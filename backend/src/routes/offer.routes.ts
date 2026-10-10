import { Router } from 'express'
import { getOffers, createOffer, updateOfferStatus } from '../controllers/offer.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', authenticate, getOffers)
router.post('/', authenticate, createOffer)
router.patch('/:id', authenticate, updateOfferStatus)

export default router
