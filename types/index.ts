export interface Message {
  speaker: 'interviewer' | 'candidate' | 'system'
  text: string
  timestamp: number
}

export interface Personality {
  identity: {
    name: string
    nickname: string
    role: string
    background: string
  }
  experience: Array<{
    company: string
    period: string
    achievements: string[]
  }>
  skills: {
    core: string[]
    tools: string[]
  }
}

export interface SutaSettings {
  sourceLang: string
  targetLang: string
  isAutoTranslate: boolean
}
