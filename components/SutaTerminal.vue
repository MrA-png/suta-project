<template>
  <div class="flex flex-col h-full bg-suta-dark-gray text-white font-sans">
    <!-- Header -->
    <header class="h-[64px] px-6 flex items-center justify-between border-b border-suta-border">
      <div class="brand">
        <h1 class="text-[20px] font-extrabold tracking-tight">
          Suta<span class="text-suta-cyan shadow-cyan-glow">.</span>
        </h1>
      </div>
      
      <div class="w-10 h-10 flex items-center justify-center">
        <div class="relative w-5 h-5" :class="{ 'animate-pulse': status === 'processing' }">
          <div 
            class="w-full h-full bg-suta-cyan rounded-full shadow-cyan-glow relative z-10 transition-transform duration-500"
            :class="{ 'scale-110 shadow-cyan-glow-intense': status === 'processing' }"
          ></div>
          <!-- Rings -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-x-75 w-10 h-10 border border-suta-cyan rounded-full opacity-30" :class="{ 'animate-[spin_2s_linear_infinite]': status === 'processing' }"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-x-75 rotate-y-75 w-10 h-10 border border-suta-cyan rounded-full opacity-30" :class="{ 'animate-[spin_2s_linear_infinite]': status === 'processing' }"></div>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Transcription -->
      <div 
        class="flex-1 p-6 overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]" 
        ref="transcriptionRef"
      >
        <div v-for="(msg, index) in transcript" :key="index" class="mb-5">
          <span class="text-[10px] font-semibold text-suta-muted uppercase tracking-[1px] block mb-1">
            {{ msg.speaker }}
          </span>
          <p class="text-suta-muted text-[14px] leading-relaxed">
            {{ msg.text }}
          </p>
        </div>
      </div>

      <!-- Teleprompter / Guide -->
      <div class="p-6 bg-black/20 border-t border-suta-border">
        <div class="flex gap-5 relative">
          <div class="w-[2px] bg-suta-cyan shadow-cyan-glow rounded-[2px]"></div>
          <div class="flex-1">
            <div class="text-[10px] color-suta-cyan font-bold mb-3 tracking-[2px] uppercase text-suta-cyan">
              SUTA QUICK START GUIDE
            </div>
            <div class="text-[18px] leading-snug text-white whitespace-pre-wrap font-mono">
              {{ displayedSuggestion }}<span class="inline-block w-[2px] h-[1em] bg-suta-cyan ml-1 animate-pulse align-middle"></span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="mt-8 flex justify-end">
          <button 
            class="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-md text-suta-muted text-[10px] font-medium tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300 uppercase"
            @click="togglePin"
          >
            <div class="w-3 h-3 bg-current [mask-image:url(/icons/info.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
            VIEW FULL DOCS
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const status = ref('idle')
const transcript = ref([
  { speaker: 'System', text: 'Suta Terminal Initialized. Ready for session capture.' },
  { speaker: 'System', text: 'Awaiting audio source connection...' }
])
const fullSuggestion = "Welcome to Suta.\n\nTo begin:\n1. Click 'Change Source'.\n2. Select your Meet/Zoom tab.\n3. Enable 'Share tab audio'.\n\nSuta will start assisting instantly."
const displayedSuggestion = ref('')
const transcriptionRef = ref(null)

const typeWriter = async () => {
  status.value = 'processing'
  displayedSuggestion.value = ''
  for (let i = 0; i < fullSuggestion.length; i++) {
    displayedSuggestion.value += fullSuggestion[i]
    await new Promise(r => setTimeout(r, 20))
  }
  status.value = 'idle'
}

onMounted(() => {
  setTimeout(typeWriter, 1500)
})

watch(transcript, () => {
  if (transcriptionRef.value) {
    transcriptionRef.value.scrollTop = transcriptionRef.value.scrollHeight
  }
}, { deep: true })

const togglePin = () => {
  console.log("Docs requested")
}
</script>

<style scoped>
/* Keeping only the non-standard perspective transforms for the 3D rings */
.rotate-x-75 { transform: translate(-50%, -50%) rotateX(75deg); }
.rotate-y-75 { transform: translate(-50%, -50%) rotateX(75deg) rotateY(75deg); }
</style>
