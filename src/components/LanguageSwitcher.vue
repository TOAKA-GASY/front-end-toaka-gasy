<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setActiveLocale, SUPPORTED_LOCALES } from '@/i18n'

const LABELS = { en: 'ENG', fr: 'FR', nl: 'NL' }

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

const open = ref(false)
const rootEl = ref(null)

function baseRouteName(name) {
  return String(name).replace(/-(fr|nl)$/, '')
}

function selectLocale(targetLocale) {
  open.value = false
  if (targetLocale === locale.value) return
  const base = baseRouteName(route.name)
  const name = targetLocale === 'en' ? base : `${base}-${targetLocale}`
  setActiveLocale(targetLocale)
  router.push({ name, params: route.params, query: route.query, hash: route.hash })
}

function onClickOutside(event) {
  if (rootEl.value && !rootEl.value.contains(event.target)) open.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="lang-switcher" ref="rootEl">
    <button
      type="button"
      class="lang-switcher__trigger"
      @click="open = !open"
      :aria-expanded="open"
      aria-haspopup="listbox"
      aria-label="Language"
    >
      <svg class="lang-switcher__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12a15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span>{{ LABELS[locale] }}</span>
    </button>

    <ul v-if="open" class="lang-switcher__menu" role="listbox">
      <li v-for="code in SUPPORTED_LOCALES" :key="code" role="option" :aria-selected="locale === code">
        <button
          type="button"
          class="lang-switcher__option"
          :class="{ 'lang-switcher__option--active': locale === code }"
          @click="selectLocale(code)"
        >{{ LABELS[code] }}</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.lang-switcher {
  position: fixed;
  z-index: 500;
  top: 2.2rem;
  right: 1.25rem;
  transform: translateY(-50%);
}

.lang-switcher__trigger {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  box-shadow: none;
  padding: 0.5rem 0.25rem;
  margin: -0.5rem -0.25rem;
  color: #69431D;
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: clamp(0.75rem, 1vw, 1rem);
  line-height: 1;
  letter-spacing: 0.1em;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.lang-switcher__icon {
  width: 17px;
  height: 17px;
  color: #69431D;
  flex-shrink: 0;
  pointer-events: none;
}

.lang-switcher__menu {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  list-style: none;
  margin: 0;
  padding: 0.4rem 0;
  min-width: 100px;
  background: #F5EADB;
  border: 1px solid rgba(105, 67, 29, 0.2);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

.lang-switcher__option {
  display: block;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  padding: 0.5rem 1rem;
  color: #69431D;
  font-family: var(--font-cinzel);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background 0.15s ease;
}

.lang-switcher__option:hover {
  background: rgba(105, 67, 29, 0.1);
}

.lang-switcher__option--active {
  background: rgba(105, 67, 29, 0.16);
}

@media (min-width: 768px) {
  .lang-switcher {
    top: 3.2rem;
    right: 4rem;
  }
}
</style>
