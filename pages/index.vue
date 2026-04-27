<template>
  <div class="relative min-h-screen flex flex-col bg-suta-black selection:bg-suta-cyan selection:text-black transition-all duration-300">
    <CyberBackground />

    <!-- Navigation -->
    <nav class="relative z-10 px-8 py-8 flex justify-between items-center max-w-7xl w-full mx-auto">
      <div class="flex items-center gap-2">
        <span class="text-3xl font-black tracking-tighter text-white">Suta<span class="text-suta-cyan">.</span></span>
      </div>
      <div class="flex items-center gap-8">
        <NuxtLink to="/docs" class="text-[11px] font-bold uppercase tracking-[2px] text-white/40 hover:text-suta-cyan transition-colors">Documentation</NuxtLink>
        <NuxtLink to="/workspace" class="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold uppercase tracking-[2px] text-white hover:bg-white hover:text-black transition-all">Try Now</NuxtLink>
      </div>
    </nav>

    <LandingHero>
      <LandingFeatures />
      <LandingWorkflow />
      <LandingUseCases />
    </LandingHero>

    <!-- Footer -->
    <footer class="relative z-10 mt-32 py-10 border-t border-white/5 px-8">
      <div class="max-w-7xl mx-auto flex justify-center items-center gap-8">
        <div class="text-white/20 text-[10px] uppercase tracking-[3px] font-bold flex items-center gap-2">
          &copy; 2026 Suta Assist | Terminal Protocol V1.0 | BY 
          <a href="https://github.com/MrA-png" target="_blank" class="text-white/30 hover:text-suta-cyan transition-colors underline-offset-4 hover:underline">MrA-png</a>
        </div>
      </div>
    </footer>

    <GlitchCursor />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>
