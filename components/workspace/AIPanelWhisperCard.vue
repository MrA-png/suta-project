<template>
  <div class="animate-in fade-in slide-in-from-top-2 duration-500 mb-6 last:mb-0">
    <!-- Input Bubble (Manual Query or Auto Transcript) -->
    <div v-if="whisper.query" class="flex justify-end mb-2">
      <div class="max-w-[85%] px-3 py-2 rounded-2xl bg-suta-cyan/10 border border-suta-cyan/20 text-white text-[12px] font-medium">
        {{ whisper.query }}
      </div>
    </div>

    <!-- AI Response -->
    <div class="bg-white/[0.03] border border-white/10 p-5 rounded-xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 w-32 h-32 bg-suta-cyan/5 blur-3xl pointer-events-none group-hover:bg-suta-cyan/10 transition-all"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-4 opacity-50">
          <span class="text-[8px] font-mono text-suta-cyan italic">{{ whisper.type === 'auto' ? 'AUTO_WHISPER' : 'MANUAL_QUERY' }}</span>
          <div class="h-[1px] flex-1 bg-suta-cyan/10"></div>
          <span class="text-[8px] font-mono text-suta-muted uppercase mr-2 opacity-50">{{ whisper.model }}</span>
          <span class="text-[8px] font-mono text-suta-muted">{{ whisper.timestamp }}</span>
        </div>
        
        <div class="prose prose-invert max-w-none">
          <div class="text-[13px] text-white/90 leading-relaxed whitespace-pre-wrap font-sans space-y-4" v-html="formattedContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  whisper: {
    type: string;
    query?: string;
    content: string;
    model: string;
    timestamp: string;
  }
}>()

const formattedContent = computed(() => {
  return props.whisper.content
    .replace(/\*\*(.*?)\*\*/g, '<b class="text-suta-cyan">$1</b>')
    .replace(/### (.*?)\n/g, '<h5 class="text-white font-bold text-[14px] mt-4 mb-2 uppercase tracking-wider">$1</h5>')
})
</script>
