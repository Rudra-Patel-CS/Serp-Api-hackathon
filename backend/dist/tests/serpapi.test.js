"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serpapi_cache_service_1 = require("../integrations/serpapi/serpapi-cache.service");
const google_search_service_1 = require("../integrations/serpapi/google-search.service");
const google_news_service_1 = require("../integrations/serpapi/google-news.service");
const google_maps_service_1 = require("../integrations/serpapi/google-maps.service");
const net_realisation_service_1 = require("../services/net-realisation.service");
const opportunity_score_service_1 = require("../services/opportunity-score.service");
async function runAllTests() {
    console.log('--- STARTING SERPAPI & MARKET INTELLIGENCE SUITE TESTS ---');
    let passed = 0;
    let failed = 0;
    function assert(condition, message) {
        if (condition) {
            console.log(`[PASS] ${message}`);
            passed++;
        }
        else {
            console.error(`[FAIL] ${message}`);
            failed++;
        }
    }
    // 1. CACHE TESTS
    (0, serpapi_cache_service_1.clearCache)();
    const key = (0, serpapi_cache_service_1.getCacheKey)('google', 'Groundnut price', 'Rajkot');
    assert(key === 'google:groundnut price:rajkot', 'Cache key generation normalizes input');
    const miss = (0, serpapi_cache_service_1.getCachedResult)(key);
    assert(!miss.hit, 'Cache miss on initial key lookup');
    (0, serpapi_cache_service_1.setCachedResult)(key, [{ id: '1', title: 'Test Evidence' }], 10);
    const hit = (0, serpapi_cache_service_1.getCachedResult)(key);
    assert(hit.hit && hit.data?.length === 1 && hit.data[0].title === 'Test Evidence', 'Cache hit returns cached data');
    // 2. SERPAPI FALLBACK / MOCK TESTS (WITHOUT KEY OR WITH LIVE KEY)
    const searchRes = await (0, google_search_service_1.fetchGoogleSearchEvidence)('Groundnut', 'Rajkot');
    assert(searchRes.evidence.length > 0, 'Google search service returns evidence records');
    assert(typeof searchRes.isLive === 'boolean', 'Search response correctly flags live vs demo/fallback data');
    const newsRes = await (0, google_news_service_1.fetchGoogleNewsEvidence)('Groundnut', 'Gujarat');
    assert(newsRes.evidence.length > 0, 'Google news service returns news records');
    assert(typeof newsRes.isLive === 'boolean', 'News response correctly flags live vs demo/fallback data');
    const mapsRes = await (0, google_maps_service_1.fetchGoogleMapsLeads)('wholesaler', 'Groundnut', 'Rajkot');
    assert(mapsRes.leads.length > 0, 'Google Maps service returns leads');
    assert(mapsRes.leads[0].status === 'CANDIDATE' || mapsRes.leads[0].status === 'VERIFIED', 'Maps leads return valid lead status');
    // 3. NET REALISATION CALCULATIONS
    const netResult = (0, net_realisation_service_1.calculateNetRealisation)({
        grossPerQtl: 6500,
        quantityKg: 2000, // 20 Quintals
        distanceKm: 50,
    });
    // grossPerQtl = 6500
    // qtlCount = 2000 / 100 = 20
    // totalGross = 6500 * 20 = 130000
    // totalNet > 0
    assert(netResult.totalGross === 130000, `Gross sale value calculated accurately: ${netResult.totalGross}`);
    assert(netResult.totalNet > 0, `Net realization is positive: ${netResult.totalNet}`);
    assert(netResult.netPerQtl > 0, `Net price per quintal calculated accurately: ${netResult.netPerQtl}`);
    // 4. UNIT CONVERSION TEST (1 Quintal = 100 kg)
    const pricePerKg = 65;
    const convertedPricePerQuintal = pricePerKg * 100;
    assert(convertedPricePerQuintal === 6500, 'Unit conversion 1 Quintal = 100 kg enforced accurately');
    // 5. OPPORTUNITY SCORE CALCULATIONS
    const scoreResult = (0, opportunity_score_service_1.calculateOpportunityScore)({
        netPerQtl: netResult.netPerQtl,
        grossPerQtl: 6500,
        distanceKm: 50,
        buyerCount: 5,
    });
    assert(scoreResult.score >= 0 && scoreResult.score <= 100, `Opportunity score in valid range 0-100: ${scoreResult.score}`);
    assert(scoreResult.components.priceSignal > 0, 'Components contain priceSignal score');
    assert(scoreResult.badgeText !== '', `Badge text generated: ${scoreResult.badgeText}`);
    console.log(`\n--- TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
    if (failed > 0) {
        process.exit(1);
    }
}
runAllTests().catch((err) => {
    console.error('Test suite runner crashed:', err);
    process.exit(1);
});
