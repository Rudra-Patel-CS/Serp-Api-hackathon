import { Router } from 'express'
import {
  getAdminDashboardStats,
  getAdminUsers,
  updateUserStatus,
  getAuditLogs,
  getSystemHealth,
} from '../controllers/admin.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

// All admin routes strictly enforced with authorize(Role.ADMIN)
router.use(authenticate, authorize(Role.ADMIN))

router.get('/dashboard', getAdminDashboardStats)
router.get('/users', getAdminUsers)
router.patch('/users/:id/status', updateUserStatus)
router.get('/audit-logs', getAuditLogs)
router.get('/system-health', getSystemHealth)

export default router
