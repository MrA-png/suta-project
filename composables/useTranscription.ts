import { ref } from 'vue'
import { useSuta } from './useSuta'
import { useTranslation } from './useTranslation'

export const useTranscription = () => {
  const { public: config } = useRuntimeConfig()
  const { 
    currentStatus, isListening, isStreaming, settings, 
    addMessage, setInterim, updateLastMessageTranslation 
  } = useSuta()
  const { translateAuto } = useTranslation()

  const activeStream = ref<MediaStream | null>(null)
  let audioContext: AudioContext | null = null
  let sourceNode: MediaStreamAudioSourceNode | null = null
  let workletNode: AudioWorkletNode | null = null
  let socket: WebSocket | null = null
  let keepAliveTimer: any = null

  const WORKLET_CODE = `
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
  `

  const initDeepgram = async (stream: MediaStream) => {
    const apiKey = config.deepgramApiKey
    if (!apiKey || !stream.getAudioTracks()[0]) return

    currentStatus.value = 'connecting'

    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 48000 })
      
      const blob = new Blob([WORKLET_CODE], { type: 'application/javascript' })
      const url = URL.createObjectURL(blob)
      await audioContext.audioWorklet.addModule(url)
      
      sourceNode = audioContext.createMediaStreamSource(stream)
      workletNode = new AudioWorkletNode(audioContext, 'suta-audio-processor')

      const langCode = settings.value.sourceLang.split('-')[0]
      const dgUrl = `wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&interim_results=true&encoding=linear16&sample_rate=48000&channels=1&endpointing=300&language=${langCode}`
      
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
              translateAuto(transcriptText).then(t => updateLastMessageTranslation(t))
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

  const stopDeepgram = () => {
    if (keepAliveTimer) clearInterval(keepAliveTimer)
    if (socket) { socket.onclose = null; socket.close() }
    if (workletNode) { workletNode.port.onmessage = null; workletNode.disconnect() }
    if (sourceNode) sourceNode.disconnect()
    if (audioContext) audioContext.close()
    socket = workletNode = sourceNode = audioContext = null
  }

  let mediaRecorder: MediaRecorder | null = null
  let audioChunks: Blob[] = []

  const initGroqWhisper = async (stream: MediaStream) => {
    const apiKey = config.groqApiKey
    const audioTracks = stream.getAudioTracks()

    if (!apiKey || audioTracks.length === 0) {
      currentStatus.value = 'error'
      return
    }

    currentStatus.value = 'listening'
    isListening.value = true
    
    const mimeType = [
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac'
    ].find(type => MediaRecorder.isTypeSupported(type))

    const captureChunk = () => {
      if (!isListening.value || !activeStream.value) return

      const audioStream = new MediaStream(activeStream.value.getAudioTracks())
      const recorder = new MediaRecorder(audioStream, mimeType ? { mimeType } : {})
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = async () => {
        if (chunks.length > 0) {
          const blob = new Blob(chunks, { type: mimeType || 'audio/webm' })
          await sendToGroq(blob)
        }
        // Start next chunk
        if (isListening.value) captureChunk()
      }

      // Record for 3 seconds then stop to finalize the file
      recorder.start()
      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop()
      }, 3500)
    }

    captureChunk()
  }

  const sendToGroq = async (blob: Blob) => {
    const apiKey = config.groqApiKey
    const formData = new FormData()
    formData.append('file', blob, 'audio.webm')
    formData.append('model', 'whisper-large-v3-turbo')
    formData.append('language', settings.value.sourceLang.split('-')[0])
    formData.append('response_format', 'json')

    try {
      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: formData
      })
      const data = await response.json()
      if (data.text?.trim()) {
        addMessage('Speaker', data.text)
        if (settings.value.isTranslatorEnabled) {
          translateAuto(data.text).then(t => updateLastMessageTranslation(t))
        }
      }
    } catch (err) {
      console.error("Groq API Error:", err)
    }
  }

  const stopGroqWhisper = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    mediaRecorder = null
    isListening.value = false
    currentStatus.value = 'idle'
  }

  return {
    activeStream,
    initDeepgram,
    stopDeepgram,
    initGroqWhisper,
    stopGroqWhisper
  }
}
