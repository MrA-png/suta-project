<template>
  <div class="h-screen w-screen bg-suta-black flex overflow-hidden font-sans text-white">
    <div 
      class="grid w-full h-full" 
      :style="{ gridTemplateColumns: `${splitPercentage}% 1px auto` }"
    >
      <!-- Video Area -->
      <section class="relative overflow-hidden">
        <VideoWorkspace />
      </section>

      <!-- Resizer -->
      <div 
        class="w-[10px] ml-[-5px] cursor-col-resize z-10 flex justify-center transition-opacity duration-300 group"
        @mousedown="startResizing"
      >
        <div class="w-[1px] h-full bg-suta-border group-hover:bg-suta-cyan group-hover:shadow-cyan-glow"></div>
      </div>

      <!-- Terminal Area -->
      <section class="bg-suta-dark-gray overflow-hidden">
        <SutaTerminal />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const splitPercentage = ref(65)
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
</script>

<style>
/* Global styles stay in main.css but we can remove app-specific scoped styles */
</style>
