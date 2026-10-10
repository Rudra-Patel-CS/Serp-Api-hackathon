"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGoogleSearchEvidence = fetchGoogleSearchEvidence;
const serpapi_client_1 = require("./serpapi.client");
const serpapi_cache_service_1 = require("./serpapi-cache.service");
async function fetchGoogleSearchEvidence(cropName, location) {
    const query = `${cropName} wholesale mandi price market demand ${location} Gujarat India`;
    const cacheKey = (0, serpapi_cache_service_1.getCacheKey)('google', query, location);
    const cached = (0, serpapi_cache_service_1.getCachedResult)(cacheKey);
    if (cached.hit && cached.data) {
        return { evidence: cached.data, isLive: true, isCached: true };
    }
    const res = await (0, serpapi_client_1.executeSerpApiRequest)({
        engine: 'google',
        q: query,
        gl: 'in',
        hl: 'en',
        num: 5,
    });
    if (res.success && res.data?.organic_results) {
        const nowStr = new Date().toISOString();
        const evidence = res.data.organic_results.slice(0, 4).map((item, idx) => ({
            id: `GSRC-${idx + 1}-${Date.now().toString(36)}`,
            sourceType: 'google_search',
            title: item.title || `${cropName} Market Search Record`,
            sourceName: item.source || 'Web Agricultural Report',
            sourceUrl: item.link || 'https://agmarknet.gov.in',
            snippet: item.snippet || `Market information for ${cropName} in ${location}.`,
            observedAt: nowStr,
            publishedAt: item.date || null,
            cropName,
            location,
            signalType: 'MARKET_REPORT',
            relevance: idx === 0 ? 'high' : 'medium',
            isLive: true,
            confidence: idx === 0 ? 88 : 75,
        }));
        (0, serpapi_cache_service_1.setCachedResult)(cacheKey, evidence);
        return { evidence, isLive: true, isCached: false };
    }
    // Structured Demo Fallback when live key is missing or request fails
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const fallback = [
        {
            id: 'GSRC-DEMO-01',
            sourceType: 'demo',
            title: `${cropName} APMC Yard Arrival & Price Trends in ${location}`,
            sourceName: 'Gujarat APMC Daily Bulletin',
            sourceUrl: 'https://agmarknet.gov.in',
            snippet: `Wholesale market arrivals for ${cropName} in ${location} indicate steady buyer demand and 3-5% price gain for Grade A lots.`,
            observedAt: nowStr,
            publishedAt: nowStr,
            cropName,
            location,
            signalType: 'MARKET_REPORT',
            relevance: 'high',
            isLive: false,
            confidence: 80,
        },
        {
            id: 'GSRC-DEMO-02',
            sourceType: 'demo',
            title: `${cropName} Bulk Processing Buyers Requirement Notice`,
            sourceName: 'Western India Food Processors',
            sourceUrl: 'https://mofpi.gov.in',
            snippet: `Regional food processors announce premium procurement quotes for aggregated ${cropName} lots meeting moisture standards.`,
            observedAt: nowStr,
            publishedAt: nowStr,
            cropName,
            location,
            signalType: 'BUYER_DEMAND',
            relevance: 'high',
            isLive: false,
            confidence: 85,
        },
    ];
    return { evidence: fallback, isLive: false, isCached: false, error: res.error };
}
