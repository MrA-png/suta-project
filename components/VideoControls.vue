<template>
  <div class="absolute bottom-[30px] left-1/2 -translate-x-1/2 px-4 py-2 rounded-full flex items-center gap-3 z-[10] bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all hover:bg-white/10">
    <button 
      class="flex items-center gap-2 text-[12px] font-bold px-3 py-1.5 rounded-full opacity-80 hover:opacity-100 hover:text-suta-cyan transition-all disabled:opacity-30 uppercase tracking-wider" 
      @click="$emit('start')" 
      :disabled="isStreaming"
    >
      <div class="w-5 h-5 bg-current [mask-image:url(/icons/source.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
      <span>{{ isStreaming ? 'Connected' : 'Change Source' }}</span>
    </button>
    
    <div class="w-[1px] h-5 bg-white/10"></div>
    
    <button 
      class="flex items-center gap-2 text-[12px] font-bold px-3 py-1.5 rounded-full transition-all"
      :class="isStreaming ? 'text-red-500 opacity-100 hover:bg-red-500/10' : 'text-white/20 pointer-events-none'"
      @click="$emit('stop')" 
      title="Stop Capture"
    >
      <div class="w-5 h-5 bg-current [mask-image:url(/icons/stop.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isStreaming: boolean
}>()

defineEmits(['start', 'stop'])
</script>
