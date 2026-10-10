import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { sendSuccess, sendError } from '../utils/response.util'
import { LotStatus } from '@prisma/client'

export async function getLots(req: Request, res: Response) {
  try {
    const { status, cropId, farmerId, fpoId } = req.query

    const where: any = {}
    if (status) where.status = status as LotStatus
    if (cropId) where.cropId = cropId as string
    if (farmerId) where.farmerId = farmerId as string
    if (fpoId) where.fpoId = fpoId as string

    // Role-based visibility scoping
    if (req.user?.role === 'FARMER') {
      where.farmerId = req.user.id
    }

    const lots = await prisma.harvestLot.findMany({
      where,
      include: {
        crop: true,
        farmer: {
          select: { id: true, name: true, phone: true, avatarUrl: true },
        },
        fpo: true,
        offers: {
          include: { buyer: true },
        },
        shipments: {
          include: { provider: true, vehicle: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return sendSuccess(res, lots)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch lots', 500, 'SERVER_ERROR')
  }
}

export async function getLotById(req: Request, res: Response) {
  try {
    const lotId = req.params.id as string
    const lot = await prisma.harvestLot.findUnique({
      where: { id: lotId },
      include: {
        crop: true,
        farmer: { include: { farmerProfile: true } },
        fpo: true,
        offers: { include: { buyer: true } },
        shipments: { include: { provider: true, vehicle: true, locations: true } },
      },
    })

    if (!lot) {
      return sendError(res, 'Harvest lot not found', 404, 'NOT_FOUND')
    }

    return sendSuccess(res, lot)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch lot', 500, 'SERVER_ERROR')
  }
}

export async function createLot(req: Request, res: Response) {
  try {
    const userId = req.user!.id
    const { cropId, quantityKg, grade, moisture, farmPlot, harvestDate, location } = req.body

    if (!cropId || !quantityKg || !grade) {
      return sendError(res, 'cropId, quantityKg, and grade are required', 400, 'VALIDATION_ERROR')
    }

    // Check if farmer is member of any FPO
    const membership = await prisma.fPOMember.findFirst({
      where: { farmerId: userId, status: 'ACTIVE' },
    })

    const lotNumber = `LOT-${Date.now().toString().slice(-6)}`

    const newLot = await prisma.harvestLot.create({
      data: {
        lotNumber,
        farmerId: userId,
        fpoId: membership ? membership.fpoId : null,
        cropId,
        quantityKg: parseFloat(quantityKg),
        grade: grade || 'Grade A',
        moisture: moisture || '14%',
        farmPlot: farmPlot || 'Plot 1',
        harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
        location: location || 'Anand, Gujarat',
        status: LotStatus.READY,
      },
      include: {
        crop: true,
        farmer: { select: { id: true, name: true } },
      },
    })

    await prisma.auditLog.create({
      data: {
        userId,
        action: 'LOT_CREATED',
        entityType: 'HarvestLot',
        entityId: newLot.id,
        metadata: JSON.stringify({ lotNumber, cropId, quantityKg }),
        ipAddress: req.ip,
      },
    })

    return sendSuccess(res, newLot, 201)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to create lot', 500, 'SERVER_ERROR')
  }
}

export async function updateLot(req: Request, res: Response) {
  try {
    const lotId = req.params.id as string
    const { status, grade, quantityKg, location } = req.body

    const existingLot = await prisma.harvestLot.findUnique({ where: { id: lotId } })
    if (!existingLot) {
      return sendError(res, 'Lot not found', 404, 'NOT_FOUND')
    }

    // Ownership check
    if (req.user?.role === 'FARMER' && existingLot.farmerId !== req.user.id) {
      return sendError(res, 'Unauthorized access to another farmer lot', 403, 'FORBIDDEN')
    }

    const updatedLot = await prisma.harvestLot.update({
      where: { id: lotId },
      data: {
        ...(status ? { status: status as LotStatus } : {}),
        ...(grade ? { grade } : {}),
        ...(quantityKg ? { quantityKg: parseFloat(quantityKg) } : {}),
        ...(location ? { location } : {}),
      },
      include: { crop: true, farmer: true },
    })

    return sendSuccess(res, updatedLot)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update lot', 500, 'SERVER_ERROR')
  }
}
