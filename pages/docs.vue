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
                  class="text-sm transition-all block border-l py-1.5"
                  :class="activeSection === link.id 
                    ? 'text-suta-cyan border-suta-cyan pl-6 bg-suta-cyan/5 font-bold shadow-[inset_4px_0_10px_-4px_rgba(0,240,255,0.2)]' 
                    : 'text-white/40 border-white/5 hover:text-white hover:pl-5 hover:border-white/20 pl-4 font-medium'"
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
              Suta is an advanced cognitive extension designed to assist technical professionals during intense communication sessions. By leveraging real-time transcription and adaptive AI, Suta provides contextual whispers to ensure you never lose your thread. The system is built on a "Terminal-First" philosophy, where every interaction is recorded and analyzed through a low-latency neural pipeline.
            </p>
            <div class="bg-white/5 border border-white/10 p-6 rounded-xl mb-8">
              <h4 class="text-suta-cyan text-xs font-bold uppercase tracking-widest mb-4">Quick Setup Protocol</h4>
              <ul class="space-y-4 text-sm text-white/80">
                <li class="flex gap-4">
                  <span class="text-suta-cyan font-mono">01</span> 
                  <div>
                    <div class="font-bold mb-1">Access the Workspace</div>
                    <p class="text-xs text-white/40">Navigate to the main terminal interface and ensure your identity badge is synced.</p>
                  </div>
                </li>
                <li class="flex gap-4">
                  <span class="text-suta-cyan font-mono">02</span> 
                  <div>
                    <div class="font-bold mb-1">Source Initialization</div>
                    <p class="text-xs text-white/40">Click 'Initiate Capture' to grant screen and system audio permissions. Suta supports both browser tabs and native applications.</p>
                  </div>
                </li>
                <li class="flex gap-4">
                  <span class="text-suta-cyan font-mono">03</span> 
                  <div>
                    <div class="font-bold mb-1">Neural Profile Injection</div>
                    <p class="text-xs text-white/40">Open the Neural Profile modal and inject your JSON-based persona. This tells the AI who you are and what your technical background is.</p>
                  </div>
                </li>
                <li class="flex gap-4">
                  <span class="text-suta-cyan font-mono">04</span> 
                  <div>
                    <div class="font-bold mb-1">Engagement</div>
                    <p class="text-xs text-white/40">Switch to Auto Mode for continuous whispers or stay in Manual Mode for specific targeted queries.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section id="overview" class="mb-20 pt-10 border-t border-white/5">
            <h2 class="text-3xl font-bold tracking-tight mb-8">Protocol Overview</h2>
            <p class="text-white/60 leading-relaxed mb-8">
              Suta operates on the principle of "Active Standby." The system doesn't just listen; it maintains a persistent state of neural awareness, ready to synthesize information the moment it's detected.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="border border-white/10 p-5 rounded-lg bg-white/[0.02] hover:bg-suta-cyan/[0.03] transition-all group">
                <div class="text-suta-cyan text-[10px] font-bold mb-4 tracking-widest">NEURAL_STANDBY</div>
                <div class="text-sm font-bold mb-2 group-hover:text-suta-cyan transition-colors">Idle Awareness</div>
                <p class="text-[11px] text-white/40 leading-relaxed">The system maintains a zero-load monitor, waiting for audio frequency spikes. It consumes minimal resources while staying "warm" for instant capture.</p>
              </div>
              <div class="border border-white/10 p-5 rounded-lg bg-white/[0.02] hover:bg-suta-cyan/[0.03] transition-all group">
                <div class="text-suta-cyan text-[10px] font-bold mb-4 tracking-widest">CAPTURING_ACTIVE</div>
                <div class="text-sm font-bold mb-2 group-hover:text-suta-cyan transition-colors">Neural Stream</div>
                <p class="text-[11px] text-white/40 leading-relaxed">Raw audio is streamed via WebSocket to the transcription engine. Interim results are fed back instantly to the AI Panel for real-time visual feedback.</p>
              </div>
              <div class="border border-white/10 p-5 rounded-lg bg-white/[0.02] hover:bg-suta-cyan/[0.03] transition-all group">
                <div class="text-suta-cyan text-[10px] font-bold mb-4 tracking-widest">WHISPER_SYNTHESIS</div>
                <div class="text-sm font-bold mb-2 group-hover:text-suta-cyan transition-colors">Contextual Output</div>
                <p class="text-[11px] text-white/40 leading-relaxed">Finalized transcripts are cross-referenced with your Neural Profile to generate strategic hints and ready-to-read interview responses.</p>
              </div>
            </div>
          </section>

          <section id="core-features" class="mb-20 pt-10 border-t border-white/5">
            <h2 class="text-3xl font-bold tracking-tight mb-8">Core Systems</h2>
            
            <div class="grid gap-12">
              <div class="space-y-4">
                <h3 class="text-xl font-bold text-suta-cyan">Real-time Audio Intelligence</h3>
                <p class="text-white/60 leading-relaxed">
                  Powered by Deepgram's Nova-2 model, Suta converts spoken word to text with sub-second latency. The AI Panel features a "Live Audio Monitor" that shows you exactly what the system is hearing in real-time, even before the final transcript is generated. This ensures you can verify that Suta is in sync with the conversation.
                </p>
              </div>

              <div id="transcription" class="space-y-4 pt-8 border-t border-white/5">
                <h3 class="text-xl font-bold text-suta-cyan">Dual-Engine Transcription</h3>
                <p class="text-white/60 leading-relaxed">
                  Suta allows you to choose your "Ears" based on the environment. 
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div class="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                    <h5 class="text-xs font-bold text-white uppercase tracking-widest mb-1">Deepgram Nova-2</h5>
                    <p class="text-[10px] text-white/40 leading-relaxed">Native WebSocket streaming for sub-second visual feedback. Best for fast-paced Q&A sessions.</p>
                  </div>
                  <div class="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                    <h5 class="text-xs font-bold text-suta-cyan uppercase tracking-widest mb-1">Groq Whisper Turbo</h5>
                    <p class="text-[10px] text-white/40 leading-relaxed">High-fidelity <b>whisper-large-v3-turbo</b> model. Perfect for complex technical jargon and foreign accents.</p>
                  </div>
                </div>
              </div>

              <div id="whisperer" class="space-y-4 pt-8 border-t border-white/5">
                <h3 class="text-xl font-bold text-suta-cyan">Dual-Mode Secret Whisperer</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div class="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                    <h5 class="text-xs font-bold text-white uppercase tracking-widest mb-2">Auto Mode</h5>
                    <p class="text-[11px] text-white/50 leading-relaxed">Continuously monitors the transcript. After 2 seconds of silence, it automatically synthesizes a whisper based on the most recent conversation context and your profile. The output is optimized for natural "Human-Pro" flow, allowing you to read it aloud directly without further adjustment.</p>
                  </div>
                  <div class="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                    <h5 class="text-xs font-bold text-white uppercase tracking-widest mb-2">Manual Mode</h5>
                    <p class="text-[11px] text-white/50 leading-relaxed">Allows you to explicitly ask the AI questions. This is perfect for deep dives into specific technical topics that weren't explicitly mentioned in the live audio. You can also switch models mid-conversation to get different perspectives.</p>
                  </div>
                </div>
                <div class="mt-8 p-6 bg-suta-cyan/5 border border-suta-cyan/20 rounded-xl">
                  <h4 class="text-suta-cyan text-xs font-bold uppercase tracking-widest mb-4">Neural Infrastructure v2.0</h4>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-[10px]">
                    <div class="space-y-2">
                      <span class="text-white font-bold border-b border-suta-cyan/30 pb-1 block">GROQ (Performance)</span>
                      <p class="text-white/40 leading-relaxed">
                        High-speed execution via <b>Llama 3.3 70B</b> and <b>Llama 3.1 8B</b>. Features experimental support for <b>Llama 4 Scout</b> and <b>Qwen 3 32B</b> for cutting-edge response synthesis.
                      </p>
                    </div>
                    <div class="space-y-2">
                      <span class="text-white font-bold border-b border-suta-cyan/30 pb-1 block">GEMINI (Intelligence)</span>
                      <p class="text-white/40 leading-relaxed">
                        Utilizing <b>Gemini 2.0 Flash</b> for high-fidelity context preservation. Best for deep technical discussions where continuity is critical.
                      </p>
                    </div>
                    <div class="space-y-2">
                      <span class="text-white font-bold border-b border-suta-cyan/30 pb-1 block">OPENROUTER (Flexibility)</span>
                      <p class="text-white/40 leading-relaxed">
                        Access to <b>GPT OSS 120B</b> and multi-provider Gemini endpoints. Offers the broadest reasoning capabilities for complex architectural queries.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="neural-profiles" class="mb-20 pt-10 border-t border-white/5">
            <h2 class="text-3xl font-bold tracking-tight mb-8">Neural Profile Architecture</h2>
            <p class="text-white/60 leading-relaxed mb-6">
              The Neural Profile is Suta's brain. Beyond basic identity, you can inject complex narratives, project histories, and research findings. The more detailed your profile, the more "human" and "experience-based" the AI's whispers become.
            </p>

            <!-- Baseline Template Example -->
            <div id="baseline-profile" class="mb-20">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-2 h-2 bg-suta-cyan rounded-full shadow-[0_0_8px_rgba(0,240,255,0.5)]"></div>
                <h3 class="text-lg font-bold text-white">Baseline Neural Template</h3>
              </div>
              <p class="text-xs text-white/50 mb-8 leading-relaxed">
                This is the standard <span class="text-suta-cyan font-mono">personality.json</span> structure. Use this as your primary reference when building a baseline identity.
              </p>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
                <div class="bg-black border border-white/10 p-6 rounded-xl font-mono text-[10px] max-h-[525px] overflow-y-auto shadow-2xl group/code relative">
                  <div class="sticky top-0 right-0 flex justify-end">
                    <span class="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-white/30 uppercase tracking-widest">JSON Template</span>
                  </div>
                  <div class="text-[11px] leading-relaxed font-mono mt-4 whitespace-pre overflow-x-auto custom-scrollbar" v-html="highlightedJson"></div>
                </div>

                <div class="space-y-6">
                  <div>
                    <h4 class="text-sm font-bold text-suta-cyan uppercase tracking-widest mb-2">Core Identity</h4>
                    <p class="text-xs text-white/50 leading-relaxed"> Defines your professional persona and tech stack. This is the foundation of every AI whisper.</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-white uppercase tracking-widest mb-2">Academic Background</h4>
                    <p class="text-xs text-white/50 leading-relaxed"> Lists your degrees and institutions. AI uses this for background validation and credential-based queries.</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-white uppercase tracking-widest mb-2">Skill Matrix</h4>
                    <p class="text-xs text-white/50 leading-relaxed"> Categorizes your technical competencies. AI cross-references this to provide specific code logic or tools.</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-white uppercase tracking-widest mb-2">Experience Mapping</h4>
                    <p class="text-xs text-white/50 leading-relaxed"> Detailed roles and key achievements used to validate your experience during technical discussions.</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-white uppercase tracking-widest mb-2">Project Highlights</h4>
                    <p class="text-xs text-white/50 leading-relaxed"> Showcases specific work you've built, allowing the AI to cite real-world examples from your portfolio.</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-white uppercase tracking-widest mb-2">Interview Context</h4>
                    <p class="text-xs text-white/50 leading-relaxed"> Pre-defined answers to common questions, ensuring the AI's suggestions align with your actual strategy.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 mb-4 mt-16">
              <div class="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.5)]"></div>
              <h3 class="text-lg font-bold text-white">Advanced Narrative Injection</h3>
            </div>
            <p class="text-xs text-white/50 mb-8 leading-relaxed">
              To achieve maximum "Human Fidelity," you can expand your profile with specific project stories and research findings. This allows the AI to provide evidence-based responses.
            </p>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
              <div class="bg-black border border-white/10 p-6 rounded-lg font-mono text-[10px] overflow-x-auto shadow-2xl">
                <div class="text-white/20 mb-2">// Advanced Neural Profile (JSON)</div>
                <div class="text-[11px] leading-relaxed font-mono">
                  <span class="text-white/30">{</span><br />
                  &nbsp;&nbsp;<span class="text-suta-cyan">"identity"</span>: <span class="text-white/30">{</span> <span class="text-white/10">/* ... */</span> <span class="text-white/30">}</span>,<br />
                  &nbsp;&nbsp;<span class="text-suta-cyan">"projects"</span>: <span class="text-white/30">[</span><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-white/30">{</span><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-suta-cyan">"title"</span>: <span class="text-pink-400">"Eco-Stream Analytics"</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-suta-cyan">"story"</span>: <span class="text-pink-400">"Faced 50% data loss..."</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-suta-cyan">"result"</span>: <span class="text-pink-400">"99.9% integrity"</span><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-white/30">}</span><br />
                  &nbsp;&nbsp;<span class="text-white/30">]</span>,<br />
                  &nbsp;&nbsp;<span class="text-suta-cyan">"research"</span>: <span class="text-white/30">[</span><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-white/30">{</span><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-suta-cyan">"topic"</span>: <span class="text-pink-400">"Audio Streaming"</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-suta-cyan">"context"</span>: <span class="text-pink-400">"PCM-to-Opus..."</span><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span class="text-white/30">}</span><br />
                  &nbsp;&nbsp;<span class="text-white/30">]</span><br />
                  <span class="text-white/30">}</span>
                </div>
              </div>

              <div class="space-y-6">
                <div>
                  <h4 class="text-sm font-bold text-suta-cyan uppercase tracking-widest mb-2">Narrative Injection</h4>
                  <p class="text-xs text-white/50 leading-relaxed">
                    By including specific "Stories," you enable the AI to use the <b>STAR Method</b> (Situation, Task, Action, Result) when suggesting answers. This is crucial for behavioral interview questions.
                  </p>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white uppercase tracking-widest mb-2">Project Case Studies</h4>
                  <p class="text-xs text-white/50 leading-relaxed">
                    Detailing your technical triumphs allows the AI to provide specific code logic or architectural patterns you've actually implemented in the past.
                  </p>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-white uppercase tracking-widest mb-2">Research & Theory</h4>
                  <p class="text-xs text-white/50 leading-relaxed">
                    Adding research topics ensures that if an interviewer asks about deep theoretical concepts, Suta can draw from your specific academic or self-taught background.
                  </p>
                </div>
              </div>
            </div>
            
            <p class="text-sm text-white/60 leading-relaxed border-l-2 border-suta-cyan pl-6 italic">
              "A well-documented Neural Profile turns a generic AI into a high-fidelity digital twin that knows your career as well as you do."
            </p>
          </section>

          <section id="settings" class="mb-20 pt-10 border-t border-white/5">
            <h2 class="text-3xl font-bold tracking-tight mb-8">System Configuration & Privacy</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div class="space-y-4">
                <h4 class="text-sm font-bold text-white uppercase tracking-widest">Cognitive Translation</h4>
                <p class="text-xs text-white/40 leading-relaxed">When the <b>Live Translator</b> is enabled, Suta activates its combined neural path. It doesn't just translate words; it synthesizes technical answers in your target language based on the translated context, providing a seamless "Foreign-to-Strategy" bridge.</p>
              </div>
              <div class="space-y-4">
                <h4 class="text-sm font-bold text-white uppercase tracking-widest">Model Architecture</h4>
                <p class="text-xs text-white/40 leading-relaxed">Choose your neural engine based on the situation. <b>Groq</b> is recommended for real-time speed, <b>Gemini</b> for reliable reasoning, and <b>OpenRouter</b> for access to specialized open-weights models like GPT-OSS and Qwen. You can swap models instantly via the sub-menu in the AI Panel.</p>
              </div>
            </div>

            <div id="privacy" class="pt-8 border-t border-white/5">
              <h3 class="text-xl font-bold text-white mb-6">Security & Privacy Protocols</h3>
              <p class="text-white/60 text-sm leading-relaxed mb-8">
                Suta is designed for high-stakes technical environments. Data privacy is integrated into our core architecture.
              </p>
              
              <div id="data" class="bg-suta-cyan/5 border border-suta-cyan/20 p-6 rounded-xl">
                <h3 class="text-xs font-bold text-suta-cyan uppercase tracking-widest mb-4">Zero-Server Persistence</h3>
                <p class="text-xs text-white/60 leading-relaxed mb-4">
                  1. <span class="text-white">Local Storage:</span> All transcription history and neural profiles are stored locally in your browser's IndexedDB/LocalStorage. No data is sent to our servers for storage.<br />
                  2. <span class="text-white">Encryption:</span> Communication with AI providers (Google/OpenRouter) is secured via SSL. Your API keys are stored only in your local session.<br />
                  3. <span class="text-white">Purge Command:</span> At any time, you can clear the terminal to permanently erase all session logs from your device.
                </p>
              </div>
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

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import personalityData from '~/assets/personality.json'

const activeSection = ref('getting-started')

const highlightedJson = computed(() => {
  const jsonString = JSON.stringify(personalityData, null, 2)
  return jsonString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'text-pink-400'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-suta-cyan'
        } else {
          cls = 'text-pink-400'
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-orange-400'
      } else if (/null/.test(match)) {
        cls = 'text-gray-400'
      } else {
        cls = 'text-yellow-400'
      }
      return `<span class="${cls}">${match}</span>`
    })
    .replace(/([\[\]{}:,])/g, '<span class="text-white/30">$1</span>')
})

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
  }
]

onMounted(() => {
  // Intersection Observer for scroll-spy functionality
  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -80% 0px', // Focus on the top part of the viewport
    threshold: 0
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, observerOptions)

  // Observe each section listed in navSections
  navSections.forEach(section => {
    section.links.forEach(link => {
      const el = document.getElementById(link.id)
      if (el) observer.observe(el)
    })
  })
})

const scrollTo = (id: string) => {
  activeSection.value = id
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

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.2);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.4);
}
</style>
