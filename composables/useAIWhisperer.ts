import { ref, computed } from 'vue'
import { useSuta } from './useSuta'
import { useUsage } from './useUsage'

export const useAIWhisperer = () => {
  const { public: config } = useRuntimeConfig()
  const { transcript, settings, personality, aiWhispers, lastProcessedIdx } = useSuta()
  
  const isAnalyzing = ref(false)
  const activeModel = ref<'gemini' | 'openrouter' | 'groq'>('groq')
  const geminiModel = ref('gemini-2.0-flash')
  const geminiModels = [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' }
  ]
  const openRouterModel = ref('openai/gpt-oss-120b:free')
  const openRouterModels = [
    { id: 'openai/gpt-oss-120b:free', name: 'GPT OSS 120B' },
    { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
  ]
  const groqModel = ref('llama-3.3-70b-versatile')
  const groqModels = [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
    { id: 'meta-llama/llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout 17B' },
    { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B' },
    { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B' },
  ]
  const pendingManualQuery = ref('')
  const pendingContext = ref('')

  const SUTA_WHISPERER_PROMPT = computed(() => {
    const isIndonesian = settings.value.sourceLang.startsWith('id')
    const responseLanguage = isIndonesian ? 'Indonesian' : 'English'
    const isTranslatorMode = settings.value.isTranslatorEnabled

    let basePrompt = `
You are the "SECRET WHISPERER", a personal job interview assistant acting as a "source person" or "coach" to help the user answer interview questions.
You have access to the following candidate's full profile:

${JSON.stringify(personality.value, null, 2)}

Your Personality & Tone:
1. TONE: Human-pro, conversational, and "one-take ready". Imagine a senior developer speaking naturally in an interview.
2. LANGUAGE: You MUST respond in ${responseLanguage}. Use natural phrasing (Indonesian: "Sebenarnya...", "Kalau dari sisi...", "Jadi gini...").
`

    if (isTranslatorMode) {
      basePrompt += `
3. SPECIAL INSTRUCTION (TRANSLATOR MODE): The input text might be in a different language. 
   - First, identify the meaning of the input.
   - You MUST provide the suggested answer in ${responseLanguage}.
   - If the input is a question from an interviewer in English and you are responding in Indonesian, provide a strategic technical answer in Indonesian that the user can say.
`
    }

    basePrompt += `
4. PERSONA: You ARE the candidate. Speak in the first person ("I" or "Saya").
5. BE CONCISE: Complete, but compact. 2-4 sentences max per whisper. High impact, zero fluff.
6. NO AI-FORMATTING: NEVER use bullet points or numbered lists in the SUGGESTED_WHISPER. Write in natural paragraphs.

Guidelines:
1. RADICAL HONESTY: NEVER lie. If it's not in the JSON, don't say it. Stick to the projects listed.
2. PLUG-AND-PLAY: The user must be able to read your response EXACTLY as written. No placeholders, no [brackets], no "..." gaps.
3. SENIORITY: Sound like a confident professional. Use technical terms naturally without over-explaining like a textbook.
4. STRATEGY: If the interviewer's question is vague, answer based on your strongest project in the profile.

OUTPUT STRUCTURE:
- ### SUGGESTED_WHISPER: The ready-to-read answer (No lists, just natural flow).
- ### STRATEGIC_TIP: One quick tip on delivery or body language.
`
    return basePrompt
  })

  let currentAbortController: AbortController | null = null

  const performAIAnalysis = async (customQuery?: string) => {
    const geminiKey = config.geminiApiKey
    const openRouterKey = config.openrouterApiKey
    const groqKey = config.groqApiKey

    if (transcript.value.length < 1 && !customQuery) return

    // Abort previous analysis if still running
    if (currentAbortController) {
      currentAbortController.abort()
    }
    currentAbortController = new AbortController()
    const { signal } = currentAbortController

    isAnalyzing.value = true
    
    const allMessages = transcript.value
    const newMessages = customQuery ? [] : allMessages.slice(lastProcessedIdx.value)
    
    const context = customQuery 
      ? customQuery 
      : newMessages.filter(m => m.speaker !== 'System').map(m => m.text).join(' ')

    if (!context) {
      isAnalyzing.value = false
      return
    }

    pendingContext.value = context
    if (customQuery) pendingManualQuery.value = customQuery

    try {
      const { trackAIUsage } = useUsage()
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
      } else if (activeModel.value === 'openrouter') {
        endpoint = 'https://openrouter.ai/api/v1/chat/completions'
        headers['Authorization'] = `Bearer ${openRouterKey}`
        body = {
          model: openRouterModel.value,
          messages: [
            { role: 'system', content: SUTA_WHISPERER_PROMPT.value },
            { role: 'user', content: finalPrompt }
          ]
        }
      } else if (activeModel.value === 'groq') {
        endpoint = 'https://api.groq.com/openai/v1/chat/completions'
        headers['Authorization'] = `Bearer ${groqKey}`
        body = {
          model: groqModel.value,
          messages: [
            { role: 'system', content: SUTA_WHISPERER_PROMPT.value },
            { role: 'user', content: finalPrompt }
          ]
        }
      }

      const response = await fetch(endpoint, { 
        method: 'POST', 
        headers, 
        body: JSON.stringify(body),
        signal 
      })
      const data = await response.json()

      // Track Usage
      let tokensUsed = 0
      if (activeModel.value === 'gemini') {
        tokensUsed = data.usageMetadata?.totalTokenCount || 0
      } else {
        tokensUsed = data.usage?.total_tokens || 0
      }
      trackAIUsage(activeModel.value, tokensUsed)

      let content = ''
      if (activeModel.value === 'gemini') {
        content = data.candidates?.[0]?.content?.parts?.[0]?.text || "Communication interrupted."
      } else {
        content = data.choices?.[0]?.message?.content || "Communication interrupted."
      }

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
        model: activeModel.value === 'gemini' 
          ? geminiModel.value 
          : activeModel.value === 'groq' 
            ? groqModel.value 
            : openRouterModel.value,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })

      if (!customQuery) {
        lastProcessedIdx.value = transcript.value.length
      }

      pendingManualQuery.value = ''
      pendingContext.value = ''
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('AI Analysis aborted due to new input.')
      } else {
        console.error('AI Analysis Error:', err)
      }
      pendingManualQuery.value = ''
      pendingContext.value = ''
    } finally {
      if (currentAbortController?.signal === signal) {
        isAnalyzing.value = false
        currentAbortController = null
      }
    }
  }

  const formatAIResponse = (text: string) => {
    if (!text) return ''
    return text
      .replace(/\*\*(.*?)\*\*/g, '<b class="text-suta-cyan">$1</b>')
      .replace(/### (.*?)\n/g, '<h5 class="text-white font-bold text-[14px] mt-4 mb-2 uppercase tracking-wider">$1</h5>')
  }

  return {
    isAnalyzing,
    activeModel,
    pendingManualQuery,
    pendingContext,
    geminiModel,
    geminiModels,
    openRouterModel,
    openRouterModels,
    groqModel,
    groqModels,
    performAIAnalysis,
    formatAIResponse
  }
}
