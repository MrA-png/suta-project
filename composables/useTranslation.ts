import { useSuta } from './useSuta'

export const useTranslation = () => {
  const { settings } = useSuta()

  const translate = async (text: string, langPair: string): Promise<string> => {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
      const response = await fetch(url)
      const json = await response.json()
      return json?.responseData?.translatedText || "Translation failed"
    } catch (err) {
      console.error('Translation Error:', err)
      return "Translation failed"
    }
  }

  const translateAuto = async (text: string): Promise<string> => {
    if (!settings.value.isTranslatorEnabled) return text
    
    const source = settings.value.sourceLang.split('-')[0]
    const target = settings.value.targetLang
    const langPair = `${source}|${target}`
    
    return await translate(text, langPair)
  }

  return {
    translate,
    translateAuto
  }
}
