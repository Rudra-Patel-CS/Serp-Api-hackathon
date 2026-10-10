const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: { code: string; message: string } }> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('krishi_token') : null

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    const result = await response.json()
    return result
  } catch (error: any) {
    console.error(`API Fetch Error [${endpoint}]:`, error)
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Could not connect to KrishiIntel backend service.',
      },
    }
  }
}
