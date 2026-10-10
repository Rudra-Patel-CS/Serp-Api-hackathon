"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const serpapi_config_1 = require("../integrations/serpapi/serpapi.config");
const google_search_service_1 = require("../integrations/serpapi/google-search.service");
const google_news_service_1 = require("../integrations/serpapi/google-news.service");
const google_maps_service_1 = require("../integrations/serpapi/google-maps.service");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
async function runLiveSmokeTest() {
    console.log('====================================================');
    console.log('       KRISHIINTEL SERPAPI LIVE SMOKE TEST          ');
    console.log('====================================================\n');
    const apiKey = serpapi_config_1.serpapiConfig.apiKey;
    if (!apiKey || apiKey === 'your_serpapi_key_here') {
        console.warn('⚠️  SERPAPI_KEY is NOT configured in backend/.env!');
        console.warn('⚠️  Running smoke test in DEGRADED/FALLBACK mode.');
        console.warn('To test real SerpApi engines, add SERPAPI_KEY=<your_key> to backend/.env\n');
    }
    else {
        // Mask key for safety
        const maskedKey = apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4);
        console.log(`✅ Detected SERPAPI_KEY: ${maskedKey}`);
    }
    // 1. TEST GOOGLE SEARCH ENGINE (engine=google)
    console.log('\n--- [1/3] Testing Google Search Engine (engine=google) ---');
    console.log('Query: Groundnut wholesale price Rajkot Gujarat');
    try {
        const searchRes = await (0, google_search_service_1.fetchGoogleSearchEvidence)('Groundnut', 'Rajkot');
        console.log(`Success: ${searchRes.evidence.length > 0}`);
        console.log(`Live Status: ${searchRes.isLive ? 'LIVE' : 'DEMO/FALLBACK'}`);
        console.log(`Evidence Count: ${searchRes.evidence.length}`);
        if (searchRes.evidence.length > 0) {
            console.log(`Sample Result: [${searchRes.evidence[0].sourceType}] "${searchRes.evidence[0].title}"`);
            console.log(`Source URL: ${searchRes.evidence[0].sourceUrl || 'N/A'}`);
        }
    }
    catch (err) {
        console.error('❌ Google Search Engine failed:', err.message);
    }
    // 2. TEST GOOGLE NEWS ENGINE (engine=google_news)
    console.log('\n--- [2/3] Testing Google News Engine (engine=google_news) ---');
    console.log('Query: Groundnut market price Gujarat');
    try {
        const newsRes = await (0, google_news_service_1.fetchGoogleNewsEvidence)('Groundnut', 'Gujarat');
        console.log(`Success: ${newsRes.evidence.length > 0}`);
        console.log(`Live Status: ${newsRes.isLive ? 'LIVE' : 'DEMO/FALLBACK'}`);
        console.log(`News Count: ${newsRes.evidence.length}`);
        if (newsRes.evidence.length > 0) {
            console.log(`Sample News: [${newsRes.evidence[0].sourceName}] "${newsRes.evidence[0].title}"`);
            console.log(`Published At: ${newsRes.evidence[0].publishedAt || 'Unknown'}`);
        }
    }
    catch (err) {
        console.error('❌ Google News Engine failed:', err.message);
    }
    // 3. TEST GOOGLE MAPS ENGINE (engine=google_maps)
    console.log('\n--- [3/3] Testing Google Maps Engine (engine=google_maps) ---');
    console.log('Query: vegetable wholesalers near Rajkot');
    try {
        const mapsRes = await (0, google_maps_service_1.fetchGoogleMapsLeads)('wholesaler', 'Groundnut', 'Rajkot');
        console.log(`Success: ${mapsRes.leads.length > 0}`);
        console.log(`Live Status: ${mapsRes.isLive ? 'LIVE' : 'DEMO/FALLBACK'}`);
        console.log(`Leads Discovered: ${mapsRes.leads.length}`);
        if (mapsRes.leads.length > 0) {
            console.log(`Sample Lead: "${mapsRes.leads[0].name}" (${mapsRes.leads[0].category})`);
            console.log(`Address: ${mapsRes.leads[0].address || 'N/A'}`);
            console.log(`Verified Status: ${mapsRes.leads[0].status === 'VERIFIED' ? 'VERIFIED' : 'CANDIDATE ONLY (UNVERIFIED)'}`);
        }
    }
    catch (err) {
        console.error('❌ Google Maps Engine failed:', err.message);
    }
    console.log('\n====================================================');
    console.log('             SMOKE TEST COMPLETED                    ');
    console.log('====================================================');
}
runLiveSmokeTest();
