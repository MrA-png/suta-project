<template>
  <div class="flex flex-col w-full h-full bg-black select-none">
    <!-- Main Display Area -->
    <div 
      class="relative flex-1 min-h-0"
      :class="{ 'pointer-events-none': isResizing }"
    >
      <WorkspaceVideoDisplay 
        ref="displayRef"
        :is-streaming="isStreaming" 
        :source-name="sourceName" 
        :stream="activeStream"
      />

      <WorkspaceVideoControls 
        :is-streaming="isStreaming"
        @start="startCapture"
        @stop="stopCapture"
      />
    </div>

    <!-- Resizer Handle -->
    <div 
      class="h-[10px] -my-[5px] w-full cursor-row-resize z-30 relative group flex items-center justify-center"
      @mousedown="startResizing"
    >
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 group-hover:bg-suta-cyan/40 transition-colors"></div>
      <div class="relative z-10 px-3 bg-black flex gap-1 items-center">
        <div v-for="i in 3" :key="i" class="w-1 h-1 rounded-full bg-white/10 group-hover:bg-suta-cyan/60 transition-colors"></div>
      </div>
    </div>

    <!-- Embedded Terminal Unit -->
    <div 
      :style="{ height: terminalHeight + 'px' }"
      class="flex-shrink-0 border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20 overflow-hidden"
    >
      <WorkspaceTerminalUnit />
    </div>

    <!-- Status Modal -->
    <UiBaseModal :show="showModal" title="SYSTEM STATUS" @close="showModal = false">
      <p class="whitespace-pre-wrap text-[13px] text-white/80 leading-relaxed">{{ modalMessage }}</p>
    </UiBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { useSuta } from '../../composables/useSuta'
import { useTranscription } from '../../composables/useTranscription'
import { useWorkspaceResizer } from '../../composables/useWorkspaceResizer'

const { isStreaming, currentStatus, transcript, settings, clearTranscript } = useSuta()
const { activeStream, initDeepgram, stopDeepgram } = useTranscription()
const { terminalHeight, isResizing, startResizing } = useWorkspaceResizer()

const displayRef = ref<any>(null)
const sourceName = ref('External Stream')
const showModal = ref(false)
const modalMessage = ref('')

const startCapture = async () => {
  if (isStreaming.value || activeStream.value) stopCapture()

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({ 
      video: { cursor: 'always', displaySurface: 'monitor' } as any, 
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        suppressLocalAudioPlayback: false,
      } as any,
      systemAudio: 'include',
      selfBrowserSurface: 'exclude',
      surfaceSwitching: 'include'
    } as any)
    
    activeStream.value = stream
    isStreaming.value = true
    sourceName.value = stream.getVideoTracks()[0]?.label || 'Screen Capture'
    
    if (displayRef.value?.videoElement) displayRef.value.videoElement.srcObject = stream
    stream.getVideoTracks()[0].onended = () => stopCapture()
    
    await initDeepgram(stream)
  } catch (err) {
    console.error("Capture failed:", err)
    isStreaming.value = false
    activeStream.value = null
  }
}

const stopCapture = () => {
  if (transcript.value.length > 0 && transcript.value[0].speaker !== 'System') {
    clearTranscript(true)
  }
  
  stopDeepgram()
  
  if (displayRef.value?.videoElement) displayRef.value.videoElement.srcObject = null
  
  if (activeStream.value) {
    activeStream.value.getTracks().forEach(track => {
      track.enabled = false
      track.stop()
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
