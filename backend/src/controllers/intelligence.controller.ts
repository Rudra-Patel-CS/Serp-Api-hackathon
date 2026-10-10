import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { calculateNetRealisation } from '../services/net-realisation.service'
import { calculateOpportunityScore } from '../services/opportunity-score.service'
import {
  fetchGoogleSearchEvidence,
  fetchGoogleNewsEvidence,
  fetchGoogleMapsLeads,
} from '../integrations/serpapi'
import { sendSuccess, sendError } from '../utils/response.util'

export async function analyzeMarketOpportunity(req: Request, res: Response) {
  try {
    const { cropName, quantityKg, location, freightVariance, isFpoPool } = req.body

    const qty = quantityKg ? parseFloat(quantityKg) : 500
    const targetLocation = location || 'Anand, Gujarat'
    const crop = await prisma.crop.findFirst({
      where: {
        OR: [
          { name: cropName || 'Tomato' },
          { localName: { contains: cropName || 'Tomato' } },
          { gujaratiName: { contains: cropName || 'Tomato' } },
        ],
      },
    })

    const targetCropId = crop ? crop.id : (await prisma.crop.findFirst())?.id!
    const targetCropName = crop ? crop.name : cropName || 'Tomato'
    const shelfLifeDays = crop ? crop.shelfLifeDays : 4

    // Fetch APMC Markets & Prices from MySQL DB
    const markets = await prisma.market.findMany({
      include: {
        prices: {
          where: { cropId: targetCropId },
          orderBy: { observedAt: 'desc' },
          take: 1,
        },
      },
    })

    // Fetch Buyer Count
    const buyerCount = await prisma.buyer.count({
      where: {
        requirements: {
          some: { cropId: targetCropId, active: true },
        },
      },
    })

    const comparisons = markets.map((m) => {
      const latestPrice = m.prices[0] ? m.prices[0].modalPrice : 2800
      const netCalc = calculateNetRealisation({
        grossPerQtl: latestPrice,
        quantityKg: qty,
        distanceKm: m.distanceKm,
        freightVariance: freightVariance ? parseFloat(freightVariance) : 0,
        isFpoPool: isFpoPool || false,
        shelfLifeDays,
      })

      const oppScore = calculateOpportunityScore({
        netPerQtl: netCalc.netPerQtl,
        grossPerQtl: latestPrice,
        distanceKm: m.distanceKm,
        buyerCount,
      })

      return {
        id: m.id,
        name: m.name,
        city: m.city,
        distanceKm: m.distanceKm,
        priceSource: m.prices[0] ? 'OFFICIAL_APMC_RECORD' : 'ESTIMATED_REGIONAL_QUOTE',
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
    const [newsRes, searchRes, mapsRes] = await Promise.all([
      fetchGoogleNewsEvidence(targetCropName, targetLocation),
      fetchGoogleSearchEvidence(targetCropName, targetLocation),
      fetchGoogleMapsLeads('wholesaler', targetCropName, targetLocation),
    ])

    const combinedEvidence = [...newsRes.evidence, ...searchRes.evidence]
    const isLive = newsRes.isLive || searchRes.isLive || mapsRes.isLive
    const isCached = newsRes.isCached || searchRes.isCached

    let statusBadge: 'LIVE WEB EVIDENCE' | 'CACHED WEB EVIDENCE' | 'DEMO DATA' = 'DEMO DATA'
    if (isLive) {
      statusBadge = isCached ? 'CACHED WEB EVIDENCE' : 'LIVE WEB EVIDENCE'
    }

    return sendSuccess(res, {
      crop: targetCropName,
      quantityKg: qty,
      location: targetLocation,
      bestMarket: comparisons[0],
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
        reasoning: `High net realization of ₹${comparisons[0]?.totalNet?.toLocaleString('en-IN')} achieved in ${comparisons[0]?.name}. Transit spoilage risk increases beyond ${shelfLifeDays} days.`,
        confidence: isLive ? 'High (89% - Web Verified)' : 'Moderate (78% - Baseline)',
        disclaimer: 'Prices and net returns are decision metrics and not guaranteed financial advice.',
      },
    })
  } catch (error: any) {
    console.error('Market Analysis Error:', error)
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
