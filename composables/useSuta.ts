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

export const useSuta = () => {
  const transcript = useState<TranscriptMessage[]>('suta-transcript', () => [
    { speaker: 'System', text: 'Suta Terminal Initialized. Ready for session capture.', isFinal: true }
  ])
  const history = useState<TranscriptionSession[]>('suta-history', () => [])
  
  const interimText = useState('suta-interim', () => '')
  const isListening = useState('suta-listening', () => false)
  const currentStatus = useState('suta-status', () => 'idle')
  
  const settings = useState<SutaSettings>('suta-settings', () => ({
    sourceLang: 'en-US',
    targetLang: 'id',
    isTranslatorEnabled: true
  }))

  // Persistence Logic
  onMounted(() => {
    const savedHistory = localStorage.getItem('suta_history')
    if (savedHistory) {
      history.value = JSON.parse(savedHistory)
    }
  })

  watch(history, (newVal) => {
    localStorage.setItem('suta_history', JSON.stringify(newVal))
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
    transcript.value = []
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

  return { 
    transcript, 
    interimText, 
    isListening, 
    currentStatus, 
    settings,
    history,
    addMessage, 
    setInterim,
    clearTranscript,
    deleteSession,
    updateLastMessageTranslation 
  }
}
