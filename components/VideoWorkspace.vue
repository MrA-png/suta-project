<template>
  <div class="relative w-full h-full bg-black">
    <!-- Real Video Stream -->
    <div class="relative w-full h-full flex items-center justify-center bg-black" :class="{ 'has-stream': isStreaming }">
      <video 
        ref="videoRef" 
        autoplay 
        playsinline 
        muted
        class="w-full h-full object-contain"
        :class="isStreaming ? 'block' : 'hidden'"
      ></video>
      
      <div v-if="!isStreaming" class="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none"></div>
        <div class="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,240,255,0.03)_50%,transparent)] bg-[length:100%_4px] pointer-events-none"></div>
        
        <div class="absolute top-6 left-6 text-[10px] tracking-[2px] text-suta-muted flex items-center gap-2 z-[4] px-2 py-1 bg-black/30 rounded backdrop-blur-md">
          <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
          OFFLINE: WAITING FOR SOURCE
        </div>

        <div class="text-center">
          <div class="text-[14px] tracking-[4px] text-suta-muted relative uppercase">READY TO CONNECT</div>
        </div>
      </div>

      <div v-else class="absolute top-6 left-6 text-[10px] tracking-[2px] text-suta-cyan flex items-center gap-2 z-[4] px-2 py-1 bg-black/30 rounded backdrop-blur-md">
        <span class="w-1.5 h-1.5 bg-suta-emerald rounded-full shadow-[0_0_8px_#10B981] animate-pulse"></span>
        LIVE: {{ sourceName }}
      </div>
    </div>

    <!-- Floating Controls -->
    <div class="absolute bottom-[30px] left-1/2 -translate-x-1/2 px-4 py-2 rounded-full flex items-center gap-3 z-[5] bg-white/5 backdrop-blur-md border border-white/10">
      <button 
        class="flex items-center gap-2 text-[12px] font-medium px-2 py-1 rounded opacity-80 hover:opacity-100 hover:bg-white/5 transition-all disabled:opacity-50" 
        @click="startCapture" 
        :disabled="isStreaming"
      >
        <div class="w-5 h-5 bg-current [mask-image:url(/icons/source.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        <span>{{ isStreaming ? 'Source Connected' : 'Change Source' }}</span>
      </button>
      <div class="w-[1px] h-5 bg-suta-border"></div>
      <button 
        class="flex items-center gap-2 text-[12px] font-medium px-2 py-1 rounded transition-all"
        :class="isStreaming ? 'text-red-500 opacity-100 hover:bg-red-500/10' : 'text-white opacity-50'"
        @click="stopCapture" 
        title="Stop Capture"
      >
        <div class="w-5 h-5 bg-current [mask-image:url(/icons/stop.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
      </button>
    </div>

    <BaseModal :show="showModal" title="SYSTEM STATUS" @close="showModal = false">
      <p class="whitespace-pre-wrap">{{ modalMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useSuta } from '~/composables/useSuta'

const config = useRuntimeConfig()
const { transcript, interimText, isListening, currentStatus, addMessage, setInterim } = useSuta()

const videoRef = ref<HTMLVideoElement | null>(null)
const isStreaming = ref(false)
const sourceName = ref('EXTERNAL STREAM')
const showModal = ref(false)
const modalMessage = ref('')

let mediaStream: MediaStream | null = null
let audioContext: AudioContext | null = null
let source: MediaStreamAudioSourceNode | null = null
let processor: ScriptProcessorNode | null = null
let socket: WebSocket | null = null

// Translator Logic (Ala VIRA)
const translate = async (text: string, langPair: string = 'en|id'): Promise<string> => {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
  const response = await fetch(url)
  const json = await response.json()
  return json?.responseData?.translatedText || "Translation failed"
}

const translateLossy = async (text: string): Promise<string> => {
  try { return await translate(text) } catch (err) { return "Translation failed" }
}

/**
 * PCM Conversion (Equivalent to VIRA's f32_to_linear16 in Rust)
 */
const float32ToLinear16 = (float32Array: Float32Array) => {
  const buffer = new Int16Array(float32Array.length)
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]))
    buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
  }
  return buffer.buffer
}

/**
 * Professional Deepgram Integration (Web Audio API / Linear16)
 */
const initDeepgram = (stream: MediaStream) => {
  const apiKey = config.public.deepgramApiKey
  if (!apiKey) return

  const audioTrack = stream.getAudioTracks()[0]
  if (!audioTrack) {
    modalMessage.value = "No audio track detected! Please ensure you check 'Share tab audio'."
    showModal.value = true
    return
  }

  currentStatus.value = 'connecting'

  // Initialize Web Audio API
  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 48000 })
  source = audioContext.createMediaStreamSource(stream)
  processor = audioContext.createScriptProcessor(4096, 1, 1)

  const url = 'wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&interim_results=true&encoding=linear16&sample_rate=48000&channels=1'
  socket = new WebSocket(url, ['token', apiKey])

  socket.onopen = () => {
    isListening.value = true
    currentStatus.value = 'listening'

    processor!.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0)
      const pcmData = float32ToLinear16(inputData)
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(pcmData)
      }
    }

    source!.connect(processor!)
    processor!.connect(audioContext!.destination)
  }

  socket.onmessage = async (message) => {
    const data = JSON.parse(message.data)
    const alternatives = data.channel?.alternatives?.[0]
    const transcriptText = alternatives?.transcript
    const isFinal = data.is_final

    if (transcriptText && transcriptText.trim() !== "") {
      if (isFinal) {
        currentStatus.value = 'processing'
        const translation = await translateLossy(transcriptText)
        addMessage('Speaker', transcriptText, translation, true)
        currentStatus.value = 'listening'
      } else {
        setInterim(transcriptText)
      }
    }
  }

  socket.onerror = (error) => {
    console.error("Deepgram Error:", error)
    currentStatus.value = 'error'
  }

  socket.onclose = () => {
    isListening.value = false
    if (currentStatus.value !== 'error') currentStatus.value = 'idle'
  }
}

const startCapture = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    })

    if (videoRef.value && mediaStream) {
      videoRef.value.srcObject = mediaStream
      isStreaming.value = true
      sourceName.value = mediaStream.getVideoTracks()[0]?.label || 'SCREEN CAPTURE'
      mediaStream.getVideoTracks()[0].onended = () => stopCapture()
      
      videoRef.value.play().catch(e => console.warn(e))
      initDeepgram(mediaStream)
    }
  } catch (err: any) {
    modalMessage.value = "Failed to select source."
    showModal.value = true
    isStreaming.value = false
  }
}

const stopCapture = () => {
  if (processor) {
    processor.onaudioprocess = null
    processor.disconnect()
  }
  if (source) source.disconnect()
  if (audioContext) audioContext.close()
  if (socket) socket.close()
  if (mediaStream) mediaStream.getTracks().forEach(t => t.stop())
  if (videoRef.value) videoRef.value.srcObject = null
  isStreaming.value = false
  currentStatus.value = 'idle'
}

onUnmounted(() => stopCapture())
</script>
