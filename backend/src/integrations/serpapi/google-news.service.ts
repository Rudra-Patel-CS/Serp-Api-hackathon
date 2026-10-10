import { executeSerpApiRequest } from './serpapi.client'
import { getCacheKey, getCachedResult, setCachedResult } from './serpapi-cache.service'
import { NormalizedEvidence } from './serpapi.types'

export async function fetchGoogleNewsEvidence(
  cropName: string,
  location: string
): Promise<{ evidence: NormalizedEvidence[]; isLive: boolean; isCached: boolean; error?: string }> {
  const query = `${cropName} market price news Gujarat ${location}`
  const cacheKey = getCacheKey('google_news', query, location)

  const cached = getCachedResult<NormalizedEvidence[]>(cacheKey)
  if (cached.hit && cached.data) {
    return { evidence: cached.data, isLive: true, isCached: true }
  }

  const res = await executeSerpApiRequest({
    engine: 'google_news',
    q: query,
    gl: 'in',
    hl: 'en',
    num: 5,
  })

  if (res.success && res.data?.news_results) {
    const nowStr = new Date().toISOString()
    const evidence: NormalizedEvidence[] = res.data.news_results.slice(0, 4).map((item, idx) => {
      const rawSource = (item as any).source
      const sourceStr = typeof rawSource === 'string'
        ? rawSource
        : (rawSource?.name || 'Agri News Publication')

      return {
        id: `GNEWS-${idx + 1}-${Date.now().toString(36)}`,
        sourceType: 'google_news',
        title: item.title || `${cropName} News Update`,
        sourceName: sourceStr,
        sourceUrl: item.link || 'https://agmarknet.gov.in',
        snippet: item.snippet || `Latest market news regarding ${cropName} in ${location}.`,
        observedAt: nowStr,
        publishedAt: item.date || null,
        cropName,
        location,
        signalType: 'NEWS_ALERT',
        relevance: idx === 0 ? 'high' : 'medium',
        isLive: true,
        confidence: idx === 0 ? 90 : 80,
      }
    })

    setCachedResult(cacheKey, evidence)
    return { evidence, isLive: true, isCached: false }
  }

  // Structured Demo Fallback when live key is missing or request fails
  const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const fallback: NormalizedEvidence[] = [
    {
      id: 'GNEWS-DEMO-01',
      sourceType: 'demo',
      title: `Surge in ${cropName} Wholesale Demand Across Central Gujarat APMCs`,
      sourceName: 'Gujarat Agri Daily Bulletin',
      sourceUrl: 'https://agmarknet.gov.in',
      snippet: `Traders in Ahmedabad and Vadodara report robust buying interest for high-quality ${cropName} produce.`,
      observedAt: nowStr,
      publishedAt: nowStr,
      cropName,
      location,
      signalType: 'NEWS_ALERT',
      relevance: 'high',
      isLive: false,
      confidence: 85,
    },
    {
      id: 'GNEWS-DEMO-02',
      sourceType: 'demo',
      title: `Transport Corridor Rates Stabilize on NH48 Highway`,
      sourceName: 'State Logistics Association',
      sourceUrl: 'https://transport.gujarat.gov.in',
      snippet: `Truck freight rates for refrigerated dispatches from ${location} remain steady, benefiting crop deliveries.`,
      observedAt: nowStr,
      publishedAt: nowStr,
      cropName,
      location,
      signalType: 'LOGISTICS_SIGNAL',
      relevance: 'medium',
      isLive: false,
      confidence: 82,
    },
  ]

  return { evidence: fallback, isLive: false, isCached: false, error: res.error }
}
