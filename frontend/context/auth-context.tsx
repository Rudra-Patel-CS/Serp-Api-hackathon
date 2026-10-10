'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getMeApi, logoutApi } from '@/services/api/auth-api'

export type PlatformRole = 'FARMER' | 'FPO_MANAGER' | 'ADMIN'

export interface UserSession {
  id: string
  name: string
  email: string
  phone: string
  role: PlatformRole
  status: string
  avatarUrl?: string
  preferredLanguage?: string
  farmerProfile?: any
  managedFpo?: any
}

interface AuthContextType {
  user: UserSession | null
  token: string | null
  selectedRole: PlatformRole | null
  setSelectedRole: (role: PlatformRole) => void
  isAuthenticated: boolean
  isLoading: boolean
  setUserSession: (user: UserSession, token: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [selectedRole, setSelectedRoleState] = useState<PlatformRole | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    // Restore session from localStorage and verify with backend
    const storedToken = localStorage.getItem('krishi_token')
    const storedUserStr = localStorage.getItem('krishi_user')
    const storedRole = localStorage.getItem('krishi_selected_role') as PlatformRole

    if (storedRole) {
      setSelectedRoleState(storedRole)
    }

    if (storedToken && storedUserStr) {
      try {
        const parsedUser = JSON.parse(storedUserStr)
        setUser(parsedUser)
        setToken(storedToken)
      } catch (e) {
        console.error('Session restore parse error', e)
      }

      // Verify token with backend /api/auth/me
      getMeApi().then((res) => {
        if (res.success && res.data) {
          setUser(res.data)
        } else {
          // Token expired or invalid
          localStorage.removeItem('krishi_token')
          localStorage.removeItem('krishi_user')
          setUser(null)
          setToken(null)
        }
        setIsLoading(false)
      })
    } else {
      setIsLoading(false)
    }
  }, [])

  const setSelectedRole = (role: PlatformRole) => {
    setSelectedRoleState(role)
    if (typeof window !== 'undefined') {
      localStorage.setItem('krishi_selected_role', role)
    }
  }

  const setUserSession = (newUser: UserSession, newToken: string) => {
    setUser(newUser)
    setToken(newToken)
    setSelectedRole(newUser.role)
    if (typeof window !== 'undefined') {
      localStorage.setItem('krishi_token', newToken)
      localStorage.setItem('krishi_user', JSON.stringify(newUser))
    }
  }

  const logout = async () => {
    await logoutApi()
    setUser(null)
    setToken(null)
    setSelectedRoleState(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        selectedRole,
        setSelectedRole,
        isAuthenticated: !!user && !!token,
        isLoading,
        setUserSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
