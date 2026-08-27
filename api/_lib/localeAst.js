import * as acorn from 'acorn'

const ACORN_OPTIONS = { ecmaVersion: 2022, sourceType: 'module' }

function propertyKeyName(prop) {
  if (prop.computed) return null
  if (prop.key.type === 'Identifier') return prop.key.name
  if (prop.key.type === 'Literal' && typeof prop.key.value === 'string') return prop.key.value
  return null
}

function isStringArrayExpression(node) {
  return (
    node.type === 'ArrayExpression' &&
    node.elements.length > 0 &&
    node.elements.every((el) => el && el.type === 'Literal' && typeof el.value === 'string')
  )
}

function buildObjectNode(objectExpr, path) {
  const children = {}
  for (const prop of objectExpr.properties) {
    if (prop.type !== 'Property') continue
    const key = propertyKeyName(prop)
    if (key == null) continue
    const childPath = path ? `${path}.${key}` : key
    const value = prop.value

    if (value.type === 'Literal' && typeof value.value === 'string') {
      children[key] = { type: 'leaf', leafType: 'string', path: childPath, value: value.value, start: value.start, end: value.end }
    } else if (isStringArrayExpression(value)) {
      children[key] = {
        type: 'leaf',
        leafType: 'stringArray',
        path: childPath,
        value: value.elements.map((el) => el.value),
        start: value.start,
        end: value.end,
      }
    } else if (value.type === 'ObjectExpression') {
      children[key] = buildObjectNode(value, childPath)
    }
    // Anything else (null literal, Identifier reference, number, etc.) is intentionally
    // left out of the model: this editor only ever touches existing string/string-array leaves.
  }
  return { type: 'object', path, children }
}

/**
 * Parses a `src/locales/*.js` file into:
 * - `tree`: the nested {type:'object'|'leaf', ...} shape of the exported object
 * - `consts`: top-level `const NAME = '...'` string declarations, keyed by name
 */
export function parseLocaleSource(sourceText) {
  const ast = acorn.parse(sourceText, ACORN_OPTIONS)

  const consts = {}
  for (const node of ast.body) {
    if (node.type !== 'VariableDeclaration') continue
    for (const decl of node.declarations) {
      if (decl.id?.type === 'Identifier' && decl.init?.type === 'Literal' && typeof decl.init.value === 'string') {
        consts[decl.id.name] = {
          type: 'leaf',
          leafType: 'string',
          path: decl.id.name,
          value: decl.init.value,
          start: decl.init.start,
          end: decl.init.end,
        }
      }
    }
  }

  const exportNode = ast.body.find((node) => node.type === 'ExportDefaultDeclaration')
  if (!exportNode || exportNode.declaration.type !== 'ObjectExpression') {
    throw new Error('Unsupported locale file format: expected `export default { ... }`')
  }

  const tree = buildObjectNode(exportNode.declaration, '')
  return { tree, consts }
}

export function flattenLeaves(node, out = new Map()) {
  if (node.type === 'leaf') {
    out.set(node.path, node)
  } else {
    for (const child of Object.values(node.children)) flattenLeaves(child, out)
  }
  return out
}

function detectQuoteChar(sourceText, start) {
  const ch = sourceText[start]
  return ch === '"' || ch === "'" ? ch : "'"
}

function escapeStringForQuote(str, quoteChar) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(new RegExp(quoteChar, 'g'), `\\${quoteChar}`)
    .replace(/\r\n|\r|\n/g, '\\n')
}

function formatStringLiteral(str, quoteChar) {
  return `${quoteChar}${escapeStringForQuote(str, quoteChar)}${quoteChar}`
}

function lineIndent(sourceText, offset) {
  const lineStart = sourceText.lastIndexOf('\n', offset - 1) + 1
  return /^[ \t]*/.exec(sourceText.slice(lineStart))[0]
}

function formatStringArray(values, baseIndent) {
  const itemIndent = `${baseIndent}  `
  const items = values.map((v) => `${itemIndent}${formatStringLiteral(v, "'")}`).join(',\n')
  return `[\n${items},\n${baseIndent}]`
}

/**
 * Applies `{ path, value }` edits to `sourceText` by splicing only the exact
 * source ranges of the targeted string/string-array literals — everything
 * else in the file (formatting, comments, unrelated content) is untouched.
 * Re-parses the result as a safety net; throws rather than returning
 * possibly-broken JS if anything looks wrong.
 */
export function applyLocaleEdits(sourceText, edits) {
  const { tree, consts } = parseLocaleSource(sourceText)
  const leafMap = flattenLeaves(tree)
  for (const [name, node] of Object.entries(consts)) leafMap.set(name, node)

  const splices = []
  for (const edit of edits) {
    const info = leafMap.get(edit.path)
    if (!info) continue

    if (info.leafType === 'string' && typeof edit.value === 'string') {
      const quoteChar = detectQuoteChar(sourceText, info.start)
      splices.push({ start: info.start, end: info.end, text: formatStringLiteral(edit.value, quoteChar) })
    } else if (info.leafType === 'stringArray' && Array.isArray(edit.value) && edit.value.every((v) => typeof v === 'string')) {
      const baseIndent = lineIndent(sourceText, info.start)
      splices.push({ start: info.start, end: info.end, text: formatStringArray(edit.value, baseIndent) })
    }
    // Mismatched types (e.g. client sends an array for a plain string leaf) are silently skipped.
  }

  splices.sort((a, b) => b.start - a.start)

  let patched = sourceText
  for (const splice of splices) {
    patched = patched.slice(0, splice.start) + splice.text + patched.slice(splice.end)
  }

  acorn.parse(patched, ACORN_OPTIONS)

  return patched
}
