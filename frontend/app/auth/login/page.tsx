'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth, PlatformRole } from '@/context/auth-context'
import { loginApi } from '@/services/api/auth-api'
import { toast } from 'sonner'
import { Lock, Phone, UserCheck, ArrowLeft, Loader2, Sparkles, AlertCircle } from 'lucide-react'

function LoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { selectedRole, setSelectedRole, setUserSession } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const roleParam = searchParams.get('role') as PlatformRole
    if (roleParam && ['FARMER', 'FPO_MANAGER', 'ADMIN'].includes(roleParam)) {
      setSelectedRole(roleParam)
    }
  }, [searchParams, setSelectedRole])

  const activeRole: PlatformRole = selectedRole || (searchParams.get('role') as PlatformRole) || 'FARMER'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!identifier || !password) {
      toast.error('Please enter your mobile number/email and password')
      return
    }

    setIsLoading(true)

    try {
      const res = await loginApi({
        identifier,
        password,
        selectedRole: activeRole,
      })

      if (res.success && res.data) {
        toast.success(`Welcome back, ${res.data.user.name}!`)
        setUserSession(res.data.user, res.data.token)

        if (res.data.user.role === 'FARMER') {
          router.push('/farmer/dashboard')
        } else if (res.data.user.role === 'FPO_MANAGER') {
          router.push('/fpo/dashboard')
        } else if (res.data.user.role === 'ADMIN') {
          router.push('/admin/dashboard')
        }
      } else {
        const message = res.error?.message || 'Login failed. Please check credentials.'
        setErrorMsg(message)
        toast.error(message)
      }
    } catch (err: any) {
      setErrorMsg('An error occurred while connecting to authentication service.')
      toast.error('Network connection error')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoAccount = (role: PlatformRole) => {
    setSelectedRole(role)
    if (role === 'FARMER') {
      setIdentifier('farmer@demo.krishiintel.local')
      setPassword('Farmer123!')
    } else if (role === 'FPO_MANAGER') {
      setIdentifier('fpo@demo.krishiintel.local')
      setPassword('Fpo123!')
    } else if (role === 'ADMIN') {
      setIdentifier('admin@demo.krishiintel.local')
      setPassword('Admin123!')
    }
  }

  return (
    <div className="bg-stone-800/90 border border-stone-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center justify-between bg-stone-900/80 p-3 rounded-xl border border-stone-700 mb-6">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-amber-400" />
          <span className="text-xs text-stone-400 font-medium">Selected Role:</span>
        </div>
        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase">
          {activeRole.replace('_', ' ')}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-white text-center mb-1">Account Authentication</h1>
      <p className="text-stone-400 text-xs text-center mb-6">
        Sign in to access your role-specific agricultural workspace.
      </p>

      {errorMsg && (
        <div className="mb-5 bg-rose-900/40 border border-rose-700/60 text-rose-200 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>{errorMsg}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-300 mb-1.5">
            Mobile Number / Email Address
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="e.g. 9876543210 or farmer@demo.krishiintel.local"
            required
            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-stone-300">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-amber-400 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying Credentials...
            </>
          ) : (
            `Login as ${activeRole.replace('_', ' ')}`
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-stone-700/60 text-center text-xs text-stone-400">
        Don't have an account yet?{' '}
        <Link href="/auth/register" className="text-amber-400 font-bold hover:underline">
          Create Account
        </Link>
      </div>

      <div className="mt-6 bg-stone-900/90 p-4 rounded-xl border border-stone-700/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Quick Development Demo Autofill</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => fillDemoAccount('FARMER')}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 py-2 px-2 rounded border border-stone-700 text-center font-medium"
          >
            Farmer
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('FPO_MANAGER')}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 py-2 px-2 rounded border border-stone-700 text-center font-medium"
          >
            FPO Mgr
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('ADMIN')}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 py-2 px-2 rounded border border-stone-700 text-center font-medium"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/auth/role" className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Change Role Selection
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
            K
          </div>
          <span className="font-bold text-white text-lg">KrishiIntel</span>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full py-8">
        <Suspense fallback={<div className="text-center py-12 text-stone-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading Login...</div>}>
          <LoginFormContent />
        </Suspense>
      </div>

      <div className="text-center text-xs text-stone-500">
        Secured with server-side HTTP-only cookies and bcrypt password hashing.
      </div>
    </div>
  )
}
