<template>
  <div class="h-full bg-suta-dark-gray border-t border-suta-border flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
    <!-- Panel Header -->
    <div class="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-black/20">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-3.5 h-3.5 bg-suta-cyan [mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat] animate-pulse"></div>
          <span class="text-[10px] font-bold text-suta-cyan uppercase tracking-[2px]">Secret Whisperer Mode</span>
        </div>
        
        <!-- Model Selector -->
        <div class="flex items-center bg-white/5 rounded-full p-0.5 border border-white/10">
          <button 
            v-for="m in ['gemini', 'openrouter']" 
            :key="m"
            @click="activeModel = m as any"
            class="px-3 py-1 rounded-full text-[8px] font-bold uppercase transition-all"
            :class="activeModel === m ? 'bg-suta-cyan text-black' : 'text-suta-muted hover:text-white'"
          >
            {{ m }}
          </button>
        </div>

        <!-- Personality Settings Button -->
        <button 
          @click="isPersonalityModalOpen = true"
          class="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:border-suta-cyan/30 transition-all group flex items-center gap-2"
        >
          <div class="w-3 h-3 bg-suta-cyan/60 group-hover:bg-suta-cyan [mask-image:url(/icons/settings.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
          <span class="text-[8px] font-bold text-suta-muted group-hover:text-white uppercase tracking-widest">Neural Profile</span>
        </button>
      </div>
      <button @click="isAIPanelOpen = false" class="text-suta-muted hover:text-white transition-colors">
        <div class="w-4 h-4 bg-current [mask-image:url(/icons/clear.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
      <!-- Floating Identity Badge -->
      <div class="absolute top-2 right-6 px-2 py-1 rounded border border-suta-cyan/20 bg-suta-cyan/5 text-[8px] font-mono text-suta-cyan/50 uppercase tracking-tighter">
        Profile: {{ personality?.identity?.nickname || 'Unknown' }} // Synced
      </div>

    <!-- Personality Modal -->
    <TerminalPersonalityModal 
      :show="isPersonalityModalOpen" 
      @close="isPersonalityModalOpen = false" 
    />

      <!-- Processing Overlay -->
      <div v-if="isAnalyzing" class="py-12 flex flex-col items-center gap-4">
        <div class="flex gap-1.5">
          <div v-for="i in 3" :key="i" class="w-1.5 h-1.5 bg-suta-cyan rounded-full animate-bounce" :style="{ animationDelay: i * 0.1 + 's' }"></div>
        </div>
        <span class="text-[9px] font-mono text-suta-cyan animate-pulse uppercase tracking-[4px]">Generating Whisper...</span>
      </div>

      <!-- AI Content -->
      <div v-else-if="analysisResult" class="animate-in fade-in slide-in-from-top-2 duration-500 pb-4">
        <div class="bg-white/[0.03] border border-white/10 p-5 rounded-xl relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-32 h-32 bg-suta-cyan/5 blur-3xl pointer-events-none group-hover:bg-suta-cyan/10 transition-all"></div>
          
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-4 opacity-50">
              <span class="text-[8px] font-mono text-suta-cyan italic">INTERNAL_MONOLOGUE</span>
              <div class="h-[1px] flex-1 bg-suta-cyan/10"></div>
            </div>
            
            <div class="prose prose-invert max-w-none">
              <div class="text-[13px] text-white/90 leading-relaxed whitespace-pre-wrap font-sans space-y-4" v-html="formattedResult"></div>
            </div>
          </div>
        </div>
        
        <!-- Action Area -->
        <div class="mt-6 flex items-center justify-between">
          <button 
            @click="performAIAnalysis"
            class="px-4 py-2 bg-suta-cyan/10 border border-suta-cyan/20 text-suta-cyan text-[10px] font-bold rounded-lg hover:bg-suta-cyan hover:text-black transition-all flex items-center gap-2 uppercase tracking-widest"
          >
            <div class="w-3.5 h-3.5 bg-current [mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
            Sync Context
          </button>
          
          <div class="text-[8px] text-suta-muted uppercase tracking-widest italic opacity-50">
            Brain: {{ activeModel === 'gemini' ? 'Gemini 1.5 Flash' : 'GPT-OSS 120B' }}
          </div>
        </div>
      </div>
      
      <!-- Error / Empty State -->
      <div v-else class="py-12 text-center">
        <p class="text-[10px] text-suta-muted uppercase tracking-[2px] opacity-30 italic">Whisperer Unit Standing By...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSuta } from '~/composables/useSuta'

