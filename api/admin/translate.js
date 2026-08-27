import { requireSession } from '../_lib/auth.js'

const DEEPL_TARGET_LANG = { fr: 'FR', nl: 'NL' }

async function deeplTranslate(texts, targetLang) {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey) throw new Error('DEEPL_API_KEY is not configured')

  // Free-tier keys end with ":fx" and use a different host than paid Pro keys.
  const host = apiKey.endsWith(':fx') ? 'api-free.deepl.com' : 'api.deepl.com'

  const res = await fetch(`https://${host}/v2/translate`, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: texts, source_lang: 'EN', target_lang: targetLang }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`DeepL request failed: ${res.status} ${body}`)
  }

  const data = await res.json()
  return data.translations.map((t) => t.text)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!requireSession(req, res)) return

  const { fields, targetLocales } = req.body || {}
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
    res.status(400).json({ error: 'Missing fields' })
    return
  }

  const targets = (Array.isArray(targetLocales) && targetLocales.length ? targetLocales : ['fr', 'nl']).filter(
    (locale) => DEEPL_TARGET_LANG[locale],
  )
  const paths = Object.keys(fields)
  const texts = paths.map((p) => String(fields[p] ?? ''))

  if (paths.length === 0 || targets.length === 0) {
    res.status(200).json({ translations: {} })
    return
  }

  try {
    const translations = {}
    for (const locale of targets) {
      const translated = await deeplTranslate(texts, DEEPL_TARGET_LANG[locale])
      translations[locale] = Object.fromEntries(paths.map((p, i) => [p, translated[i]]))
    }
    res.status(200).json({ translations })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
