'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
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
  Settings,
  LogOut,
  LayoutDashboard,
} from 'lucide-react'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Directory', href: '/admin/users', icon: Users },
    { label: 'Farmers', href: '/admin/farmers', icon: Tractor },
    { label: 'FPOs', href: '/admin/fpos', icon: Building2 },
    { label: 'Buyers', href: '/admin/buyers', icon: Store },
    { label: 'Markets', href: '/admin/markets', icon: MapPin },
    { label: 'Harvest Lots', href: '/admin/lots', icon: Layers },
    { label: 'Offers', href: '/admin/offers', icon: Tag },
    { label: 'Logistics', href: '/admin/logistics', icon: Truck },
    { label: 'Fleet Live Track', href: '/admin/tracking', icon: MapPin },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: FileCode },
    { label: 'System Health', href: '/admin/settings', icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans">
      {/* Top Console Header */}
      <header className="bg-stone-950 border-b border-stone-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md">
              A
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">KrishiIntel Console</span>
              <span className="ml-2 text-xs bg-rose-900/60 text-rose-300 border border-rose-700/50 px-2 py-0.5 rounded font-mono font-bold">
                ADMIN ACCESS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right text-xs">
              <div className="font-bold text-white">{user?.name || 'Platform Admin'}</div>
              <div className="text-stone-400 font-mono">Role: SUPER_ADMIN</div>
            </div>

            <button
              onClick={() => logout()}
              className="p-2 text-stone-400 hover:text-rose-400 transition-colors"
              title="Logout System Console"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Console Sub-nav */}
        <div className="bg-stone-900/90 border-t border-stone-800 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-xs font-medium py-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive ? 'bg-rose-900/40 text-amber-400 border border-rose-700/60 font-bold' : 'text-stone-300 hover:bg-stone-800'
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