const config = useRuntimeConfig()
const { transcript, isAIPanelOpen, settings, personality } = useSuta()
const isAnalyzing = ref(false)
const isPersonalityModalOpen = ref(false)
const analysisResult = ref('')
const activeModel = ref<'gemini' | 'openrouter'>('gemini')

// Formatter to make the output look like a pro whisperer
const formattedResult = computed(() => {
  if (!analysisResult.value) return ''
  return analysisResult.value
    .replace(/\*\*(.*?)\*\*/g, '<b class="text-suta-cyan">$1</b>')
    .replace(/### (.*?)\n/g, '<h5 class="text-white font-bold text-[14px] mt-4 mb-2 uppercase tracking-wider">$1</h5>')
})

const SUTA_WHISPERER_PROMPT = computed(() => {
  const lang = settings.value.sourceLang.startsWith('id') ? 'id' : 'en'
  
  return `
You are the "SECRET WHISPERER", a personal job interview assistant acting as a "source person" or "coach" to help the user answer interview questions.
You have access to the following candidate's full profile:

${JSON.stringify(personality.value, null, 2)}

Your Personality & Tone:
1. TONE: Human-like, direct, and conversational. Avoid a "robotic" or overly formal AI assistant voice.
2. LANGUAGE: You MUST respond in ${lang === "id" ? "Indonesian" : "English"}.
3. PERSONA: You ARE the candidate. Speak in the first person ("I" or "Saya").
4. BE CONCISE: Get straight to the point. Most people speak in short chunks (2-3 sentences). Don't give long-winded explanations unless specifically asked for a deep dive.
5. NO PLACEHOLDERS: Don't say "[Nama Perusahaan]" or "[Tahun]". If the data isn't in the persona, use the "Honest Learning" philosophy: be honest that you're currently learning/adapting to it.

Guidelines:
1. Don't sound like a textbook. Sound like a senior developer talking to a colleague or an interviewer.
2. Use specific data (Mertani, Pubmedia, Siber Integrasi) naturally. Instead of "I have experience in X," say "During my time at Siber Integrasi, I handled X..."
3. If the transcript contains a question, focus entirely on providing a ready-to-use answer that the user can read aloud naturally.

OUTPUT STRUCTURE:
- ### SUGGESTED_WHISPER: The ready-to-read answer.
- ### STRATEGIC_TIP: One quick tip on how to deliver the answer or what to emphasize next.
`
})

const performAIAnalysis = async () => {
  const geminiKey = config.public.geminiApiKey
  const openRouterKey = config.public.openrouterApiKey

  if (transcript.value.length < 1) {
    analysisResult.value = "### STATUS: WAITING_FOR_FLUX\nI'm monitoring the conversation. I'll whisper as soon as the first words are spoken."
    return
  }

  isAnalyzing.value = true
  analysisResult.value = ''

  try {
    const currentContext = transcript.value.map(m => `[${m.speaker}]: ${m.text}`).join('\n')
    
    let endpoint = ''
    let headers: any = { 'Content-Type': 'application/json' }
    let body: any = {}

    if (activeModel.value === 'gemini') {
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`
      body = {
        contents: [{
          parts: [{ text: `${SUTA_WHISPERER_PROMPT.value}\n\nTRANSCRIPT_TO_ANALYZE:\n${currentContext}` }]
        }]
      }
    } else {
      endpoint = 'https://openrouter.ai/api/v1/chat/completions'
      headers['Authorization'] = `Bearer ${openRouterKey}`
      body = {
        model: 'openai/gpt-oss-120b:free',
        messages: [
          { role: 'system', content: SUTA_WHISPERER_PROMPT.value },
          { role: 'user', content: `Current interview context:\n${currentContext}` }
        ]
      }
    }

    const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
    const data = await response.json()

    if (activeModel.value === 'gemini') {
      analysisResult.value = data.candidates?.[0]?.content?.parts?.[0]?.text || "Communication interrupted."
    } else {
      analysisResult.value = data.choices?.[0]?.message?.content || "Communication interrupted."
    }
  } catch (err) {
    analysisResult.value = "### ERROR: NEURAL_DISCONNECT\nPlease check your API keys or internet connection."
    console.error(err)
  } finally {
    isAnalyzing.value = false
  }
}

onMounted(() => {
  performAIAnalysis()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,240,255,0.1); border-radius: 10px; }
</style>
