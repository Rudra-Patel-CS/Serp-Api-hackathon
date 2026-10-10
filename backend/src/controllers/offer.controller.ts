import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { sendSuccess, sendError } from '../utils/response.util'
import { OfferStatus, LotStatus } from '@prisma/client'
import { emitOfferEvent, emitNotificationEvent } from '../realtime/socket.server'
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

export async function getOffers(req: Request, res: Response) {
  try {
    const userId = req.user?.id || 'DEMO-FARMER-001'
    const role = req.user?.role || 'FARMER'

    let where: any = {}
    if (role === 'FARMER') {
      where.lot = { farmerId: userId }
    } else if (role === 'FPO_MANAGER') {
      const fpo = await prisma.fPO.findFirst({ where: { managerUserId: userId } })
      if (fpo) {
        where.lot = { fpoId: fpo.id }
      }
    }

    const offers = await prisma.offer.findMany({
      where,
      include: {
        buyer: true,
        lot: {
          include: { crop: true, farmer: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return sendSuccess(res, offers)
  } catch (error: any) {
    if (isDbAuthError(error)) {
      return sendSuccess(res, memoryDbStore.getOffers())
    }
    return sendError(res, error.message || 'Failed to fetch offers', 500, 'SERVER_ERROR')
  }
}

export async function createOffer(req: Request, res: Response) {
  try {
    const { lotId, buyerId, offeredPrice, quantityKg } = req.body

    if (!lotId || !buyerId || !offeredPrice || !quantityKg) {
      return sendError(res, 'lotId, buyerId, offeredPrice, and quantityKg are required', 400, 'VALIDATION_ERROR')
    }

    const lot = await prisma.harvestLot.findUnique({ where: { id: lotId } })
    if (!lot) {
      return sendError(res, 'Harvest lot not found', 404, 'NOT_FOUND')
    }

    const offer = await prisma.offer.create({
      data: {
        lotId,
        buyerId,
        offeredPrice: parseFloat(offeredPrice),
        quantityKg: parseFloat(quantityKg),
        status: OfferStatus.PENDING,
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000),
      },
      include: { buyer: true, lot: true },
    })

    emitNotificationEvent(lot.farmerId, {
      title: 'New Offer Received!',
      message: `Buyer ${offer.buyer.businessName} made an offer of ₹${offeredPrice}/kg for Lot #${lot.lotNumber}`,
      entityType: 'Offer',
      entityId: offer.id,
    })

    await prisma.notification.create({
      data: {
        userId: lot.farmerId,
        type: 'OFFER_RECEIVED',
        title: 'New Offer Received!',
        message: `Buyer ${offer.buyer.businessName} made an offer of ₹${offeredPrice}/kg for Lot #${lot.lotNumber}`,
        entityType: 'Offer',
        entityId: offer.id,
      },
    })

    return sendSuccess(res, offer, 201)
  } catch (error: any) {
    if (isDbAuthError(error)) {
      const createdOffer = memoryDbStore.createOffer(req.body)
      return sendSuccess(res, createdOffer, 201)
    }
    return sendError(res, error.message || 'Failed to create offer', 500, 'SERVER_ERROR')
  }
}

export async function updateOfferStatus(req: Request, res: Response) {
  try {
    const offerId = req.params.id as string
    const { status } = req.body

    if (!status || !['ACCEPTED', 'REJECTED', 'CANCELLED'].includes(status)) {
      return sendError(res, 'Invalid offer status', 400, 'VALIDATION_ERROR')
    }

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: { lot: true, buyer: true },
    })

    if (!offer) {
      return sendError(res, 'Offer not found', 404, 'NOT_FOUND')
    }

    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: { status: status as OfferStatus },
      include: { buyer: true, lot: true },
    })

    if (status === 'ACCEPTED') {
      await prisma.harvestLot.update({
        where: { id: offer.lotId },
        data: { status: LotStatus.SOLD },
      })
    }

    emitOfferEvent(offer.lot.farmerId, updatedOffer)

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id || 'DEMO-FARMER-001',
        action: `OFFER_${status}`,
        entityType: 'Offer',
        entityId: offer.id,
        metadata: JSON.stringify({ offeredPrice: offer.offeredPrice, lotId: offer.lotId }),
        ipAddress: req.ip,
      },
    })

    return sendSuccess(res, updatedOffer)
  } catch (error: any) {
    if (isDbAuthError(error)) {
      const fallbackOffers = memoryDbStore.getOffers()
      const off = fallbackOffers.find((o) => o.id === req.params.id) || fallbackOffers[0]
      if (off) off.status = req.body.status
      return sendSuccess(res, off || { id: req.params.id, status: req.body.status })
    }
    return sendError(res, error.message || 'Failed to update offer', 500, 'SERVER_ERROR')
  }
}
