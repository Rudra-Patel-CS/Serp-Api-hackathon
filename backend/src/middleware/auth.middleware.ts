import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { sendError } from '../utils/response.util'
import { Role } from '@prisma/client'

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  status: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }

    if (!token) {
      return sendError(res, 'Authentication token required', 401, 'UNAUTHORIZED')
    }

    const decoded = jwt.verify(token, config.jwtSecret) as AuthenticatedUser
    req.user = decoded
    next()
  } catch (error) {
    return sendError(res, 'Invalid or expired authentication token', 401, 'UNAUTHORIZED')
  }
}

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401, 'UNAUTHORIZED')
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Required role: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`,
        403,
        'FORBIDDEN'
      )
    }

    next()
  }
}
