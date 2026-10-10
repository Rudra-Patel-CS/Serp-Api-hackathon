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

export async function getFpos(req: Request, res: Response) {
  try {
    const fpos = await prisma.fPO.findMany({
      include: {
        manager: {
          select: { id: true, name: true, phone: true, email: true },
        },
        members: true,
      },
    })
    return sendSuccess(res, fpos)
  } catch (error: any) {
    if (isDbAuthError(error)) {
      return sendSuccess(res, memoryDbStore.getFpos())
    }
    return sendError(res, error.message || 'Failed to list FPOs', 500, 'SERVER_ERROR')
  }
}

export async function getFpoById(req: Request, res: Response) {
  try {
    const fpoId = req.params.id as string
    const fpo = await prisma.fPO.findUnique({
      where: { id: fpoId },
      include: {
        manager: true,
        members: {
          include: {
            farmer: {
              include: { farmerProfile: true },
            },
          },
        },
        harvestLots: {
          include: { crop: true, farmer: true },
        },
      },
    })

    if (!fpo) {
      return sendError(res, 'FPO record not found', 404, 'NOT_FOUND')
    }

    return sendSuccess(res, fpo)
  } catch (error: any) {
    if (isDbAuthError(error)) {
      return sendSuccess(res, memoryDbStore.getFpoById(req.params.id as string))
    }
    return sendError(res, error.message || 'Failed to fetch FPO details', 500, 'SERVER_ERROR')
  }
}

export async function getFpoFarmers(req: Request, res: Response) {
  try {
    const userId = req.user?.id || 'DEMO-FPO-001'
    const fpo = await prisma.fPO.findFirst({
      where: { managerUserId: userId },
    })

    if (!fpo) {
      return sendError(res, 'Managed FPO not found for current user', 404, 'NOT_FOUND')
    }

    const members = await prisma.fPOMember.findMany({
      where: { fpoId: fpo.id },
      include: {
        farmer: {
          include: {
            farmerProfile: true,
            harvestLots: {
              include: { crop: true },
            },
          },
        },
      },
    })

    return sendSuccess(res, members)
  } catch (error: any) {
    if (isDbAuthError(error)) {
      const demoMembers = [
        {
          id: 'MEM-01',
          farmerId: 'DEMO-FARMER-001',
          farmer: memoryDbStore.getUserById('DEMO-FARMER-001'),
          status: 'ACTIVE',
        },
      ]
      return sendSuccess(res, demoMembers)
    }
    return sendError(res, error.message || 'Failed to fetch FPO farmers', 500, 'SERVER_ERROR')
  }
}

export async function getFpoLots(req: Request, res: Response) {
  try {
    const userId = req.user?.id || 'DEMO-FPO-001'
    const fpo = await prisma.fPO.findFirst({
      where: { managerUserId: userId },
    })

    if (!fpo) {
      return sendError(res, 'Managed FPO not found', 404, 'NOT_FOUND')
    }

    const lots = await prisma.harvestLot.findMany({
      where: { fpoId: fpo.id },
      include: {
        crop: true,
        farmer: {
          select: { id: true, name: true, phone: true },
        },
        offers: {
          include: { buyer: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return sendSuccess(res, lots)
  } catch (error: any) {
    if (isDbAuthError(error)) {
      return sendSuccess(res, memoryDbStore.getLots({ fpoId: 'FPO-001' }))
    }
    return sendError(res, error.message || 'Failed to fetch FPO lots', 500, 'SERVER_ERROR')
  }
}
