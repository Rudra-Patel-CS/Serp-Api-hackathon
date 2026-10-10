'use client'

import React from 'react'
import { useLanguage } from '@/context/language-context'
import { Globe } from 'lucide-react'

export function LanguageSelector({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLanguage()

  return (
    <div className={`inline-flex items-center bg-emerald-950/90 border border-emerald-700/80 rounded-xl p-1 text-xs font-semibold text-emerald-200 shadow-sm ${className}`}>
      <Globe className="w-3.5 h-3.5 ml-1.5 mr-1 text-amber-400" />
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2 py-1 rounded-lg transition-colors ${
          locale === 'en' ? 'bg-amber-500 text-stone-950 font-bold shadow' : 'hover:text-white hover:bg-emerald-800'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('gu')}
        className={`px-2 py-1 rounded-lg transition-colors ${
          locale === 'gu' ? 'bg-amber-500 text-stone-950 font-bold shadow' : 'hover:text-white hover:bg-emerald-800'
        }`}
      >
        ગુજરાતી
      </button>
      <button
        type="button"
        onClick={() => setLocale('hi')}
        className={`px-2 py-1 rounded-lg transition-colors ${
          locale === 'hi' ? 'bg-amber-500 text-stone-950 font-bold shadow' : 'hover:text-white hover:bg-emerald-800'
        }`}
      >
        हिंदी
      </button>
    </div>
  )
}
