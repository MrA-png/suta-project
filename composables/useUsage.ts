import { useState } from '#app'

export interface ModelUsage {
  requests: number;
  tokens: number;
  cost: number;
}

export interface UsageStats {
  groq: ModelUsage;
  gemini: ModelUsage;
  openrouter: ModelUsage;
  deepgram: {
    requests: number;
    seconds: number;
  };
}

export const useUsage = () => {
  const stats = useState<UsageStats>('suta-usage', () => ({
    groq: { requests: 0, tokens: 0, cost: 0 },
    gemini: { requests: 0, tokens: 0, cost: 0 },
    openrouter: { requests: 0, tokens: 0, cost: 0 },
    deepgram: { requests: 0, seconds: 0 }
  }))

  const trackAIUsage = (model: 'groq' | 'gemini' | 'openrouter', tokens: number = 0) => {
    stats.value[model].requests++
    stats.value[model].tokens += tokens
    // Approximate cost (very rough estimate)
    const costPer1k = model === 'groq' ? 0.0001 : 0.0005
    stats.value[model].cost += (tokens / 1000) * costPer1k
  }

  const trackTranscriptionUsage = (engine: 'deepgram' | 'groq-whisper', seconds: number) => {
    if (engine === 'deepgram') {
      stats.value.deepgram.requests++
      stats.value.deepgram.seconds += seconds
    } else {
      stats.value.groq.requests++
      // Groq whisper doesn't really report tokens the same way, but we track requests
    }
  }

  const resetUsage = () => {
    stats.value = {
      groq: { requests: 0, tokens: 0, cost: 0 },
      gemini: { requests: 0, tokens: 0, cost: 0 },
      openrouter: { requests: 0, tokens: 0, cost: 0 },
      deepgram: { requests: 0, seconds: 0 }
    }
  }

  return {
    stats,
    trackAIUsage,
    trackTranscriptionUsage,
    resetUsage
  }
}
