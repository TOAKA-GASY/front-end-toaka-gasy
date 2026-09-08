<template>
  <div class="tg-admin-page">
    <header class="tg-admin-topbar">
      <div class="tg-admin-topbar__brand">
        <img src="/logo/logo-marron.webp" class="tg-admin-topbar__logo" alt="Toaka Gasy" />
        <div>
          <div class="tg-admin-topbar__title">Éditeur Toaka Gasy</div>
          <div class="tg-admin-topbar__subtitle">Texte, police, couleur & taille du site</div>
        </div>
      </div>
      <button type="button" class="btn-close" aria-label="Fermer" @click="emit('close')"></button>
    </header>

    <div v-if="loading" class="text-center text-muted py-5">Chargement…</div>
    <div v-else-if="loadError" class="alert alert-danger m-4">{{ loadError }}</div>

    <div v-else class="tg-admin-layout">
      <nav class="tg-admin-sidebar">
        <div v-for="group in navGroups" :key="group.label" class="tg-admin-sidebar__group">
          <div class="tg-admin-sidebar__group-label">{{ group.label }}</div>
          <button
            v-for="item in group.items"
            :key="item.key"
            type="button"
            class="tg-admin-sidebar__item"
            :class="{ 'tg-admin-sidebar__item--active': activeKey === item.key }"
            @click="activeKey = item.key"
          >
            <span>{{ item.label }}</span>
            <span v-if="itemDirty(item)" class="tg-admin-sidebar__dot" title="Modifications non publiées"></span>
          </button>
        </div>
      </nav>

      <main class="tg-admin-content">
        <div v-if="!activeItem" class="text-center text-muted py-5">Sélectionnez une page à gauche.</div>

        <template v-else>
        <div v-for="section in activeItem.sections" :key="section.id" class="tg-admin-block">
          <div class="tg-admin-block__header">
            <h2>{{ activeItem.sections.length > 1 ? sectionLabel(section.id) : activeItem.label }}</h2>
          </div>

          <div v-for="field in section.fields" :key="field.path" class="tg-field">
            <label class="tg-field__label">{{ fieldLabel(field.path, section.id) }}</label>

            <div class="tg-field__style">
              <div class="tg-field__style-control">
                <label>Police</label>
                <select class="form-select form-select-sm" v-model="field.style.font">
                  <option value="">Par défaut ({{ defaultStyleFor(field).font === 'cinzel' ? 'Cinzel' : 'Simonetta' }})</option>
                  <option value="cinzel">Cinzel</option>
                  <option value="simonetta">Simonetta</option>
                </select>
              </div>

              <div class="tg-field__style-control">
                <label>Couleur</label>
                <div class="d-flex align-items-center gap-2">
                  <input
                    type="color"
                    class="form-control form-control-color"
                    title="Choisir une couleur"
                    :value="effectiveColor(field)"
                    @input="field.style.color = $event.target.value"
                  />
                  <input
                    type="text"
                    class="form-control form-control-sm"
                    style="width: 7.5rem"
                    :placeholder="defaultStyleFor(field).color"
                    v-model="field.style.color"
                    @blur="normalizeHex(field)"
                    :class="{ 'is-invalid': field.style.color && !isValidHex(field.style.color) }"
                  />
                  <button
                    v-if="field.style.color"
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="field.style.color = ''"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>

              <div class="tg-field__style-control">
                <label>Taille : {{ Math.round(effectiveSize(field) * 100) }}%</label>
                <div class="d-flex align-items-center gap-2">
                  <input
                    type="range"
                    class="form-range"
                    style="width: 9rem"
                    min="0.6"
                    max="1.8"
                    step="0.05"
                    v-model.number="field.style.size"
                  />
                  <button
                    v-if="field.style.size !== 1"
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="field.style.size = 1"
                  >
                    100%
                  </button>
                </div>
              </div>
            </div>

            <div class="row g-2">
              <div v-for="locale in LOCALES" :key="locale" class="col-12 col-lg-4">
                <div class="small text-muted mb-1">{{ locale.toUpperCase() }}</div>
                <textarea
                  v-if="field.type === 'string'"
                  class="form-control tg-field__textarea"
                  rows="3"
                  v-model="field[locale]"
                  :style="fieldTextStyle(field)"
                  :class="{ 'border-warning': !valuesEqual(field[locale], field[originalKey(locale)]) }"
                ></textarea>
                <textarea
                  v-else
                  class="form-control tg-field__textarea"
                  rows="3"
                  :value="(field[locale] || []).join('\n')"
                  @input="field[locale] = $event.target.value.split('\n')"
                  :style="fieldTextStyle(field)"
                  :class="{ 'border-warning': !valuesEqual(field[locale], field[originalKey(locale)]) }"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="tg-admin-block__actions">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              :disabled="translating === section.id"
              @click="translateSection(section)"
            >
              {{ translating === section.id ? 'Traduction…' : '🌐 Traduire EN → NL/IT' }}
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
        </template>
      </main>
    </div>
  </div>

  <AdminConfirmModal
    v-if="confirmSection"
    :section="confirmSection"
    :changes="pendingChanges"
    :style-changes="pendingStyleChanges"
    @confirmed="onConfirmed"
    @close="confirmSection = null"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AdminConfirmModal from './AdminConfirmModal.vue'
