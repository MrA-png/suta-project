<template>
  <main class="relative z-10 flex-1 pt-12 md:pt-24 px-8 max-w-7xl mx-auto flex flex-col items-center">
    <!-- Hero Section: 2 Columns -->
    <div class="w-full flex flex-col md:flex-row items-center gap-12 text-left mb-24">
      <!-- Left Column: Content -->
      <div class="flex-1 flex flex-col items-start">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-suta-cyan/10 border border-suta-cyan/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span class="w-2 h-2 bg-suta-cyan rounded-full animate-pulse"></span>
          <span class="text-[9px] font-bold uppercase tracking-[3px] text-suta-cyan">Neural Network Active</span>
        </div>

        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Your Secret <br />
          <span class="text-white">Whisperer<span class="text-suta-cyan">.</span></span>
        </h1>

        <p class="max-w-xl text-white/50 text-lg md:text-xl leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          Suta is a cognitive extension for technical interviews. Real-time transcription, AI-powered insights, and profile-synced coaching all in one seamless terminal.
        </p>

        <div class="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <NuxtLink 
            to="/workspace" 
            class="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-[4px] rounded-xl hover:bg-white/10 transition-all"
          >
            Initiate Session
          </NuxtLink>
        </div>
      </div>

      <!-- Right Column: ASCII Silhouette -->
      <div class="flex-1 hidden md:flex justify-end items-center pr-2 animate-in fade-in zoom-in duration-1000 delay-700">
        <div class="relative group" @mouseenter="triggerScramble">
          <!-- Glow Effect (Outside) -->
          <div class="absolute inset-0 bg-suta-cyan/20 blur-[100px] rounded-full group-hover:bg-suta-cyan/30 transition-all duration-700"></div>
          
          <!-- Tightly wrapped container for ASCII + Scan -->
          <div class="relative overflow-hidden rounded-lg">
            <pre class="relative select-none group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500 whitespace-pre drop-shadow-[0_0_15px_rgba(0,240,255,0.4)] opacity-80 ascii-art text-suta-cyan leading-[1.1] text-[8px] font-bold pr-10">{{ displayedAscii }}</pre>

            <!-- Scanning Line -->
            <div class="absolute top-0 inset-x-0 h-[80px] bg-gradient-to-b from-transparent via-suta-cyan/30 to-transparent animate-scan pointer-events-none"></div>
            
            <!-- Live Camera Button Overlay -->
            <div class="absolute bottom-4 left-0 right-0 flex justify-center transition-opacity duration-500">
              <button 
                @click="isCameraActive ? stopCamera() : startCamera()"
                class="px-4 py-2 bg-black/60 backdrop-blur-md border border-suta-cyan/30 text-suta-cyan font-bold text-[9px] uppercase tracking-[3px] rounded-full hover:bg-suta-cyan hover:text-black transition-all flex items-center gap-2"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="isCameraActive ? 'bg-red-500 animate-pulse' : 'bg-suta-cyan'"></span>
                {{ isCameraActive ? 'Stop Live Feed' : 'Live Camera' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features, Workflow, etc. go here -->
    <slot />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const ORIGINAL_ASCII = `          ....................................................................................................
          ....................................................................................................
          ....................................................................................................
          ....................................................................................................
          ....................................................................................................
          ....................................................................................................
          ....................................................................................................
          ............................................:-+*##%#*+-:............................................
          .........................................:%%@@@@@@@@@@@@@%+.........................................
          .......................................-%@@@%###****+*#%@@@@%-......................................
          ......................................*%%%###**#####*##**#%@@@%.....................................
          .....................................#%%####**##%%######%###%@@%:...................................
          ....................................#@@##******#%##*####%##**#@@@:..................................
          ...................................-%@%#**********###*###%#***#@@#..................................
          ..................................:%%@##*************##***#***#%@@=.................................
          .................................:%%%#***##*********+*+==+#****%@@*.................................
          ...............................:.*%@%%%#***********+++**+++++**#@@%.................................
          .......................::.::::::+%%%@***********#%@@@@@@@@@%*+**@@%:::.:.........:.:................
          .....................:.::::::::-%%%@@@*+**+*#@@@@@@@@@@@@@@@@@#+%@%:.:.:..:.:.....:...........:.....
          ..........:.::::....:::::::::::%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@%+%%:::::::::::::::::::::::::::::::.:
          ........::.:.::.:.::::::::::::%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#*:::::::::::::::::::::::::::::::..
          ......:::.::.:::.::::::::::::-%%%@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#=:::::::::::::::::::::::::::::::::
          .::..:::::::::::::::::::::::-%%%%%%%@@@@%@@@@@@@@@@@@@@@@@@@@@@@@#::::::::::::::::::::::::::::::::::
          :.:...::::::::::::::::::::::*%@%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@%*::::::::::::::::::::::::::::::::::
          :::..:.::::::::::::::::::::+%%%@%%%%@@@@@@@@@@@@%%%@@@@@@@@@@@%%%#::..::::::::::::::::::::::::::::::
          ::.:::.::::.:..::::::::::::%%%@@%%@%%@@@@@@@@@@@@@@@%@@@@@@@@@%%%#::::::::::::::::::::::::::::::::::
          ::..::.::.:::.::::::::::::*%%%%%%%%@%@@@@@@@@@%%@%%%@@@@@@@@%%%%%*::::::::::::::::::::::::::::::::::
          ::.::.:::..:::::::::::::::#%%%%%@%%@%@@@@@@@@@@%@@@%%@@@@@@%%%%%%+::::::::::::::::::::::::::::::::::
          .::..::::...:.::::::::::::#%%%@@@@%@%@@@@@@@@@@@@@@@@@@@@@%%%@%%%:::::::::::::::::::::::::::::::::::
          .:::::.:.....:::::::::::::*%%%%%%%%@@%@@@@@@@@@@@@@@@@@@@%%%%@%%%:::::::::::::::::::::::::::::::::::
          :.:::::.:::.::::::::::::::-%@%%%@%%%@%%@@@@@@@@@@@@@@@@@%%%%%%@%%=::::::::::::::::::::::::::::::::::
          :.::::::::.::::::::::::::::*@@@@@%%@@%%@@@@@@@@@@@@@@@@@%@%%%@%%%-::::::.:.:::::::::::::::::::::::::
          ::...:..:..::::::::::::::::=@@@@@@@@@@@%@@@@@@@@@@@@@@@@@@@@%%%#::::::::::::::.:::::::::::::::::::::
          ::::.:::...::::::::::::::::+%@@@@@@@@@@@@@@@@@@@@@@%@@@@@@@@@@@%+::=-:::::::::::::::::::::::::::::::
          :....:.....::::::::::::::::%%%%%@@@@@@@@%@@@@@@@@%%@@@@@%@@@@@@@@%%%@@%###%#-:::::.:::::::::::::::::
          .:::..:.::::::::::::::::::=%%%%%%@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%@@%%%@@%%%%%%%#-::::::::::::::::
          :::.....::::::::::::::-*%%%%%%%%%%@@@@@@@%@@@@@@@%@@@@@@@@@@@@@@@@@@@@%%@@%%%%%%%%%%%%*:::::::::::::
          ........:::::::::::-#%%@@%@@@@@@%%%%%@@@@%@@@@@@%%@@@@@@%@@@%%@@@@@@@@%@@@@%%@%%%%%%%%%%%##:::::::::
          :.::....::::::::-#%@%@@@@%@@%@@@@@@@@@@@%%@@@@@@%%@%@%@@@@%@%%%@@@@@%%%@@@@@@@%%@%%%%%%%%%%+::-:::::
          :::....::::::+%%%%%%@%%%@@@%%%%%%%@%%%%@%%@%%@@@%%%%@@@@%%%%%%%@@@@%%%%%@@@@%%%%%%@@%%@@%%%%%%%%%%%%
          .::::..::=#%%%%%%%@%%%@%%%%%%%%%%@%@%%%@%%%@%%@@%%%%@%%%%%%%%%%@@@%%@@@%@@@@@%@@@@@%%@@@%%%%%%%%%%%%
          ::::.::%%%%%%%%%%%%%%%@@%%%%%%%%@%%%%%%@%@@%%@%@%%%%@%%%%%%%%%%@@@%@@@@@%@@@@@@@@@@%%@@@@@@@%%%%%%%%
          :.:.:#%%%%%@%%%%%@%%%%%@@%%%%%%%%%%%%%%%%@@@@@@@%%%%%%%%%%%%%%@@@@%%@@@@%@@@@@@@@@@@%%@@@@@%%%%%%%%%
          :::-%%%%%%%%%%%%%%@@%%%%@@@%%@%%%%%%%%%@%@@@@%@@%%%@%%@@%%%%%%@@@@%%@@@@@@@@@@@@@@@@@@@@@@%%%%%%%%%%
          :.:%%%%%%%%%%%@%%%%%%%%%%%%@%%%@@@%%%%@@%@@@@@@@%%@@@@%%%%%%%%@@@@@%@@@@@@@@@@@@@@@@@@%%%%%%%%%%%%%%
          ::%%%%%%%@%%%%%%%%%@@%%%%%%%@%@%%%%%%%@@%@@@@@@@%@@@%%%%%%%%%%@@@@@%%@@@@@@@@@@@@@@@%%%%%%%%%%%%%%%%
          :%%%%%@%@@%%%%%@@%%%%%%%%%%%%%%@%@%%%@@@%@@@@@@@%@%%@@%%%%%%%%@@@@@@%@@@@@@@@@@@@@@%%%%%%%%%%%%%%%%%
          -%@@@%%%@@%%%%@%@@@%%@@%%%%%@%%%@%%%%@@@%@@@@@@@%@@%%@%%%%%%%%@@@@@@@@@@@@@@%%%%%%%%%%%%%%%%%%%%%%%%
          #%%%@%%%%%@@@%%@@@@%%%@%%%%%@@@@%%%%@@@@%@@@@@@%%%@%@@%%%%%%%%@@@@@@@@@@@@%%%%%%%%%%%%%@@@%%@%%%%%%%
          %%%@@@@@@@%@@@%%@@@@%%%%%@%%@%@@%%%@@@@@@@@@@@@@%%@@@%%%%%%%%%@@@@@@@@@%%%%%%%%%%%%%%%%%%%%%@@%%@@%%
          %%%@%@@@%@@%@@%%@@@@%%%%%@@@@@@%%%@@@@@@%@%@@@@@@%%%@%%%%%%%%@@@@@@@%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%@
          @%%@@@%@@@%@@@@%@@@@@%%%%@@@@@%%%%@@@@@@%@@%@@@%%%%@@%%%%%@%%@@%%%%%%%%%%%%@%@%%%%%%%%%%%%%%%%%%%%%%
          @@%%@%@@@@@%@@@@@@@@@%%%%%@@@@%%%%@@@@@@@@%@@@%@@%@@@@%%%%%%%%%%@%@%%%%%%%%@@@@@@@@@%%%%%%%@%@%%@%@@
          @@@@@@%%@@@@%@@@@@@@@@@%@@@@@%%@@@@@@@@@%@@@@@@@%%@@@@%%%%%%%%%%%%@@@%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@`

const displayedAscii = ref('')
const isCameraActive = ref(false)
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let stream: MediaStream | null = null
let animationFrameId: number | null = null

// ASCII Character set for mapping brightness (Dark to Light)
const ASCII_CHARS = '@%#*+=-:. '
const COLS = 110 
const ROWS = 54  

const startCamera = async () => {
  try {
    triggerScramble()
    
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: COLS * 8, height: ROWS * 16, facingMode: 'user' } 
    })
    
    if (!videoRef.value) videoRef.value = document.createElement('video')
    videoRef.value.srcObject = stream
    videoRef.value.play()
    
    setTimeout(() => {
      isCameraActive.value = true
      if (!canvasRef.value) canvasRef.value = document.createElement('canvas')
      renderFrame()
    }, 500)
    
  } catch (err) {
    console.error("Camera access denied:", err)
    isCameraActive.value = false
    displayedAscii.value = ORIGINAL_ASCII
  }
}

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  isCameraActive.value = false
  triggerScramble()
}

