import { requireSession } from '../_lib/auth.js'
import { getFileText } from '../_lib/github.js'
import { parseLocaleSource, flattenLeaves } from '../_lib/localeAst.js'
import { collectSections } from '../_lib/sectionize.js'

// FR temporarily left out of the editor (site's language switcher has it disabled too).
const LOCALES = ['en', 'nl', 'it']

function localePath(locale) {
  return `src/locales/${locale}.js`
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!requireSession(req, res)) return

  try {
    const texts = await Promise.all(LOCALES.map((locale) => getFileText(localePath(locale))))
    const parsedByLocale = {}
    for (let i = 0; i < LOCALES.length; i++) {
      parsedByLocale[LOCALES[i]] = parseLocaleSource(texts[i])
    }

    // The English file is the source of truth for which sections/fields exist;
    // fr/nl/it are expected to mirror its structure and are merged in by path.
    const en = parsedByLocale.en
    const constsNode = { type: 'object', path: '__consts__', children: en.consts }
    const sectionNodes = [...collectSections(en.tree), ...collectSections(constsNode)]

    const valuesByLocale = {}
    for (const locale of LOCALES) {
      const { tree, consts } = parsedByLocale[locale]
      const leaves = flattenLeaves(tree)
      for (const [name, node] of Object.entries(consts)) leaves.set(name, node)
      valuesByLocale[locale] = leaves
    }

    const sections = sectionNodes.map((sectionNode) => {
      const fieldLeaves = flattenLeaves(sectionNode)
      return {
        id: sectionNode.path,
        fields: Array.from(fieldLeaves.values()).map((leaf) => ({
          path: leaf.path,
          type: leaf.leafType,
          values: Object.fromEntries(
            LOCALES.map((locale) => [locale, valuesByLocale[locale].get(leaf.path)?.value ?? null]),
          ),
        })),
      }
    })

    res.status(200).json({ sections })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
