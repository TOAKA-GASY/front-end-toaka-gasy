import { reactive } from 'vue'

const toasts = reactive([])
let nextId = 1

export function pushToast(message, variant = 'success', duration = 4500) {
  const id = nextId++
  toasts.push({ id, message, variant })
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id)
    if (index !== -1) toasts.splice(index, 1)
  }, duration)
}

export function dismissToast(id) {
  const index = toasts.findIndex((t) => t.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

export function useToasts() {
  return { toasts }
}
