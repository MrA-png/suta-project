<template>
  <div class="flex flex-col h-full bg-suta-dark-gray text-white font-sans overflow-hidden">
    <!-- Header -->
    <header class="h-[64px] px-6 flex items-center justify-between border-b border-suta-border flex-shrink-0">
      <NuxtLink to="/" class="brand group flex items-center gap-2">
        <h1 class="text-[20px] font-extrabold tracking-tight text-white group-hover:text-suta-cyan transition-colors">
          Suta<span class="text-suta-cyan">.</span>
        </h1>
      </NuxtLink>
      
      <div class="flex items-center gap-2" ref="headerRef">
        <!-- Resource Monitor -->
        <button 
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-suta-muted hover:text-suta-cyan transition-all relative group"
          @click="showUsage = true"
          title="Resource Usage Monitor"
        >
          <div class="w-5 h-5 bg-current [mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat] opacity-70 group-hover:opacity-100"></div>
          <div class="absolute top-2 right-2 w-1.5 h-1.5 bg-suta-cyan rounded-full border border-suta-dark-gray"></div>
        </button>

        <div class="w-[1px] h-4 bg-white/10 mx-1"></div>

        <!-- AI Panel Toggle -->
        <button 
          class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all group overflow-hidden"
          :class="isAIPanelOpen ? 'bg-suta-cyan text-black' : 'bg-suta-cyan/10 border border-suta-cyan/20 text-suta-cyan hover:bg-suta-cyan hover:text-black'"
          @click="isAIPanelOpen = !isAIPanelOpen"
          title="Toggle AI Secret Whisperer"
        >
          <div class="w-4 h-4 bg-current [mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat]" :class="{ 'animate-pulse': isListening }"></div>
          <span v-if="headerWidth > 280" class="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">AI Help</span>
        </button>

        <div class="w-[1px] h-4 bg-white/10 mx-1"></div>

        <!-- History Button -->
        <button 
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-suta-muted hover:text-suta-cyan transition-all"
          @click="showHistory = true"
          title="Transcription History"
        >
          <div class="w-5 h-5 bg-current [mask-image:url(/icons/archive-svgrepo-com.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        </button>

        <!-- Settings Button -->
        <button 
          class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-suta-muted hover:text-suta-cyan transition-all"
          @click="showSettings = true"
          title="System Settings"
        >
          <div class="w-5 h-5 bg-current [mask-image:url(/icons/settings.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        </button>
      </div>
    </header>

    <!-- Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Floating Reset Button -->
      <button 
        v-if="transcript.length > 1"
        @click="showResetConfirm = true"
        class="absolute top-4 right-6 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-md text-[10px] font-bold tracking-widest text-suta-muted hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all duration-300 flex items-center gap-2 uppercase"
      >
        <div class="w-3.5 h-3.5 bg-current [mask-image:url(/icons/clear.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        RESET TERMINAL
      </button>

      <div class="flex-1 p-6 overflow-y-auto terminal-content-area custom-scrollbar" ref="transcriptionRef">
        <WorkspaceMessage 
          v-for="(msg, index) in transcript" 
          :key="index"
          :speaker="msg.speaker"
          :text="msg.text"
          :translation="msg.translation"
          :target-lang="settings.targetLang"
        />

        <WorkspaceTerminalLiveCaption :text="interimText" />
      </div>
    </div>

    <!-- Modals -->
    <WorkspaceModalsHistory :show="showHistory" @close="showHistory = false" />
    <WorkspaceModalsSettings :show="showSettings" @close="showSettings = false" />
    <WorkspaceModalsUsage :show="showUsage" @close="showUsage = false" />
    <UiBaseConfirmation 
      :show="showResetConfirm"
      title="END SESSION?"
      message="Are you sure you want to clear the terminal?"
      sub-message="Current transcript will be archived to history."
      confirm-text="Reset Now"
      danger
      @cancel="showResetConfirm = false"
      @confirm="handleReset"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useSuta } from '../../composables/useSuta'

const { transcript, interimText, isListening, settings, isAIPanelOpen, clearTranscript } = useSuta()

const showSettings = ref(false)
const showHistory = ref(false)
const showUsage = ref(false)
const showResetConfirm = ref(false)
const transcriptionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const headerWidth = ref(0)
const resizeObserver = ref<ResizeObserver | null>(null)

onMounted(() => {
  if (headerRef.value) {
    resizeObserver.value = new ResizeObserver((entries) => {
      for (const entry of entries) {
        headerWidth.value = entry.contentRect.width
      }
    })
    if (headerRef.value.parentElement) {
      resizeObserver.value.observe(headerRef.value.parentElement)
    }
  }
})

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
})

const handleReset = () => {
  clearTranscript(true)
  showResetConfirm.value = false
}

const scrollToBottom = () => {
  if (transcriptionRef.value) {
    transcriptionRef.value.scrollTop = transcriptionRef.value.scrollHeight
  }
}

watch(() => transcript.value.length, () => nextTick(scrollToBottom))
watch(interimText, (newText) => {
  if (newText) requestAnimationFrame(scrollToBottom)
})
</script>

<style scoped>
.terminal-content-area { scroll-behavior: smooth; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>
