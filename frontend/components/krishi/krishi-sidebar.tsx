'use client'

import React from 'react'
import Image from 'next/image'
import {
  LayoutDashboard,
  Sprout,
  TrendingUp,
  Users,
  Hourglass,
  Calculator,
  Truck,
  ShieldCheck,
  Building2,
  Bell,
  Headphones,
  Leaf,
  ChevronRight,
} from 'lucide-react'
import { Language } from './krishi-topbar'
import { HarvestLot, cropsList } from '@/lib/market-service'
import { useTranslation } from '@/lib/translations'

export type NavItem =
  | 'dashboard'
  | 'my-crop'
  | 'market-intel'
  | 'buyers'
  | 'sell-vs-wait'
  | 'net-calculator'
  | 'logistics'
  | 'evidence'
  | 'fpo'
  | 'alerts'

interface SidebarProps {
  activeTab: NavItem
  onSelectTab: (tab: NavItem) => void
  currentLang: Language
  onLangChange: (lang: Language) => void
  onOpenSwitchLot: () => void
  activeLot?: HarvestLot
}

export function KrishiSidebar({
  activeTab,
  onSelectTab,
  currentLang,
  onLangChange,
  onOpenSwitchLot,
  activeLot,
}: SidebarProps) {
  const t = useTranslation(currentLang)

  const navItems: { id: NavItem; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'my-crop', label: t.myCrop, icon: Sprout },
    { id: 'market-intel', label: t.marketIntel, icon: TrendingUp },
    { id: 'buyers', label: t.buyers, icon: Users },
    { id: 'sell-vs-wait', label: t.sellVsWait, icon: Hourglass },
    { id: 'logistics', label: t.logistics, icon: Truck },
    { id: 'evidence', label: t.evidence, icon: ShieldCheck },
    { id: 'fpo', label: t.fpo, icon: Building2 },
    { id: 'alerts', label: t.alerts, icon: Bell },
  ]

  const cropLabel = activeLot
    ? (currentLang === 'gu'
        ? (cropsList.find((c) => c.id === activeLot.baseCrop)?.labelGu || activeLot.crop)
        : currentLang === 'hi'
        ? (cropsList.find((c) => c.id === activeLot.baseCrop)?.labelHi || activeLot.crop)
        : activeLot.crop)
    : 'Tomato'

  return (
    <aside className="w-64 bg-[#fbfdfa] border-r border-[#e0e9df] flex flex-col h-screen select-none shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#e5ebe2] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#184e36] flex items-center justify-center text-white shadow-xs">
          <Leaf className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-lg tracking-tight text-[#143c29]">Krishi</span>
            <span className="font-bold text-lg tracking-tight text-[#1f6645]">Intel</span>
          </div>
          <span className="text-[9px] font-semibold tracking-wider text-[#647c6e] uppercase -mt-0.5">
            {t.appSubtitle}
          </span>
        </div>
      </div>

      {/* Farmer Profile Card */}
      <div className="p-3 mx-3 my-3 bg-[#f2f7f0] border border-[#d6e5d3] rounded-xl">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#2b724f] shadow-xs shrink-0">
            <Image
              src="/images/ramesh-patel.jpg"
              alt="Ramesh Patel"
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-[#152e20] truncate">{t.kisanProfile}</span>
            <span className="text-[11px] text-[#55695d] truncate">{t.kisanLocation}</span>
          </div>
        </div>

        {/* Active Lot Pill */}
        <button
          onClick={onOpenSwitchLot}
          className="mt-2.5 w-full text-left bg-white/90 hover:bg-white border border-[#cbe0c7] hover:border-[#206342] px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] text-[#1c4d34] font-medium shadow-xs transition-all group"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-[#1b7340] shrink-0"></span>
            <span className="truncate">
              {activeLot
                ? `${cropLabel.split('(')[0].trim()} • ${activeLot.quantity} kg • ${activeLot.grade}`
                : 'Tomato • 500 kg • Grade A'}
            </span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#527e65] group-hover:translate-x-0.5 transition-transform shrink-0" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#184e36] text-white shadow-xs font-bold'
                  : 'text-[#3c5445] hover:bg-[#edf5eb] hover:text-[#184e36]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#506e5b]'}`} />
              <span className="truncate text-left">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom Kisan Seva Widget */}
      <div className="p-3 border-t border-[#e2eae0] bg-[#f8fbf7]">
        <div className="p-2.5 rounded-lg bg-[#edf4ec] border border-[#d6e3d3] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#184e36]" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-[#143826]">
                {currentLang === 'gu' ? 'કિસાન સહાય' : currentLang === 'hi' ? 'किसान सेवा' : 'Kisan Seva'}
              </span>
              <span className="text-[9px] text-[#55695d]">24x7 Mandi Helpline</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-[10px] font-bold">
            <button
              onClick={() => onLangChange('en')}
              className={`px-1.5 py-0.5 rounded transition-all ${currentLang === 'en' ? 'bg-[#184e36] text-white' : 'text-[#4d6657] hover:bg-[#d6e5d3]'}`}
            >
              EN
            </button>
            <button
              onClick={() => onLangChange('gu')}
              className={`px-1.5 py-0.5 rounded transition-all ${currentLang === 'gu' ? 'bg-[#184e36] text-white' : 'text-[#4d6657] hover:bg-[#d6e5d3]'}`}
            >
              ગુજ
            </button>
            <button
              onClick={() => onLangChange('hi')}
              className={`px-1.5 py-0.5 rounded transition-all ${currentLang === 'hi' ? 'bg-[#184e36] text-white' : 'text-[#4d6657] hover:bg-[#d6e5d3]'}`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
