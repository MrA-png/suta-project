<template>
  <BaseModal :show="show" title="CORE_DOCUMENTATION" wide @close="$emit('close')">
    <div class="space-y-8 py-2 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar text-left">
      <!-- Section: Overview -->
      <section>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 rounded-lg bg-suta-cyan/10 border border-suta-cyan/20 flex items-center justify-center">
            <div class="w-4 h-4 bg-suta-cyan [mask-image:url(/icons/info.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
          </div>
          <h2 class="text-white font-bold text-[16px] uppercase tracking-wider">What is Suta?</h2>
        </div>
        <p class="text-white/60 text-[13px] leading-relaxed pl-11">
          Suta is a "Secret Whisperer" designed to be your cognitive extension during technical interviews. It captures live audio from your browser tabs, transcribes it in real-time, and provides intelligent answers based on your unique professional profile.
        </p>
      </section>

      <!-- Section: Setup Guide -->
      <section>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <div class="w-4 h-4 bg-orange-500 [mask-image:url(/icons/source.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
          </div>
          <h2 class="text-white font-bold text-[16px] uppercase tracking-wider">Setup Instructions</h2>
        </div>
        <div class="pl-11 space-y-4">
          <div class="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div class="text-suta-cyan font-mono text-[14px]">01</div>
            <div>
              <h4 class="text-white font-bold text-[13px] mb-1">Select Source</h4>
              <p class="text-white/40 text-[12px]">Click 'Change Source' and select the browser tab where your interview is happening (Google Meet, Zoom, etc.).</p>
            </div>
          </div>
          <div class="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div class="text-suta-cyan font-mono text-[14px]">02</div>
            <div>
              <h4 class="text-white font-bold text-[13px] mb-1">Enable Audio Sharing</h4>
              <p class="text-white/40 text-[12px]">CRITICAL: Ensure 'Also share tab audio' is checked in the system popup, otherwise Suta cannot hear the interviewer.</p>
            </div>
          </div>
          <div class="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div class="text-suta-cyan font-mono text-[14px]">03</div>
            <div>
              <h4 class="text-white font-bold text-[13px] mb-1">Neural Profile Sync</h4>
              <p class="text-white/40 text-[12px]">Ensure your profile is up-to-date in the Neural Profile section. Suta's whispers are only as good as the data you provide.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Features -->
      <section>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <div class="w-4 h-4 bg-purple-500 [mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
          </div>
          <h2 class="text-white font-bold text-[16px] uppercase tracking-wider">Core Features</h2>
        </div>
        <ul class="pl-11 space-y-3">
          <li class="flex items-start gap-2 text-[12px] text-white/60">
            <span class="text-suta-cyan">•</span>
            <span><strong class="text-white">Real-time Transcription:</strong> Low-latency capture using Deepgram Nova-2.</span>
          </li>
          <li class="flex items-start gap-2 text-[12px] text-white/60">
            <span class="text-suta-cyan">•</span>
            <span><strong class="text-white">Secret Whisperer AI:</strong> Multi-model support (Gemini & OpenRouter) for intelligent coaching.</span>
          </li>
          <li class="flex items-start gap-2 text-[12px] text-white/60">
            <span class="text-suta-cyan">•</span>
            <span><strong class="text-white">Live Translator:</strong> Instant translation for international interviews.</span>
          </li>
        </ul>
      </section>
    </div>

    <template #footer>
      <button @click="$emit('close')" class="w-full py-3 bg-white/5 text-white font-bold text-[11px] border border-white/10 rounded hover:bg-white hover:text-black transition-all uppercase tracking-[2px]">
        Acknowledge & Close
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
defineEmits(['close'])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 240, 255, 0.1); border-radius: 10px; }
</style>
