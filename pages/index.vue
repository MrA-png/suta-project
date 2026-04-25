<template>
  <div 
    class="relative min-h-screen flex flex-col bg-suta-black selection:bg-suta-cyan selection:text-black transition-all duration-300"
    :class="isOverInteractive ? 'cursor-default' : 'cursor-none'"
  >
    <!-- Background Effects (Synced with VideoDisplay Offline State) -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <!-- Base Radial Gradient -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]"></div>
      
      <!-- Vertical Vignette -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
      
      <!-- Cyber Scanlines -->
      <div class="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,240,255,0.03)_50%,transparent)] bg-[length:100%_4px]"></div>

      <!-- Accent Glows -->
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-suta-cyan/5 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full"></div>
      <div class="absolute inset-0 opacity-[0.02] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]"></div>
    </div>

    <!-- Navigation -->
    <nav class="relative z-10 px-8 py-8 flex justify-between items-center max-w-7xl w-full mx-auto">
      <div class="flex items-center gap-2">
        <span class="text-3xl font-black tracking-tighter text-white">Suta<span class="text-suta-cyan">.</span></span>
      </div>
      <div class="flex items-center gap-8">
        <a href="#" class="text-[11px] font-bold uppercase tracking-[2px] text-white/40 hover:text-suta-cyan transition-colors">Documentation</a>
        <NuxtLink to="/workspace" class="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold uppercase tracking-[2px] text-white hover:bg-white hover:text-black transition-all">Try Now</NuxtLink>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative z-10 flex-1 pt-20 pb-32 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-suta-cyan/10 border border-suta-cyan/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <span class="w-2 h-2 bg-suta-cyan rounded-full animate-pulse"></span>
        <span class="text-[9px] font-bold uppercase tracking-[3px] text-suta-cyan">Neural Network Active</span>
      </div>

      <span class="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        Your Secret <br />
        <span class="text-white">Whisperer<span class="text-suta-cyan">.</span></span>
      </span>

      <p class="max-w-xl text-white/50 text-lg md:text-xl leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        Suta is a cognitive extension for technical interviews. Real-time transcription, AI-powered insights, and profile-synced coaching—all in one seamless terminal.
      </p>

      <div class="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
        <NuxtLink 
          to="/workspace" 
          class="group relative px-8 py-4 bg-suta-cyan text-black font-black text-sm uppercase tracking-[4px] rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,240,255,0.3)]"
        >
          <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          Initiate Session
        </NuxtLink>
        
        <button class="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-[4px] rounded-xl hover:bg-white/10 transition-all">
          Watch Demo
        </button>
      </div>

      <!-- Feature Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
        <div class="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-suta-cyan/30 transition-all group">
          <div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <div class="w-6 h-6 bg-white [mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
          </div>
          <h3 class="text-white font-bold text-lg mb-3 tracking-tight">AI Whisperer</h3>
          <p class="text-white/40 text-sm leading-relaxed">Multi-model intelligence providing context-aware answers synced to your professional profile.</p>
        </div>

        <div class="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-suta-cyan/30 transition-all group">
          <div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <div class="w-6 h-6 bg-white [mask-image:url(/icons/source.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
          </div>
          <h3 class="text-white font-bold text-lg mb-3 tracking-tight">Real-time Sync</h3>
          <p class="text-white/40 text-sm leading-relaxed">Captures audio directly from your browser tabs with ultra-low latency transcription.</p>
        </div>

        <div class="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-suta-cyan/30 transition-all group">
          <div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <div class="w-6 h-6 bg-white [mask-image:url(/icons/settings.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
          </div>
          <h3 class="text-white font-bold text-lg mb-3 tracking-tight">Neural Identity</h3>
          <p class="text-white/40 text-sm leading-relaxed">Customize your AI's knowledge base via the JSON Personality Editor to match your unique story.</p>
        </div>
      </div>

      <!-- How It Works -->
      <div class="mt-48 w-full text-center">
        <h2 class="text-3xl font-black text-white mb-16 tracking-tight">Strategic Workflow</h2>
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-12 text-left">
          <div v-for="(step, i) in [
            { t: 'Connect', d: 'Bridge your interview audio stream to Suta.' },
            { t: 'Sync', d: 'Inject your personality JSON into the neural core.' },
            { t: 'Listen', d: 'Suta transcribes every word with millisecond precision.' },
            { t: 'Whisper', d: 'Receive curated answers directly in your terminal.' }
          ]" :key="i" class="relative">
            <div class="text-4xl font-black text-white/5 mb-4">{{ i + 1 }}</div>
            <h4 class="text-suta-cyan font-bold text-lg mb-2 uppercase tracking-widest">{{ step.t }}</h4>
            <p class="text-white/40 text-sm">{{ step.d }}</p>
          </div>
        </div>
      </div>

      <!-- Use Cases Section -->
      <div class="mt-48 w-full p-12 rounded-[40px] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-suta-cyan/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl font-black text-white mb-6 tracking-tight">Built for Technical Excellence</h2>
          <p class="text-white/50 mb-12 text-center">Whether you're tackling system design or deep-diving into algorithms, Suta provides the edge you need to stay composed and articulate.</p>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div v-for="item in ['System Design', 'Algorithms', 'Soft Skills', 'Live Coding']" :key="item" class="flex flex-col items-center gap-3">
              <div class="w-2 h-2 bg-suta-cyan rounded-full"></div>
              <span class="text-[10px] font-bold text-white uppercase tracking-widest">{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 py-10 border-t border-white/5 px-8">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="text-white/20 text-[10px] uppercase tracking-[3px] font-bold">
          &copy; 2026 Suta Assist | Terminal Protocol V1.0
        </div>
        <div class="flex gap-8">
          <a href="#" class="text-[10px] uppercase tracking-[2px] text-white/40 hover:text-white transition-colors">Privacy</a>
          <a href="#" class="text-[10px] uppercase tracking-[2px] text-white/40 hover:text-white transition-colors">Terms</a>
          <a href="#" class="text-[10px] uppercase tracking-[2px] text-white/40 hover:text-white transition-colors">Support</a>
        </div>
      </div>
    </footer>

    <!-- ASCII Glitch Cursor (Following VideoDisplay aesthetic) -->
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
  layout: false
})

// ASCII Cursor Logic
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

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  isHovering.value = true
  
  // Detection logic for interactive elements
  const target = e.target
  const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']
  const isInteractive = interactiveTags.includes(target.tagName) || 
                   target.closest('button') || 
                   target.closest('a') ||
                   window.getComputedStyle(target).cursor === 'pointer'
  
  isOverInteractive.value = !!isInteractive
}

let noiseInterval
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

<style scoped>
.shadow-cyan-glow {
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.1);
}
</style>
