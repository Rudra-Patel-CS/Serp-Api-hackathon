import { serpapiConfig } from './serpapi.config'

interface CacheEntry<T> {
  data: T
  cachedAt: number
  expiresAt: number
}

const memoryCache = new Map<string, CacheEntry<any>>()

export function getCacheKey(engine: string, query: string, location?: string): string {
  return `${engine}:${query.toLowerCase().trim()}:${(location || 'default').toLowerCase().trim()}`
}

export function getCachedResult<T>(key: string): { hit: boolean; data?: T; isExpired?: boolean } {
  const entry = memoryCache.get(key)
  if (!entry) {
    return { hit: false }
  }

  const now = Date.now()
  if (now > entry.expiresAt) {
    memoryCache.delete(key)
    return { hit: false, isExpired: true }
  }

  return { hit: true, data: entry.data as T }
}

export function setCachedResult<T>(key: string, data: T, ttlSeconds: number = serpapiConfig.cacheTtlSeconds): void {
  const now = Date.now()
  memoryCache.set(key, {
    data,
    cachedAt: now,
    expiresAt: now + ttlSeconds * 1000,
  })
}

export function clearCache(): void {
  memoryCache.clear()
}
