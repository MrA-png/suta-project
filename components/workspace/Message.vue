<template>
  <div class="mb-6 group animate-in fade-in duration-300">
    <div class="flex items-center gap-2 mb-1">
      <span class="text-[10px] font-semibold text-suta-muted uppercase tracking-[1px]">
        {{ speaker }}
      </span>
    </div>
    
    <p class="text-suta-muted text-[14px] leading-relaxed group-hover:text-white transition-colors">
      {{ text }}
    </p>
    
    <div v-if="translation" class="mt-2 pl-4 border-l border-suta-cyan/30">
      <p class="text-suta-cyan text-[13px] italic opacity-90 leading-relaxed font-medium">
        <span class="inline-block text-[9px] not-italic font-bold bg-suta-cyan/20 px-1.5 py-0.5 rounded mr-2 align-middle uppercase">
          {{ targetLang }}
        </span>
        {{ translation }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  speaker: string
  text: string
  translation?: string
  targetLang?: string
}>()
</script>
