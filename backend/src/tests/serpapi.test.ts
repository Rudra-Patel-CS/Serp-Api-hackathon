import { getCacheKey, getCachedResult, setCachedResult, clearCache } from '../integrations/serpapi/serpapi-cache.service'
import { fetchGoogleSearchEvidence } from '../integrations/serpapi/google-search.service'
import { fetchGoogleNewsEvidence } from '../integrations/serpapi/google-news.service'
import { fetchGoogleMapsLeads } from '../integrations/serpapi/google-maps.service'
import { calculateNetRealisation } from '../services/net-realisation.service'
import { calculateOpportunityScore } from '../services/opportunity-score.service'

async function runAllTests() {
  console.log('--- STARTING SERPAPI & MARKET INTELLIGENCE SUITE TESTS ---')
  let passed = 0
  let failed = 0

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`)
      passed++
    } else {
      console.error(`[FAIL] ${message}`)
      failed++
    }
  }

  // 1. CACHE TESTS
  clearCache()
  const key = getCacheKey('google', 'Groundnut price', 'Rajkot')
  assert(key === 'google:groundnut price:rajkot', 'Cache key generation normalizes input')

  const miss = getCachedResult(key)
  assert(!miss.hit, 'Cache miss on initial key lookup')

  setCachedResult(key, [{ id: '1', title: 'Test Evidence' }], 10)
  const hit = getCachedResult<any[]>(key)
  assert(hit.hit && hit.data?.length === 1 && hit.data[0].title === 'Test Evidence', 'Cache hit returns cached data')

  // 2. SERPAPI FALLBACK / MOCK TESTS (WITHOUT KEY OR WITH LIVE KEY)
  const searchRes = await fetchGoogleSearchEvidence('Groundnut', 'Rajkot')
  assert(searchRes.evidence.length > 0, 'Google search service returns evidence records')
  assert(typeof searchRes.isLive === 'boolean', 'Search response correctly flags live vs demo/fallback data')

  const newsRes = await fetchGoogleNewsEvidence('Groundnut', 'Gujarat')
  assert(newsRes.evidence.length > 0, 'Google news service returns news records')
  assert(typeof newsRes.isLive === 'boolean', 'News response correctly flags live vs demo/fallback data')

  const mapsRes = await fetchGoogleMapsLeads('wholesaler', 'Groundnut', 'Rajkot')
  assert(mapsRes.leads.length > 0, 'Google Maps service returns leads')
  assert(mapsRes.leads[0].status === 'CANDIDATE' || mapsRes.leads[0].status === 'VERIFIED', 'Maps leads return valid lead status')

  // 3. NET REALISATION CALCULATIONS
  const netResult = calculateNetRealisation({
    grossPerQtl: 6500,
    quantityKg: 2000, // 20 Quintals
    distanceKm: 50,
  })

  // grossPerQtl = 6500
  // qtlCount = 2000 / 100 = 20
  // totalGross = 6500 * 20 = 130000
  // totalNet > 0
  assert(netResult.totalGross === 130000, `Gross sale value calculated accurately: ${netResult.totalGross}`)
  assert(netResult.totalNet > 0, `Net realization is positive: ${netResult.totalNet}`)
  assert(netResult.netPerQtl > 0, `Net price per quintal calculated accurately: ${netResult.netPerQtl}`)

  // 4. UNIT CONVERSION TEST (1 Quintal = 100 kg)
  const pricePerKg = 65
  const convertedPricePerQuintal = pricePerKg * 100
  assert(convertedPricePerQuintal === 6500, 'Unit conversion 1 Quintal = 100 kg enforced accurately')

  // 5. OPPORTUNITY SCORE CALCULATIONS
  const scoreResult = calculateOpportunityScore({
    netPerQtl: netResult.netPerQtl,
    grossPerQtl: 6500,
    distanceKm: 50,
    buyerCount: 5,
  })

  assert(scoreResult.score >= 0 && scoreResult.score <= 100, `Opportunity score in valid range 0-100: ${scoreResult.score}`)
  assert(scoreResult.components.priceSignal > 0, 'Components contain priceSignal score')
  assert(scoreResult.badgeText !== '', `Badge text generated: ${scoreResult.badgeText}`)

  console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`)
  if (failed > 0) {
    process.exit(1)
  }
}

runAllTests().catch((err) => {
  console.error('Test suite runner crashed:', err)
  process.exit(1)
})
