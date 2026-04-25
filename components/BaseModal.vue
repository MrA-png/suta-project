<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 w-screen h-screen bg-black/70 backdrop-blur-[4px] flex items-center justify-center z-[1000]" @click.self="$emit('close')">
      <div class="w-[90%] max-w-[440px] p-10 rounded-[24px] text-center bg-white/5 backdrop-blur-[25px] border border-white/10 relative overflow-hidden">
        <!-- Header -->
        <div class="mb-6 relative z-[1]">
          <slot name="header">
            <div class="flex flex-col items-center gap-4">
              <div class="w-[50px] h-[50px] border border-white/20 rounded-[12px] flex items-center justify-center text-white font-extrabold text-[24px] bg-white/5">!</div>
              <h3 class="text-[13px] tracking-[5px] text-white uppercase font-semibold opacity-80">{{ title }}</h3>
            </div>
          </slot>
        </div>

        <!-- Body -->
        <div class="text-[15px] leading-relaxed text-white/60 mb-9 relative z-[1]">
          <slot></slot>
        </div>

        <!-- Footer -->
        <div class="relative z-[1]">
          <slot name="footer">
            <button class="bg-white text-black border-none py-3 px-10 rounded-[12px] font-bold text-[13px] tracking-[1px] cursor-pointer transition-all duration-200 w-full hover:bg-white/90 hover:-translate-y-[1px]" @click="$emit('close')">
              CONFIRM
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'SYSTEM STATUS'
  }
})

defineEmits(['close'])
</script>

<style scoped>
/* Simplified Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
