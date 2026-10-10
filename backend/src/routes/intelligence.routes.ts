import { Router } from 'express'
import { analyzeMarketOpportunity, getEvidenceRecords, discoverBuyers } from '../controllers/intelligence.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/analyze', authenticate, analyzeMarketOpportunity)
router.get('/evidence', authenticate, getEvidenceRecords)
router.get('/discover-buyers', authenticate, discoverBuyers)

export default router
