<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 w-screen h-screen flex items-center justify-center z-[9999]" @click.self="$emit('close')">
        <div 
          class="w-[90%] p-10 rounded-[24px] bg-white/5 backdrop-blur-[25px] border border-white/10 relative overflow-hidden"
          :class="wide ? 'max-w-[640px]' : 'max-w-[440px]'"
        >
          <!-- Header -->
          <div class="mb-6 relative z-[1]">
            <slot name="header">
              <div class="flex flex-col items-center gap-4 text-center">
                <div 
                  class="w-[50px] h-[50px] border rounded-[12px] flex items-center justify-center font-extrabold text-[24px] transition-all duration-300"
                  :class="danger ? 'bg-orange-500/20 border-orange-500/40 text-amber-400 shadow-[0_0_25px_rgba(249,115,22,0.25)]' : 'bg-white/5 border-white/20 text-white'"
                >
                  !
                </div>
                <h3 class="text-[13px] tracking-[5px] uppercase font-semibold text-white opacity-80">
                  {{ title }}
                </h3>
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
  </Teleport>
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
  },
  wide: {
    type: Boolean,
    default: false
  },
  danger: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>

<style scoped>
/* Simplified Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
