<template>
  <div class="tg-admin-backdrop">
    <div class="tg-admin-modal card shadow-lg">
      <div class="card-body p-4">
        <h2 class="h5 mb-3">Accès administrateur</h2>
        <p class="text-muted small mb-3">Saisissez le code d'accès pour ouvrir l'éditeur de texte.</p>
        <form @submit.prevent="submit">
          <input
            ref="inputRef"
            v-model="code"
            type="password"
            autocomplete="off"
            class="form-control mb-3"
            placeholder="Code d'accès"
            :disabled="loading"
          />
          <p v-if="error" class="text-danger small mb-3">{{ error }}</p>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary" :disabled="loading" @click="emit('close')">
              Annuler
            </button>
            <button type="submit" class="btn btn-dark" :disabled="loading || !code">
              {{ loading ? 'Vérification…' : 'Déverrouiller' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { login } from './adminApi'
import { setSession } from './adminSession'

const emit = defineEmits(['success', 'close'])

const code = ref('')
const error = ref('')
const loading = ref(false)
const inputRef = ref(null)

async function submit() {
  if (!code.value || loading.value) return
  loading.value = true
  error.value = ''
  try {
    const { token, expiresAt } = await login(code.value)
    setSession(token, expiresAt)
    emit('success')
  } catch (err) {
    error.value = err.message || 'Code invalide'
  } finally {
    loading.value = false
    code.value = ''
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') emit('close')
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  await nextTick()
  inputRef.value?.focus()
})
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.tg-admin-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2100;
  padding: 1rem;
}
.tg-admin-modal {
  width: 100%;
  max-width: 26rem;
}
</style>
