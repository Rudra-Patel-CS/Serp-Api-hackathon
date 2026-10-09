'use client'

import React, { useState } from 'react'
import { Search, Bell, TrendingUp, TrendingDown, Minus, Check, Sparkles, MapPin } from 'lucide-react'
import Image from 'next/image'

export type Language = 'en' | 'gu' | 'hi'

interface TopbarProps {
  currentLang: Language
  onLangChange: (lang: Language) => void
  onOpenNotifications: () => void
  onSearchQuery?: (q: string) => void
}

export function KrishiTopbar({
  currentLang,
  onLangChange,
  onOpenNotifications,
  onSearchQuery,
}: TopbarProps) {
  const [search, setSearch] = useState('')

  const tickers = [
    { mandi: 'Ahmedabad', price: '₹2,850', trend: 'up', change: '+2.4%' },
    { mandi: 'Surat', price: '₹2,740', trend: 'down', change: '-1.8%' },
    { mandi: 'Vadodara', price: '₹2,810', trend: 'up', change: '+0.9%' },
    { mandi: 'Nadiad', price: '₹2,790', trend: 'flat', change: '0.0%' },
  ]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchQuery) {
      onSearchQuery(search)
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e5ebe3] px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Left: Search Bar & Mandi Ticker */}
        <div className="flex flex-1 items-center gap-3 lg:gap-5 flex-wrap">
          {/* Search Input */}
          <div className="relative min-w-[260px] sm:min-w-[340px] lg:min-w-[420px] flex-1 max-w-[500px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#758a7e]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentLang === 'gu'
                  ? 'પૂછો અથવા લખો: દા.ત. આવતીકાલે આણંદમાં ૫૦૦ કિલો ટામેટા...'
                  : currentLang === 'hi'
                  ? 'पूछें या लिखें: जैसे कल आणंद में 500 किग्रा टमाटर...'
                  : 'Ask or type: e.g. 500 kg tomatoes in Anand tomorrow...'
              }
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#f6f9f5] hover:bg-[#edf3ec] focus:bg-white text-[#193225] placeholder-[#7d8f84] border border-[#d6e2d4] focus:border-[#245e43] rounded-full outline-none transition-all shadow-xs"
            />
          </div>

          {/* Mandi Ticker */}
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-[#e2eae0] text-xs text-[#2b4235]">
            <span className="font-bold text-[10px] tracking-wider text-[#1d5c3f] uppercase flex items-center gap-1 bg-[#eaf4ec] px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1b7340] animate-pulse"></span>
              {currentLang === 'gu' ? 'મંડી ભાવ' : currentLang === 'hi' ? 'मंडी भाव' : 'Mandi Ticker'}
            </span>

            <div className="flex items-center gap-3">
              {tickers.map((t) => (
                <div key={t.mandi} className="flex items-center gap-1.5">
                  <span className="text-[#55695d] font-medium">{t.mandi}</span>
                  <span className="font-bold text-[#1a2f24]">{t.price}</span>
                  {t.trend === 'up' && (
                    <span className="text-[#137333] flex items-center text-[10px] font-semibold">
                      ▲
                    </span>
                  )}
                  {t.trend === 'down' && (
                    <span className="text-[#c5221f] flex items-center text-[10px] font-semibold">
                      ▼
                    </span>
                  )}
                  {t.trend === 'flat' && (
                    <span className="text-[#80868b] flex items-center text-[10px]">
                      =
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Language Selector, Notifications, Farmer Profile */}
        <div className="flex items-center gap-3 sm:gap-4 self-end md:self-auto">
          {/* Language Selector */}
          <div className="flex items-center bg-[#edf3ec] p-0.5 rounded-full border border-[#d3dfd1] text-xs font-medium">
            <button
              onClick={() => onLangChange('en')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                currentLang === 'en'
                  ? 'bg-[#184e36] text-white shadow-xs font-semibold'
                  : 'text-[#385343] hover:text-[#184e36]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLangChange('gu')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                currentLang === 'gu'
                  ? 'bg-[#184e36] text-white shadow-xs font-semibold'
                  : 'text-[#385343] hover:text-[#184e36]'
              }`}
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => onLangChange('hi')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                currentLang === 'hi'
                  ? 'bg-[#184e36] text-white shadow-xs font-semibold'
                  : 'text-[#385343] hover:text-[#184e36]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="Alerts & Telemetry notifications"
            className="relative p-2 rounded-full text-[#314a3b] hover:bg-[#edf3ec] border border-[#d6e2d4] transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c5221f] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              1
            </span>
          </button>

          {/* Farmer Profile Badge */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#dce6da]">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#2b724f] shadow-xs">
              <Image
                src="/images/ramesh-patel.jpg"
                alt="Ramesh Patel"
                width={32}
                height={32}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#152e20] leading-tight">
                R. Patel
              </span>
              <span className="text-[10px] text-[#55695d] font-medium leading-tight">
                Anand Lot #4
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
