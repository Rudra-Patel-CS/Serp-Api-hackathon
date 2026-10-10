import { Router } from 'express'
import { getBuyers, getBuyerById } from '../controllers/buyer.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, getBuyers)
router.get('/:id', authenticate, getBuyerById)

export default router