import { fetchLocales, fetchTextStyles, translateFields } from './adminApi'
import { pushToast } from './useToast'
import { getDefaultStyle } from './fieldDefaultStyles'

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/

const SECTION_LABELS = {
  nav: 'Menu de navigation',
  footer: 'Footer',
  home: 'Section principale',
  eventsSection: 'Événements',
  ourStory: 'Notre Histoire',
  ourRums: 'Nos Rhums',
  product: 'Fiche produit (textes communs)',
  recipe: 'Recette (textes communs)',
  contact: 'Formulaire de contact',
  contactForm: 'Champs du formulaire',
  ageGate: "Vérification d'âge",
  __consts__: 'Valeurs partagées',
}

// Sidebar structure: Header/Footer, then one entry per site page. A page can
// combine several underlying locale sections (e.g. "Accueil" = home +
// eventsSection) — each still gets its own "Valider cette section" button.
const NAV_GROUPS = [
  {
    label: 'Composants globaux',
    items: [
      { key: 'nav', label: 'Header (menu)', sectionIds: ['nav'] },
      { key: 'footer', label: 'Footer', sectionIds: ['footer'] },
    ],
  },
  {
    label: 'Pages',
    items: [
      { key: 'home', label: 'Accueil', sectionIds: ['home', 'eventsSection'] },
      { key: 'ourStory', label: 'Notre Histoire', sectionIds: ['ourStory'] },
      { key: 'ourRums', label: 'Nos Rhums', sectionIds: ['ourRums'] },
      { key: 'product', label: 'Fiche Produit', sectionIds: ['product'] },
      { key: 'recipe', label: 'Recette Cocktail', sectionIds: ['recipe'] },
      { key: 'contact', label: 'Contact', sectionIds: ['contact', 'contactForm'] },
      { key: 'ageGate', label: "Vérification d'âge", sectionIds: ['ageGate'] },
    ],
  },
]

// Sections for individual products/cocktails/events (e.g. `data.products.toaka-608`)
// aren't known in advance — grouped dynamically once the content loads.
const DYNAMIC_GROUPS = [
  { prefix: 'data.products.', label: 'Produits' },
  { prefix: 'data.cocktails.', label: 'Cocktails' },
  { prefix: 'data.events.', label: 'Événements' },
]

const emit = defineEmits(['close'])

// FR temporarily left out of the editor (site's language switcher has it disabled too — see src/i18n.js).
const LOCALES = ['en', 'nl', 'it']
const TARGET_LOCALES = LOCALES.filter((locale) => locale !== 'en')

const loading = ref(true)
const loadError = ref('')
const sections = ref([])
const activeKey = ref(null)
const translating = ref(null)
const confirmSection = ref(null)
const pendingChanges = ref(null)
const pendingStyleChanges = ref(null)

function originalKey(locale) {
  return `original${locale[0].toUpperCase()}${locale.slice(1)}`
}

function sectionLabel(id) {
  return SECTION_LABELS[id] || id.split('.').join(' › ')
}

function fieldLabel(fieldPath, sectionId) {
  return fieldPath.startsWith(`${sectionId}.`) ? fieldPath.slice(sectionId.length + 1) : fieldPath
}

