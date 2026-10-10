import { Request, Response } from 'express'
import { prisma } from '../config/db'
import { sendSuccess, sendError } from '../utils/response.util'

export async function getUserNotifications(req: Request, res: Response) {
  try {
    const userId = req.user!.id

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return sendSuccess(res, notifications)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch notifications', 500, 'SERVER_ERROR')
  }
}

export async function markNotificationRead(req: Request, res: Response) {
  try {
    const alertId = req.params.id as string

    const notification = await prisma.notification.update({
      where: { id: alertId },
      data: { read: true },
    })

    return sendSuccess(res, notification)
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to mark notification as read', 500, 'SERVER_ERROR')
  }
}
