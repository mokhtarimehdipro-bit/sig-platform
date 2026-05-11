import type { Session } from './gas'

const KEY = 'sig_session'

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

export function setSession(s: Session): void {
  sessionStorage.setItem(KEY, JSON.stringify(s))
}

export function clearSession(): void {
  sessionStorage.removeItem(KEY)
}
