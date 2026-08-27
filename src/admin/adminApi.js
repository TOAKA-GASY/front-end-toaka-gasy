import { adminSession, clearSession } from './adminSession'

async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(adminSession.token ? { Authorization: `Bearer ${adminSession.token}` } : {}),
      ...(options.headers || {}),
    },
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    // no/invalid JSON body
  }

  if (res.status === 401) clearSession()

  if (!res.ok) {
    throw new Error(data?.error || `La requête a échoué (${res.status})`)
  }

  return data
}

export function login(code) {
  return request('/api/admin/login', { method: 'POST', body: JSON.stringify({ code }) })
}

export function fetchLocales() {
  return request('/api/admin/locales', { method: 'GET' })
}

export function translateFields(fields, targetLocales) {
  return request('/api/admin/translate', { method: 'POST', body: JSON.stringify({ fields, targetLocales }) })
}

export function commitSection(section, changes, code) {
  return request('/api/admin/commit', { method: 'POST', body: JSON.stringify({ section, changes, code }) })
}
