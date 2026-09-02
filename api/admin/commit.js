import { requireSession, verifyAccessCode } from '../_lib/auth.js'
import { getFileText, commitFiles } from '../_lib/github.js'
import { applyLocaleEdits } from '../_lib/localeAst.js'

// FR temporarily left out of the editor (site's language switcher has it disabled too).
const LOCALES = ['en', 'nl', 'it']

function localePath(locale) {
  return `src/locales/${locale}.js`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!requireSession(req, res)) return

  const { section, changes, code } = req.body || {}

  // Second factor: re-checked here, independently of the session token that
  // only proves the editor was unlocked earlier — this is the "double security"
  // gate that guards the actual publish action.
  if (!code || typeof code !== 'string' || !verifyAccessCode(code)) {
    res.status(401).json({ error: 'Code de confirmation invalide' })
    return
  }

  if (!section || typeof section !== 'string' || !changes || typeof changes !== 'object') {
    res.status(400).json({ error: 'Requête invalide' })
    return
  }

  const localesToPatch = LOCALES.filter(
    (locale) => changes[locale] && typeof changes[locale] === 'object' && Object.keys(changes[locale]).length > 0,
  )

  if (localesToPatch.length === 0) {
    res.status(200).json({ skipped: true, message: 'Aucun changement à publier' })
    return
  }

  try {
    const files = []
    for (const locale of localesToPatch) {
      const path = localePath(locale)
      const currentText = await getFileText(path)
      const edits = Object.entries(changes[locale]).map(([fieldPath, value]) => ({ path: fieldPath, value }))
      const patchedText = applyLocaleEdits(currentText, edits)
      files.push({ path, content: patchedText })
    }

    const commit = await commitFiles(files, `chore(i18n): update ${section} via admin editor`)
    res.status(200).json({ commitSha: commit.sha, commitUrl: commit.html_url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
