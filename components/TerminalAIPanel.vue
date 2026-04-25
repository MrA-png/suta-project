<template>
  <div class="h-full bg-suta-dark-gray border-t border-suta-border flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
    <!-- Panel Header -->
    <div class="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-black/20">
      <div class="flex items-center gap-2">
        <div class="w-3.5 h-3.5 bg-suta-cyan [mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat] animate-pulse"></div>
        <span class="text-[10px] font-bold text-suta-cyan uppercase tracking-[2px]">AI Intelligence Panel</span>
      </div>
      <button @click="isAIPanelOpen = false" class="text-suta-muted hover:text-white transition-colors">
        <div class="w-4 h-4 bg-current [mask-image:url(/icons/clear.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button 
          @click="startAnalysis('summary')"
          class="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-suta-cyan/50 hover:bg-suta-cyan/5 transition-all text-left group"
        >
          <div class="text-white font-bold text-[12px] mb-1 group-hover:text-suta-cyan">Quick Summary</div>
          <div class="text-suta-muted text-[9px] leading-tight opacity-60">Condense current transcription into key points.</div>
        </button>

        <button 
          @click="startAnalysis('questions')"
          class="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-suta-cyan/50 hover:bg-suta-cyan/5 transition-all text-left group"
        >
          <div class="text-white font-bold text-[12px] mb-1 group-hover:text-suta-cyan">Follow-up Tips</div>
          <div class="text-suta-muted text-[9px] leading-tight opacity-60">Generate context-aware follow-up questions.</div>
        </button>
      </div>

      <!-- Result Area -->
      <div v-if="isAnalyzing" class="py-12 flex flex-col items-center gap-4">
        <div class="flex gap-1.5">
          <div v-for="i in 3" :key="i" class="w-1.5 h-1.5 bg-suta-cyan rounded-full animate-bounce" :style="{ animationDelay: i * 0.1 + 's' }"></div>
        </div>
        <span class="text-[9px] font-mono text-suta-cyan animate-pulse uppercase tracking-[4px]">Neural Processing...</span>
      </div>

      <div v-else-if="analysisResult" class="animate-in fade-in slide-in-from-top-2 duration-500 pb-4">
        <div class="bg-black/40 border border-suta-cyan/20 p-4 rounded-lg relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-suta-cyan/5 blur-3xl pointer-events-none"></div>
          <pre class="text-[13px] text-white/90 leading-relaxed whitespace-pre-wrap font-mono">{{ analysisResult }}</pre>
        </div>
      </div>
      
      <div v-else class="py-12 text-center">
        <p class="text-[10px] text-suta-muted uppercase tracking-[2px] opacity-30 italic">Select an analysis tool to begin</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSuta } from '~/composables/useSuta'

const { transcript, isAIPanelOpen } = useSuta()
const isAnalyzing = ref(false)
const analysisResult = ref('')

const startAnalysis = async (type: 'summary' | 'questions') => {
  if (transcript.value.length < 2) {
    analysisResult.value = "ERROR: Insufficient data found."
    return
  }

  isAnalyzing.value = true
  analysisResult.value = ''
  await new Promise(r => setTimeout(r, 1500))
  
  if (type === 'summary') {
    analysisResult.value = "AI_SUMMARY_LOG:\n\n• Discussion focused on real-time data streaming.\n• Mentioned high-latency issues in browser environments.\n• Proposed AudioWorklet as a solution for thread-safe processing."
  } else {
    analysisResult.value = "AI_FOLLOWUP_LOG:\n\n• Ask about specific buffer size configurations.\n• Inquire about fallback strategies for legacy browsers.\n• Discuss testing methodologies for low-bandwidth scenarios."
  }
  isAnalyzing.value = false
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,240,255,0.1); border-radius: 10px; }
</style>
