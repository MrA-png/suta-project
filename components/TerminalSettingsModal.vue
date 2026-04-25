<template>
  <BaseModal :show="show" title="SYSTEM SETTINGS" @close="$emit('close')">
    <div class="space-y-6 py-2">
      <!-- Language Selection -->
      <div class="space-y-3">
        <label class="text-[10px] font-bold text-suta-muted uppercase tracking-widest">Interview Language (Source)</label>
        <div class="grid grid-cols-2 gap-2">
          <button 
            v-for="lang in ['en-US', 'id-ID']" 
            :key="lang"
            @click="updateLanguage(lang)"
            class="px-4 py-3 rounded border text-[12px] font-medium transition-all"
            :class="settings.sourceLang === lang ? 'bg-suta-cyan/10 border-suta-cyan text-suta-cyan' : 'bg-white/5 border-white/10 text-suta-muted hover:border-white/30'"
          >
            {{ lang === 'en-US' ? 'English (EN)' : 'Indonesia (ID)' }}
          </button>
        </div>
      </div>

      <!-- Translator Toggle -->
      <div class="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
        <div>
          <div class="text-[12px] font-bold text-white">Live Translator</div>
          <div class="text-[10px] text-suta-muted">Translate to {{ settings.targetLang === 'id' ? 'Indonesian' : 'English' }}</div>
        </div>
        <button 
          @click="settings.isTranslatorEnabled = !settings.isTranslatorEnabled"
          class="relative w-10 h-5 rounded-full transition-colors duration-300"
          :class="settings.isTranslatorEnabled ? 'bg-suta-cyan' : 'bg-white/20'"
        >
          <div 
            class="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300"
            :class="{ 'translate-x-5': settings.isTranslatorEnabled }"
          ></div>
        </button>
      </div>
    </div>

    <template #footer>
      <button 
        @click="$emit('close')"
        class="w-full py-3 bg-suta-cyan text-suta-black font-bold text-[12px] rounded hover:bg-white transition-colors uppercase tracking-[2px]"
      >
        Save Configuration
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useSuta } from '~/composables/useSuta'

defineProps<{ show: boolean }>()
defineEmits(['close'])

const { settings } = useSuta()

const updateLanguage = (lang: string) => {
  settings.value.sourceLang = lang
  settings.value.targetLang = lang === 'en-US' ? 'id' : 'en'
}
</script>
