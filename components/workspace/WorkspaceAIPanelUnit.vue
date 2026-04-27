<template>
  <div class="h-full bg-suta-dark-gray border-t border-suta-border flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
    <!-- Header -->
    <div 
      ref="headerRef"
      class="px-6 py-3 border-b border-white/5 flex flex-col gap-3 bg-black/20 transition-all duration-300 relative"
    >
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2 flex-shrink-0">
          <template v-if="panelWidth < 300">
            <h1 class="text-[20px] font-extrabold tracking-tight text-white transition-colors">
              Suta<span class="text-suta-cyan">.</span>
            </h1>
          </template>
          <span v-else class="text-[10px] font-bold text-suta-cyan uppercase tracking-[2px] whitespace-nowrap">
            Secret Whisperer Mode
          </span>
        </div>
        <button @click="isAIPanelOpen = false" class="text-suta-muted hover:text-white transition-colors p-1">
          <div class="w-4 h-4 bg-current [mask-image:url(/icons/close.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        </button>
      </div>
      
      <div class="flex gap-2 items-center" :class="panelWidth < 350 ? 'justify-between' : 'justify-start'">
        <!-- Model Selector -->
        <div class="flex items-center bg-white/5 rounded-full p-0.5 border border-white/10 flex-shrink-0">
          <button 
            v-for="m in ['gemini', 'openrouter']" 
            :key="m"
            @click="activeModel = m as any"
            class="px-2.5 py-1 rounded-full text-[8px] font-bold uppercase transition-all"
            :class="activeModel === m ? 'bg-suta-cyan text-black' : 'text-suta-muted hover:text-white'"
          >
            {{ m }}
          </button>
        </div>

        <button @click="isPersonalityModalOpen = true" class="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:border-suta-cyan/30 transition-all group flex items-center gap-2 flex-shrink-0">
          <span v-if="panelWidth > 350" class="text-[8px] font-bold text-suta-muted group-hover:text-white uppercase tracking-widest">Neural Profile</span>
          <span v-else class="text-[8px] font-bold text-suta-cyan uppercase tracking-tighter">Profile</span>
        </button>

        <button 
          @click="isAutoMode = !isAutoMode"
          class="px-3 py-1.5 rounded transition-all flex items-center gap-2 border flex-shrink-0"
          :class="isAutoMode ? 'bg-suta-cyan/10 border-suta-cyan/40 text-suta-cyan' : 'bg-white/5 border-white/10 text-suta-muted hover:bg-white/10'"
        >
          <div class="w-1.5 h-1.5 rounded-full" :class="isAutoMode ? 'bg-suta-cyan animate-pulse' : 'bg-white/20'"></div>
          <span class="text-[8px] font-bold uppercase tracking-widest">{{ isAutoMode ? 'Auto' : 'Manual' }}</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto custom-scrollbar relative">
      <!-- Sticky Info Row -->
      <div class="sticky top-0 z-30 flex items-center justify-between p-2 pb-2 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <button 
          v-if="aiWhispers.length > 0"
          @click="aiWhispers = []"
          class="text-[8px] font-bold text-red-400/40 hover:text-red-400 uppercase tracking-widest transition-all"
        >
          [ Clear ]
        </button>
        <div v-else></div>

        <button 
          @click="syncPersonality"
          class="px-2 py-1 rounded border border-suta-cyan/20 bg-suta-cyan/5 text-[8px] font-mono text-suta-cyan/50 uppercase tracking-tighter hover:bg-suta-cyan/10 hover:border-suta-cyan/40 transition-all flex items-center gap-2 group"
          :class="{ 'animate-pulse text-suta-cyan border-suta-cyan/50': isSyncing }"
        >
          <div class="w-1 h-1 rounded-full bg-suta-cyan/40 group-hover:bg-suta-cyan" :class="{ 'animate-ping': isSyncing }"></div>
          Profile: {{ personality?.identity?.nickname || 'Unknown' }} // {{ isSyncing ? 'Syncing...' : 'Synced' }}
        </button>
      </div>

      <!-- Chat Flow -->
      <div v-if="aiWhispers.length > 0 || isAnalyzing || (isAutoMode && isStreaming)" class="p-6 pt-2 pb-20">
        <WorkspaceAIPanelWhisperCard 
          v-for="(item, idx) in aiWhispers" 
          :key="idx"
          :whisper="item"
        />

        <!-- Pending Manual Query -->
        <div v-if="isAnalyzing && pendingManualQuery" class="animate-in fade-in slide-in-from-top-1 duration-300 mb-6">
          <div class="flex justify-end">
            <div class="max-w-[85%] px-3 py-2 rounded-2xl bg-suta-cyan/10 border border-suta-cyan/20 text-white text-[12px] font-medium shadow-lg shadow-suta-cyan/5">
              {{ pendingManualQuery }}
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isAnalyzing" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div class="flex justify-start items-center gap-3">
            <div class="px-3 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
              <div class="flex gap-1">
                <div v-for="i in 3" :key="i" class="w-1 h-1 bg-suta-cyan rounded-full animate-bounce" :style="{ animationDelay: i * 0.1 + 's' }"></div>
              </div>
              <span class="text-[8px] font-mono text-suta-cyan/50 uppercase tracking-[1px]">Synthesizing Whisper...</span>
            </div>
          </div>
        </div>

        <!-- Live Real-time Monitor -->
        <WorkspaceAIPanelMonitor 
          v-if="isAutoMode && isStreaming && !isAnalyzing" 
          :interim-text="interimText"
        />
      </div>
      
      <!-- Empty State -->
      <div v-else class="py-12 text-center">
        <p v-if="!isAutoMode" class="text-[10px] text-suta-cyan uppercase tracking-[2px] italic opacity-40">Manual Mode Active: Ready for Queries</p>
        <p v-else-if="!isStreaming" class="text-[10px] text-suta-muted uppercase tracking-[2px] italic opacity-40">Source Offline: Waiting for Connection...</p>
        <p v-else class="text-[10px] text-suta-muted uppercase tracking-[2px] opacity-30 italic">Whisperer Unit Standing By...</p>
      </div>
    </div>

    <!-- Manual Input Bar -->
    <div v-if="!isAutoMode" class="p-4 bg-black/40 border-t border-white/5 backdrop-blur-xl">
      <form @submit.prevent="handleManualSubmit" class="relative group">
        <input 
          v-model="manualInput"
          type="text"
          placeholder="Ask Whisperer something manually..."
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-[12px] text-white placeholder:text-white/20 focus:outline-none focus:border-suta-cyan/50 transition-all"
        />
        <button 
          type="submit"
          :disabled="!manualInput.trim() || isAnalyzing"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-suta-cyan hover:scale-110 disabled:opacity-30 disabled:scale-100 transition-all"
        >
          <div class="w-5 h-5 bg-current [mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        </button>
      </form>
    </div>

    <!-- Guide & Modals -->
    <WorkspaceModalsPersonality :show="isPersonalityModalOpen" @close="isPersonalityModalOpen = false" />
    <WorkspaceGuide />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSuta } from '../../composables/useSuta'
