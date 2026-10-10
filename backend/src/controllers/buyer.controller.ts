import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { sendSuccess, sendError } from '../utils/response.util'

export async function getBuyers(req: Request, res: Response) {
  try {
    const { buyerType, cropId } = req.query

    const buyers = await prisma.buyer.findMany({
      where: {
        ...(buyerType ? { buyerType: buyerType as any } : {}),
        ...(cropId ? { requirements: { some: { cropId: cropId as string, active: true } } } : {}),
      },
      include: {
        requirements: { include: { crop: true } },
      },
      orderBy: { rating: 'desc' },
    })

    return sendSuccess(res, buyers)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch buyers', 500, 'SERVER_ERROR')
  }
}

export async function getBuyerById(req: Request, res: Response) {
  try {
    const buyerId = req.params.id as string
    const buyer = await prisma.buyer.findUnique({
      where: { id: buyerId },
      include: {
        requirements: { include: { crop: true } },
        offers: { include: { lot: true } },
      },
    })

    if (!buyer) {
      return sendError(res, 'Buyer not found', 404, 'NOT_FOUND')
    }

    return sendSuccess(res, buyer)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch buyer details', 500, 'SERVER_ERROR')
  }
}
