<template>
  <div class="suta-terminal">
    <!-- Header -->
    <header class="terminal-header">
      <div class="brand">
        <h1>Suta<span class="dot">.</span></h1>
      </div>
      
      <div class="status-indicator">
        <div class="sphere-container" :class="status">
          <div class="sphere"></div>
          <div class="rings">
            <div class="ring"></div>
            <div class="ring"></div>
          </div>
        </div>
      </div>
    </header>

    <!-- Content Area -->
    <div class="terminal-content">
      <!-- Transcription -->
      <div class="transcription-area" ref="transcriptionRef">
        <div v-for="(msg, index) in transcript" :key="index" class="msg-block">
          <span class="speaker">{{ msg.speaker }}</span>
          <p class="text">{{ msg.text }}</p>
        </div>
      </div>

      <!-- Teleprompter / Suggestions -->
      <div class="teleprompter-area">
        <div class="suggestion-container">
          <div class="neon-line"></div>
          <div class="suggestion-content">
            <div class="label">SUTA SUGGESTION</div>
            <div class="typewriter-text mono">
              {{ displayedSuggestion }}
              <span class="cursor">|</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="actions">
          <button class="pin-btn" @click="togglePin">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            PIN CONTEXT
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const status = ref('idle') // idle, listening, processing
const transcript = ref([
  { speaker: 'Interviewer', text: 'Tell me about your experience with real-time data processing.' },
  { speaker: 'Interviewer', text: 'We are looking for someone who can handle high-throughput streams...' }
])
const fullSuggestion = "I have extensive experience building real-time pipelines using Nuxt 3 and WebSocket protocols. In my previous project, I optimized data latency by 40% by implementing specialized Vite pre-bundling strategies."
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

// Auto-scroll transcript
watch(transcript, () => {
  if (transcriptionRef.value) {
    transcriptionRef.value.scrollTop = transcriptionRef.value.scrollHeight
  }
}, { deep: true })
</script>

<style scoped>
.suta-terminal {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.terminal-header {
  height: var(--header-height);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-muted);
}

.brand h1 {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.dot {
  color: var(--electric-cyan);
  text-shadow: var(--cyan-glow);
}

/* 3D Indicator */
.status-indicator {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sphere-container {
  position: relative;
  width: 20px;
  height: 20px;
}

.sphere {
  width: 100%;
  height: 100%;
  background: var(--electric-cyan);
  border-radius: 50%;
  box-shadow: var(--cyan-glow);
  position: relative;
  z-index: 2;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(75deg);
  width: 40px;
  height: 40px;
  border: 1px solid var(--electric-cyan);
  border-radius: 50%;
  opacity: 0.3;
}

.ring:last-child {
  transform: translate(-50%, -50%) rotateX(75deg) rotateY(75deg);
}

.sphere-container.processing .sphere {
  animation: pulse-glow 1s infinite alternate;
}

.sphere-container.processing .ring {
  animation: spin 2s linear infinite;
}

@keyframes pulse-glow {
  from { box-shadow: var(--cyan-glow); }
  to { box-shadow: var(--cyan-glow-intense); transform: scale(1.1); }
}

@keyframes spin {
  from { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(0deg); }
  to { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(360deg); }
}

/* Content Area */
.terminal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.transcription-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
}

.msg-block {
  margin-bottom: 20px;
}

.speaker {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 4px;
}

.text {
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
}

/* Teleprompter */
.teleprompter-area {
  padding: 24px;
  background: rgba(0,0,0,0.2);
  border-top: 1px solid var(--border-muted);
}

.suggestion-container {
  display: flex;
  gap: 20px;
  position: relative;
}

.neon-line {
  width: 2px;
  background: var(--electric-cyan);
  box-shadow: var(--cyan-glow);
  border-radius: 2px;
}

.label {
  font-size: 10px;
  color: var(--electric-cyan);
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.typewriter-text {
  font-size: 18px;
  line-height: 1.5;
  color: var(--text-bright);
}

.cursor {
  animation: blink 1s step-end infinite;
  color: var(--electric-cyan);
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.pin-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border-muted);
  color: var(--text-muted);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.pin-btn:hover {
  background: rgba(255,255,255,0.1);
  color: var(--text-bright);
  border-color: var(--electric-cyan);
}
</style>
