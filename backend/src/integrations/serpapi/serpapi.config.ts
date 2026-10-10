import { config as appConfig } from '../../config'

export const serpapiConfig = {
  apiKey: process.env.SERPAPI_KEY || appConfig.serpapiKey || '',
  enabled: process.env.SERPAPI_ENABLED ? process.env.SERPAPI_ENABLED === 'true' : true,
  timeoutMs: parseInt(process.env.SERPAPI_TIMEOUT_MS || '10000', 10),
  cacheTtlSeconds: parseInt(process.env.SERPAPI_CACHE_TTL_SECONDS || '1800', 10), // 30 mins
  maxRetries: 2,
  retryDelayMs: 1000,
  baseUrl: 'https://serpapi.com/search.json',
  locationDefault: 'Gujarat, India',
  countryDefault: 'in',
  languageDefault: 'en',
}
