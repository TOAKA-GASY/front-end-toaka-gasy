import textStyles from '../data/textStyles.json'

const FONT_VARS = {
  cinzel: 'var(--font-cinzel)',
  simonetta: 'var(--font-simonetta)',
}

export function getTextStyle(path) {
  return (path && textStyles[path]) || null
}

// Elements with a size override, so a resize event can recompute their scale
// against the (responsive, clamp()-based) size the stylesheet would produce.
const scaledElements = new Set()

function rescale(el) {
  const scale = Number(el.dataset.tgFsScale)
  if (!scale) return
  el.style.fontSize = ''
  const naturalPx = parseFloat(window.getComputedStyle(el).fontSize)
  if (Number.isFinite(naturalPx)) el.style.fontSize = `${naturalPx * scale}px`
}

let resizeTimer = null
function onWindowResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => scaledElements.forEach(rescale), 120)
}
if (typeof window !== 'undefined') {
  window.addEventListener('resize', onWindowResize)
}

function applyFieldStyle(el, path) {
  const style = getTextStyle(path)
  el.style.fontFamily = style?.font ? FONT_VARS[style.font] : ''
  el.style.color = style?.color || ''

  if (style?.size && style.size !== 1) {
    el.dataset.tgFsScale = String(style.size)
    scaledElements.add(el)
    rescale(el)
  } else {
    delete el.dataset.tgFsScale
    el.style.fontSize = ''
    scaledElements.delete(el)
  }
}

/**
 * `v-field-style="'home.s2Title'"` on the element that renders an editable
 * field applies the font/color/size chosen for that field in the admin
 * editor. Bundled at build time from `src/data/textStyles.json`, same as
 * locale text. Size is a multiplier (not a fixed px) recomputed against the
 * element's own responsive (clamp()) size on every resize, so it stays
 * responsive instead of freezing the font at one viewport's size.
 */
export const fieldStyleDirective = {
  mounted(el, binding) {
    applyFieldStyle(el, binding.value)
  },
  updated(el, binding) {
    applyFieldStyle(el, binding.value)
  },
  unmounted(el) {
    scaledElements.delete(el)
  },
}
