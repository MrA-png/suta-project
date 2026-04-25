<template>
  <div class="flex flex-col h-full bg-suta-dark-gray text-white font-sans">
    <!-- Header -->
    <header class="h-[64px] px-6 flex items-center justify-between border-b border-suta-border">
      <div class="brand">
        <h1 class="text-[20px] font-extrabold tracking-tight">
          Suta<span class="text-suta-cyan">.</span>
        </h1>
      </div>
      
      <div class="w-10 h-10 flex items-center justify-center">
        <div class="relative w-5 h-5">
          <!-- Core Sphere -->
          <div 
            class="w-full h-full rounded-full relative z-10 transition-all duration-500"
            :class="{ 
              'bg-suta-cyan shadow-cyan-glow scale-110 shadow-cyan-glow-intense animate-pulse': status === 'listening' || status === 'processing',
              'bg-yellow-500/50 scale-90': status === 'connecting',
              'bg-red-500 shadow-[0_0_10px_#ef4444]': status === 'error',
              'bg-white/10': status === 'idle'
            }"
          ></div>
          
          <!-- Ring 1 -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-x-75 pointer-events-none">
            <div 
              class="w-10 h-10 border rounded-full transition-colors duration-500"
              :class="{ 
                'border-suta-cyan opacity-30 animate-[spin_4s_linear_infinite]': status === 'listening' || status === 'processing' || status === 'connecting',
                'border-red-500 opacity-20': status === 'error',
                'border-white opacity-5 border-dashed': status === 'idle'
              }"
            ></div>
          </div>
          
          <!-- Ring 2 -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-x-75 rotate-y-75 pointer-events-none">
            <div 
              class="w-10 h-10 border rounded-full transition-colors duration-500"
              :class="{ 
                'border-suta-cyan opacity-20 animate-[spin_3s_linear_infinite_reverse]': status === 'listening' || status === 'processing' || status === 'connecting',
                'border-red-500 opacity-10': status === 'error',
                'border-white opacity-0': status === 'idle'
              }"
            ></div>
          </div>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Transcription Area -->
      <div 
        class="flex-1 p-6 overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]" 
        ref="transcriptionRef"
      >
        <div v-for="(msg, index) in transcript" :key="index" class="mb-6 group">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-semibold text-suta-muted uppercase tracking-[1px]">
              {{ msg.speaker }}
            </span>
          </div>
          
          <p class="text-suta-muted text-[14px] leading-relaxed transition-colors group-hover:text-white">
            {{ msg.text }}
          </p>
          
          <div v-if="msg.translation" class="mt-2 pl-4 border-l border-suta-cyan/30 animate-in fade-in slide-in-from-left-2 duration-500">
            <p class="text-suta-cyan text-[13px] italic opacity-90 leading-relaxed font-medium">
              <span class="inline-block text-[9px] not-italic font-bold bg-suta-cyan/20 px-1.5 py-0.5 rounded mr-2 align-middle">ID</span>
              {{ msg.translation }}
            </p>
          </div>
        </div>

        <!-- LIVE INTERIM TEXT -->
        <div v-if="interimText" class="mb-6 opacity-70">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold text-suta-cyan uppercase tracking-[2px] animate-pulse">LIVE CAPTION</span>
          </div>
          <p class="text-white text-[14px] leading-relaxed italic">
            {{ interimText }}<span class="inline-block w-1 h-4 bg-suta-cyan ml-1 animate-ping"></span>
          </p>
        </div>
      </div>

      <!-- Teleprompter / Guide -->
      <div class="border-t border-suta-border bg-black/20">
        <div 
          class="p-4 px-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group"
          @click="isGuideOpen = !isGuideOpen"
        >
          <div class="text-[10px] color-suta-cyan font-bold tracking-[2px] uppercase text-suta-cyan">
            SUTA QUICK START GUIDE
          </div>
          <div 
            class="w-4 h-4 text-suta-muted transition-transform duration-300"
            :class="{ 'rotate-180': isGuideOpen }"
          >
            <div class="w-full h-full bg-current [mask-image:url(/icons/source.svg)] [mask-size:contain] [mask-repeat:no-repeat] rotate-180"></div>
          </div>
        </div>

        <div 
          v-show="isGuideOpen"
          class="px-6 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div class="flex gap-5 relative">
            <div class="w-[2px] bg-suta-cyan shadow-cyan-glow rounded-[2px]"></div>
            <div class="flex-1">
              <div class="text-[18px] leading-snug text-white whitespace-pre-wrap font-mono">
                {{ displayedSuggestion }}<span class="inline-block w-[2px] h-[1em] bg-suta-cyan ml-1 animate-pulse align-middle"></span>
              </div>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end">
            <button 
              class="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-md text-suta-muted text-[10px] font-medium tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300 uppercase"
              @click.stop="togglePin"
            >
              <div class="w-3 h-3 bg-current [mask-image:url(/icons/info.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
              VIEW FULL DOCS
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSuta } from '~/composables/useSuta'

const { transcript, interimText, currentStatus: status } = useSuta()

const isGuideOpen = ref(true)
const fullSuggestion = "Welcome to Suta.\n\nTo begin:\n1. Click 'Change Source'.\n2. Select your Meet/Zoom tab.\n3. Enable 'Share tab audio'.\n\nSuta will start assisting instantly."
const displayedSuggestion = ref('')
const transcriptionRef = ref(null)

const typeWriter = async () => {
  displayedSuggestion.value = ''
  for (let i = 0; i < fullSuggestion.length; i++) {
    displayedSuggestion.value += fullSuggestion[i]
    await new Promise(r => setTimeout(r, 20))
  }
}

onMounted(() => {
  setTimeout(typeWriter, 1500)
})

watch(status, (newStatus) => {
  if (newStatus === 'listening' || newStatus === 'processing' || newStatus === 'connecting') {
    isGuideOpen.value = false
  }
})

watch([transcript, interimText], () => {
  if (transcriptionRef.value) {
    setTimeout(() => {
      if (transcriptionRef.value) {
        transcriptionRef.value.scrollTop = transcriptionRef.value.scrollHeight
      }
    }, 50)
  }
}, { deep: true })

const togglePin = () => {
  console.log("Docs requested")
}
</script>

<style scoped>
.rotate-x-75 { transform: translate(-50%, -50%) rotateX(75deg); }
.rotate-y-75 { transform: translate(-50%, -50%) rotateX(75deg) rotateY(75deg); }
</style>
