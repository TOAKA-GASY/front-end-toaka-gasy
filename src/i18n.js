import { createI18n } from 'vue-i18n'
import en from '@/locales/en'
import fr from '@/locales/fr'
import nl from '@/locales/nl'

export const SUPPORTED_LOCALES = ['en', 'fr', 'nl']
export const DEFAULT_LOCALE = 'en'
const STORAGE_KEY = 'tg-locale'

function readStoredLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return SUPPORTED_LOCALES.includes(stored) ? stored : null
  } catch {
    return null
  }
}

function writeStoredLocale(locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* localStorage unavailable (private browsing, etc.) — locale just won't persist */
  }
}

/**
 * Priority: URL locale prefix > stored preference > browser language > English.
 * Landing on a /fr or /nl URL always wins and re-syncs the stored preference,
 * so a shared/bookmarked link is never silently overridden.
 */
function resolveInitialLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  const pathLocale = window.location.pathname.match(/^\/(fr|nl)(\/|$)/)?.[1]
  if (pathLocale) {
    writeStoredLocale(pathLocale)
    return pathLocale
  }

  const stored = readStoredLocale()
  if (stored) return stored

  const browserLang = (navigator.language || '').slice(0, 2).toLowerCase()
  if (browserLang === 'fr' || browserLang === 'nl') {
    writeStoredLocale(browserLang)
    return browserLang
  }

  return DEFAULT_LOCALE
}

export const initialLocale = resolveInitialLocale()

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { en, fr, nl },
})

export function getActiveLocale() {
  return i18n.global.locale.value
}

export function setActiveLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return
  i18n.global.locale.value = locale
  document.documentElement.lang = locale
  writeStoredLocale(locale)
}
