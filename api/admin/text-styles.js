import { requireSession } from '../_lib/auth.js'
import { getFileText } from '../_lib/github.js'
import { parseTextStyles, styleFilePath } from '../_lib/textStylesFile.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!requireSession(req, res)) return

  try {
    const text = await getFileText(styleFilePath())
    res.status(200).json({ styles: parseTextStyles(text) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
