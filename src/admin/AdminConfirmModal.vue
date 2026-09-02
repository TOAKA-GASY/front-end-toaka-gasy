<template>
  <div class="tg-admin-backdrop">
    <div class="tg-admin-modal card shadow-lg">
      <div class="card-body p-4">
        <h2 class="h5 mb-1">Confirmer la publication</h2>
        <p class="text-muted small mb-3">Section : {{ sectionLabel }}</p>

        <div v-if="diffRows.length === 0" class="alert alert-secondary small">Aucun changement détecté.</div>
        <ul v-else class="list-unstyled small mb-3 tg-admin-diff border rounded p-2">
          <li v-for="(row, i) in diffRows" :key="i" class="mb-2 pb-2 border-bottom">
            <span class="badge text-bg-light border me-1">{{ row.locale.toUpperCase() }}</span>
            <strong>{{ row.path }}</strong>
            <div class="text-muted text-decoration-line-through">{{ display(row.oldValue) }}</div>
            <div>{{ display(row.newValue) }}</div>
          </li>
        </ul>

        <form @submit.prevent="submit">
          <label class="form-label small">Ressaisissez le code d'accès pour publier</label>
          <input
            ref="inputRef"
            v-model="code"
            type="password"
            autocomplete="off"
            class="form-control mb-3"
            :disabled="loading"
          />
          <p v-if="error" class="text-danger small mb-3">{{ error }}</p>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary" :disabled="loading" @click="emit('close')">
              Annuler
            </button>
            <button type="submit" class="btn btn-dark" :disabled="loading || !code || diffRows.length === 0">
              {{ loading ? 'Publication…' : 'Confirmer & publier' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { commitSection } from './adminApi'
import { pushToast } from './useToast'

const props = defineProps({
  section: { type: Object, required: true },
  changes: { type: Object, required: true },
})
const emit = defineEmits(['confirmed', 'close'])

const code = ref('')
const error = ref('')
const loading = ref(false)
const inputRef = ref(null)

const sectionLabel = computed(() => (props.section.id === '__consts__' ? 'Valeurs partagées' : props.section.id.split('.').join(' › ')))

const diffRows = computed(() => {
  const rows = []
  for (const locale of ['en', 'fr', 'nl', 'it']) {
    for (const [path, newValue] of Object.entries(props.changes[locale] || {})) {
      const field = props.section.fields.find((f) => f.path === path)
      const originalKey = `original${locale[0].toUpperCase()}${locale.slice(1)}`
      rows.push({ locale, path, oldValue: field?.[originalKey], newValue })
    }
  }
  return rows
})

function display(value) {
  if (Array.isArray(value)) return value.join(' / ')
  return value ?? ''
}

async function submit() {
  if (!code.value || loading.value) return
  loading.value = true
  error.value = ''
  try {
    const result = await commitSection(props.section.id, props.changes, code.value)
    if (result.skipped) {
      pushToast('Aucun changement à publier.', 'error')
      emit('close')
    } else {
      emit('confirmed')
    }
  } catch (err) {
    error.value = err.message || 'La publication a échoué.'
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
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2200;
  padding: 1rem;
}
.tg-admin-modal {
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
}
.tg-admin-diff {
  max-height: 14rem;
  overflow-y: auto;
}
</style>
