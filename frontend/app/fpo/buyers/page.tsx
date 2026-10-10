'use client'

import React, { useState, useEffect } from 'react'
import { FpoShell } from '@/components/fpo/FpoShell'
import { getBuyersApi } from '@/services/api/krishi-api'
import { Store, Star, MapPin, Loader2 } from 'lucide-react'

export default function FpoBuyersPage() {
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
    <FpoShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Store className="w-6 h-6 text-emerald-600" />
            Bulk Buyer Procurement Requirements
          </h1>
          <p className="text-stone-600 text-xs mt-1">
            Verified institutional food processors, export traders, and wholesale buyers accepting aggregated co-op volumes.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading bulk buyers...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyers.map((buyer) => (
              <div key={buyer.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full uppercase">
                    {buyer.buyerType}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{buyer.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-stone-900">{buyer.businessName}</h3>
                <div className="text-xs text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{buyer.city}, {buyer.district}</span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="font-bold text-stone-700">Capacity Requirement:</div>
                  <div className="text-stone-600">{buyer.minQuantityKg} kg to {buyer.maxQuantityKg} kg</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FpoShell>
  )
}
