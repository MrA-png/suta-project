<template>
  <div class="mt-48 w-full text-center">
    <h2 class="text-3xl font-black text-white mb-16 tracking-tight">Strategic Workflow</h2>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-12 text-left">
      <div v-for="(step, i) in steps" :key="i" class="relative">
        <div class="text-4xl font-black text-white/5 mb-4">{{ i + 1 }}</div>
        <h4 class="text-suta-cyan font-bold text-lg mb-2 uppercase tracking-widest">{{ step.t }}</h4>
        <p class="text-white/40 text-sm">{{ step.d }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const steps = [
  { t: 'Connect', d: 'Bridge your interview audio stream to Suta.' },
  { t: 'Sync', d: 'Inject your personality JSON into the neural core.' },
  { t: 'Listen', d: 'Suta transcribes every word with millisecond precision.' },
  { t: 'Whisper', d: 'Receive curated answers directly in your terminal.' }
]
</script>
