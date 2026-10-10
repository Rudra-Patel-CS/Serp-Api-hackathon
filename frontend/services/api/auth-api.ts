import { apiFetch } from './client'

export async function loginApi(payload: { identifier: string; password: string; selectedRole: string }) {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (res.success && res.data?.token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('krishi_token', res.data.token)
      localStorage.setItem('krishi_user', JSON.stringify(res.data.user))
    }
  }
  return res
}

export async function registerApi(payload: any) {
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (res.success && res.data?.token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('krishi_token', res.data.token)
      localStorage.setItem('krishi_user', JSON.stringify(res.data.user))
    }
  }
  return res
}

export async function getMeApi() {
  return await apiFetch('/api/auth/me', { method: 'GET' })
}

export async function logoutApi() {
  const res = await apiFetch('/api/auth/logout', { method: 'POST' })
  if (typeof window !== 'undefined') {
    localStorage.removeItem('krishi_token')
    localStorage.removeItem('krishi_user')
    localStorage.removeItem('krishi_selected_role')
  }
  return res
}
