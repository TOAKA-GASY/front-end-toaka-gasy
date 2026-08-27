<template>
  <AdminAccessModal v-if="showAccess" @success="handleLoginSuccess" @close="showAccess = false" />
  <AdminEditorOverlay v-if="showEditor" @close="showEditor = false" />

  <div class="tg-admin-toasts">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast show align-items-center border-0 mb-2"
      :class="t.variant === 'error' ? 'text-bg-danger' : 'text-bg-success'"
      role="status"
    >
      <div class="d-flex">
        <div class="toast-body">{{ t.message }}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" aria-label="Fermer" @click="dismissToast(t.id)"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminAccessModal from './AdminAccessModal.vue'
import AdminEditorOverlay from './AdminEditorOverlay.vue'
import { useAdminHotkey } from './useAdminHotkey'
import { isSessionActive } from './adminSession'
import { useToasts, dismissToast } from './useToast'

const showAccess = ref(false)
const showEditor = ref(false)
const { toasts } = useToasts()

useAdminHotkey(() => {
  if (showAccess.value || showEditor.value) return
  showEditor.value = isSessionActive()
  showAccess.value = !showEditor.value
})

function handleLoginSuccess() {
  showAccess.value = false
  showEditor.value = true
}
</script>

<style scoped>
.tg-admin-toasts {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2300;
  max-width: 22rem;
}
</style>
