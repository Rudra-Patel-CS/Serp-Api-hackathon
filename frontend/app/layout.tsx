import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/auth-context'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KrishiIntel — Smart Agricultural Selling & Market Intelligence',
  description:
    'Know where, when, and to whom to sell your harvest. Compare markets, calculate net realization, find buyers, and track logistics across Gujarat.',
}

import { LanguageProvider } from '@/context/language-context'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="gu" className="h-full bg-stone-50">
      <body className={`${inter.className} h-full antialiased text-stone-900 bg-stone-50`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster position="top-right" richColors />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
