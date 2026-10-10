import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { sendSuccess, sendError } from '../utils/response.util'
import { memoryDbStore } from '../store/memory-db.store'

function isDbAuthError(error: any): boolean {
  return (
    error?.name === 'PrismaClientInitializationError' ||
    error?.message?.includes('Authentication failed') ||
    error?.message?.includes('database server') ||
    error?.message?.includes('ECONNREFUSED') ||
    error?.code === 'P1001'
  )
}

const FALLBACK_MARKETS = [
  { id: 'APMC-ANAND-01', name: 'Anand APMC Mandi', city: 'Anand', distanceKm: 14, prices: [] },
  { id: 'APMC-AHMEDABAD-02', name: 'Ahmedabad APMC (Vasna)', city: 'Ahmedabad', distanceKm: 68, prices: [] },
  { id: 'APMC-VADODARA-03', name: 'Vadodara APMC (Sayajipura)', city: 'Vadodara', distanceKm: 42, prices: [] },
  { id: 'APMC-RAJKOT-04', name: 'Rajkot APMC Market', city: 'Rajkot', distanceKm: 185, prices: [] },
]

export async function getMarkets(req: Request, res: Response) {
  try {
    const markets = await prisma.market.findMany({
      include: {
        prices: {
          orderBy: { observedAt: 'desc' },
          take: 10,
          include: { crop: true },
        },
      },
    })

    const crops = await prisma.crop.findMany()

    return sendSuccess(res, { markets, crops })
  } catch (error: any) {
    console.error('getMarkets DB Error:', error?.message)
    if (isDbAuthError(error)) {
      return sendSuccess(res, {
        markets: FALLBACK_MARKETS,
        crops: memoryDbStore.getCrops(),
      })
    }
    return sendError(res, error.message || 'Failed to fetch markets', 500, 'SERVER_ERROR')
  }
}

export async function getMarketPrices(req: Request, res: Response) {
  try {
    const marketId = req.params.id as string
    const { cropId } = req.query

    const prices = await prisma.marketPrice.findMany({
      where: {
        marketId,
        ...(cropId ? { cropId: cropId as string } : {}),
      },
      include: { crop: true, market: true },
      orderBy: { observedAt: 'desc' },
      take: 30,
    })

    return sendSuccess(res, prices)
  } catch (error: any) {
    console.error('getMarketPrices DB Error:', error?.message)
    if (isDbAuthError(error)) {
      return sendSuccess(res, [])
    }
    return sendError(res, error.message || 'Failed to fetch market prices', 500, 'SERVER_ERROR')
  }
}
