import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
dotenv.config()

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
  databaseUrl: process.env.DATABASE_URL || 'mysql://root:password@localhost:3307/krishiintel',
  jwtSecret: process.env.JWT_SECRET || 'krishiintel_jwt_secret_key_development_only',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  serpapiKey: process.env.SERPAPI_KEY || '',
}
