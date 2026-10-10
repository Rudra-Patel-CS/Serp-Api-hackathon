'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { translate, type Locale } from '@/lib/i18n'
import { initialLots, type HarvestLot, type Role } from '@/lib/market-service'

type DemoContext = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  role: Role
  setRole: (role: Role) => void
  lots: HarvestLot[]
  activeLot: HarvestLot
  setActiveLot: (lot: HarvestLot) => void
  addLot: (lot: HarvestLot) => void
  offline: boolean
}

const Context = createContext<DemoContext | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const [role, setRole] = useState<Role>('farmer')
  const [lots, setLots] = useState<HarvestLot[]>(initialLots)
  const [activeLot, setActiveLot] = useState<HarvestLot>(initialLots[0])
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  const addLot = (newLot: HarvestLot) => {
    setLots((prev) => [newLot, ...prev])
    setActiveLot(newLot)
  }

  const value: DemoContext = {
    locale,
    setLocale,
    t: (key) => translate(key, locale),
    role,
    setRole,
    lots,
    activeLot,
    setActiveLot,
    addLot,
    offline,
  }

  return (
    <Context.Provider value={value}>
      {children}
      <Toaster theme="light" position="top-right" richColors />
    </Context.Provider>
  )
}

export function useDemo() {
  const context = useContext(Context)
  if (!context) throw new Error('DemoProvider required')
  return context
}
