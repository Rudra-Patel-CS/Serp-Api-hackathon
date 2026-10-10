import { Router } from 'express'
import { getUserNotifications, markNotificationRead } from '../controllers/alert.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, getUserNotifications)
router.patch('/:id/read', authenticate, markNotificationRead)

export default router
