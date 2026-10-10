'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { useLanguage } from '@/context/language-context'
import { LanguageSelector } from '@/components/LanguageSelector'
import {
  ShieldAlert,
  Users,
  Tractor,
  Building2,
  Store,
  Layers,
  Tag,
  Truck,
  MapPin,
  Activity,
  FileCode,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const navItems = [
    { label: t('Overview', 'Overview'), href: '/admin/dashboard', icon: LayoutDashboard },
    { label: t('User Directory', 'User Directory'), href: '/admin/users', icon: Users },
    { label: t('Farmers', 'Farmers'), href: '/admin/farmers', icon: Tractor },
    { label: t('FPOs', 'FPOs'), href: '/admin/fpos', icon: Building2 },
    { label: t('Buyers', 'Buyers'), href: '/admin/buyers', icon: Store },
    { label: t('Markets', 'Markets'), href: '/admin/markets', icon: MapPin },
    { label: t('Harvest Lots', 'Harvest Lots'), href: '/admin/lots', icon: Layers },
    { label: t('Offers', 'Offers'), href: '/admin/offers', icon: Tag },
    { label: t('Logistics', 'Logistics'), href: '/admin/logistics', icon: Truck },
    { label: t('Fleet Live Track', 'Fleet Live Track'), href: '/admin/tracking', icon: MapPin },
    { label: t('Audit Logs', 'Audit Logs'), href: '/admin/audit-logs', icon: FileCode },
    { label: t('System Health', 'System Health'), href: '/admin/settings', icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      {/* Top Console Header in Krishi Emerald Theme */}
      <header className="bg-emerald-900 border-b border-emerald-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 font-extrabold flex items-center justify-center text-lg shadow-md">
              A
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">
                {t('KrishiIntel Console', 'KrishiIntel Console')}
              </span>
              <span className="ml-2 text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded font-mono font-bold">
                {t('ADMIN ACCESS', 'ADMIN ACCESS')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Language Selector */}
            <LanguageSelector />

            <div className="hidden sm:block text-right text-xs border-l border-emerald-800 pl-3">
              <div className="font-bold text-white">{user?.name || 'Platform Admin'}</div>
              <div className="text-emerald-300 font-mono">Role: SUPER_ADMIN</div>
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

        {/* Console Sub-nav in Krishi Theme */}
        <div className="bg-emerald-950 border-t border-emerald-800 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-xs font-medium py-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow'
                      : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
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

      {/* Main Admin Console Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}
