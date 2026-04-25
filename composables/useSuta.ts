import { useState } from '#app'

export const useSuta = () => {
  const transcript = useState<{speaker: string, text: string}[]>('suta-transcript', () => [
    { speaker: 'System', text: 'Suta Terminal Initialized. Ready for session capture.' }
  ])
  const isListening = useState('suta-listening', () => false)
  const currentStatus = useState('suta-status', () => 'idle')
  
  const addMessage = (speaker: string, text: string) => {
    transcript.value.push({ speaker, text })
    // Limit history to 50 messages
    if (transcript.value.length > 50) {
      transcript.value.shift()
    }
  }

  return { transcript, isListening, currentStatus, addMessage }
}
