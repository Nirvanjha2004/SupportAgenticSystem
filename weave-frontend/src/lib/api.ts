import { useAppStore } from '../store/useAppStore'

const API_BASE = 'http://localhost:8000'

export async function apiFetch(path: string, opts?: RequestInit) {
  const token = useAppStore.getState().token

  const headers = new Headers(opts?.headers)

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  return res.json()
}
