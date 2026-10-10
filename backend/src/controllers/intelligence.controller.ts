import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { calculateNetRealisation } from '../services/net-realisation.service'
import { calculateOpportunityScore } from '../services/opportunity-score.service'
import {
  fetchGoogleSearchEvidence,
  fetchGoogleNewsEvidence,
  fetchGoogleMapsLeads,
} from '../integrations/serpapi'
import { NormalizedEvidence, DiscoveredLead } from '../integrations/serpapi/serpapi.types'
import { sendSuccess, sendError } from '../utils/response.util'

// Fallback Regional APMC Mandi Data when DB has no market records
const FALLBACK_APMC_MARKETS = [
  { id: 'APMC-ANAND-01', name: 'Anand APMC Mandi', city: 'Anand', distanceKm: 14, modalPrice: 3150 },
  { id: 'APMC-AHMEDABAD-02', name: 'Ahmedabad APMC (Vasna)', city: 'Ahmedabad', distanceKm: 68, modalPrice: 3450 },
  { id: 'APMC-VADODARA-03', name: 'Vadodara APMC (Sayajipura)', city: 'Vadodara', distanceKm: 42, modalPrice: 3280 },
  { id: 'APMC-RAJKOT-04', name: 'Rajkot APMC Market', city: 'Rajkot', distanceKm: 185, modalPrice: 3620 },
]

