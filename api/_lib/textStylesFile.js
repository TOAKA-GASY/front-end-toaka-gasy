const STYLE_FILE_PATH = 'src/data/textStyles.json'
const FONT_VALUES = new Set(['cinzel', 'simonetta'])
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/

export function styleFilePath() {
  return STYLE_FILE_PATH
}

export function parseTextStyles(sourceText) {
  if (!sourceText || !sourceText.trim()) return {}
  const data = JSON.parse(sourceText)
  return data && typeof data === 'object' ? data : {}
}

function sanitizeStyle(style) {
  if (!style || typeof style !== 'object') return null
  const out = {}
  if (FONT_VALUES.has(style.font)) out.font = style.font
  if (typeof style.color === 'string' && HEX_COLOR_RE.test(style.color)) out.color = style.color
  return Object.keys(out).length > 0 ? out : null
}

/**
 * Merges `{ path: style|null }` edits into the current style map. A field
 * whose style sanitizes to nothing (no valid font/color left) is removed
 * entirely, so "reset to default" cleans up the JSON file instead of leaving
 * empty entries behind.
 */
export function applyTextStyleEdits(current, edits) {
  const next = { ...current }
  for (const [path, style] of Object.entries(edits)) {
    const sanitized = sanitizeStyle(style)
    if (sanitized) next[path] = sanitized
    else delete next[path]
  }
  return next
}

export function serializeTextStyles(map) {
  const sorted = {}
  for (const key of Object.keys(map).sort()) sorted[key] = map[key]
  return `${JSON.stringify(sorted, null, 2)}\n`
}
