import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/db'
import { config } from '../config'
import { sendSuccess, sendError } from '../utils/response.util'
import { Role, UserStatus } from '@prisma/client'

export async function register(req: Request, res: Response) {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
      village,
      taluka,
      district,
      state,
      pincode,
      landArea,
      landUnit,
      primaryCrops,
      fpoName,
      fpoRegistrationNumber,
      fpoAddress,
    } = req.body

    if (!name || !phone || !password || !role) {
      return sendError(res, 'Name, phone, password, and role are required fields', 400, 'VALIDATION_ERROR')
    }

    // Prohibit public Admin registration
    if (role === Role.ADMIN || role === 'ADMIN') {
      return sendError(res, 'Administrator registration cannot be performed publicly', 403, 'FORBIDDEN')
    }

    const targetRole = role as 'FARMER' | 'FPO_MANAGER'
    if (!['FARMER', 'FPO_MANAGER'].includes(targetRole)) {
      return sendError(res, 'Invalid registration role specified', 400, 'VALIDATION_ERROR')
    }

    // Check existing email/phone
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          ...(email ? [{ email }] : []),
        ],
      },
    })

    if (existingUser) {
      return sendError(res, 'An account with this phone number or email already exists', 409, 'ALREADY_EXISTS')
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const userEmail = email || `${phone}@krishiintel.local`

    // Transaction for User + Profile Creation
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: userEmail,
          phone,
          passwordHash,
          role: targetRole,
          status: UserStatus.ACTIVE,
          preferredLanguage: 'en',
        },
      })

      if (targetRole === Role.FARMER) {
        await tx.farmerProfile.create({
          data: {
            userId: user.id,
            village: village || 'Anand',
            taluka: taluka || 'Anand',
            district: district || 'Anand',
            state: state || 'Gujarat',
            pincode: pincode || '388001',
            landArea: landArea ? parseFloat(landArea) : 2.0,
            landUnit: landUnit || 'Acre',
            primaryCrops: primaryCrops || 'Tomato',
          },
        })
      } else if (targetRole === Role.FPO_MANAGER) {
        await tx.fPO.create({
          data: {
            name: fpoName || `${name} FPO Co-operative`,
            registrationNumber: fpoRegistrationNumber || `FPO-${Date.now()}`,
            managerUserId: user.id,
            address: fpoAddress || 'APMC Yard',
            village: village || 'Anand',
            taluka: taluka || 'Anand',
            district: district || 'Anand',
            state: state || 'Gujarat',
            pincode: pincode || '388001',
            contactPhone: phone,
            email: userEmail,
          },
        })
      }

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED',
          entityType: 'User',
          entityId: user.id,
          metadata: JSON.stringify({ role: targetRole, phone }),
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
      })

      return user
    })

    const token = jwt.sign(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return sendSuccess(res, {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        status: newUser.status,
      },
      token,
    }, 201)
  } catch (error: any) {
    console.error('Registration Error:', error)
    return sendError(res, error.message || 'Registration failed', 500, 'SERVER_ERROR')
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { identifier, password, selectedRole } = req.body

    if (!identifier || !password || !selectedRole) {
      return sendError(
        res,
        'Mobile number/email, password, and selected role are required',
        400,
        'VALIDATION_ERROR'
      )
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
      include: {
        farmerProfile: true,
        managedFpo: true,
      },
    })

    if (!user) {
      return sendError(res, 'Invalid credentials. User account not found.', 401, 'INVALID_CREDENTIALS')
    }

    if (user.status === UserStatus.SUSPENDED) {
      return sendError(res, 'Your account has been suspended. Contact administrator.', 403, 'ACCOUNT_SUSPENDED')
    }

    // Role Match Verification Requirement!
    const normalizedSelectedRole = String(selectedRole).toUpperCase()
    if (user.role !== normalizedSelectedRole) {
      return sendError(
        res,
        `Role mismatch! This account is registered as ${user.role}, but you selected ${selectedRole}. Please select the correct role on the role screen.`,
        400,
        'ROLE_MISMATCH'
      )
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return sendError(res, 'Invalid credentials. Password incorrect.', 401, 'INVALID_CREDENTIALS')
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        metadata: JSON.stringify({ role: user.role }),
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    })

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn as any }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return sendSuccess(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl,
        preferredLanguage: user.preferredLanguage,
        farmerProfile: user.farmerProfile,
        managedFpo: user.managedFpo,
      },
      token,
    })
  } catch (error: any) {
    console.error('Login Error:', error)
    return sendError(res, error.message || 'Login failed', 500, 'SERVER_ERROR')
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 401, 'UNAUTHORIZED')
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        farmerProfile: true,
        managedFpo: true,
      },
    })

    if (!user) {
      return sendError(res, 'User not found', 404, 'NOT_FOUND')
    }

    return sendSuccess(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      preferredLanguage: user.preferredLanguage,
      farmerProfile: user.farmerProfile,
      managedFpo: user.managedFpo,
    })
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch user session', 500, 'SERVER_ERROR')
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('token')
  return sendSuccess(res, { message: 'Logged out successfully' })
}