const renderFrame = () => {
  if (!isCameraActive.value || !videoRef.value || !canvasRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  canvas.width = COLS
  canvas.height = ROWS

  ctx.drawImage(videoRef.value, 0, 0, COLS, ROWS)
  const pixels = ctx.getImageData(0, 0, COLS, ROWS).data
  let asciiImage = ''

  for (let y = 0; y < ROWS; y++) {
    asciiImage += '          ' // Match 10 leading spaces of ORIGINAL_ASCII
    for (let x = 0; x < COLS; x++) {
      const idx = (y * COLS + x) * 4
      const r = pixels[idx]
      const g = pixels[idx+1]
      const b = pixels[idx+2]
      const brightness = (r + g + b) / 3
      const charIdx = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1))
      asciiImage += ASCII_CHARS[charIdx]
    }
    asciiImage += '\n'
  }

  displayedAscii.value = asciiImage
  animationFrameId = requestAnimationFrame(renderFrame)
}

const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
let scrambleInterval: any = null

const triggerScramble = () => {
  if (isCameraActive.value) return
  if (scrambleInterval) clearInterval(scrambleInterval)
  
  const target = ORIGINAL_ASCII.split('')
  let frame = 0
  const totalFrames = 20
  
  scrambleInterval = setInterval(() => {
    frame++
    const progress = frame / totalFrames
    const next = target.map((char) => {
      if (char === '\n' || char === ' ') return char
      if (Math.random() < progress) return char
      return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
    })
    
    displayedAscii.value = next.join('')
    if (frame >= totalFrames) {
      displayedAscii.value = ORIGINAL_ASCII
      clearInterval(scrambleInterval)
    }
  }, 40)
}

onMounted(() => {
  triggerScramble()
})
</script>

<style scoped>
@keyframes scan {
  0% { top: -100px; }
  100% { top: 100%; }
}

.animate-scan {
  animation: scan 3s linear infinite;
}
</style>
