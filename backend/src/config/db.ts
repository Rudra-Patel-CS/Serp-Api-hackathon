import dotenv from 'dotenv'
import path from 'path'
import { PrismaClient } from '@prisma/client'

// Load environment variables from backend/.env and root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../../.env') })
dotenv.config()

let dbUrl = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/krishiintel'

// Guard against legacy file:./dev.db sqlite URLs when Prisma schema requires MySQL
if (!dbUrl || dbUrl.startsWith('file:')) {
  dbUrl = 'mysql://root:password@localhost:3306/krishiintel'
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})
