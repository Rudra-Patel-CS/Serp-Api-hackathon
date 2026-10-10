import { Router } from 'express'
import { getFarmerProfile, updateFarmerProfile, getFarmerLots } from '../controllers/farmer.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

router.get('/me', authenticate, authorize(Role.FARMER, Role.ADMIN), getFarmerProfile)
router.patch('/me', authenticate, authorize(Role.FARMER, Role.ADMIN), updateFarmerProfile)
router.get('/me/lots', authenticate, authorize(Role.FARMER, Role.ADMIN), getFarmerLots)

export default router
