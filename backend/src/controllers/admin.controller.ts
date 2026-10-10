import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { sendSuccess, sendError } from '../utils/response.util'
import { UserStatus } from '@prisma/client'

export async function getAdminDashboardStats(req: Request, res: Response) {
  try {
    const totalUsers = await prisma.user.count()
    const activeFarmers = await prisma.user.count({ where: { role: 'FARMER', status: 'ACTIVE' } })
    const activeFpos = await prisma.fPO.count({ where: { status: 'ACTIVE' } })
    const verifiedBuyers = await prisma.buyer.count({ where: { verified: true } })

    const totalLots = await prisma.harvestLot.count()
    const activeShipments = await prisma.shipment.count({ where: { status: 'IN_TRANSIT' } })

    const produceSum = await prisma.harvestLot.aggregate({
      _sum: { quantityKg: true },
    })
    const totalProduceKg = produceSum._sum.quantityKg || 0

    const acceptedOffers = await prisma.offer.findMany({
      where: { status: 'ACCEPTED' },
    })
    const totalTransactionValue = acceptedOffers.reduce(
      (acc, curr) => acc + curr.offeredPrice * curr.quantityKg,
      0
    )

    const recentAuditLogs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        user: { select: { name: true, email: true, role: true } },
      },
    })

    return sendSuccess(res, {
      metrics: {
        totalUsers,
        activeFarmers,
        activeFpos,
        verifiedBuyers,
        totalLots,
        activeShipments,
        totalProduceKg,
        totalTransactionValue,
      },
      recentAuditLogs,
    })
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch admin stats', 500, 'SERVER_ERROR')
  }
}

export async function getAdminUsers(req: Request, res: Response) {
  try {
    const { role, status, search } = req.query

    const where: any = {}
    if (role) where.role = role as any
    if (status) where.status = status as any
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { email: { contains: search as string } },
        { phone: { contains: search as string } },
      ]
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        farmerProfile: true,
        managedFpo: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return sendSuccess(res, users)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch users', 500, 'SERVER_ERROR')
  }
}

export async function updateUserStatus(req: Request, res: Response) {
  try {
    const userId = req.params.id as string
    const { status } = req.body

    if (!status || !['ACTIVE', 'SUSPENDED', 'PENDING'].includes(status)) {
      return sendError(res, 'Invalid user status', 400, 'VALIDATION_ERROR')
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: status as UserStatus },
      select: { id: true, name: true, email: true, role: true, status: true },
    })

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: `USER_STATUS_${status}`,
        entityType: 'User',
        entityId: userId,
        metadata: JSON.stringify({ updatedStatus: status }),
        ipAddress: req.ip,
      },
    })

    return sendSuccess(res, updatedUser)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to update user status', 500, 'SERVER_ERROR')
  }
}

export async function getAuditLogs(req: Request, res: Response) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    })
    return sendSuccess(res, logs)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch audit logs', 500, 'SERVER_ERROR')
  }
}

export async function getSystemHealth(req: Request, res: Response) {
  try {
    const dbPingStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbLatencyMs = Date.now() - dbPingStart

    return sendSuccess(res, {
      status: 'HEALTHY',
      uptimeSeconds: process.uptime(),
      database: {
        status: 'CONNECTED',
        latencyMs: dbLatencyMs,
      },
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return sendError(res, 'Database connection healthcheck failed', 500, 'DATABASE_UNHEALTHY')
  }
}
