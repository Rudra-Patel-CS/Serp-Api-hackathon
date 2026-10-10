import { Router } from 'express'
import { getFpos, getFpoById, getFpoFarmers, getFpoLots } from '../controllers/fpo.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { Role } from '@prisma/client'

const router = Router()

router.get('/', authenticate, getFpos)
router.get('/me/farmers', authenticate, authorize(Role.FPO_MANAGER, Role.ADMIN), getFpoFarmers)
router.get('/me/lots', authenticate, authorize(Role.FPO_MANAGER, Role.ADMIN), getFpoLots)
router.get('/:id', authenticate, getFpoById)

export default router
