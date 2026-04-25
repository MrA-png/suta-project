<template>
  <div class="suta-app">
    <div 
      class="workspace-container" 
      :style="{ gridTemplateColumns: `${splitPercentage}% 1px auto` }"
    >
      <!-- Video Area -->
      <section class="video-section">
        <VideoWorkspace />
      </section>

      <!-- Resizer -->
      <div class="resizer" @mousedown="startResizing">
        <div class="resizer-line"></div>
      </div>

      <!-- Terminal Area -->
      <section class="terminal-section">
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

<style scoped>
.suta-app {
  height: 100vh;
  width: 100vw;
  background-color: var(--void-black);
  display: flex;
  overflow: hidden;
}

.workspace-container {
  display: grid;
  width: 100%;
  height: 100%;
}

.video-section {
  position: relative;
  overflow: hidden;
}

.terminal-section {
  background-color: var(--dark-gray);
  overflow: hidden;
}

.resizer {
  width: 10px;
  margin-left: -5px;
  cursor: col-resize;
  z-index: 10;
  display: flex;
  justify-content: center;
  transition: opacity 0.3s;
}

.resizer-line {
  width: 1px;
  height: 100%;
  background-color: var(--border-muted);
}

.resizer:hover .resizer-line {
  background-color: var(--electric-cyan);
  box-shadow: var(--cyan-glow);
}
</style>
