'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translate, type Locale } from '@/lib/i18n'

type LanguageContextType = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, defaultText?: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'gu',
  setLocale: () => {},
  t: (key, defaultText) => defaultText || key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('gu')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('krishi_locale') as Locale) : null
    if (saved && (saved === 'en' || saved === 'gu' || saved === 'hi')) {
      setLocaleState(saved)
      document.documentElement.lang = saved
    } else {
      document.documentElement.lang = 'gu'
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== 'undefined') {
      localStorage.setItem('krishi_locale', newLocale)
    }
    document.documentElement.lang = newLocale
  }

  const t = (key: string, defaultText?: string) => {
    const translated = translate(key, locale)
    if (translated !== key) return translated
    if (defaultText) {
      const defaultTranslated = translate(defaultText, locale)
      if (defaultTranslated !== defaultText) return defaultTranslated
      return defaultText
    }
    return key
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