import { useAIWhisperer } from '../../composables/useAIWhisperer'

const { transcript, interimText, isAIPanelOpen, isStreaming, personality, aiWhispers } = useSuta()
const { isAnalyzing, activeModel, pendingManualQuery, performAIAnalysis, formatAIResponse } = useAIWhisperer()

const isPersonalityModalOpen = ref(false)
const isAutoMode = ref(true)
const manualInput = ref('')
const isSyncing = ref(false)

const syncPersonality = () => {
  if (isSyncing.value) return
  isSyncing.value = true
  setTimeout(() => isSyncing.value = false, 1500)
}

// Auto-Analysis Orchestration
let autoWhisperTimeout: any = null

watch(interimText, (newVal) => {
  if (newVal && autoWhisperTimeout) {
    clearTimeout(autoWhisperTimeout)
    autoWhisperTimeout = null
  }
})

watch(transcript, (newVal) => {
  if (!isStreaming.value || !isAutoMode.value || isAnalyzing.value) return
  
  const { lastProcessedIdx } = useSuta()
  if (newVal.length > lastProcessedIdx.value) {
    const hasRealContent = newVal.slice(lastProcessedIdx.value).some(m => m.speaker !== 'System')
    
    if (hasRealContent && !interimText.value) {
      clearTimeout(autoWhisperTimeout)
      autoWhisperTimeout = setTimeout(() => performAIAnalysis(), 2000)
    }
  }
}, { deep: true })

const scrollToBottom = () => {
  setTimeout(() => {
    const el = document.querySelector('.flex-1.overflow-y-auto')
    if (el) el.scrollTop = el.scrollHeight
  }, 100)
}

const handleManualSubmit = () => {
  if (!manualInput.value.trim() || isAnalyzing.value) return
  const query = manualInput.value
  manualInput.value = ''
  performAIAnalysis(query)
  scrollToBottom()
}

// Responsive layout handling
const headerRef = ref<HTMLElement | null>(null)
const panelWidth = ref(500)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (isStreaming.value) performAIAnalysis()
  if (headerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) panelWidth.value = entry.contentRect.width
    })
    resizeObserver.observe(headerRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
  if (autoWhisperTimeout) clearTimeout(autoWhisperTimeout)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,240,255,0.1); border-radius: 10px; }
</style>
