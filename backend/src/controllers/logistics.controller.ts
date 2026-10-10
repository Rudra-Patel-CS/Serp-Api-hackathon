import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { sendSuccess, sendError } from '../utils/response.util'
import { ShipmentStatus } from '@prisma/client'
import { emitShipmentLocationUpdate } from '../realtime/socket.server'

export async function getLogisticsProviders(req: Request, res: Response) {
  try {
    const providers = await prisma.logisticsProvider.findMany({
      include: { vehicles: true },
    })
    return sendSuccess(res, providers)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch providers', 500, 'SERVER_ERROR')
  }
}

export async function getShipments(req: Request, res: Response) {
  try {
    const userId = req.user!.id
    const role = req.user!.role

    let where: any = {}
    if (role === 'FARMER') {
      where.lot = { farmerId: userId }
    } else if (role === 'FPO_MANAGER') {
      const fpo = await prisma.fPO.findFirst({ where: { managerUserId: userId } })
      if (fpo) {
        where.lot = { fpoId: fpo.id }
      }
    }

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        lot: { include: { crop: true, farmer: true } },
        provider: true,
        vehicle: true,
        locations: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return sendSuccess(res, shipments)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch shipments', 500, 'SERVER_ERROR')
  }
}

export async function getShipmentTracking(req: Request, res: Response) {
  try {
    const shipmentId = req.params.id as string

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        lot: { include: { crop: true, farmer: true } },
        provider: true,
        vehicle: true,
        locations: {
          orderBy: { recordedAt: 'asc' },
        },
      },
    })

    if (!shipment) {
      return sendError(res, 'Shipment not found', 404, 'NOT_FOUND')
    }

    return sendSuccess(res, shipment)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch shipment tracking', 500, 'SERVER_ERROR')
  }
}

export async function updateShipmentLocation(req: Request, res: Response) {
  try {
    const shipmentId = req.params.id as string
    const { latitude, longitude, speed, heading, accuracy } = req.body

    if (!latitude || !longitude) {
      return sendError(res, 'latitude and longitude are required', 400, 'VALIDATION_ERROR')
    }

    const snapshot = await prisma.shipmentLocation.create({
      data: {
        shipmentId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        speed: speed ? parseFloat(speed) : 45,
        heading: heading ? parseFloat(heading) : 315,
        accuracy: accuracy ? parseFloat(accuracy) : 5,
      },
    })

    // Emit live location update over Socket.IO room `shipment:${shipmentId}`
    emitShipmentLocationUpdate(shipmentId, snapshot)

    return sendSuccess(res, snapshot, 201)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to record location update', 500, 'SERVER_ERROR')
  }
}
