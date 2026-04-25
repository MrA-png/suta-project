<template>
  <div 
    class="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"
    :class="{ 'cursor-none': !isStreaming }"
    @mousemove="handleMouseMove"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- Custom ASCII Glitch Cursor (Only Offline) -->
    <div 
      v-if="!isStreaming && isHovering"
      class="pointer-events-none fixed z-[50] mix-blend-difference font-mono text-[10px] text-suta-cyan transition-opacity duration-300"
      :style="{ left: mouseX + 'px', top: mouseY + 'px' }"
    >
      <div class="relative -translate-x-1/2 -translate-y-1/2">
        <!-- Crosshair -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-6 h-[1px] bg-suta-cyan/40"></div>
          <div class="h-6 w-[1px] bg-suta-cyan/40 absolute"></div>
        </div>
        
        <!-- ASCII Glitch Data -->
        <div class="ml-6 mt-6 whitespace-nowrap bg-black/40 backdrop-blur-[4px] p-2 border-l-2 border-suta-cyan/60 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
          <div class="flex flex-col gap-0.5">
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

    <!-- Real Video Stream -->
    <video 
      ref="videoRef" 
      autoplay 
      playsinline 
      muted
      class="w-full h-full object-contain transition-opacity duration-700"
      :class="isStreaming ? 'opacity-100' : 'opacity-0'"
    ></video>
    
    <!-- Offline Overlay -->
    <div v-if="!isStreaming" class="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none"></div>
      <div class="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,240,255,0.03)_50%,transparent)] bg-[length:100%_4px] pointer-events-none"></div>
      
      <div class="absolute top-6 left-6 text-[10px] tracking-[2px] text-suta-muted flex items-center gap-2 z-[4] px-2 py-1 bg-black/30 rounded backdrop-blur-md border border-white/5 uppercase">
        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
        Waiting for Source
      </div>

      <div class="text-center group">
        <div class="text-[14px] tracking-[8px] text-suta-muted relative uppercase font-light group-hover:text-suta-cyan transition-colors duration-500">
          Ready to Connect
        </div>
        <div class="mt-2 text-[8px] text-white/10 uppercase tracking-[4px] font-mono">
          - No Active Stream Detected -
        </div>
      </div>
    </div>

    <!-- Online Status Badge -->
    <div v-else class="absolute top-6 left-6 text-[10px] tracking-[2px] text-suta-cyan flex items-center gap-2 z-[4] px-2 py-1 bg-black/30 rounded backdrop-blur-md border border-suta-cyan/20 uppercase">
      <span class="w-1.5 h-1.5 bg-suta-emerald rounded-full shadow-[0_0_8px_#10B981] animate-pulse"></span>
      Live: {{ sourceName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  isStreaming: boolean
  sourceName: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)
const noiseString = ref('----')
const glitchChar = ref('Δ')

const chars = '@#$%&*§ΔΩΣΘΞΨΠΦΓΛ0123456789'
let interval: any = null

const generateNoise = () => {
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  noiseString.value = result
  glitchChar.value = chars.charAt(Math.floor(Math.random() * chars.length))
}

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

onMounted(() => {
  interval = setInterval(generateNoise, 100)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

// Expose the video element to the parent
defineExpose({ videoElement: videoRef })
</script>

<style scoped>
.cursor-none {
  cursor: none !important;
}
</style>
