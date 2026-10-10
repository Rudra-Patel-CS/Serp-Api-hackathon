import { Router } from 'express'
import { getMarkets, getMarketPrices } from '../controllers/market.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, getMarkets)
router.get('/:id/prices', authenticate, getMarketPrices)

export default router
