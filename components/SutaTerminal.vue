<template>
  <div class="flex flex-col h-full bg-suta-dark-gray text-white font-sans overflow-hidden">
    <!-- Header -->
    <header class="h-[64px] px-6 flex items-center justify-between border-b border-suta-border flex-shrink-0">
      <div class="brand">
        <h1 class="text-[20px] font-extrabold tracking-tight">
          Suta<span class="text-suta-cyan">.</span>
        </h1>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- AI Help Button -->
        <button 
          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-suta-cyan/10 border border-suta-cyan/20 text-suta-cyan hover:bg-suta-cyan hover:text-black transition-all group"
          @click="isAIPanelOpen = !isAIPanelOpen"
          title="AI Assistant"
        >
          <div class="w-4 h-4 bg-current [mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat] animate-pulse"></div>
          <span class="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">AI Help</span>
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
    <div class="flex-1 flex flex-col overflow-hidden relative group/content">
      <!-- Floating Clear Button -->
      <button 
        v-if="transcript.length > 0 && (status === 'listening' || status === 'processing')"
        @click="showResetConfirm = true"
        class="absolute top-4 right-6 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-md text-[10px] font-bold tracking-widest text-suta-muted hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all duration-300 flex items-center gap-2 uppercase"
      >
        <div class="w-3.5 h-3.5 bg-current [mask-image:url(/icons/clear.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        RESET TERMINAL
      </button>

      <div class="flex-1 p-6 overflow-y-auto terminal-content-area custom-scrollbar" ref="transcriptionRef">
        <!-- Message History -->
        <TerminalMessage 
          v-for="(msg, index) in transcript" 
          :key="index"
          :speaker="msg.speaker"
          :text="msg.text"
          :translation="msg.translation"
          :target-lang="settings.targetLang"
        />

        <!-- LIVE INTERIM TEXT -->
        <div v-if="interimText" class="mb-6 opacity-70 animate-pulse">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold text-suta-cyan uppercase tracking-[2px]">LIVE CAPTION</span>
          </div>
          <p class="text-white text-[14px] leading-relaxed italic">
            {{ interimText }}<span class="inline-block w-1 h-4 bg-suta-cyan ml-1 align-middle"></span>
          </p>
        </div>
      </div>

      <!-- Quick Start Guide -->
      <TerminalGuide />
    </div>

    <!-- Modals -->
    <TerminalHistoryModal :show="showHistory" @close="showHistory = false" />
    <TerminalSettingsModal :show="showSettings" @close="showSettings = false" />
    <TerminalAIModal :show="showAI" @close="showAI = false" />

    <!-- Reset Confirmation Dialog -->
    <BaseConfirmation 
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

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useSuta } from '~/composables/useSuta'

const { transcript, interimText, currentStatus: status, settings, isAIPanelOpen, clearTranscript } = useSuta()

const showSettings = ref(false)
const showHistory = ref(false)
const showResetConfirm = ref(false)
const transcriptionRef = ref(null)

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
.terminal-content-area {
  scroll-behavior: auto !important;
  -webkit-overflow-scrolling: touch;
  contain: strict;
  will-change: scroll-position;
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
</style>
