import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { sendSuccess, sendError } from '../utils/response.util'

export async function getFarmerProfile(req: Request, res: Response) {
  try {
    const userId = req.user!.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        fpoMemberships: {
          include: {
            fpo: true,
          },
        },
      },
    })

    if (!user) {
      return sendError(res, 'Farmer profile not found', 404, 'NOT_FOUND')
    }

    return sendSuccess(res, user)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch farmer profile', 500, 'SERVER_ERROR')
  }
}

export async function updateFarmerProfile(req: Request, res: Response) {
  try {
    const userId = req.user!.id
    const { name, village, taluka, district, state, pincode, landArea, landUnit, primaryCrops } = req.body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name ? { name } : {}),
        farmerProfile: {
          update: {
            ...(village ? { village } : {}),
            ...(taluka ? { taluka } : {}),
            ...(district ? { district } : {}),
            ...(state ? { state } : {}),
            ...(pincode ? { pincode } : {}),
            ...(landArea ? { landArea: parseFloat(landArea) } : {}),
            ...(landUnit ? { landUnit } : {}),
            ...(primaryCrops ? { primaryCrops } : {}),
          },
        },
      },
      include: { farmerProfile: true },
    })

    return sendSuccess(res, updatedUser)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update profile', 500, 'SERVER_ERROR')
  }
}

export async function getFarmerLots(req: Request, res: Response) {
  try {
    const userId = req.user!.id

    const lots = await prisma.harvestLot.findMany({
      where: { farmerId: userId },
      include: {
        crop: true,
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
    return sendError(res, error.message || 'Failed to fetch farmer lots', 500, 'SERVER_ERROR')
  }
}
