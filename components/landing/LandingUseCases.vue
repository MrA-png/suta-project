<template>
  <div class="mt-48 w-full p-12 rounded-[40px] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-suta-cyan/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
    <div class="max-w-3xl mx-auto">
      <h2 class="text-3xl font-black text-white mb-6 tracking-tight">Built for Technical Excellence</h2>
      <p class="text-white/50 mb-12 text-center leading-relaxed">From high-stakes interviews to global team collaborations, Suta's AI whispering system provides the strategic edge you need to stay composed and articulate.</p>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="item in useCases" :key="item" class="flex flex-col items-center gap-3">
          <div class="w-2 h-2 bg-suta-cyan rounded-full"></div>
          <span class="text-[10px] font-bold text-white uppercase tracking-widest text-center">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const useCases = ['Technical Interviews', 'Team Reporting', 'Strategic Discussions', 'Language Bridging']
</script>
