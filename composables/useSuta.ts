import { useState } from '#app'

export interface TranscriptMessage {
  speaker: string;
  text: string;
  translation?: string;
  isFinal: boolean;
}

export const useSuta = () => {
  const transcript = useState<TranscriptMessage[]>('suta-transcript', () => [
    { speaker: 'System', text: 'Suta Terminal Initialized. Ready for session capture.', isFinal: true }
  ])
  const interimText = useState('suta-interim', () => '')
  const isListening = useState('suta-listening', () => false)
  const currentStatus = useState('suta-status', () => 'idle')
  
  const addMessage = (speaker: string, text: string, translation?: string, isFinal: boolean = true) => {
    transcript.value.push({ speaker, text, translation, isFinal })
    
    // Clear interim when a final message is added
    if (isFinal) {
      interimText.value = ''
    }

    if (transcript.value.length > 50) {
      transcript.value.shift()
    }
  }

  const setInterim = (text: string) => {
    interimText.value = text
  }

  return { transcript, interimText, isListening, currentStatus, addMessage, setInterim }
}
