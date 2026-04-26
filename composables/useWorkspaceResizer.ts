import { ref } from 'vue'

export const useWorkspaceResizer = (initialHeight = 288) => {
  const terminalHeight = ref(initialHeight)
  const isResizing = ref(false)

  const startResizing = () => {
    isResizing.value = true
    document.addEventListener('mousemove', handleResizing)
    document.addEventListener('mouseup', stopResizing)
    document.body.style.cursor = 'row-resize'
  }

  const handleResizing = (e: MouseEvent) => {
    if (!isResizing.value) return
    const newHeight = window.innerHeight - e.clientY
    
    // Limits: min 100px, max 70% of screen
    if (newHeight > 100 && newHeight < window.innerHeight * 0.7) {
      terminalHeight.value = newHeight
    }
  }

  const stopResizing = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', handleResizing)
    document.removeEventListener('mouseup', stopResizing)
    document.body.style.cursor = 'default'
  }

  return {
    terminalHeight,
    isResizing,
    startResizing
  }
}
