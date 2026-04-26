<template>
  <div class="relative min-h-screen flex flex-col bg-suta-black text-white selection:bg-suta-cyan selection:text-black">
    <CyberBackground />
    
    <!-- Navigation -->
    <nav class="sticky top-0 z-50 backdrop-blur-md bg-suta-black/50 border-b border-white/5 px-8 py-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <span class="text-2xl font-black tracking-tighter text-white group-hover:text-suta-cyan transition-colors">Suta<span class="text-suta-cyan">.</span></span>
          <span class="text-[10px] font-mono text-suta-cyan/50 mt-1 uppercase tracking-tighter">Documentation</span>
        </NuxtLink>
        
        <div class="flex items-center gap-6">
          <NuxtLink to="/workspace" class="px-4 py-1.5 bg-suta-cyan text-black text-[11px] font-bold uppercase tracking-[2px] rounded hover:scale-105 transition-all">
            Launch Terminal
          </NuxtLink>
        </div>
      </div>
    </nav>

    <div class="relative z-10 flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-12 p-8">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 flex-shrink-0">
        <div class="sticky top-24 space-y-8">
          <div v-for="section in navSections" :key="section.title">
            <h3 class="text-[10px] font-bold text-suta-cyan uppercase tracking-[3px] mb-4 opacity-50">{{ section.title }}</h3>
            <ul class="space-y-2">
              <li v-for="link in section.links" :key="link.text">
                <a 
                  :href="'#' + link.id" 
                  class="text-sm text-white/40 hover:text-white hover:pl-2 transition-all block border-l border-white/5 hover:border-suta-cyan/50 pl-4 py-1"
                  @click.prevent="scrollTo(link.id)"
                >
                  {{ link.text }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <!-- Content -->
      <main class="flex-1 max-w-3xl">
        <div class="prose prose-invert prose-suta max-w-none">
          <section id="getting-started" class="mb-20">
            <h1 class="text-5xl font-black tracking-tighter mb-8">Getting Started</h1>
            <p class="text-lg text-white/60 leading-relaxed mb-6">
              Suta is an advanced cognitive extension designed to assist technical professionals during intense communication sessions. By leveraging real-time transcription and adaptive AI, Suta provides contextual whispers to ensure you never lose your thread.
            </p>
            <div class="bg-white/5 border border-white/10 p-6 rounded-xl mb-8">
              <h4 class="text-suta-cyan text-xs font-bold uppercase tracking-widest mb-4">Quick Setup</h4>
              <ul class="space-y-3 text-sm text-white/80">
                <li class="flex gap-3"><span class="text-suta-cyan">01</span> Launch the Suta Workspace</li>
                <li class="flex gap-3"><span class="text-suta-cyan">02</span> Grant screen/audio permissions for your meeting</li>
                <li class="flex gap-3"><span class="text-suta-cyan">03</span> Select your AI personality in the Neural Profile</li>
                <li class="flex gap-3"><span class="text-suta-cyan">04</span> Start capturing and receive real-time whispers</li>
              </ul>
            </div>
          </section>

          <section id="overview" class="mb-20 pt-10 border-t border-white/5">
            <h2 class="text-3xl font-bold tracking-tight mb-8">Protocol Overview</h2>
            <p class="text-white/60 leading-relaxed mb-6">
              Suta operates on the principle of "Contextual Awareness." Unlike standard transcription tools, Suta doesn't just record; it understands the flow of technical dialogue.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="border border-white/10 p-5 rounded-lg bg-white/[0.02]">
                <div class="text-suta-cyan text-xs font-bold mb-2">PHASE 01</div>
                <div class="text-sm font-bold mb-2">Capture</div>
                <p class="text-[11px] text-white/40">Raw audio stream processing and noise reduction.</p>
              </div>
              <div class="border border-white/10 p-5 rounded-lg bg-white/[0.02]">
                <div class="text-suta-cyan text-xs font-bold mb-2">PHASE 02</div>
                <div class="text-sm font-bold mb-2">Synthesize</div>
                <p class="text-[11px] text-white/40">Contextual mapping against your active Neural Profile.</p>
              </div>
              <div class="border border-white/10 p-5 rounded-lg bg-white/[0.02]">
                <div class="text-suta-cyan text-xs font-bold mb-2">PHASE 03</div>
                <div class="text-sm font-bold mb-2">Whisper</div>
                <p class="text-[11px] text-white/40">Delivery of actionable technical insights in real-time.</p>
              </div>
            </div>
          </section>

          <section id="core-features" class="mb-20 pt-10 border-t border-white/5">
            <h2 class="text-3xl font-bold tracking-tight mb-8">Core Features</h2>
            
            <div class="grid gap-8">
              <div class="space-y-4">
                <h3 class="text-xl font-bold text-suta-cyan">Real-time Transcription</h3>
                <p class="text-white/60 leading-relaxed">
                  Utilizing the latest neural audio processing, Suta converts spoken word to text with sub-second latency. This creates a searchable, persistent record of your conversation as it happens.
                </p>
              </div>

              <div id="transcription" class="space-y-4 pt-4 border-t border-white/5">
                <h3 class="text-xl font-bold text-suta-cyan">Transcription Engine</h3>
                <p class="text-white/60 leading-relaxed">
                  Suta uses an advanced WebSocket-based streaming protocol to ensure zero-loss audio transmission. Our engine is optimized for technical jargon, including specific programming languages, frameworks, and architectural terminology.
                </p>
              </div>

              <div id="whisperer" class="space-y-4 pt-4 border-t border-white/5">
                <h3 class="text-xl font-bold text-suta-cyan">Secret Whisperer AI</h3>
                <p class="text-white/60 leading-relaxed">
                  Our proprietary AI engine analyzes the live transcript to provide high-level technical insights, code snippets, and conversational hints tailored to your active session. It uses a combination of Gemini 1.5 Pro and Flash models to balance depth with speed.
                </p>
              </div>

              <div class="space-y-4 pt-4 border-t border-white/5">
                <h3 class="text-xl font-bold text-suta-cyan">Multi-Language Support</h3>
                <p class="text-white/60 leading-relaxed">
                  Break language barriers with built-in translation. Suta can listen in one language and provide insights or translations in your preferred target tongue.
                </p>
              </div>
            </div>
          </section>

          <section id="neural-profiles" class="mb-20 pt-10 border-t border-white/5">
            <h2 class="text-3xl font-bold tracking-tight mb-8">Neural Profiles</h2>
            <p class="text-white/60 leading-relaxed mb-6">
              Customize the AI's behavior by switching between different personalities. Each profile is tuned for specific technical domains or communication styles.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 bg-white/[0.03] border border-white/5 rounded-lg">
                <span class="text-[10px] font-bold text-suta-cyan uppercase tracking-widest">The Architect</span>
                <p class="text-xs text-white/40 mt-2">Focused on system design, scalability, and high-level patterns.</p>
              </div>
              <div class="p-4 bg-white/[0.03] border border-white/5 rounded-lg">
                <span class="text-[10px] font-bold text-pink-500 uppercase tracking-widest">The Debugger</span>
                <p class="text-xs text-white/40 mt-2">Specializes in identifying logic flaws and providing immediate fixes.</p>
              </div>
            </div>
          </section>

          <section id="settings" class="mb-20 pt-10 border-t border-white/5">
            <h2 class="text-3xl font-bold tracking-tight mb-8">System Settings</h2>
            <p class="text-white/60 leading-relaxed mb-6">
              Fine-tune Suta's performance to match your hardware and network conditions.
            </p>
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-1.5 h-1.5 bg-suta-cyan rounded-full mt-2"></div>
                <div>
                  <h4 class="text-sm font-bold text-white mb-1">Language Selection</h4>
                  <p class="text-xs text-white/40">Switch between over 30 source languages for transcription.</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-1.5 h-1.5 bg-suta-cyan rounded-full mt-2"></div>
                <div>
                  <h4 class="text-sm font-bold text-white mb-1">Translation Toggle</h4>
                  <p class="text-xs text-white/40">Enable or disable real-time translation during sessions.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="privacy" class="mb-20 pt-10 border-t border-white/5">
            <h2 class="text-3xl font-bold tracking-tight mb-8">Privacy & Security</h2>
            <p class="text-white/60 leading-relaxed mb-6">
              We take data sovereignty seriously. Suta operates on a session-by-session basis.
            </p>
            
            <div id="data" class="bg-suta-cyan/5 border border-suta-cyan/20 p-6 rounded-xl">
              <h3 class="text-sm font-bold text-suta-cyan uppercase tracking-widest mb-4">Data Protocols</h3>
              <p class="text-xs text-white/60 leading-relaxed">
                All transcripts are encrypted in-transit and stored locally in your browser's persistent state only if "Save History" is enabled. You can purge all session data at any time through the Terminal interface. No identifiable audio data is ever stored on our backend infrastructure.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer class="relative z-10 py-10 border-t border-white/5 px-8">
      <div class="max-w-7xl mx-auto flex justify-center items-center gap-8">
        <div class="text-white/20 text-[10px] uppercase tracking-[3px] font-bold">
          &copy; 2026 Suta Assist | Documentation V1.0
        </div>
      </div>
    </footer>

    <GlitchCursor />
  </div>
</template>

<script setup lang="ts">
const navSections = [
  {
    title: 'Introduction',
    links: [
      { text: 'Getting Started', id: 'getting-started' },
      { text: 'Protocol Overview', id: 'overview' }
    ]
  },
  {
    title: 'Technology',
    links: [
      { text: 'Core Features', id: 'core-features' },
      { text: 'Transcription Engine', id: 'transcription' },
      { text: 'Secret Whisperer AI', id: 'whisperer' }
    ]
  },
  {
    title: 'Customization',
    links: [
      { text: 'Neural Profiles', id: 'neural-profiles' },
      { text: 'System Settings', id: 'settings' }
    ]
  },
  {
    title: 'Security',
    links: [
      { text: 'Privacy Policy', id: 'privacy' },
      { text: 'Data Protocols', id: 'data' }
    ]
  }
]

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    window.scrollTo({
      top: el.offsetTop - 100,
      behavior: 'smooth'
    })
  }
}
</script>

<style scoped>
.prose-suta h1, .prose-suta h2, .prose-suta h3 {
  color: white;
  letter-spacing: -0.025em;
}
</style>
