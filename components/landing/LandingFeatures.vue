<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700">
    <div v-for="(feature, i) in features" :key="i" class="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-suta-cyan/30 transition-all group">
      <div class="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <div class="w-6 h-6 bg-white" :class="feature.iconStyle"></div>
      </div>
      <h3 class="text-white font-bold text-lg mb-3 tracking-tight">{{ feature.title }}</h3>
      <p class="text-white/40 text-sm leading-relaxed">{{ feature.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    title: 'AI Whisperer',
    description: 'Multi-model intelligence providing context-aware answers synced to your professional profile.',
    iconStyle: '[mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat]'
  },
  {
    title: 'Real-time Sync',
    description: 'Captures audio directly from your browser tabs with ultra-low latency transcription.',
    iconStyle: '[mask-image:url(/icons/source.svg)] [mask-size:contain] [mask-repeat:no-repeat]'
  },
  {
    title: 'Neural Identity',
    description: "Customize your AI's knowledge base via the JSON Personality Editor to match your unique story.",
    iconStyle: '[mask-image:url(/icons/settings.svg)] [mask-size:contain] [mask-repeat:no-repeat]'
  }
]
</script>
