<template>
  <BaseModal 
    :show="show" 
    :title="viewingSession ? 'SESSION DETAILS' : 'TRANSCRIPTION HISTORY'" 
    @close="$emit('close')"
  >
    <!-- Session List -->
    <div v-if="!viewingSession" class="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      <div v-if="history.length === 0" class="py-12 text-center text-suta-muted">
        <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <div class="w-6 h-6 bg-current [mask-image:url(/icons/archive-svgrepo-com.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        </div>
        <p class="text-[12px] uppercase tracking-widest font-medium">No history recorded yet</p>
      </div>
      
      <div 
        v-for="session in history" 
        :key="session.id"
        class="p-4 bg-white/5 border border-white/10 rounded-lg group cursor-pointer hover:border-suta-cyan/50 hover:bg-suta-cyan/5 transition-all flex items-center justify-between"
        @click="viewingSession = session"
      >
        <div>
          <div class="text-[13px] font-bold text-white mb-1">{{ session.timestamp }}</div>
          <div class="text-[10px] text-suta-muted uppercase tracking-wider">{{ session.messages.length }} Messages</div>
        </div>
        <button 
          @click.stop="deleteSession(session.id)"
          class="p-2 text-suta-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
          title="Delete Session"
        >
          <div class="w-4 h-4 bg-current [mask-image:url(/icons/clear.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
        </button>
      </div>
    </div>

    <!-- Detail View -->
    <div v-else class="space-y-6 py-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      <button 
        @click="viewingSession = null"
        class="text-suta-cyan text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4 hover:underline"
      >
        ← Back to History
      </button>
      
      <div v-for="(msg, idx) in viewingSession.messages" :key="idx" class="border-b border-white/5 pb-4 last:border-0">
        <div class="text-[9px] font-bold text-suta-muted uppercase mb-1">{{ msg.speaker }}</div>
        <div class="text-[13px] text-white/80 leading-relaxed">{{ msg.text }}</div>
        <div v-if="msg.translation" class="mt-2 text-[12px] text-suta-cyan italic font-medium">
          {{ msg.translation }}
        </div>
      </div>
    </div>

    <template #footer>
      <button 
        @click="$emit('close')"
        class="w-full py-3 bg-white/5 text-white font-bold text-[11px] border border-white/10 rounded hover:bg-white hover:text-black transition-all uppercase tracking-[2px]"
      >
        Close History
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSuta } from '~/composables/useSuta'

defineProps<{ show: boolean }>()
defineEmits(['close'])

const { history, deleteSession } = useSuta()
const viewingSession = ref<any>(null)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,240,255,0.2); border-radius: 10px; }
</style>
