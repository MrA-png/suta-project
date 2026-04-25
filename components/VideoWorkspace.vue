<template>
  <div class="relative w-full h-full bg-black">
    <!-- Main Display -->
    <VideoDisplay 
      ref="displayRef"
      :is-streaming="isStreaming" 
      :source-name="sourceName" 
    />

    <!-- Controls Overlay -->
    <VideoControls 
      :is-streaming="isStreaming"
      @start="startCapture"
      @stop="stopCapture"
    />

    <!-- Status Modal -->
    <BaseModal :show="showModal" title="SYSTEM STATUS" @close="showModal = false">
      <p class="whitespace-pre-wrap text-[13px] text-white/80 leading-relaxed">{{ modalMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { useSuta } from '~/composables/useSuta'

const config = useRuntimeConfig()
const { settings, currentStatus, isListening, transcript, addMessage, setInterim, updateLastMessageTranslation, clearTranscript } = useSuta()

const displayRef = ref<any>(null)
const isStreaming = ref(false)
const sourceName = ref('External Stream')
const showModal = ref(false)
const modalMessage = ref('')

// Use a ref for mediaStream to ensure reactivity and consistent reference
const activeStream = ref<MediaStream | null>(null)
let audioContext: AudioContext | null = null
let sourceNode: MediaStreamAudioSourceNode | null = null
let workletNode: AudioWorkletNode | null = null
let socket: WebSocket | null = null
let keepAliveTimer: any = null

// --- Translation Logic ---
const translate = async (text: string, langPair: string): Promise<string> => {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
  const response = await fetch(url)
  const json = await response.json()
  return json?.responseData?.translatedText || "Translation failed"
}

const translateLossy = async (text: string): Promise<string> => {
  try { 
    const langPair = `${settings.value.sourceLang.split('-')[0]}|${settings.value.targetLang}`
    return await translate(text, langPair) 
  } catch (err) { return "Translation failed" }
}

// --- Audio Engine Logic ---
const workletCode = `
class SutaAudioProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const float32Array = input[0];
      const buffer = new Int16Array(float32Array.length);
      for (let i = 0; i < float32Array.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      this.port.postMessage(buffer.buffer, [buffer.buffer]);
    }
    return true;
  }
}
registerProcessor('suta-audio-processor', SutaAudioProcessor);
`;

const initDeepgram = async (stream: MediaStream) => {
  const apiKey = config.public.deepgramApiKey
  if (!apiKey || !stream.getAudioTracks()[0]) return

  currentStatus.value = 'connecting'

  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 48000 })
    
    audioContext.onstatechange = () => {
      if (audioContext?.state === 'suspended' && isStreaming.value) audioContext.resume()
    }

    const blob = new Blob([workletCode], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    await audioContext.audioWorklet.addModule(url)
    
    sourceNode = audioContext.createMediaStreamSource(stream)
    workletNode = new AudioWorkletNode(audioContext, 'suta-audio-processor')

    const dgUrl = `wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&interim_results=true&encoding=linear16&sample_rate=48000&channels=1&endpointing=300&language=${settings.value.sourceLang.split('-')[0]}`
    socket = new WebSocket(dgUrl, ['token', apiKey])

    socket.onopen = () => {
      isListening.value = true
      currentStatus.value = 'listening'
      workletNode!.port.onmessage = (event) => {
        if (socket?.readyState === WebSocket.OPEN) socket.send(event.data)
      }
      sourceNode!.connect(workletNode!)
      workletNode!.connect(audioContext!.destination)

      keepAliveTimer = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'KeepAlive' }))
      }, 10000)
    }

    socket.onmessage = async (message) => {
      const data = JSON.parse(message.data)
      const transcriptText = data.channel?.alternatives?.[0]?.transcript
      if (transcriptText?.trim()) {
        if (data.is_final) {
          addMessage('Speaker', transcriptText)
          if (settings.value.isTranslatorEnabled) {
            translateLossy(transcriptText).then(t => updateLastMessageTranslation(t))
          }
        } else {
          setInterim(transcriptText)
        }
      }
    }

    socket.onclose = () => {
      isListening.value = false
      if (isStreaming.value && currentStatus.value !== 'error') {
        setTimeout(() => isStreaming.value && activeStream.value && initDeepgram(activeStream.value), 1000)
      } else if (!isStreaming.value) {
        currentStatus.value = 'idle'
      }
    }
  } catch (err) {
    console.error("Deepgram initialization failed:", err)
    currentStatus.value = 'error'
  }
}

// --- Action Methods ---
const startCapture = async () => {
  // 1. Safety first: If already streaming, stop everything first
  if (isStreaming.value || activeStream.value) {
    stopCapture()
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ 
      video: { cursor: 'always' } as any, 
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    })
    
    activeStream.value = stream
    isStreaming.value = true
    sourceName.value = stream.getVideoTracks()[0]?.label || 'Screen Capture'
    
    if (displayRef.value?.videoElement) {
      displayRef.value.videoElement.srcObject = stream
    }
    
    stream.getVideoTracks()[0].onended = () => stopCapture()
    await initDeepgram(stream)
  } catch (err) {
    console.error("Capture failed:", err)
    isStreaming.value = false
    activeStream.value = null
  }
}

const stopDeepgram = () => {
  if (keepAliveTimer) clearInterval(keepAliveTimer)
  
  if (socket) {
    socket.onclose = null // Prevent auto-reconnect trigger
    socket.close()
  }
  
  if (workletNode) {
    workletNode.port.onmessage = null
    workletNode.disconnect()
  }
  
  if (sourceNode) {
    sourceNode.disconnect()
  }
  
  if (audioContext) {
    audioContext.close()
  }
  
  socket = null
  workletNode = null
  sourceNode = null
  audioContext = null
}

const stopCapture = () => {
  console.log("Initiating complete hardware shutdown...")
  
  // Auto-archive current session before clearing
  if (transcript.value.length > 0 && transcript.value[0].speaker !== 'System') {
    clearTranscript(true)
  }

  // 1. Stop audio processing first
  stopDeepgram()
  
  // 2. Clear video source
  if (displayRef.value?.videoElement) {
    displayRef.value.videoElement.srcObject = null
  }

  // 3. Kill all tracks in the current stream
  if (activeStream.value) {
    const tracks = activeStream.value.getTracks()
    tracks.forEach(track => {
      track.enabled = false // Disable first
      track.stop()         // Then stop
      console.log(`Hardware track [${track.kind}] has been killed.`)
    })
    activeStream.value = null
  }

  isStreaming.value = false
  currentStatus.value = 'idle'
}

watch(() => settings.value.sourceLang, () => {
  if (isStreaming.value && activeStream.value) { 
    stopDeepgram()
    initDeepgram(activeStream.value) 
  }
})

onUnmounted(() => stopCapture())
</script>
