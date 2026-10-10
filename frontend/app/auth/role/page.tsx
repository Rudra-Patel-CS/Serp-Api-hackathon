'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth, PlatformRole } from '@/context/auth-context'
import { Tractor, Users, ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RoleSelectionPage() {
  const router = useRouter()
  const { setSelectedRole } = useAuth()

  const handleSelectRole = (role: PlatformRole) => {
    setSelectedRole(role)
    router.push(`/auth/login?role=${role}`)
  }

  return (
    <div className="min-h-screen bg-stone-900 text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to KrishiIntel Home
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
            K
          </div>
          <span className="font-bold text-white text-lg">KrishiIntel</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto w-full py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block bg-emerald-800/50 border border-emerald-600/50 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Step 1: Role Pre-Selection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Welcome to KrishiIntel</h1>
          <p className="text-stone-300 text-base mt-2">
            Choose how you use KrishiIntel. Your selection dictates workspace security and feature access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Farmer */}
          <div className="bg-stone-800/90 rounded-2xl p-6 border-2 border-stone-700 hover:border-amber-500 shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Tractor className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Farmer</h2>
              <p className="text-amber-400 font-semibold text-xs mb-4 uppercase tracking-wider">Individual Harvest Seller</p>
              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                Manage your crops, compare APMC market prices, calculate net earnings, find buyers, and sell your produce.
              </p>
            </div>
            <button
              onClick={() => handleSelectRole('FARMER')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-amber-500/20"
            >
              Continue as Farmer
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: FPO Manager */}
          <div className="bg-stone-800/90 rounded-2xl p-6 border-2 border-stone-700 hover:border-emerald-500 shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">FPO Manager</h2>
              <p className="text-emerald-400 font-semibold text-xs mb-4 uppercase tracking-wider">Co-operative Operations</p>
              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                Manage member farmers, procure produce, aggregate lots for freight savings, and coordinate with bulk buyers.
              </p>
            </div>
            <button
              onClick={() => handleSelectRole('FPO_MANAGER')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-emerald-500/20"
            >
              Continue as FPO Manager
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Admin */}
          <div className="bg-stone-800/90 rounded-2xl p-6 border-2 border-stone-700 hover:border-stone-400 shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-xl bg-stone-700/60 text-stone-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Administrator</h2>
              <p className="text-stone-400 font-semibold text-xs mb-4 uppercase tracking-wider">Platform Governance</p>
              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                Manage users, markets, FPOs, buyers, logistics tracking, platform transaction metrics, and audit logs.
              </p>
            </div>
            <button
              onClick={() => handleSelectRole('ADMIN')}
              className="w-full bg-stone-700 hover:bg-stone-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              Continue as Administrator
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-stone-400 border-t border-stone-800 pt-4">
        Role selection is strictly verified against your authenticated database account credentials.
      </div>
    </div>
  )
}
