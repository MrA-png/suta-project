<template>
  <div class="h-full bg-suta-dark-gray border-t border-suta-border flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
    <div 
      ref="headerRef"
      class="px-6 py-3 border-b border-white/5 flex flex-col gap-3 bg-black/20 transition-all duration-300 relative"
    >
      <!-- Top Row: Brand & Close -->
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2 flex-shrink-0">
          <template v-if="panelWidth < 300">
            <h1 class="text-[20px] font-extrabold tracking-tight text-white transition-colors">
              Suta<span class="text-suta-cyan">.</span>
            </h1>
          </template>
          <span v-else class="text-[10px] font-bold text-suta-cyan uppercase tracking-[2px] whitespace-nowrap">
            Secret Whisperer Mode
          </span>
        </div>
        <button 
          @click="isAIPanelOpen = false" 
          class="text-suta-muted hover:text-white transition-colors p-1"
        >
          <div class="w-4 h-4 bg-current [mask-image:url(/icons/close.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        </button>
      </div>
      
      <!-- Bottom Row: Controls -->
      <div 
        class="flex gap-2 items-center"
        :class="panelWidth < 350 ? 'justify-between' : 'justify-start'"
      >
        <!-- Model Selector -->
        <div class="flex items-center bg-white/5 rounded-full p-0.5 border border-white/10 flex-shrink-0">
          <button 
            v-for="m in ['gemini', 'openrouter']" 
            :key="m"
            @click="activeModel = m as any"
            class="px-2.5 py-1 rounded-full text-[8px] font-bold uppercase transition-all"
            :class="activeModel === m ? 'bg-suta-cyan text-black' : 'text-suta-muted hover:text-white'"
          >
            {{ m }}
          </button>
        </div>

        <!-- Personality Settings Button -->
        <button 
          @click="isPersonalityModalOpen = true"
          class="px-3 py-1.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:border-suta-cyan/30 transition-all group flex items-center gap-2 flex-shrink-0"
        >
          <span v-if="panelWidth > 350" class="text-[8px] font-bold text-suta-muted group-hover:text-white uppercase tracking-widest">Neural Profile</span>
          <span v-else class="text-[8px] font-bold text-suta-cyan uppercase tracking-tighter">Profile</span>
        </button>

        <!-- Auto Mode Toggle -->
        <button 
          @click="isAutoMode = !isAutoMode"
          class="px-3 py-1.5 rounded transition-all flex items-center gap-2 border flex-shrink-0"
          :class="isAutoMode ? 'bg-suta-cyan/10 border-suta-cyan/40 text-suta-cyan' : 'bg-white/5 border-white/10 text-suta-muted hover:bg-white/10'"
        >
          <div class="w-1.5 h-1.5 rounded-full" :class="isAutoMode ? 'bg-suta-cyan animate-pulse' : 'bg-white/20'"></div>
          <span class="text-[8px] font-bold uppercase tracking-widest">{{ isAutoMode ? 'Auto' : 'Manual' }}</span>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar relative">
      <!-- Metadata Row (Sticky) -->
      <div class="sticky top-0 z-30 flex items-center justify-between p-2 pb-2 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <!-- Clear Button -->
        <button 
          v-if="aiWhispers.length > 0"
          @click="aiWhispers = []"
          class="text-[8px] font-bold text-red-400/40 hover:text-red-400 uppercase tracking-widest transition-all"
        >
          [ Clear ]
        </button>
        <div v-else></div>

        <!-- Identity Badge (Syncable Button) -->
        <button 
          @click="syncPersonality"
          class="px-2 py-1 rounded border border-suta-cyan/20 bg-suta-cyan/5 text-[8px] font-mono text-suta-cyan/50 uppercase tracking-tighter hover:bg-suta-cyan/10 hover:border-suta-cyan/40 transition-all flex items-center gap-2 group"
          :class="{ 'animate-pulse text-suta-cyan border-suta-cyan/50': isSyncing }"
        >
          <div class="w-1 h-1 rounded-full bg-suta-cyan/40 group-hover:bg-suta-cyan" :class="{ 'animate-ping': isSyncing }"></div>
          Profile: {{ personality?.identity?.nickname || 'Unknown' }} // {{ isSyncing ? 'Syncing...' : 'Synced' }}
        </button>
      </div>

    <!-- Personality Modal -->
    <WorkspaceModalsPersonality 
      :show="isPersonalityModalOpen" 
      @close="isPersonalityModalOpen = false" 
    />



      <!-- Main Chat Flow -->
      <div v-if="aiWhispers.length > 0 || isAnalyzing || (isAutoMode && isStreaming)" class="space-y-6 p-6 pt-2 pb-20">
        <!-- AI Content List -->
        <div 
          v-for="(item, idx) in aiWhispers" 
          :key="idx"
          class="animate-in fade-in slide-in-from-top-2 duration-500"
        >
          <!-- Input Bubble (Manual Query or Auto Transcript) -->
          <div v-if="item.query" class="flex justify-end mb-2">
            <div class="max-w-[85%] px-3 py-2 rounded-2xl bg-suta-cyan/10 border border-suta-cyan/20 text-white text-[12px] font-medium">
              {{ item.query }}
            </div>
          </div>

          <!-- AI Response -->
          <div class="bg-white/[0.03] border border-white/10 p-5 rounded-xl relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-suta-cyan/5 blur-3xl pointer-events-none group-hover:bg-suta-cyan/10 transition-all"></div>
            
            <div class="relative z-10">
              <div class="flex items-center gap-2 mb-4 opacity-50">
                <span class="text-[8px] font-mono text-suta-cyan italic">{{ item.type === 'auto' ? 'AUTO_WHISPER' : 'MANUAL_QUERY' }}</span>
                <div class="h-[1px] flex-1 bg-suta-cyan/10"></div>
                <span class="text-[8px] font-mono text-suta-muted uppercase mr-2 opacity-50">{{ item.model }}</span>
                <span class="text-[8px] font-mono text-suta-muted">{{ item.timestamp }}</span>
              </div>
              
              <div class="prose prose-invert max-w-none">
                <div class="text-[13px] text-white/90 leading-relaxed whitespace-pre-wrap font-sans space-y-4" v-html="formatAIResponse(item.content)"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Manual Query (Shown during analysis) -->
        <div v-if="isAnalyzing && pendingManualQuery" class="animate-in fade-in slide-in-from-top-1 duration-300">
          <div class="flex justify-end">
            <div class="max-w-[85%] px-3 py-2 rounded-2xl bg-suta-cyan/10 border border-suta-cyan/20 text-white text-[12px] font-medium shadow-lg shadow-suta-cyan/5">
              {{ pendingManualQuery }}
            </div>
          </div>
        </div>

        <!-- Typing Indicator -->
        <div v-if="isAnalyzing" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div class="flex justify-start items-center gap-3">
            <div class="px-3 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
              <div class="flex gap-1">
                <div v-for="i in 3" :key="i" class="w-1 h-1 bg-suta-cyan rounded-full animate-bounce" :style="{ animationDelay: i * 0.1 + 's' }"></div>
              </div>
              <span class="text-[8px] font-mono text-suta-cyan/50 uppercase tracking-[1px]">Synthesizing Whisper...</span>
            </div>
          </div>
        </div>

        <!-- Live Real-time Monitor (Standby System) -->
        <div v-if="isAutoMode && isStreaming && !isAnalyzing" class="animate-in fade-in slide-in-from-right-2 duration-700">
          <div class="flex justify-end items-center gap-3">
            <div 
              class="max-w-[90%] px-4 py-2 rounded-2xl flex flex-col items-end gap-1 group/live relative overflow-hidden transition-all duration-500"
              :class="interimText ? 'bg-suta-cyan/10 border border-suta-cyan/30' : 'bg-white/[0.02] border border-white/5'"
            >
              <!-- Status Label -->
              <div class="flex items-center gap-2 mb-1">
                <span 
                  class="text-[7px] font-mono uppercase tracking-[2px] transition-colors"
                  :class="interimText ? 'text-suta-cyan' : 'text-suta-muted/40'"
                >
                  {{ interimText ? 'Capturing_Active' : 'Neural_Standby' }}
                </span>
                <div class="flex gap-0.5 items-end h-[8px]">
                  <div 
                    v-for="i in 5" 
                    :key="i" 
                    class="w-[1.5px] rounded-full transition-all duration-300" 
                    :class="interimText ? 'bg-suta-cyan animate-pulse' : 'bg-white/10'"
                    :style="{ 
                      height: interimText ? (Math.random() * 8 + 4) + 'px' : '2px',
                      animationDelay: i * 0.1 + 's' 
                    }"
                  ></div>
                </div>
              </div>
              
              <!-- Text Area -->
              <div v-if="interimText" class="text-[12px] text-white/80 italic font-medium leading-relaxed text-right transition-all">
                {{ interimText }}<span class="animate-pulse text-suta-cyan">|</span>
              </div>
              <div v-else class="text-[9px] text-white/10 font-mono uppercase tracking-[3px] py-1">
                Awaiting Audio...
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="py-12 text-center">
        <div v-if="!isAutoMode" class="flex flex-col items-center gap-3 opacity-40">
          <p class="text-[10px] text-suta-cyan uppercase tracking-[2px] italic">Manual Mode Active: Ready for Queries</p>
        </div>
        <div v-else-if="!isStreaming" class="flex flex-col items-center gap-3 opacity-40">
          <p class="text-[10px] text-suta-muted uppercase tracking-[2px] italic">Source Offline: Waiting for Connection...</p>
        </div>
        <p v-else class="text-[10px] text-suta-muted uppercase tracking-[2px] opacity-30 italic">Whisperer Unit Standing By...</p>
      </div>

    <!-- Personality Modal -->
    <WorkspaceModalsPersonality 
      :show="isPersonalityModalOpen" 
      @close="isPersonalityModalOpen = false" 
    />
    </div>

    <!-- Manual Input Bar -->
    <div v-if="!isAutoMode" class="p-4 bg-black/40 border-t border-white/5 backdrop-blur-xl">
      <form @submit.prevent="handleManualSubmit" class="relative group">
        <input 
          v-model="manualInput"
          type="text"
          placeholder="Ask Whisperer something manually..."
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-[12px] text-white placeholder:text-white/20 focus:outline-none focus:border-suta-cyan/50 transition-all"
        />
        <button 
          type="submit"
          :disabled="!manualInput.trim() || isAnalyzing"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-suta-cyan hover:scale-110 disabled:opacity-30 disabled:scale-100 transition-all"
        >
          <div class="w-5 h-5 bg-current [mask-image:url(/icons/ai.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        </button>
      </form>
    </div>

    <!-- Quick Start Guide (Moved from Terminal) -->
    <WorkspaceGuide />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useSuta } from '../../composables/useSuta'

