'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import {
  LayoutDashboard,
  Sprout,
  Store,
  Users,
  Tag,
  Truck,
  Bell,
  User,
  LogOut,
  Globe,
  Menu,
  X,
} from 'lucide-react'

export function FarmerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [lang, setLang] = useState<'en' | 'gu' | 'hi'>('en')

  const navItems = [
    { label: 'Home', href: '/farmer/dashboard', icon: LayoutDashboard },
    { label: 'My Produce', href: '/farmer/produce', icon: Sprout },
    { label: 'Markets', href: '/farmer/markets', icon: Store },
    { label: 'Find Buyers', href: '/farmer/buyers', icon: Users },
    { label: 'Offers', href: '/farmer/offers', icon: Tag },
    { label: 'Logistics', href: '/farmer/logistics', icon: Truck },
    { label: 'Alerts', href: '/farmer/alerts', icon: Bell },
    { label: 'Profile', href: '/farmer/profile', icon: User },
  ]

  const bottomNavItems = [
    { label: 'Home', href: '/farmer/dashboard', icon: LayoutDashboard },
    { label: 'Produce', href: '/farmer/produce', icon: Sprout },
    { label: 'Markets', href: '/farmer/markets', icon: Store },
    { label: 'Offers', href: '/farmer/offers', icon: Tag },
    { label: 'Profile', href: '/farmer/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans pb-20 md:pb-0">
      {/* Top Navigation Bar */}
      <header className="bg-emerald-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-stone-950 font-extrabold flex items-center justify-center text-lg">
              K
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">KrishiIntel</span>
              <span className="hidden sm:inline-block ml-2 text-xs bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded font-medium">
                Farmer Workspace
              </span>
            </div>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-emerald-100">
            {navItems.slice(0, 6).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 py-1 transition-colors ${
                    isActive ? 'text-amber-400 font-bold border-b-2 border-amber-400' : 'hover:text-amber-300'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-emerald-950 rounded-lg p-1 text-xs font-semibold text-emerald-200">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-emerald-700 text-white' : 'hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('gu')}
                className={`px-2 py-1 rounded ${lang === 'gu' ? 'bg-emerald-700 text-white' : 'hover:text-white'}`}
              >
                ગુજ
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded ${lang === 'hi' ? 'bg-emerald-700 text-white' : 'hover:text-white'}`}
              >
                हिं
              </button>
            </div>

            {/* Profile User Info & Logout */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-emerald-800 text-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-600 flex items-center justify-center text-amber-400 font-bold">
                {user?.name ? user.name[0] : 'F'}
              </div>
              <div className="text-left leading-tight">
                <div className="font-bold text-white">{user?.name || 'Ramesh Patel'}</div>
                <div className="text-emerald-300">Farmer • Anand</div>
              </div>
            </div>

            <button
              onClick={() => logout()}
              title="Logout"
              className="p-2 text-emerald-200 hover:text-rose-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">{children}</main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-emerald-950 border-t border-emerald-800 text-white z-40">
        <div className="grid grid-cols-5 h-16 text-center">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center text-[10px] font-medium transition-colors ${
                  isActive ? 'text-amber-400 font-bold' : 'text-emerald-200 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mb-0.5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
