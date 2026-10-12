import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { config } from './config'
import { errorHandler } from './middleware/error.middleware'

import authRoutes from './routes/auth.routes'
import farmerRoutes from './routes/farmer.routes'
import fpoRoutes from './routes/fpo.routes'
import lotRoutes from './routes/lot.routes'
import marketRoutes from './routes/market.routes'
import intelligenceRoutes from './routes/intelligence.routes'
import buyerRoutes from './routes/buyer.routes'
import offerRoutes from './routes/offer.routes'
import logisticsRoutes from './routes/logistics.routes'
import alertRoutes from './routes/alert.routes'
import adminRoutes from './routes/admin.routes'

const app = express()

app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman)
      if (!origin) return callback(null, true)
      // Allow localhost, any *.onrender.com domain, or custom FRONTEND_URL
      if (
        origin.includes('localhost') ||
        origin.endsWith('.onrender.com') ||
        origin === config.frontendUrl
      ) {
        return callback(null, true)
      }
      return callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Root & Healthcheck Routes
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'KrishiIntel Backend API Server is running successfully.',
    healthCheck: '/api/health',
    timestamp: new Date(),
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', system: 'KrishiIntel Express Backend API', timestamp: new Date() })
})

// API Domain Routers
app.use('/api/auth', authRoutes)
app.use('/api/farmers', farmerRoutes)
app.use('/api/fpos', fpoRoutes)
app.use('/api/lots', lotRoutes)
app.use('/api/markets', marketRoutes)
app.use('/api/market-intelligence', intelligenceRoutes)
app.use('/api/buyers', buyerRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/logistics', logisticsRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/admin', adminRoutes)

// Error Handler Middleware
app.use(errorHandler)

export default app
