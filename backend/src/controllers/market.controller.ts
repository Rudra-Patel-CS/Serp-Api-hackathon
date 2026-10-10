import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { sendSuccess, sendError } from '../utils/response.util'

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
    return sendError(res, error.message || 'Failed to fetch market prices', 500, 'SERVER_ERROR')
  }
}
