<template>
  <BaseModal :show="show" title="NEURAL_PROFILE_EDITOR" wide @close="$emit('close')">
    <div class="space-y-4 py-2">
      <div class="flex items-center justify-between">
        <label class="text-[10px] font-bold text-suta-muted uppercase tracking-widest">JSON Configuration</label>
        <span v-if="error" class="text-[9px] text-red-500 font-mono animate-pulse uppercase">{{ error }}</span>
        <span v-else class="text-[9px] text-suta-cyan/50 font-mono uppercase">Status: Valid</span>
      </div>
      
      <div class="relative group">
        <div class="absolute -inset-[1px] bg-gradient-to-b from-suta-cyan/20 to-transparent rounded-lg opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
        <textarea
          v-model="jsonContent"
          class="relative w-full h-[400px] bg-black/60 border border-white/10 rounded-lg p-4 font-mono text-[11px] text-suta-cyan leading-relaxed focus:outline-none focus:border-suta-cyan/40 transition-all custom-scrollbar resize-none"
          placeholder="{ ... }"
          @input="validateJson"
        ></textarea>
      </div>

      <div class="flex gap-3">
        <button 
          @click="resetToDefault"
          class="flex-1 py-3 bg-white/5 border border-white/10 text-suta-muted font-bold text-[11px] rounded hover:bg-white/10 transition-colors uppercase tracking-[1px]"
        >
          Reset to Default
        </button>
        <button 
          @click="savePersonality"
          :disabled="!!error"
          class="flex-[2] py-3 bg-suta-cyan text-suta-black font-bold text-[11px] rounded hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-[2px]"
        >
          Inject Personality
        </button>
      </div>
    </div>
  </BaseModal>

  <!-- Reset Confirmation -->
  <BaseConfirmation 
    :show="showResetConfirm"
    title="RESET NEURAL PROFILE?"
    message="This will overwrite your current profile with the default dummy data."
    sub-message="You can undo this by NOT clicking 'Inject' later if needed."
    confirm-text="Reset to Default"
    danger
    @cancel="showResetConfirm = false"
    @confirm="handleConfirmReset"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSuta } from '../composables/useSuta'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])

const { personality } = useSuta()
const jsonContent = ref('')
const error = ref('')
const showResetConfirm = ref(false)

// Initialize content when modal opens
watch(() => props.show, (isShowing) => {
  if (isShowing && personality.value) {
    jsonContent.value = JSON.stringify(personality.value, null, 2)
  }
})

const validateJson = () => {
  try {
    JSON.parse(jsonContent.value)
    error.value = ''
  } catch (e: any) {
    error.value = 'Invalid JSON Structure'
  }
}

const savePersonality = () => {
  try {
    const parsed = JSON.parse(jsonContent.value)
    personality.value = parsed
    emit('close')
  } catch (e) {
    error.value = 'Save failed: Invalid JSON'
  }
}

const resetToDefault = () => {
  showResetConfirm.value = true
}

const handleConfirmReset = async () => {
  try {
    const defaultPersonality = await import('../assets/personality.json')
    jsonContent.value = JSON.stringify(defaultPersonality.default, null, 2)
    error.value = ''
    showResetConfirm.value = false
  } catch (e) {
    error.value = 'Failed to load default'
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.2);
}
</style>
