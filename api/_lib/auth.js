import crypto from 'node:crypto'

const SESSION_TTL_MS = 30 * 60 * 1000

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest()
}

/** Constant-time comparison, hashed first so length itself never leaks via timing. */
export function verifyAccessCode(submitted) {
  const expected = process.env.ADMIN_ACCESS_CODE || ''
  if (!expected) return false
  return crypto.timingSafeEqual(sha256(submitted), sha256(expected))
}

function hmac(data) {
  const secret = process.env.ADMIN_SESSION_SECRET || ''
  return crypto.createHmac('sha256', secret).update(data).digest('base64url')
}

/** Stateless signed session token — no DB, fits a serverless deployment with no backend. */
export function createSessionToken() {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const payloadB64 = Buffer.from(JSON.stringify({ exp: expiresAt })).toString('base64url')
  const signature = hmac(payloadB64)
  return { token: `${payloadB64}.${signature}`, expiresAt }
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payloadB64, signature] = parts

  const expectedSignature = hmac(payloadB64)
  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expectedSignature)
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false
  }

  let payload
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'))
  } catch {
    return false
  }

  return Number.isFinite(payload.exp) && Date.now() < payload.exp
}

export function extractBearerToken(req) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return null
  return header.slice(7).trim()
}

/** Call at the top of any protected handler; returns false (and has already responded) if unauthorized. */
export function requireSession(req, res) {
  if (!verifySessionToken(extractBearerToken(req))) {
    res.status(401).json({ error: 'Session invalide ou expirée' })
    return false
  }
  return true
}
