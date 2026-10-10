import { Router } from 'express'
import { getLots, getLotById, createLot, updateLot } from '../controllers/lot.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, getLots)
router.get('/:id', authenticate, getLotById)
router.post('/', authenticate, createLot)
router.patch('/:id', authenticate, updateLot)

export default router
