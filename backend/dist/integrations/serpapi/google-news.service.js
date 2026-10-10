"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGoogleNewsEvidence = fetchGoogleNewsEvidence;
const serpapi_client_1 = require("./serpapi.client");
const serpapi_cache_service_1 = require("./serpapi-cache.service");
async function fetchGoogleNewsEvidence(cropName, location) {
    const query = `${cropName} market price news Gujarat ${location}`;
    const cacheKey = (0, serpapi_cache_service_1.getCacheKey)('google_news', query, location);
    const cached = (0, serpapi_cache_service_1.getCachedResult)(cacheKey);
    if (cached.hit && cached.data) {
        return { evidence: cached.data, isLive: true, isCached: true };
    }
    const res = await (0, serpapi_client_1.executeSerpApiRequest)({
        engine: 'google_news',
        q: query,
        gl: 'in',
        hl: 'en',
        num: 5,
    });
    if (res.success && res.data?.news_results) {
        const nowStr = new Date().toISOString();
        const evidence = res.data.news_results.slice(0, 4).map((item, idx) => ({
            id: `GNEWS-${idx + 1}-${Date.now().toString(36)}`,
            sourceType: 'google_news',
            title: item.title || `${cropName} News Update`,
            sourceName: item.source || 'Agri News Publication',
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
        }));
        (0, serpapi_cache_service_1.setCachedResult)(cacheKey, evidence);
        return { evidence, isLive: true, isCached: false };
    }
    // Structured Demo Fallback when live key is missing or request fails
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const fallback = [
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
    ];
    return { evidence: fallback, isLive: false, isCached: false, error: res.error };
}