function dynamicItemLabel(section) {
  const nameField = section.fields.find((f) => ['shortName', 'title', 'name'].includes(fieldLabel(f.path, section.id)))
  return nameField?.en || section.id.split('.').pop()
}

const navGroups = computed(() => {
  const bySectionId = new Map(sections.value.map((s) => [s.id, s]))
  const groups = []

  for (const group of NAV_GROUPS) {
    const items = group.items
      .map((item) => ({
        key: item.key,
        label: item.label,
        sections: item.sectionIds.map((id) => bySectionId.get(id)).filter(Boolean),
      }))
      .filter((item) => item.sections.length > 0)
    if (items.length) groups.push({ label: group.label, items })
  }

  for (const { prefix, label } of DYNAMIC_GROUPS) {
    const matched = sections.value.filter((s) => s.id.startsWith(prefix))
    if (!matched.length) continue
    groups.push({
      label,
      items: matched.map((s) => ({ key: s.id, label: dynamicItemLabel(s), sections: [s] })),
    })
  }

  const mappedIds = new Set(groups.flatMap((g) => g.items.flatMap((i) => i.sections.map((s) => s.id))))
  const leftover = sections.value.filter((s) => !mappedIds.has(s.id))
  if (leftover.length) {
    groups.push({
      label: 'Autres',
      items: leftover.map((s) => ({ key: s.id, label: sectionLabel(s.id), sections: [s] })),
    })
  }

  return groups
})

const activeItem = computed(() => {
  for (const group of navGroups.value) {
    const found = group.items.find((i) => i.key === activeKey.value)
    if (found) return found
  }
  return null
})

function itemDirty(item) {
  return item.sections.some((s) => sectionDirty(s))
}

function valuesEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

function isValidHex(value) {
  return HEX_COLOR_RE.test(value || '')
}

function normalizeHex(field) {
  const value = (field.style.color || '').trim()
  field.style.color = value && !value.startsWith('#') ? `#${value}` : value
}

function defaultStyleFor(field) {
  return getDefaultStyle(field.path)
}

function effectiveFont(field) {
  return field.style.font || defaultStyleFor(field).font
}

function effectiveColor(field) {
  return isValidHex(field.style.color) ? field.style.color : defaultStyleFor(field).color
}

function effectiveSize(field) {
  return field.style.size || 1
}

function luminance(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16) / 255
  const g = parseInt(c.slice(2, 4), 16) / 255
  const b = parseInt(c.slice(4, 6), 16) / 255
  const lin = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function backgroundFor(color) {
  return isValidHex(color) && luminance(color) > 0.5 ? '#2a2118' : '#f7ecd9'
}

function fieldTextStyle(field) {
  const color = effectiveColor(field)
  return {
    fontFamily: `var(--font-${effectiveFont(field)})`,
    color,
    fontSize: `${effectiveSize(field)}em`,
    background: backgroundFor(color),
  }
}

function styleEqual(a, b) {
  const sizeA = Math.round((a?.size || 1) * 100)
  const sizeB = Math.round((b?.size || 1) * 100)
  return (a?.font || '') === (b?.font || '') && (a?.color || '') === (b?.color || '') && sizeA === sizeB
}

function fieldStyleDirty(field) {
  return !styleEqual(field.style, field.originalStyle)
}

function sectionDirty(section) {
  return section.fields.some(
    (f) => LOCALES.some((locale) => !valuesEqual(f[locale], f[originalKey(locale)])) || fieldStyleDirty(f),
  )
}

