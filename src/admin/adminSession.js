import { reactive } from 'vue'

const STORAGE_KEY = 'tg_admin_session'

export const adminSession = reactive({
  token: null,
  expiresAt: null,
})

function load() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const { token, expiresAt } = JSON.parse(raw)
    if (token && Number.isFinite(expiresAt) && Date.now() < expiresAt) {
      adminSession.token = token
      adminSession.expiresAt = expiresAt
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // corrupted/unavailable storage — start logged out, no crash
  }
}

load()

export function setSession(token, expiresAt) {
  adminSession.token = token
  adminSession.expiresAt = expiresAt
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ token, expiresAt }))
  } catch {
    // session still works in-memory for this page load
  }
}

export function clearSession() {
  adminSession.token = null
  adminSession.expiresAt = null
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function isSessionActive() {
  return !!adminSession.token && Number.isFinite(adminSession.expiresAt) && Date.now() < adminSession.expiresAt
}
