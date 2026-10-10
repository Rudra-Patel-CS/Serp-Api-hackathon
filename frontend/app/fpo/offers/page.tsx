'use client'

import React, { useState, useEffect } from 'react'
import { FpoShell } from '@/components/fpo/FpoShell'
import { getOffersApi } from '@/services/api/krishi-api'
import { Tag, Loader2 } from 'lucide-react'

export default function FpoOffersPage() {
  const [offers, setOffers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getOffersApi()
        if (res.success && res.data) setOffers(res.data)
      } catch (err) {
        console.error('Error fetching FPO offers', err)
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
            <Tag className="w-6 h-6 text-amber-500" />
            FPO Bulk Buyer Offers & Negotiations
          </h1>
          <p className="text-stone-600 text-xs mt-1">
            Bulk offers received from institutional food processors and wholesale buyers.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading bulk offers...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-bold text-stone-900">{offer.buyer?.businessName}</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    {offer.status}
                  </span>
                </div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div>Offered Price: <strong className="text-emerald-800 text-sm">₹{offer.offeredPrice}/kg</strong></div>
                  <div>Quantity: <strong>{offer.quantityKg} kg</strong></div>
                  <div>Harvest Lot: {offer.lot?.lotNumber}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FpoShell>
  )
}
