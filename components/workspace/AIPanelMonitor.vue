<template>
  <div class="animate-in fade-in slide-in-from-right-2 duration-700">
    <div class="flex justify-end items-center gap-3">
      <div 
        class="max-w-[90%] px-4 py-2 rounded-2xl flex flex-col items-end gap-1 group/live relative overflow-hidden transition-all duration-500"
        :class="interimText ? 'bg-suta-cyan/10 border border-suta-cyan/30' : 'bg-white/[0.02] border border-white/5'"
      >
        <!-- Status Label -->
        <div class="flex items-center gap-2 mb-1">
          <span 
            class="text-[7px] font-mono uppercase tracking-[2px] transition-colors"
            :class="interimText ? 'text-suta-cyan' : 'text-suta-muted/40'"
          >
            {{ interimText ? 'Capturing_Active' : 'Neural_Standby' }}
          </span>
          <div class="flex gap-0.5 items-end h-[8px]">
            <div 
              v-for="i in 5" 
              :key="i" 
              class="w-[1.5px] rounded-full transition-all duration-300" 
              :class="interimText ? 'bg-suta-cyan animate-pulse' : 'bg-white/10'"
              :style="{ 
                height: interimText ? (waveHeights[i-1] + 'px') : '2px',
                animationDelay: i * 0.1 + 's' 
              }"
            ></div>
          </div>
        </div>
        
        <!-- Text Area -->
        <div v-if="interimText" class="text-[12px] text-white/80 italic font-medium leading-relaxed text-right transition-all">
          {{ interimText }}<span class="animate-pulse text-suta-cyan">|</span>
        </div>
        <div v-else class="text-[9px] text-white/10 font-mono uppercase tracking-[3px] py-1">
          Awaiting Audio...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  interimText: string;
}>()

const waveHeights = ref([4, 6, 8, 5, 7])
let interval: any = null

onMounted(() => {
  interval = setInterval(() => {
    waveHeights.value = waveHeights.value.map(() => Math.random() * 8 + 4)
  }, 100)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>
