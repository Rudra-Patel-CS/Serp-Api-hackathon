import dotenv from 'dotenv'
import path from 'path'
import { serpapiConfig } from '../integrations/serpapi/serpapi.config'
import { executeSerpApiRequest } from '../integrations/serpapi/serpapi.client'
import { fetchGoogleSearchEvidence } from '../integrations/serpapi/google-search.service'
import { fetchGoogleNewsEvidence } from '../integrations/serpapi/google-news.service'
import { fetchGoogleMapsLeads } from '../integrations/serpapi/google-maps.service'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

async function runLiveSmokeTest() {
  console.log('====================================================')
  console.log('       KRISHIINTEL SERPAPI LIVE SMOKE TEST          ')
  console.log('====================================================\n')

  const apiKey = serpapiConfig.apiKey
  if (!apiKey || apiKey === 'your_serpapi_key_here') {
    console.warn('⚠️  SERPAPI_KEY is NOT configured in backend/.env!')
    console.warn('⚠️  Running smoke test in DEGRADED/FALLBACK mode.')
    console.warn('To test real SerpApi engines, add SERPAPI_KEY=<your_key> to backend/.env\n')
  } else {
    // Mask key for safety
    const maskedKey = apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4)
    console.log(`✅ Detected SERPAPI_KEY: ${maskedKey}`)
  }

  // 1. TEST GOOGLE SEARCH ENGINE (engine=google)
  console.log('\n--- [1/3] Testing Google Search Engine (engine=google) ---')
  console.log('Query: Groundnut wholesale price Rajkot Gujarat')
  try {
    const searchRes = await fetchGoogleSearchEvidence('Groundnut', 'Rajkot')
    console.log(`Success: ${searchRes.evidence.length > 0}`)
    console.log(`Live Status: ${searchRes.isLive ? 'LIVE' : 'DEMO/FALLBACK'}`)
    console.log(`Evidence Count: ${searchRes.evidence.length}`)
    if (searchRes.evidence.length > 0) {
      console.log(`Sample Result: [${searchRes.evidence[0].sourceType}] "${searchRes.evidence[0].title}"`)
      console.log(`Source URL: ${searchRes.evidence[0].sourceUrl || 'N/A'}`)
    }
  } catch (err: any) {
    console.error('❌ Google Search Engine failed:', err.message)
  }

  // 2. TEST GOOGLE NEWS ENGINE (engine=google_news)
  console.log('\n--- [2/3] Testing Google News Engine (engine=google_news) ---')
  console.log('Query: Groundnut market price Gujarat')
  try {
    const newsRes = await fetchGoogleNewsEvidence('Groundnut', 'Gujarat')
    console.log(`Success: ${newsRes.evidence.length > 0}`)
    console.log(`Live Status: ${newsRes.isLive ? 'LIVE' : 'DEMO/FALLBACK'}`)
    console.log(`News Count: ${newsRes.evidence.length}`)
    if (newsRes.evidence.length > 0) {
      console.log(`Sample News: [${newsRes.evidence[0].sourceName}] "${newsRes.evidence[0].title}"`)
      console.log(`Published At: ${newsRes.evidence[0].publishedAt || 'Unknown'}`)
    }
  } catch (err: any) {
    console.error('❌ Google News Engine failed:', err.message)
  }

  // 3. TEST GOOGLE MAPS ENGINE (engine=google_maps)
  console.log('\n--- [3/3] Testing Google Maps Engine (engine=google_maps) ---')
  console.log('Query: vegetable wholesalers near Rajkot')
  try {
    const mapsRes = await fetchGoogleMapsLeads('Groundnut', 'Rajkot')
    console.log(`Success: ${mapsRes.leads.length > 0}`)
    console.log(`Live Status: ${mapsRes.isLive ? 'LIVE' : 'DEMO/FALLBACK'}`)
    console.log(`Leads Discovered: ${mapsRes.leads.length}`)
    if (mapsRes.leads.length > 0) {
      console.log(`Sample Lead: "${mapsRes.leads[0].title}" (${mapsRes.leads[0].category})`)
      console.log(`Address: ${mapsRes.leads[0].address || 'N/A'}`)
      console.log(`Verified Status: ${mapsRes.leads[0].verified ? 'VERIFIED' : 'CANDIDATE ONLY (UNVERIFIED)'}`)
    }
  } catch (err: any) {
    console.error('❌ Google Maps Engine failed:', err.message)
  }

  console.log('\n====================================================')
  console.log('             SMOKE TEST COMPLETED                    ')
  console.log('====================================================')
}

runLiveSmokeTest()
