import textStyles from '../data/textStyles.json'

const FONT_VARS = {
  cinzel: 'var(--font-cinzel)',
  simonetta: 'var(--font-simonetta)',
}

export function getTextStyle(path) {
  return (path && textStyles[path]) || null
}

function applyFieldStyle(el, path) {
  const style = getTextStyle(path)
  el.style.fontFamily = style?.font ? FONT_VARS[style.font] : ''
  el.style.color = style?.color || ''
}

/**
 * `v-field-style="'home.s2Title'"` on the element that renders an editable
 * field applies the font/color chosen for that field in the admin editor.
 * Bundled at build time from `src/data/textStyles.json`, same as locale text.
 */
export const fieldStyleDirective = {
  mounted(el, binding) {
    applyFieldStyle(el, binding.value)
  },
  updated(el, binding) {
    applyFieldStyle(el, binding.value)
  },
}
