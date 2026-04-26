<template>
  <UiBaseModal :show="show" :title="title" :danger="danger" @close="$emit('cancel')">
    <div class="py-4 text-center">
      <p class="text-[14px] text-white/70 mb-2">{{ message }}</p>
      <p v-if="subMessage" class="text-[11px] font-bold uppercase tracking-widest italic" :class="danger ? 'text-red-400' : 'text-suta-cyan'">
        {{ subMessage }}
      </p>
    </div>
    
    <template #footer>
      <div class="flex gap-3">
        <button 
          @click="$emit('cancel')"
          class="flex-1 py-3 bg-white/5 text-white font-bold text-[11px] border border-white/10 rounded hover:bg-white/10 transition-all uppercase tracking-[1px]"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="$emit('confirm')"
          class="flex-1 py-3 font-bold text-[11px] border rounded transition-all uppercase tracking-[1px]"
          :class="danger 
            ? 'bg-red-500/20 text-red-500 border-red-500/30 hover:bg-red-500 hover:text-white' 
            : 'bg-suta-cyan/20 text-suta-cyan border-suta-cyan/30 hover:bg-suta-cyan hover:text-black'"
        >
          {{ confirmText }}
        </button>
      </div>
    </template>
  </UiBaseModal>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  title: string
  message: string
  subMessage?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  danger: false
})

defineEmits(['confirm', 'cancel'])
</script>