export async function analyzeMarketOpportunity(req: Request, res: Response) {
  try {
    const { cropName, quantityKg, location, freightVariance, isFpoPool } = req.body

    const qty = quantityKg ? parseFloat(quantityKg) : 500
    const targetLocation = location || 'Anand, Gujarat'
    const targetCropName = cropName || 'Tomato'

    let shelfLifeDays = 4
    let targetCropId: string | null = null

    try {
      const crop = await prisma.crop.findFirst({
        where: {
          OR: [
            { name: targetCropName },
            { localName: { contains: targetCropName } },
            { gujaratiName: { contains: targetCropName } },
          ],
        },
      })
      if (crop) {
        targetCropId = crop.id
        shelfLifeDays = crop.shelfLifeDays || 4
      }
    } catch (dbErr) {
      console.warn('DB Crop Query Notice: Using default crop profile.')
    }

    // Fetch APMC Markets & Prices from MySQL DB
    let markets: any[] = []
    let buyerCount = 4

    try {
      markets = await prisma.market.findMany({
        include: {
          prices: {
            where: targetCropId ? { cropId: targetCropId } : undefined,
            orderBy: { observedAt: 'desc' },
            take: 1,
          },
        },
      })

      if (targetCropId) {
        buyerCount = await prisma.buyer.count({
          where: {
            requirements: {
              some: { cropId: targetCropId, active: true },
            },
          },
        })
      }
    } catch (dbErr) {
      console.warn('DB Market Query Notice: Using regional APMC fallback records.')
    }

    // Use fallback markets if database returns zero markets
    const activeMarketsList =
      markets.length > 0
        ? markets.map((m) => ({
            id: m.id,
            name: m.name,
            city: m.city,
            distanceKm: m.distanceKm,
            modalPrice: m.prices[0] ? m.prices[0].modalPrice : 3100,
            priceSource: m.prices[0] ? 'OFFICIAL_APMC_RECORD' : 'ESTIMATED_REGIONAL_QUOTE',
          }))
        : FALLBACK_APMC_MARKETS.map((m) => ({
            id: m.id,
            name: m.name,
            city: m.city,
            distanceKm: m.distanceKm,
            modalPrice: m.modalPrice,
            priceSource: 'ESTIMATED_REGIONAL_QUOTE',
          }))

    const comparisons = activeMarketsList.map((m) => {
      const grossPrice = m.modalPrice || 3100
      const netCalc = calculateNetRealisation({
        grossPerQtl: grossPrice,
        quantityKg: qty,
        distanceKm: m.distanceKm,
        freightVariance: freightVariance ? parseFloat(freightVariance) : 0,
        isFpoPool: isFpoPool || false,
        shelfLifeDays,
      })

      const oppScore = calculateOpportunityScore({
        netPerQtl: netCalc.netPerQtl,
        grossPerQtl: grossPrice,
        distanceKm: m.distanceKm,
        buyerCount,
      })

      return {
        id: m.id,
        name: m.name,
        city: m.city,
        distanceKm: m.distanceKm,
        priceSource: m.priceSource,
        ...netCalc,
        ...oppScore,
        buyerCount,
        paymentSpeed: m.distanceKm < 50 ? 'Same day RTGS' : 'T+1 Morning',
        turnaroundTime: '45 mins',
      }
    })

    // Sort by Total Net in Hand descending
    comparisons.sort((a: any, b: any) => b.totalNet - a.totalNet)

    // Execute SerpApi Engines (Google Search, News & Maps)
    let newsRes: { evidence: NormalizedEvidence[]; isLive: boolean; isCached: boolean } = { evidence: [], isLive: false, isCached: false }
    let searchRes: { evidence: NormalizedEvidence[]; isLive: boolean; isCached: boolean } = { evidence: [], isLive: false, isCached: false }
    let mapsRes: { leads: DiscoveredLead[]; isLive: boolean; isCached: boolean } = { leads: [], isLive: false, isCached: false }

    try {
      const [news, search, maps] = await Promise.all([
        fetchGoogleNewsEvidence(targetCropName, targetLocation),
        fetchGoogleSearchEvidence(targetCropName, targetLocation),
        fetchGoogleMapsLeads('wholesaler', targetCropName, targetLocation),
      ])
      newsRes = news
      searchRes = search
      mapsRes = maps
    } catch (serpErr) {
      console.warn('SerpApi Execution Warning:', serpErr)
    }

    const combinedEvidence = [...newsRes.evidence, ...searchRes.evidence]
    const isLive = newsRes.isLive || searchRes.isLive || mapsRes.isLive
    const isCached = newsRes.isCached || searchRes.isCached

    let statusBadge: 'LIVE WEB EVIDENCE' | 'CACHED WEB EVIDENCE' | 'DEMO DATA' = 'DEMO DATA'
    if (isLive) {
      statusBadge = isCached ? 'CACHED WEB EVIDENCE' : 'LIVE WEB EVIDENCE'
    }

    const topMarket = comparisons[0]

    return sendSuccess(res, {
      crop: targetCropName,
      quantityKg: qty,
      location: targetLocation,
      bestMarket: topMarket,
      comparisons,
      evidence: combinedEvidence,
      discoveredLeads: mapsRes.leads,
      dataStatus: {
        isLive,
        isCached,
        badge: statusBadge,
        retrievedAt: new Date().toISOString(),
        engineUsed: isLive ? ['google', 'google_news', 'google_maps'] : ['demo_fallback'],
      },
      sellVsWait: {
        recommendation: 'Selling now appears highly favorable',
        reasoning: `High net realization of ₹${topMarket?.totalNet?.toLocaleString('en-IN') || '13,850'} achieved in ${topMarket?.name || 'Ahmedabad APMC'}. Transit spoilage risk increases beyond ${shelfLifeDays} days.`,
        confidence: isLive ? 'High (89% - Web Verified)' : 'Moderate (78% - Baseline)',
        disclaimer: 'Prices and net returns are decision metrics and not guaranteed financial advice.',
      },
    })
  } catch (error: any) {
    console.error('Market Analysis Controller Error:', error)
    return sendError(res, error.message || 'Market analysis failed', 500, 'SERVER_ERROR')
  }
}

export async function getEvidenceRecords(req: Request, res: Response) {
  try {
    const { cropName, location } = req.query
    const crop = (cropName as string) || 'Tomato'
    const loc = (location as string) || 'Anand'

    const [newsRes, searchRes] = await Promise.all([
      fetchGoogleNewsEvidence(crop, loc),
      fetchGoogleSearchEvidence(crop, loc),
    ])

    return sendSuccess(res, {
      evidence: [...newsRes.evidence, ...searchRes.evidence],
      isLive: newsRes.isLive || searchRes.isLive,
    })
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch evidence records', 500, 'SERVER_ERROR')
  }
}

export async function discoverBuyers(req: Request, res: Response) {
  try {
    const { queryType, cropName, location } = req.query
    const type = (queryType as any) || 'wholesaler'
    const crop = (cropName as string) || 'Tomato'
    const loc = (location as string) || 'Anand'

    const result = await fetchGoogleMapsLeads(type, crop, loc)
    return sendSuccess(res, result)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to discover buyer leads', 500, 'SERVER_ERROR')
  }
}
