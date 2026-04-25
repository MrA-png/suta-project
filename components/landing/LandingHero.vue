<template>
  <main class="relative z-10 flex-1 pt-20 pb-32 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-suta-cyan/10 border border-suta-cyan/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <span class="w-2 h-2 bg-suta-cyan rounded-full animate-pulse"></span>
      <span class="text-[9px] font-bold uppercase tracking-[3px] text-suta-cyan">Neural Network Active</span>
    </div>

    <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
      Your Secret <br />
      <span class="text-white">Whisperer<span class="text-suta-cyan">.</span></span>
    </h1>

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

    <slot />
  </main>
</template>
