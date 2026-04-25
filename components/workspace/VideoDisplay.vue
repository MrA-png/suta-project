<template>
  <div class="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
    <!-- Custom ASCII Glitch Cursor (Only Offline) -->
    <GlitchCursor v-if="!isStreaming" />

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
      
      <div class="text-center group">
        <div class="text-[14px] tracking-[8px] text-suta-muted relative uppercase font-light group-hover:text-suta-cyan transition-colors duration-500">
          Ready to Connect
        </div>
        <div class="mt-2 text-[8px] text-white/10 uppercase tracking-[4px] font-mono">
          - No Active Stream Detected -
        </div>
      </div>
    </div>

    <!-- Status Badges -->
    <div class="absolute top-6 left-6 flex items-center gap-2 z-[4]">
      <div v-if="!isStreaming" class="text-[10px] tracking-[2px] text-suta-muted flex items-center gap-2 px-2 py-1 bg-black/30 rounded backdrop-blur-md border border-white/5 uppercase">
        <span class="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
        Waiting for Source
      </div>
      <div v-else class="text-[10px] tracking-[2px] text-suta-cyan flex items-center gap-2 px-2 py-1 bg-black/30 rounded backdrop-blur-md border border-suta-cyan/20 uppercase">
        <span class="w-1.5 h-1.5 bg-suta-emerald rounded-full shadow-[0_0_8px_#10B981] animate-pulse"></span>
        Live: {{ sourceName }}
      </div>
    </div>

    <!-- Back to Landing Button -->
    <NuxtLink 
      to="/" 
      class="absolute top-6 right-6 z-[4] flex items-center gap-2 px-3 py-1 bg-black/30 hover:bg-white/10 border border-white/10 rounded backdrop-blur-md text-[10px] text-white/50 hover:text-suta-cyan transition-all duration-300 uppercase tracking-[2px] group"
    >
      <div class="w-3 h-3 bg-current [mask-image:url(/icons/chevron.svg)] [mask-size:contain] [mask-repeat:no-repeat] rotate-90 group-hover:-translate-x-1 transition-transform"></div>
      Exit
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  isStreaming: boolean
  sourceName: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

// Expose the video element to the parent
defineExpose({ videoElement: videoRef })
</script>

<style scoped>
.cursor-none {
  cursor: none !important;
}
</style>
