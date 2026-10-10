import { Router } from 'express'
import { analyzeMarketOpportunity, getEvidenceRecords } from '../controllers/intelligence.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/analyze', authenticate, analyzeMarketOpportunity)
router.get('/evidence', authenticate, getEvidenceRecords)

export default router
