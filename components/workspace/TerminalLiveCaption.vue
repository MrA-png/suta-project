<template>
  <div v-if="text" class="mb-6 opacity-70 animate-pulse">
    <div class="flex items-center gap-2 mb-1">
      <span class="text-[10px] font-bold text-suta-cyan uppercase tracking-[2px]">LIVE CAPTION</span>
    </div>
    <p class="text-white text-[14px] leading-relaxed italic">
      {{ text }}<span class="inline-block w-1 h-4 bg-suta-cyan ml-1 align-middle"></span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>()
</script>
