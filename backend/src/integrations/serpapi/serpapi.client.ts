import { serpapiConfig } from './serpapi.config'
import { SerpApiSearchRequestParams, SerpApiRawResponse } from './serpapi.types'

export async function executeSerpApiRequest(
  params: SerpApiSearchRequestParams
): Promise<{ success: boolean; data?: SerpApiRawResponse; error?: string; isLive: boolean }> {
  const apiKey = serpapiConfig.apiKey

  if (!serpapiConfig.enabled || !apiKey || apiKey === 'your_serpapi_key_here') {
    return {
      success: false,
      error: 'SERPAPI_KEY is not configured or disabled.',
      isLive: false,
    }
  }

  const queryParams = new URLSearchParams()
  queryParams.append('engine', params.engine)
  queryParams.append('q', params.q)
  queryParams.append('api_key', apiKey)
  if (params.location) queryParams.append('location', params.location)
  if (params.gl) queryParams.append('gl', params.gl)
  if (params.hl) queryParams.append('hl', params.hl)
  if (params.tbm) queryParams.append('tbm', params.tbm)
  if (params.num) queryParams.append('num', params.num.toString())

  const requestUrl = `${serpapiConfig.baseUrl}?${queryParams.toString()}`

  let attempt = 0
  while (attempt <= serpapiConfig.maxRetries) {
    attempt++
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), serpapiConfig.timeoutMs)

      const response = await fetch(requestUrl, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        if (response.status === 401 || response.status === 403) {
          return { success: false, error: 'SerpApi Authentication Failed (Invalid API Key).', isLive: false }
        }
        if (response.status === 429) {
          return { success: false, error: 'SerpApi Rate Limit / Quota Exceeded.', isLive: false }
        }
        if (attempt <= serpapiConfig.maxRetries && response.status >= 500) {
          await new Promise((res) => setTimeout(res, serpapiConfig.retryDelayMs * attempt))
          continue
        }
        return { success: false, error: `SerpApi Error (${response.status}): ${errorText.substring(0, 150)}`, isLive: false }
      }

      const json: SerpApiRawResponse = await response.json()

      if (json.error) {
        return { success: false, error: `SerpApi Returned Error: ${json.error}`, isLive: false }
      }

      return { success: true, data: json, isLive: true }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        if (attempt <= serpapiConfig.maxRetries) continue
        return { success: false, error: 'SerpApi Request Timed Out.', isLive: false }
      }
      if (attempt <= serpapiConfig.maxRetries) {
        await new Promise((res) => setTimeout(res, serpapiConfig.retryDelayMs * attempt))
        continue
      }
      return { success: false, error: err.message || 'SerpApi Request Failed.', isLive: false }
    }
  }

  return { success: false, error: 'SerpApi max retries reached.', isLive: false }
}
