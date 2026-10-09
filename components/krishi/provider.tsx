'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { translate, type Locale } from '@/lib/i18n'
import { initialAnalysis, sampleLots, type AnalysisInput, type Lot, type Offer, type Role } from '@/lib/market-service'

type DemoContext = {
  locale: Locale; setLocale: (locale: Locale) => void; t: (key: string) => string
  role: Role; setRole: (role: Role) => void; analysis: AnalysisInput; setAnalysis: (input: AnalysisInput) => void
  lots: Lot[]; addLot: (lot: Lot) => void; offers: Offer[]; addOffer: (offer: Offer) => void
  decideOffer: (id: string, status: 'Accepted' | 'Rejected') => void; reset: () => void; offline: boolean
}
const Context = createContext<DemoContext | null>(null)
export function DemoProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const [role, setRole] = useState<Role>('farmer')
  const [analysis, setAnalysis] = useState<AnalysisInput>(initialAnalysis)
  const [lots, setLots] = useState<Lot[]>(sampleLots)
  const [offers, setOffers] = useState<Offer[]>([])
  const [offline, setOffline] = useState(false)
  useEffect(() => { document.documentElement.lang = locale }, [locale])
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    update(); window.addEventListener('online', update); window.addEventListener('offline', update)
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
  }, [])
  const value: DemoContext = { locale, setLocale, t: key => translate(key, locale), role, setRole, analysis, setAnalysis, lots, offers, offline,
    addLot: lot => setLots(current => [lot, ...current]), addOffer: offer => setOffers(current => [offer, ...current]),
    decideOffer: (id, status) => setOffers(current => current.map(offer => offer.id === id ? { ...offer, status } : offer)),
    reset: () => { setLots(sampleLots); setOffers([]); setAnalysis(initialAnalysis) },
  }
  return <Context.Provider value={value}>{children}<Toaster theme="light" position="bottom-right" richColors /></Context.Provider>
}
export function useDemo() { const context = useContext(Context); if (!context) throw new Error('DemoProvider required'); return context }
