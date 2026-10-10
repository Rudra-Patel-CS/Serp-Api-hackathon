'use client'

import React, { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getBuyersApi } from '@/services/api/krishi-api'
import { Store, Loader2 } from 'lucide-react'

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getBuyersApi()
        if (res.success && res.data) setBuyers(res.data)
      } catch (err) {
        console.error('Error fetching buyers', err)
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
            <Store className="w-6 h-6 text-amber-400" />
            Verified Buyer Registry
          </h1>
          <p className="text-stone-400 text-xs mt-1">Wholesale traders and food processors registered on KrishiIntel.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading buyers...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyers.map((b) => (
              <div key={b.id} className="bg-stone-800/90 border border-stone-700 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-700 px-2.5 py-0.5 rounded uppercase">
                    {b.buyerType}
                  </span>
                  <span className="text-xs text-amber-400 font-bold">Rating: {b.rating}</span>
                </div>
                <h3 className="font-bold text-white text-base">{b.businessName}</h3>
                <div className="text-xs text-stone-400 space-y-1">
                  <div>Contact: {b.contactName} ({b.phone})</div>
                  <div>City: {b.city}, {b.state}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
