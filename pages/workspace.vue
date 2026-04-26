<template>
  <div class="h-screen w-screen bg-suta-black flex overflow-hidden font-sans text-white">
    <div 
      class="grid w-full h-full" 
      :style="{ gridTemplateColumns: isAIPanelOpen ? `${splitPercentage}% 1px auto` : '100% 0px 0px' }"
    >
      <!-- Video & Terminal Area -->
      <section class="relative overflow-hidden">
        <WorkspaceContainer />
      </section>

      <!-- Resizer (Vertical) -->
      <div 
        v-if="isAIPanelOpen"
        class="w-[10px] ml-[-5px] cursor-col-resize z-10 flex items-center justify-center transition-all duration-300 group relative"
        @mousedown="startResizing"
      >
        <!-- The Line -->
        <div class="w-[2px] h-full bg-white/10 group-hover:bg-suta-cyan/40 transition-colors"></div>
        
        <!-- The Grip Dots (Vertical) -->
        <div class="absolute top-1/2 -translate-y-1/2 py-4 bg-suta-black flex flex-col gap-1.5 items-center z-20">
          <div v-for="i in 3" :key="i" class="w-[3px] h-[3px] rounded-full bg-white/10 group-hover:bg-suta-cyan/60 transition-colors"></div>
        </div>
      </div>

      <!-- AI Panel Area -->
      <section v-if="isAIPanelOpen" class="bg-suta-dark-gray overflow-hidden">
        <WorkspaceAIPanelUnit />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSuta } from '~/composables/useSuta'

const { isAIPanelOpen } = useSuta()
const splitPercentage = ref(70)
const isResizing = ref(false)

const startResizing = (e) => {
  isResizing.value = true
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopResizing)
  document.body.style.cursor = 'col-resize'
}

const handleMouseMove = (e) => {
  if (!isResizing.value) return
  const newPercentage = (e.clientX / window.innerWidth) * 100
  if (newPercentage > 20 && newPercentage < 80) {
    splitPercentage.value = newPercentage
  }
}

const stopResizing = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResizing)
  document.body.style.cursor = 'default'
}

// Ensure clean state on entry
definePageMeta({
  layout: false
})
</script>
