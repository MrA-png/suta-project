<template>
  <div>
    <BaseModal 
      :show="show" 
      :title="viewingSession ? 'SESSION DETAILS' : 'TRANSCRIPTION HISTORY'" 
      @close="$emit('close')"
      wide
    >
      <!-- Session List View -->
      <div v-if="!viewingSession" class="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <!-- Empty State -->
        <div v-if="history.length === 0" class="py-12 text-center text-suta-muted">
          <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <div class="w-6 h-6 bg-current [mask-image:url(/icons/archive-svgrepo-com.svg)] [mask-size:contain] [mask-repeat:no-repeat]"></div>
          </div>
          <p class="text-[12px] uppercase tracking-widest font-medium">No history recorded yet</p>
        </div>
        
        <!-- Sessions -->
        <HistorySessionCard 
          v-for="session in history" 
          :key="session.id"
          :timestamp="session.timestamp"
          :message-count="session.messages.length"
          @select="viewingSession = session"
          @delete="pendingDeleteId = session.id"
        />
      </div>

      <!-- Detail View -->
      <div v-else class="max-h-[60vh] flex flex-col -mt-4">
        <div class="sticky top-0 z-20 pt-4 pb-4 bg-[#1a1a1a]/80 backdrop-blur-md -mx-2 px-2 mb-4 border-b border-white/5">
          <button 
            @click="viewingSession = null"
            class="text-suta-cyan text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-white transition-all group/back"
          >
            <div class="w-4 h-4 bg-current [mask-image:url(/icons/chevron-left.svg)] [mask-size:contain] [mask-repeat:no-repeat] group-hover/back:-translate-x-1 transition-transform"></div>
            Back to History
          </button>
        </div>
        
        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-4">
          <div v-for="(msg, idx) in viewingSession.messages" :key="idx" class="border-b border-white/5 pb-6 last:border-0 text-left">
            <div class="text-[9px] font-bold text-suta-muted uppercase mb-1 tracking-widest">{{ msg.speaker }}</div>
            <div class="text-[14px] text-white/90 leading-relaxed">{{ msg.text }}</div>
            
            <div v-if="msg.translation" class="mt-3 pl-4 border-l-2 border-suta-cyan/30 text-left">
              <p class="text-suta-cyan text-[13px] italic font-medium leading-relaxed opacity-90">
                {{ msg.translation }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="$emit('close')" class="w-full py-3 bg-white/5 text-white font-bold text-[11px] border border-white/10 rounded hover:bg-white hover:text-black transition-all uppercase tracking-[2px]">
          Close History
        </button>
      </template>
    </BaseModal>

    <!-- Confirmation Dialog -->
    <BaseConfirmation 
      :show="!!pendingDeleteId"
      title="CONFIRM DELETE"
      message="Are you sure you want to delete this session?"
      sub-message="This action cannot be undone."
      confirm-text="Delete Now"
      danger
      @cancel="pendingDeleteId = null"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSuta } from '~/composables/useSuta'

defineProps<{ show: boolean }>()
defineEmits(['close'])

const { history, deleteSession } = useSuta()
const viewingSession = ref<any>(null)
const pendingDeleteId = ref<string | null>(null)

const handleConfirmDelete = () => {
  if (pendingDeleteId.value) {
    deleteSession(pendingDeleteId.value)
    pendingDeleteId.value = null
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,240,255,0.2); border-radius: 10px; }
</style>
