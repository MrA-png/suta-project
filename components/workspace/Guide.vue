<template>
  <div class="border-t border-suta-border bg-suta-dark-gray flex-shrink-0">
    <div 
      class="p-4 px-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group"
      @click="isOpen = !isOpen"
    >
      <div class="text-[10px] color-suta-cyan font-bold tracking-[2px] uppercase text-suta-cyan">
        SUTA QUICK START GUIDE
      </div>
      <div 
        class="w-4 h-4 text-suta-muted transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      >
        <div class="w-full h-full bg-current [mask-image:url(/icons/chevron.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
      </div>
    </div>

    <div 
      v-show="isOpen"
      class="px-6 pb-6 animate-in slide-in-from-bottom-2 duration-300"
    >
      <div class="flex gap-5 relative">
        <div class="w-[2px] bg-suta-cyan shadow-cyan-glow rounded-[2px]"></div>
        <div class="flex-1">
          <div class="text-[14px] leading-snug text-white whitespace-pre-wrap font-mono">
            {{ displayedText }}<span class="inline-block w-[2px] h-[1em] bg-suta-cyan ml-1 align-middle animate-pulse"></span>
          </div>
        </div>
      </div>
      
      <div class="mt-8 flex justify-end">
        <button 
          @click="showDocs = true"
          class="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-md text-suta-muted text-[10px] font-medium tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300 uppercase"
        >
          <div class="w-3 h-3 bg-current [mask-image:url(/icons/info.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
          VIEW FULL DOCS
        </button>
      </div>
    </div>

    <!-- Full Documentation Modal -->
    <TerminalDocsModal :show="showDocs" @close="showDocs = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useSuta } from '../composables/useSuta'

const { currentStatus } = useSuta()
const isOpen = ref(true)
const showDocs = ref(false)
const fullText = "Welcome to Suta.\n\nTo begin:\n1. Click 'Change Source'.\n2. Select your Meet/Zoom tab.\n3. Enable 'Share tab audio'.\n\nSuta will start assisting instantly."
const displayedText = ref('')

const typeWriter = async () => {
  displayedText.value = ''
  for (let i = 0; i < fullText.length; i++) {
    displayedText.value += fullText[i]
    await new Promise(r => setTimeout(r, 20))
  }
}

onMounted(() => {
  setTimeout(typeWriter, 1500)
})

watch(currentStatus, (newStatus) => {
  if (['listening', 'processing', 'connecting'].includes(newStatus)) {
    isOpen.value = false
  }
})
</script>