// Explicitly extracting public config for the AI Unit
const { public: config } = useRuntimeConfig()
const { transcript, interimText, isListening, isAIPanelOpen, isStreaming, settings, personality, aiWhispers } = useSuta()
const isAnalyzing = ref(false)
const isPersonalityModalOpen = ref(false)
const isAutoMode = ref(true)
const manualInput = ref('')
const pendingManualQuery = ref('')
const activeModel = ref<'gemini' | 'openrouter'>('openrouter')
const geminiModel = ref('gemini-2.5-flash')
const openRouterModel = ref('openai/gpt-oss-120b:free')
const isSyncing = ref(false)
const lastProcessedIdx = ref(0) // Track processed messages for Auto Mode

const syncPersonality = () => {
  if (isSyncing.value) return
  isSyncing.value = true
  // Simulation of neural sync
  setTimeout(() => {
    isSyncing.value = false
  }, 1500)
}

// Auto-Analysis Logic
let autoWhisperTimeout: any = null

// Block analysis if user is still talking
watch(interimText, (newVal) => {
  if (newVal && autoWhisperTimeout) {
    clearTimeout(autoWhisperTimeout)
    autoWhisperTimeout = null
  }
})

watch(transcript, (newVal) => {
  if (!isStreaming.value || !isAutoMode.value || isAnalyzing.value) return
  
  // Only trigger if we have new messages since last processing
  if (newVal.length > lastProcessedIdx.value) {
    const newMessages = newVal.slice(lastProcessedIdx.value)
    const hasRealContent = newMessages.some(m => m.speaker !== 'System')
    
    // Only start timeout if not currently receiving interim text
    if (hasRealContent && !interimText.value) {
      clearTimeout(autoWhisperTimeout)
      autoWhisperTimeout = setTimeout(() => {
        performAIAnalysis()
      }, 2000) // 2s of true silence
    }
  }
}, { deep: true })

