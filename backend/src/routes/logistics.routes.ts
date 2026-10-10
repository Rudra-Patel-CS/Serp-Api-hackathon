import { Router } from 'express'
import {
  getLogisticsProviders,
  getShipments,
  getShipmentTracking,
  updateShipmentLocation,
} from '../controllers/logistics.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/providers', authenticate, getLogisticsProviders)
router.get('/shipments', authenticate, getShipments)
router.get('/shipments/:id/track', authenticate, getShipmentTracking)
router.post('/shipments/:id/location', authenticate, updateShipmentLocation)

export default router
