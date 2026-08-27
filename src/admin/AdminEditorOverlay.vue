<template>
  <div class="tg-admin-overlay">
    <div class="tg-admin-panel">
      <header class="d-flex align-items-center justify-content-between p-3 border-bottom bg-white">
        <div>
          <h1 class="h5 mb-0">Éditeur de texte</h1>
          <p class="text-muted small mb-0">Modifiez le texte du site, section par section.</p>
        </div>
        <button type="button" class="btn-close" aria-label="Fermer" @click="emit('close')"></button>
      </header>

      <div class="tg-admin-body p-3">
        <div v-if="loading" class="text-center text-muted py-5">Chargement…</div>
        <div v-else-if="loadError" class="alert alert-danger">{{ loadError }}</div>

        <div v-else class="accordion" id="tg-admin-accordion">
          <div v-for="section in sections" :key="section.id" class="accordion-item">
            <h2 class="accordion-header">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="`#tg-sec-${sectionDomId(section.id)}`"
              >
                <span class="flex-grow-1">{{ sectionLabel(section.id) }}</span>
                <span v-if="sectionDirty(section)" class="badge text-bg-warning me-2">modifié</span>
              </button>
            </h2>
            <div
              :id="`tg-sec-${sectionDomId(section.id)}`"
              class="accordion-collapse collapse"
              data-bs-parent="#tg-admin-accordion"
            >
              <div class="accordion-body">
                <div v-for="field in section.fields" :key="field.path" class="mb-4">
                  <label class="form-label fw-semibold small text-uppercase text-muted">
                    {{ fieldLabel(field.path, section.id) }}
                  </label>

                  <div class="row g-2">
                    <div v-for="locale in LOCALES" :key="locale" class="col-12 col-lg-4">
                      <div class="small text-muted mb-1">{{ locale.toUpperCase() }}</div>
                      <textarea
                        v-if="field.type === 'string'"
                        class="form-control"
                        rows="3"
                        v-model="field[locale]"
                        :class="{ 'border-warning': !valuesEqual(field[locale], field[originalKey(locale)]) }"
                      ></textarea>
                      <textarea
                        v-else
                        class="form-control"
                        rows="3"
                        :value="(field[locale] || []).join('\n')"
                        @input="field[locale] = $event.target.value.split('\n')"
                        :class="{ 'border-warning': !valuesEqual(field[locale], field[originalKey(locale)]) }"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center border-top pt-3">
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    :disabled="translating === section.id"
                    @click="translateSection(section)"
                  >
                    {{ translating === section.id ? 'Traduction…' : '🌐 Traduire EN → FR/NL' }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-dark btn-sm"
                    :disabled="!sectionDirty(section)"
                    @click="openConfirm(section)"
                  >
                    Valider cette section
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <AdminConfirmModal
    v-if="confirmSection"
    :section="confirmSection"
    :changes="pendingChanges"
    @confirmed="onConfirmed"
    @close="confirmSection = null"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AdminConfirmModal from './AdminConfirmModal.vue'
import { fetchLocales, translateFields } from './adminApi'
import { pushToast } from './useToast'

const emit = defineEmits(['close'])

// FR temporarily left out of the editor (site's language switcher has it disabled too — see src/i18n.js).
const LOCALES = ['en', 'nl']
const TARGET_LOCALES = LOCALES.filter((locale) => locale !== 'en')

const loading = ref(true)
const loadError = ref('')
const sections = ref([])
const translating = ref(null)
const confirmSection = ref(null)
const pendingChanges = ref(null)

function originalKey(locale) {
  return `original${locale[0].toUpperCase()}${locale.slice(1)}`
}

function sectionDomId(id) {
  return id.replace(/[^a-zA-Z0-9]/g, '-')
}

function sectionLabel(id) {
  return id === '__consts__' ? 'Valeurs partagées' : id.split('.').join(' › ')
}

function fieldLabel(fieldPath, sectionId) {
  return fieldPath.startsWith(`${sectionId}.`) ? fieldPath.slice(sectionId.length + 1) : fieldPath
}

function valuesEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function sectionDirty(section) {
  return section.fields.some((f) => LOCALES.some((locale) => !valuesEqual(f[locale], f[originalKey(locale)])))
}

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const data = await fetchLocales()
    sections.value = data.sections.map((section) => ({
      id: section.id,
      fields: section.fields.map((field) => ({
        path: field.path,
        type: field.type,
        en: field.values.en,
        fr: field.values.fr,
        nl: field.values.nl,
        originalEn: field.values.en,
        originalFr: field.values.fr,
        originalNl: field.values.nl,
      })),
    }))
  } catch (err) {
    loadError.value = err.message || 'Impossible de charger le contenu.'
  } finally {
    loading.value = false
  }
}

async function translateSection(section) {
  translating.value = section.id
  try {
    const flat = {}
    for (const field of section.fields) {
      if (field.type === 'string') {
        flat[field.path] = field.en
      } else {
        field.en.forEach((line, i) => {
          flat[`${field.path}::${i}`] = line
        })
      }
    }

    const { translations } = await translateFields(flat, TARGET_LOCALES)

    for (const locale of TARGET_LOCALES) {
      const result = translations[locale] || {}
      for (const field of section.fields) {
        if (field.type === 'string') {
          if (field.path in result) field[locale] = result[field.path]
        } else {
          field[locale] = field.en.map((_, i) => result[`${field.path}::${i}`] ?? '')
        }
      }
    }
  } catch (err) {
    pushToast(err.message || "La traduction automatique a échoué.", 'error')
  } finally {
    translating.value = null
  }
}

function cleanValue(field, locale) {
  const value = field[locale]
  if (field.type === 'stringArray') {
    return (value || []).map((line) => line.trim()).filter((line) => line.length > 0)
  }
  return value
}

function openConfirm(section) {
  const changes = { en: {}, fr: {}, nl: {} }
  for (const field of section.fields) {
    for (const locale of LOCALES) {
      const cleaned = cleanValue(field, locale)
      if (!valuesEqual(cleaned, field[originalKey(locale)])) {
        changes[locale][field.path] = cleaned
      }
    }
  }
  pendingChanges.value = changes
  confirmSection.value = section
}

function onConfirmed() {
  const section = confirmSection.value
  for (const field of section.fields) {
    for (const locale of LOCALES) {
      const cleaned = cleanValue(field, locale)
      field[locale] = cleaned
      field[originalKey(locale)] = cleaned
    }
  }
  confirmSection.value = null
  pushToast('Modifications publiées sur GitHub ✅')
}

function handleKeydown(event) {
  if (event.key === 'Escape' && !confirmSection.value) emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  load()
})
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.tg-admin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 2050;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 1.5rem;
}
.tg-admin-panel {
  background: #fff;
  width: 100%;
  max-width: 60rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow: hidden;
}
.tg-admin-body {
  overflow-y: auto;
}
</style>
