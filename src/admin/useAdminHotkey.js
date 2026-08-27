import { onMounted, onUnmounted } from 'vue'

/** Ctrl+Alt+Shift+E anywhere on the site opens the admin access popup. */
export function useAdminHotkey(callback) {
  function handleKeydown(event) {
    if (event.ctrlKey && event.altKey && event.shiftKey && event.code === 'KeyE') {
      event.preventDefault()
      callback()
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
}
