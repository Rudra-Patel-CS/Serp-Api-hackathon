'use client'

import React, { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getMarketsApi } from '@/services/api/krishi-api'
import { MapPin, Loader2 } from 'lucide-react'

export default function AdminMarketsPage() {
  const [markets, setMarkets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getMarketsApi()
        if (res.success && res.data?.markets) setMarkets(res.data.markets)
      } catch (err) {
        console.error('Error fetching markets', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="bg-stone-800/90 border border-stone-700 p-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-400" />
            APMC Wholesale Markets & Price Feeds
          </h1>
          <p className="text-stone-400 text-xs mt-1">Configured APMC mandis and daily price bulletin feeds.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading APMC markets...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {markets.map((m) => (
              <div key={m.id} className="bg-stone-800/90 border border-stone-700 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{m.name}</h3>
                  <span className="text-xs bg-emerald-900/60 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded font-mono">
                    {m.marketType}
                  </span>
                </div>
                <div className="text-xs text-stone-400 space-y-1">
                  <div>City/District: {m.city}, {m.district}</div>
                  <div>Distance from Anand: {m.distanceKm} km</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
