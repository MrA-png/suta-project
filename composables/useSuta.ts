import { useState } from '#app'
import { onMounted, watch } from 'vue'

export interface TranscriptMessage {
  speaker: string;
  text: string;
  translation?: string;
  isFinal: boolean;
}

export interface TranscriptionSession {
  id: string;
  timestamp: string;
  messages: TranscriptMessage[];
}

export interface SutaSettings {
  sourceLang: string;
  targetLang: string;
  isTranslatorEnabled: boolean;
}

export interface AIWhisper {
  type: 'auto' | 'manual';
  query?: string;
  content: string;
  timestamp: string;
  model: string;
}

export interface Personality {
  identity: {
    full_name: string;
    nickname: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const useSuta = () => {
  const transcript = useState<TranscriptMessage[]>('suta-transcript', () => [
    { speaker: 'System', text: 'Suta Terminal Initialized. Ready for session capture.', isFinal: true }
  ])
  const history = useState<TranscriptionSession[]>('suta-history', () => [])
  
  const interimText = useState('suta-interim', () => '')
  const isListening = useState('suta-listening', () => false)
  const isStreaming = useState('suta-streaming', () => false)
  const currentStatus = useState('suta-status', () => 'idle')
  const isAIPanelOpen = useState('suta-ai-panel', () => true)
  
  const settings = useState<SutaSettings>('suta-settings', () => ({
    sourceLang: 'en-US',
    targetLang: 'id',
    isTranslatorEnabled: true
  }))

  const personality = useState<Personality | null>('suta-personality', () => null)
  const aiWhispers = useState<AIWhisper[]>('suta-ai-whispers', () => [])

  // Persistence Logic
  onMounted(async () => {
    // Load History
    const savedHistory = localStorage.getItem('suta_history')
    if (savedHistory) {
      history.value = JSON.parse(savedHistory)
    }

    // Load AI Whispers
    const savedWhispers = localStorage.getItem('suta_ai_whispers')
    if (savedWhispers) {
      aiWhispers.value = JSON.parse(savedWhispers)
    }

    // Load Personality
    const savedPersonality = localStorage.getItem('suta_personality')
    if (savedPersonality) {
      personality.value = JSON.parse(savedPersonality)
    } else {
      // Load default from assets
      try {
        const defaultPersonality = await import('~/assets/personality.json')
        personality.value = defaultPersonality.default
      } catch (e) {
        console.error('Failed to load default personality:', e)
      }
    }
  })

  watch(history, (newVal) => {
    localStorage.setItem('suta_history', JSON.stringify(newVal))
  }, { deep: true })

  watch(personality, (newVal) => {
    if (newVal) {
      localStorage.setItem('suta_personality', JSON.stringify(newVal))
    }
  }, { deep: true })
  
  const addMessage = (speaker: string, text: string, translation?: string, isFinal: boolean = true) => {
    if (transcript.value.length === 1 && transcript.value[0].speaker === 'System') {
      transcript.value = []
    }
    transcript.value.push({ speaker, text, translation, isFinal })
    if (isFinal) {
      interimText.value = ''
    }
  }

  const clearTranscript = (save: boolean = true) => {
    if (save && transcript.value.length > 0 && transcript.value[0].speaker !== 'System') {
      const newSession: TranscriptionSession = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        messages: [...transcript.value]
      }
      history.value = [newSession, ...history.value]
    }
    transcript.value = [
      { speaker: 'System', text: 'Suta Terminal Initialized. Ready for session capture.', isFinal: true }
    ]
    interimText.value = ''
  }

  const deleteSession = (id: string) => {
    history.value = history.value.filter(s => s.id !== id)
  }

  const updateLastMessageTranslation = (translation: string) => {
    if (transcript.value.length > 0) {
      const lastIdx = transcript.value.length - 1
      transcript.value[lastIdx] = {
        ...transcript.value[lastIdx],
        translation
      }
    }
  }

  const setInterim = (text: string) => {
    interimText.value = text
  }

  // Persistence for AI Whispers
  watch(aiWhispers, (newVal) => {
    localStorage.setItem('suta_ai_whispers', JSON.stringify(newVal))
  }, { deep: true })

  return { 
    transcript, 
    interimText, 
    isListening, 
    isStreaming,
    currentStatus, 
    settings,
    history,
    personality,
    isAIPanelOpen,
    aiWhispers,
    addMessage, 
    setInterim,
    clearTranscript,
    deleteSession,
    updateLastMessageTranslation 
  }
}
