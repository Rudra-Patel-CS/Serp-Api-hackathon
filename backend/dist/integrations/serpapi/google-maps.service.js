"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGoogleMapsLeads = fetchGoogleMapsLeads;
const serpapi_client_1 = require("./serpapi.client");
const serpapi_cache_service_1 = require("./serpapi-cache.service");
async function fetchGoogleMapsLeads(queryType, cropName, location) {
    let query = `${cropName} bulk buyers wholesalers ${location} Gujarat`;
    if (queryType === 'processor') {
        query = `${cropName} food processing companies near ${location} Gujarat`;
    }
    else if (queryType === 'cold_storage') {
        query = `cold storage agricultural facilities near ${location} Gujarat`;
    }
    else if (queryType === 'logistics') {
        query = `agricultural transport truck transport companies near ${location} Gujarat`;
    }
    const cacheKey = (0, serpapi_cache_service_1.getCacheKey)('google_maps', query, location);
    const cached = (0, serpapi_cache_service_1.getCachedResult)(cacheKey);
    if (cached.hit && cached.data) {
        return { leads: cached.data, isLive: true, isCached: true };
    }
    const res = await (0, serpapi_client_1.executeSerpApiRequest)({
        engine: 'google_maps',
        q: query,
        gl: 'in',
        hl: 'en',
        num: 6,
    });
    if (res.success && res.data?.local_results) {
        const nowStr = new Date().toISOString();
        const leads = res.data.local_results.map((item, idx) => ({
            id: `GMAP-LEAD-${idx + 1}-${Date.now().toString(36)}`,
            name: item.title || `Discovered ${cropName} Business`,
            address: item.address || `${location}, Gujarat`,
            city: location,
            state: 'Gujarat',
            latitude: item.gps_coordinates?.latitude || null,
            longitude: item.gps_coordinates?.longitude || null,
            phone: item.phone || null,
            website: item.website || null,
            rating: item.rating || null,
            reviewCount: item.reviews || null,
            category: item.type || queryType.toUpperCase(),
            mapsLink: item.link || null,
            sourceType: 'google_maps',
            observedAt: nowStr,
            status: 'CANDIDATE',
        }));
        (0, serpapi_cache_service_1.setCachedResult)(cacheKey, leads);
        return { leads, isLive: true, isCached: false };
    }
    // Structured Demo Fallback Candidate Leads
    const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const fallbackLeads = [
        {
            id: 'GMAP-DEMO-01',
            name: `Gujarat Regional Fresh Produce Traders (${location})`,
            address: `APMC Yard Road, ${location}, Gujarat`,
            city: location,
            state: 'Gujarat',
            latitude: 22.5645,
            longitude: 72.9289,
            phone: '+91 98250 11223',
            website: 'https://agmarknet.gov.in',
            rating: 4.6,
            reviewCount: 48,
            category: 'Wholesale Produce Trader',
            mapsLink: 'https://maps.google.com',
            sourceType: 'demo',
            observedAt: nowStr,
            status: 'CANDIDATE',
        },
        {
            id: 'GMAP-DEMO-02',
            name: `Western India Food Processing Co.`,
            address: `GIDC Industrial Estate, ${location}, Gujarat`,
            city: location,
            state: 'Gujarat',
            latitude: 22.5701,
            longitude: 72.935,
            phone: '+91 98980 44556',
            website: 'https://mofpi.gov.in',
            rating: 4.8,
            reviewCount: 92,
            category: 'Food Processing Plant',
            mapsLink: 'https://maps.google.com',
            sourceType: 'demo',
            observedAt: nowStr,
            status: 'CANDIDATE',
        },
    ];
    return { leads: fallbackLeads, isLive: false, isCached: false, error: res.error };
}
