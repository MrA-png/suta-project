<template>
  <div 
    v-if="isHovering && !isOverInteractive"
    class="pointer-events-none fixed z-[100] mix-blend-difference font-mono text-[10px] text-suta-cyan transition-opacity duration-300 hidden lg:block"
    :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
  >
    <div class="relative -translate-x-1/2 -translate-y-1/2">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-6 h-[1px] bg-suta-cyan/40"></div>
        <div class="h-6 w-[1px] bg-suta-cyan/40 absolute"></div>
      </div>
      
      <div class="ml-6 mt-6 whitespace-nowrap bg-black/40 backdrop-blur-[4px] p-2 border-l-2 border-suta-cyan/60 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
        <div class="flex flex-col gap-0.5 text-left">
          <div class="flex items-center gap-2">
            <span class="leading-none opacity-40 text-[8px]">SEARCHING_FRQ:</span>
            <span class="leading-none font-bold text-white">{{ noiseString }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="leading-none opacity-40 text-[8px]">COORD:</span>
            <span class="leading-none font-bold">[ {{ Math.round(mouseX) }} : {{ Math.round(mouseY) }} ]</span>
          </div>
          <div class="mt-1 text-[7px] text-suta-cyan/60 flex gap-1">
            <span v-for="i in 3" :key="i" class="animate-pulse">{{ glitchChar }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)
const isOverInteractive = ref(false)
const noiseString = ref('0.000')
const glitchChar = ref('░')
const chars = ['░', '▒', '▓', '█', '0', '1', '$', '#', '@', '&']

const updateNoise = () => {
  noiseString.value = (Math.random() * 1000).toFixed(3)
  glitchChar.value = chars[Math.floor(Math.random() * chars.length)]
}

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  isHovering.value = true

  const target = e.target as HTMLElement
  const isInteractive = target.closest('button') || 
                   target.closest('a') || 
                   target.closest('input') ||
                   window.getComputedStyle(target).cursor === 'pointer'
  
  isOverInteractive.value = !!isInteractive
}

let noiseInterval: any
onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseenter', () => isHovering.value = true)
  window.addEventListener('mouseleave', () => isHovering.value = false)
  noiseInterval = setInterval(updateNoise, 100)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  clearInterval(noiseInterval)
})
</script>
