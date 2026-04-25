<template>
  <div 
    class="p-4 bg-white/5 border border-white/10 rounded-lg group cursor-pointer hover:border-suta-cyan/50 hover:bg-suta-cyan/5 transition-all flex items-center justify-between"
    @click="$emit('select')"
  >
    <div class="text-left">
      <div class="text-[13px] font-bold text-white mb-1">{{ timestamp }}</div>
      <div class="text-[10px] text-suta-muted uppercase tracking-wider">{{ messageCount }} Messages recorded</div>
    </div>
    <button 
      @click.stop="$emit('delete')"
      class="p-2 text-suta-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
      title="Delete Session"
    >
      <div class="w-4 h-4 bg-current [mask-image:url(/icons/clear.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  timestamp: string
  messageCount: number
}>()

defineEmits(['select', 'delete'])
</script>
