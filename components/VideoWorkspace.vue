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

    <!-- Reusable Cyber Modal -->
    <BaseModal 
      :show="showModal" 
      title="SYSTEM STATUS" 
      @close="showModal = false"
    >
      <p>{{ modalMessage }}</p>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useSuta } from '~/composables/useSuta'

const { addMessage, isListening, currentStatus } = useSuta()

const videoRef = ref<HTMLVideoElement | null>(null)
const isStreaming = ref(false)
const sourceName = ref('EXTERNAL STREAM')
const showModal = ref(false)
const modalMessage = ref('')
let mediaStream: MediaStream | null = null

// Transcription Logic
let recognition: any = null

const initRecognition = () => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) {
    console.warn("Speech Recognition not supported in this browser.")
    return
  }

  recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = false
  recognition.lang = 'en-US' // Change to 'id-ID' for Indonesian

  recognition.onstart = () => {
    isListening.value = true
    currentStatus.value = 'listening'
  }

  recognition.onresult = (event: any) => {
    const result = event.results[event.results.length - 1]
    const text = result[0].transcript
    if (result.isFinal) {
      addMessage('Speaker', text)
    }
  }

  recognition.onerror = (event: any) => {
    console.error("Speech recognition error", event.error)
    if (event.error === 'not-allowed') {
      modalMessage.value = "Microphone access denied. Transcription requires microphone permissions even when capturing tab audio in some browsers."
      showModal.value = true
    }
  }

  recognition.onend = () => {
    if (isStreaming.value) {
      recognition.start() // Keep listening if still streaming
    } else {
      isListening.value = false
      currentStatus.value = 'idle'
    }
  }

  recognition.start()
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
      
      const videoTrack = mediaStream.getVideoTracks()[0]
      if (videoTrack) {
        sourceName.value = videoTrack.label || 'SCREEN CAPTURE'
        videoTrack.onended = () => stopCapture()
      }
      
      videoRef.value.play().catch((e: Error) => console.warn("Video play interrupted:", e))
      
      // Initialize transcription
      initRecognition()
    }
  } catch (err: any) {
    console.error("Capture error:", err)
    modalMessage.value = "Failed to select source. Please ensure you are using a modern browser and allow sharing permissions."
    showModal.value = true
    isStreaming.value = false
  }
}

const stopCapture = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    mediaStream = null
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null
  }
  if (recognition) {
    recognition.stop()
  }
  isStreaming.value = false
}

onUnmounted(() => {
  stopCapture()
})
</script>
