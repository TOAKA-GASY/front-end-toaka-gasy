import { verifyAccessCode, createSessionToken } from '../_lib/auth.js'

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { code } = req.body || {}

  if (!code || typeof code !== 'string' || !verifyAccessCode(code)) {
    await delay(400) // slows down brute-force attempts; no persistent rate limiting in a stateless serverless setup
    res.status(401).json({ error: 'Code invalide' })
    return
  }

  const { token, expiresAt } = createSessionToken()
  res.status(200).json({ token, expiresAt })
}