async function load() {
  loading.value = true
  loadError.value = ''
  try {
    const [data, styleData] = await Promise.all([fetchLocales(), fetchTextStyles()])
    const styles = styleData.styles || {}
    sections.value = data.sections.map((section) => ({
      id: section.id,
      fields: section.fields.map((field) => {
        const savedStyle = styles[field.path] || {}
        const style = { font: savedStyle.font || '', color: savedStyle.color || '', size: savedStyle.size || 1 }
        return {
          path: field.path,
          type: field.type,
          en: field.values.en,
          fr: field.values.fr,
          nl: field.values.nl,
          it: field.values.it,
          originalEn: field.values.en,
          originalFr: field.values.fr,
          originalNl: field.values.nl,
          originalIt: field.values.it,
          style,
          originalStyle: { ...style },
        }
      }),
    }))
    if (!activeKey.value) {
      activeKey.value = navGroups.value[0]?.items[0]?.key ?? null
    }
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
  const changes = { en: {}, fr: {}, nl: {}, it: {} }
  const styleChanges = {}
  for (const field of section.fields) {
    for (const locale of LOCALES) {
      const cleaned = cleanValue(field, locale)
      if (!valuesEqual(cleaned, field[originalKey(locale)])) {
        changes[locale][field.path] = cleaned
      }
    }
    if (fieldStyleDirty(field)) {
      const font = field.style.font || null
      const color = isValidHex(field.style.color) ? field.style.color : null
      const size = field.style.size && Math.abs(field.style.size - 1) > 0.001 ? field.style.size : null
      styleChanges[field.path] = font || color || size ? { font, color, size } : null
    }
  }
  pendingChanges.value = changes
  pendingStyleChanges.value = styleChanges
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
    field.originalStyle = { ...field.style }
  }
  confirmSection.value = null
  pushToast('Modifications publiées ✅')
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
.tg-admin-page {
  --tg-bg: #f7ecd9;
  --tg-bg-soft: #efe0c0;
  --tg-border: rgba(58, 46, 34, 0.18);
  --tg-text: #3a2e22;
  --tg-accent: #a86b33;

  position: fixed;
  inset: 0;
  z-index: 2050;
  background: var(--tg-bg);
  display: flex;
  flex-direction: column;
  color: var(--tg-text);
}

.tg-admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.5rem;
  background: #fffaf0;
  border-bottom: 1px solid var(--tg-border);
  flex: 0 0 auto;
}

.tg-admin-topbar__brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.tg-admin-topbar__logo {
  height: 42px;
  width: auto;
  object-fit: contain;
}

.tg-admin-topbar__title {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--tg-text);
}

.tg-admin-topbar__subtitle {
  font-size: 0.8rem;
  color: rgba(58, 46, 34, 0.65);
}

.tg-admin-layout {
  flex: 1 1 auto;
  display: flex;
  min-height: 0;
}

.tg-admin-sidebar {
  flex: 0 0 15rem;
  overflow-y: auto;
  background: var(--tg-bg-soft);
  border-right: 1px solid var(--tg-border);
  padding: 1rem 0.75rem;
}

.tg-admin-sidebar__group {
  margin-bottom: 1.25rem;
}

.tg-admin-sidebar__group-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(58, 46, 34, 0.55);
  padding: 0 0.6rem;
  margin-bottom: 0.4rem;
}

.tg-admin-sidebar__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 0.4rem;
  padding: 0.5rem 0.6rem;
  font-size: 0.88rem;
  color: var(--tg-text);
  transition: background 0.15s ease, color 0.15s ease;
}

.tg-admin-sidebar__item:hover {
  background: rgba(168, 107, 51, 0.14);
}

.tg-admin-sidebar__item--active {
  background: var(--tg-accent);
  color: #fff8ec;
  font-weight: 600;
}

.tg-admin-sidebar__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c0392b;
  flex: 0 0 auto;
}

.tg-admin-content {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1.5rem 2rem 3rem;
}

.tg-admin-block {
  background: #fffaf0;
  border: 1px solid var(--tg-border);
  border-radius: 0.6rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.tg-admin-block__header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--tg-text);
  margin-bottom: 1rem;
}

.tg-field {
  margin-bottom: 1.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px dashed var(--tg-border);
}

.tg-field:last-of-type {
  border-bottom: none;
}

.tg-field__label {
  display: block;
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(58, 46, 34, 0.6);
  margin-bottom: 0.5rem;
}

.tg-field__style {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: rgba(168, 107, 51, 0.08);
  border-radius: 0.4rem;
}

.tg-field__style-control label {
  display: block;
  font-size: 0.75rem;
  color: rgba(58, 46, 34, 0.65);
  margin-bottom: 0.2rem;
}

.tg-field__textarea {
  border-color: var(--tg-border);
  transition: background 0.15s ease, color 0.15s ease;
}

.tg-admin-block__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--tg-border);
  padding-top: 1rem;
}

@media (max-width: 767.98px) {
  .tg-admin-layout {
    flex-direction: column;
  }
  .tg-admin-sidebar {
    flex: 0 0 auto;
    max-height: 40vh;
    border-right: none;
    border-bottom: 1px solid var(--tg-border);
  }
}
</style>
