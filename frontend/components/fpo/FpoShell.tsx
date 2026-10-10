'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useLanguage } from '@/context/language-context'
import { LanguageSelector } from '@/components/LanguageSelector'
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  Store,
  Tag,
  Truck,
  FileSpreadsheet,
  User,
  LogOut,
  Building2,
} from 'lucide-react'

export function FpoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const navItems = [
    { label: t('Overview', 'Overview'), href: '/fpo/dashboard', icon: LayoutDashboard },
    { label: t('Farmers', 'Farmers'), href: '/fpo/farmers', icon: Users },
    { label: t('Procurement', 'Procurement'), href: '/fpo/procurement', icon: Package },
    { label: t('Aggregated Lots', 'Aggregated Lots'), href: '/fpo/lots', icon: Layers },
    { label: t('Buyer Match', 'Buyer Match'), href: '/fpo/buyers', icon: Store },
    { label: t('Offers', 'Offers'), href: '/fpo/offers', icon: Tag },
    { label: t('Logistics', 'Logistics'), href: '/fpo/logistics', icon: Truck },
    { label: t('Settlements & Bahi', 'Settlements & Bahi'), href: '/fpo/reports', icon: FileSpreadsheet },
    { label: t('Profile', 'Profile'), href: '/fpo/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      {/* Topbar */}
      <header className="bg-emerald-950 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg">
              F
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">KrishiIntel</span>
              <span className="hidden sm:inline-block ml-2 text-xs bg-emerald-800 text-emerald-200 border border-emerald-600 px-2 py-0.5 rounded font-medium">
                {t('FPO Manager Workspace', 'FPO Manager Workspace')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Language Selector */}
            <LanguageSelector />

            <div className="hidden sm:flex items-center gap-2 text-xs text-right border-l border-emerald-800 pl-3">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-white">{user?.managedFpo?.name || 'Anand Produce Co-op Ltd'}</div>
                <div className="text-emerald-300">Reg: FPO-GUJ-2024-8891</div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="p-2 text-emerald-200 hover:text-rose-300 transition-colors"
              title={t('Logout', 'Logout')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-nav row for FPO Manager */}
        <div className="bg-emerald-900 border-t border-emerald-800 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-xs font-medium py-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive ? 'bg-amber-500 text-stone-950 font-bold shadow-sm' : 'text-emerald-100 hover:bg-emerald-850'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}