// Formatter to make the output look like a pro whisperer
const formatAIResponse = (text: string) => {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<b class="text-suta-cyan">$1</b>')
    .replace(/### (.*?)\n/g, '<h5 class="text-white font-bold text-[14px] mt-4 mb-2 uppercase tracking-wider">$1</h5>')
}

const SUTA_WHISPERER_PROMPT = computed(() => {
  const targetLanguageName = settings.value.targetLang === 'id' ? 'Indonesian' : 'English'
  
  return `
You are the "SECRET WHISPERER", a personal job interview assistant acting as a "source person" or "coach" to help the user answer interview questions.
You have access to the following candidate's full profile:

${JSON.stringify(personality.value, null, 2)}

Your Personality & Tone:
1. TONE: Human-pro, conversational, and "one-take ready". Imagine a senior developer speaking naturally in an interview.
2. LANGUAGE: You MUST respond in ${targetLanguageName}. Use natural phrasing (Indonesian: "Sebenarnya...", "Kalau dari sisi...", "Jadi gini...").
3. PERSONA: You ARE the candidate. Speak in the first person ("I" or "Saya").
4. BE CONCISE: Complete, but compact. 2-4 sentences max per whisper. High impact, zero fluff.
5. NO AI-FORMATTING: NEVER use bullet points or numbered lists in the SUGGESTED_WHISPER. Write in natural paragraphs.

Guidelines:
1. RADICAL HONESTY: NEVER lie. If it's not in the JSON, don't say it. Stick to the projects listed.
2. PLUG-AND-PLAY: The user must be able to read your response EXACTLY as written. No placeholders, no [brackets], no "..." gaps.
3. SENIORITY: Sound like a confident professional. Use technical terms naturally without over-explaining like a textbook.
4. STRATEGY: If the interviewer's question is vague, answer based on your strongest project in the profile.

OUTPUT STRUCTURE:
- ### SUGGESTED_WHISPER: The ready-to-read answer (No lists, just natural flow).
- ### STRATEGIC_TIP: One quick tip on delivery or body language.
`
})

const performAIAnalysis = async (customQuery?: string) => {
  const geminiKey = config.geminiApiKey
  const openRouterKey = config.openrouterApiKey

  if (transcript.value.length < 1 && !customQuery) {
    return
  }

  isAnalyzing.value = true
  if (customQuery) {
    pendingManualQuery.value = customQuery
    // Immediate scroll to show the pending bubble
    setTimeout(scrollToBottom, 50)
  }

  try {
    const allMessages = transcript.value
    const newMessages = customQuery ? [] : allMessages.slice(lastProcessedIdx.value)
    
    // Skip if no new content in auto mode
    if (!customQuery && newMessages.length === 0) {
      isAnalyzing.value = false
      return
    }

    const currentContext = allMessages.map((m: any) => `[${m.speaker}]: ${m.text}`).join('\n')
    const triggeringContext = newMessages.map(m => m.text).join(' ')
    const recentWhispers = aiWhispers.value.slice(-3).map(w => `[PREVIOUS_WHISPER]: ${w.content}`).join('\n')

    const finalPrompt = customQuery 
      ? `USER_QUERY: ${customQuery}\n\nFULL_CONTEXT:\n${currentContext}\n\n${recentWhispers}`
      : `LATEST_TRANSCRIPT_SEGMENT:\n${triggeringContext}\n\nCONVERSATION_HISTORY:\n${currentContext}\n\n${recentWhispers}\n\nNote: The speaker just continued talking. Ensure your new whisper is coherent with previous whispers.`
    
    let endpoint = ''
    let headers: any = { 'Content-Type': 'application/json' }
    let body: any = {}

    if (activeModel.value === 'gemini') {
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel.value}:generateContent?key=${geminiKey}`
      body = {
        contents: [{
          parts: [{ text: `${SUTA_WHISPERER_PROMPT.value}\n\n${finalPrompt}` }]
        }]
      }
    } else {
      endpoint = 'https://openrouter.ai/api/v1/chat/completions'
      headers['Authorization'] = `Bearer ${openRouterKey}`
      body = {
        model: openRouterModel.value,
        messages: [
          { role: 'system', content: SUTA_WHISPERER_PROMPT.value },
          { role: 'user', content: finalPrompt }
        ]
      }
    }

    const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
    const data = await response.json()

    let content = ''
    if (activeModel.value === 'gemini') {
      content = data.candidates?.[0]?.content?.parts?.[0]?.text || "Communication interrupted."
    } else {
      content = data.choices?.[0]?.message?.content || "Communication interrupted."
    }

    // Append to history
    // Aggregate all messages that triggered this analysis into one context bubble
    const aggregatedNewContext = customQuery 
      ? customQuery 
      : transcript.value.slice(lastProcessedIdx.value)
          .filter(m => m.speaker !== 'System')
          .map(m => m.text)
          .join(' ')

    aiWhispers.value.push({
      type: customQuery ? 'manual' : 'auto',
      query: aggregatedNewContext,
      content,
      model: activeModel.value === 'gemini' ? geminiModel.value : openRouterModel.value,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })

    // Update processed index if this was an auto-whisper
    if (!customQuery) {
      lastProcessedIdx.value = transcript.value.length
    }

    pendingManualQuery.value = ''
    scrollToBottom()

  } catch (err) {
    console.error(err)
    pendingManualQuery.value = ''
  } finally {
    isAnalyzing.value = false
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    const el = document.querySelector('.flex-1.overflow-y-auto.p-6')
    if (el) el.scrollTop = el.scrollHeight
  }, 100)
}

const handleManualSubmit = () => {
  if (!manualInput.value.trim() || isAnalyzing.value) return
  const query = manualInput.value
  manualInput.value = ''
  performAIAnalysis(query)
}

// Responsive logic
const headerRef = ref<HTMLElement | null>(null)
const panelWidth = ref(500)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (isStreaming.value) {
    performAIAnalysis()
  }
  
  if (headerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        panelWidth.value = entry.contentRect.width
      }
    })
    resizeObserver.observe(headerRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (autoWhisperTimeout) {
    clearTimeout(autoWhisperTimeout)
  }
})

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,240,255,0.1); border-radius: 10px; }
</style>
