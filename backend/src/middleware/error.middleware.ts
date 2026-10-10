import { Request, Response, NextFunction } from 'express'
import { sendError } from '../utils/response.util'

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('🔥 Server Error Exception:', err)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'
  const code = err.code || 'INTERNAL_SERVER_ERROR'

  return sendError(res, message, statusCode, code, err.details)
}
