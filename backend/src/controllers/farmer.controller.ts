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

export async function getFarmerProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id || 'DEMO-FARMER-001'

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
    console.error('getFarmerProfile DB Error:', error?.message)
    if (isDbAuthError(error)) {
      const fallbackUser = memoryDbStore.getUserById(req.user?.id || 'DEMO-FARMER-001') || memoryDbStore.getUsers()[0]
      return sendSuccess(res, fallbackUser)
    }
    return sendError(res, error.message || 'Failed to fetch farmer profile', 500, 'SERVER_ERROR')
  }
}

export async function updateFarmerProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.id || 'DEMO-FARMER-001'
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
    console.error('updateFarmerProfile DB Error:', error?.message)
    if (isDbAuthError(error)) {
      const fallbackUser = memoryDbStore.getUserById(req.user?.id || 'DEMO-FARMER-001') || memoryDbStore.getUsers()[0]
      if (req.body.name) fallbackUser.name = req.body.name
      if (!fallbackUser.farmerProfile) fallbackUser.farmerProfile = {}
      if (req.body.village) fallbackUser.farmerProfile.village = req.body.village
      if (req.body.district) fallbackUser.farmerProfile.district = req.body.district
      if (req.body.state) fallbackUser.farmerProfile.state = req.body.state
      if (req.body.landArea) fallbackUser.farmerProfile.landArea = parseFloat(req.body.landArea)
      if (req.body.primaryCrops) fallbackUser.farmerProfile.primaryCrops = req.body.primaryCrops
      return sendSuccess(res, fallbackUser)
    }
    return sendError(res, error.message || 'Failed to update profile', 500, 'SERVER_ERROR')
  }
}

export async function getFarmerLots(req: Request, res: Response) {
  try {
    const userId = req.user?.id || 'DEMO-FARMER-001'

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
    console.error('getFarmerLots DB Error:', error?.message)
    if (isDbAuthError(error)) {
      const farmerId = req.user?.id || 'DEMO-FARMER-001'
      const fallbackLots = memoryDbStore.getLots({ farmerId })
      return sendSuccess(res, fallbackLots)
    }
    return sendError(res, error.message || 'Failed to fetch farmer lots', 500, 'SERVER_ERROR')
  }
}
