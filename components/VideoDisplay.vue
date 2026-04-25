<template>
  <div class="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
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

      <div class="text-center">
        <div class="text-[14px] tracking-[4px] text-suta-muted relative uppercase font-light">Ready to Connect</div>
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
import { ref, onMounted } from 'vue'

const props = defineProps<{
  isStreaming: boolean
  sourceName: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

// Expose the video element to the parent
defineExpose({ videoElement: videoRef })
</script>
