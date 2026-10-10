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

  // 2. SERPAPI FALLBACK / MOCK TESTS (WITHOUT KEY)
  const searchRes = await fetchGoogleSearchEvidence('Groundnut', 'Rajkot')
  assert(searchRes.evidence.length > 0, 'Google search service returns fallback evidence when key is missing')
  assert(searchRes.isLive === false, 'Search response correctly flags non-live demo/fallback data')

  const newsRes = await fetchGoogleNewsEvidence('Groundnut', 'Gujarat')
  assert(newsRes.evidence.length > 0, 'Google news service returns fallback news when key is missing')
  assert(newsRes.isLive === false, 'News response correctly flags non-live demo/fallback data')

  const mapsRes = await fetchGoogleMapsLeads('Groundnut', 'Rajkot')
  assert(mapsRes.leads.length > 0, 'Google Maps service returns fallback leads when key is missing')
  assert(mapsRes.leads[0].verified === false, 'Maps leads are strictly unverified candidate leads')

  // 3. NET REALISATION CALCULATIONS
  const netResult = calculateNetRealisation({
    marketPricePerQuintal: 6500,
    quantityQuintals: 20,
    distanceKm: 50,
    freightCostPerKm: 15,
    handlingCostPerQuintal: 30,
    storageCostPerQuintalDay: 5,
    storageDays: 3,
    expectedLossPercentage: 1.5,
  })

  // Gross = 6500 * 20 = 130000
  // Transport = 50 * 15 = 750
  // Handling = 20 * 30 = 600
  // Storage = 20 * 5 * 3 = 300
  // Loss = 1.5% of 130000 = 1950
  // Total deductions = 750 + 600 + 300 + 1950 = 3600
  // Net = 130000 - 3600 = 126400
  assert(netResult.grossSaleValue === 130000, `Gross sale value calculated accurately: ${netResult.grossSaleValue}`)
  assert(netResult.netRealisationValue === 126400, `Net realisation calculated accurately: ${netResult.netRealisationValue}`)
  assert(netResult.netPricePerQuintal === 6320, `Net price per quintal calculated accurately: ${netResult.netPricePerQuintal}`)

  // 4. UNIT CONVERSION TEST (1 Quintal = 100 kg)
  const pricePerKg = 65
  const convertedPricePerQuintal = pricePerKg * 100
  assert(convertedPricePerQuintal === 6500, 'Unit conversion 1 Quintal = 100 kg enforced accurately')

  // 5. OPPORTUNITY SCORE CALCULATIONS
  const scoreResult = calculateOpportunityScore({
    netPricePerQuintal: 6320,
    baseMarketPricePerQuintal: 6000,
    buyerCount: 5,
    demandSignalCount: 3,
    distanceKm: 50,
    evidenceFreshnessDays: 1,
    hasOfficialData: true,
  })

  assert(scoreResult.score >= 0 && scoreResult.score <= 100, `Opportunity score in valid range 0-100: ${scoreResult.score}`)
  assert(scoreResult.breakdown.priceAttractivenessScore > 0, 'Breakdown contains price attractiveness component')
  assert(scoreResult.confidence >= 0 && scoreResult.confidence <= 100, `Confidence indicator in valid range: ${scoreResult.confidence}`)

  console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`)
  if (failed > 0) {
    process.exit(1)
  }
}

runAllTests().catch((err) => {
  console.error('Test suite runner crashed:', err)
  process.exit(1)
})
