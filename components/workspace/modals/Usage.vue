<template>
  <UiBaseModal :show="show" @close="$emit('close')" title="SYSTEM RESOURCE MONITOR" max-width="md">
    <div class="p-4 bg-suta-dark-gray text-white">
      <div class="space-y-6">
        <!-- AI Models Usage -->
        <div>
          <h3 class="text-[10px] font-bold text-suta-muted uppercase tracking-[2px] mb-4 flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-suta-muted animate-pulse"></div>
            Neural Engine Usage (LLMs)
          </h3>
          <div class="grid grid-cols-1 gap-3">
            <div 
              v-for="(data, model) in aiModelsUsage" 
              :key="model" 
              class="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-suta-cyan/30 transition-all flex items-center justify-between"
            >
              <div class="flex flex-col">
                <span class="text-[12px] font-bold uppercase tracking-wider text-white/80 group-hover:text-suta-cyan transition-colors">{{ model }}</span>
                <span class="text-[10px] font-mono text-suta-muted tracking-tight">${{ data.cost.toFixed(4) }}</span>
              </div>
              
              <div class="flex gap-6 text-right">
                <div class="flex flex-col">
                  <span class="text-[7px] uppercase text-white/30 tracking-[1px] mb-0.5">Req</span>
                  <span class="text-[12px] font-mono text-white leading-none">{{ data.requests }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[7px] uppercase text-white/30 tracking-[1px] mb-0.5">Tokens</span>
                  <span class="text-[12px] font-mono text-white leading-none">{{ data.tokens.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transcription Usage -->
        <div>
          <h3 class="text-[10px] font-bold text-suta-muted uppercase tracking-[2px] mb-4 flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-suta-muted"></div>
            Acoustic Processing (STT)
          </h3>
          <div class="grid grid-cols-1 gap-3">
            <div class="p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-suta-cyan/30 transition-all flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-[12px] font-bold uppercase tracking-wider text-white/80 group-hover:text-suta-cyan transition-colors">Deepgram</span>
                <span class="text-[10px] font-mono text-suta-muted">{{ (stats.deepgram.seconds / 60).toFixed(2) }} mins</span>
              </div>
              <div class="flex gap-6 text-right">
                <div class="flex flex-col">
                  <span class="text-[7px] uppercase text-white/30 tracking-[1px] mb-0.5">Req</span>
                  <span class="text-[12px] font-mono text-white leading-none">{{ stats.deepgram.requests }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-[7px] uppercase text-white/30 tracking-[1px] mb-0.5">Seconds</span>
                  <span class="text-[12px] font-mono text-white leading-none">{{ stats.deepgram.seconds.toFixed(1) }}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 flex flex-col items-center gap-3 border-t border-white/5">
          <button 
            @click="showResetConfirm = true"
            class="text-[9px] font-bold text-red-400/50 hover:text-red-400 uppercase tracking-widest transition-all"
          >
            [ Reset Session Data ]
          </button>
          <p class="text-[8px] text-white/20 italic tracking-wider">Usage data is tracked per session and stored locally.</p>
        </div>
      </div>
    </div>
    <UiBaseConfirmation 
      :show="showResetConfirm"
      title="RESET USAGE LOGS?"
      message="Are you sure you want to clear all session statistics?"
      sub-message="This will reset all token counts and estimated costs for the current session."
      confirm-text="Reset Logs"
      danger
      @cancel="showResetConfirm = false"
      @confirm="handleConfirmReset"
    />
  </UiBaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUsage } from '~/composables/useUsage'

defineProps<{ show: boolean }>()
defineEmits(['close'])

const { stats, resetUsage } = useUsage()
const showResetConfirm = ref(false)

const handleConfirmReset = () => {
  resetUsage()
  showResetConfirm.value = false
}

const aiModelsUsage = computed(() => {
  return {
    gemini: stats.value.gemini,
    openrouter: stats.value.openrouter,
    groq: stats.value.groq
  }
})
</script>
