'use client'

import React, { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getOffersApi } from '@/services/api/krishi-api'
import { Tag, Loader2 } from 'lucide-react'

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getOffersApi()
        if (res.success && res.data) setOffers(res.data)
      } catch (err) {
        console.error('Error fetching offers', err)
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
            <Tag className="w-6 h-6 text-amber-400" />
            Platform Offers & Transactions Overview
          </h1>
          <p className="text-stone-400 text-xs mt-1">Audit of all buyer offers and transaction states.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading offers...
          </div>
        ) : (
          <div className="bg-stone-800/90 rounded-2xl border border-stone-700 shadow-xl overflow-hidden">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-400 font-mono font-bold uppercase border-b border-stone-700">
                <tr>
                  <th className="p-3.5">Buyer Name</th>
                  <th className="p-3.5">Lot Number</th>
                  <th className="p-3.5">Offered Rate</th>
                  <th className="p-3.5">Total Value</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-700/60 font-medium">
                {offers.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-750">
                    <td className="p-3.5 font-bold text-white">{o.buyer?.businessName}</td>
                    <td className="p-3.5 font-mono text-amber-400">{o.lot?.lotNumber}</td>
                    <td className="p-3.5 font-bold text-emerald-400">₹{o.offeredPrice}/kg</td>
                    <td className="p-3.5 font-bold text-white">₹{(o.offeredPrice * o.quantityKg).toLocaleString('en-IN')}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
