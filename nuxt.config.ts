// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // @ts-ignore - Required by Nitro but not recognized by Nuxt 3.10 types
  compatibilityDate: '2026-04-25',
  runtimeConfig: {
    public: {
      deepgramApiKey: process.env.DEEPGRAM_API_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY,
      openrouterApiKey: process.env.OPENROUTER_API_KEY
    }
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  telemetry: false,
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
  nitro: {
    compatibilityDate: '2026-04-25'
  }
})
