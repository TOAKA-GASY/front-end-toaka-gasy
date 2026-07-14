import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { products } from '@/data/products'
import { cocktails } from '@/data/cocktails'
import { events } from '@/data/events'

function mergeLocalized(structuralList, messageKey, tm) {
  const translations = tm(messageKey) || {}
  return structuralList.map((item) => ({
    ...item,
    ...(translations[item.slug ?? item.id] || {}),
  }))
}

export function useLocalizedProducts() {
  const { tm } = useI18n()
  return computed(() => mergeLocalized(products, 'data.products', tm))
}

export function useLocalizedCocktails() {
  const { tm } = useI18n()
  return computed(() => mergeLocalized(cocktails, 'data.cocktails', tm))
}

export function useLocalizedEvents() {
  const { tm } = useI18n()
  return computed(() => mergeLocalized(events, 'data.events', tm))
}
