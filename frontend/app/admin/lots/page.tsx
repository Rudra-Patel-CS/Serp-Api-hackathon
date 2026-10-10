'use client'

import React, { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getLotsApi } from '@/services/api/krishi-api'
import { Layers, Loader2 } from 'lucide-react'

export default function AdminLotsPage() {
  const [lots, setLots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getLotsApi()
        if (res.success && res.data) setLots(res.data)
      } catch (err) {
        console.error('Error fetching lots', err)
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
            <Layers className="w-6 h-6 text-amber-400" />
            Platform Harvest Lots Registry
          </h1>
          <p className="text-stone-400 text-xs mt-1">All farmer and FPO crop produce lots registered in MySQL database.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading lots...
          </div>
        ) : (
          <div className="bg-stone-800/90 rounded-2xl border border-stone-700 shadow-xl overflow-hidden">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-400 font-mono font-bold uppercase border-b border-stone-700">
                <tr>
                  <th className="p-3.5">Lot #</th>
                  <th className="p-3.5">Farmer</th>
                  <th className="p-3.5">Crop</th>
                  <th className="p-3.5">Quantity (kg)</th>
                  <th className="p-3.5">Grade</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-700/60 font-medium">
                {lots.map((lot) => (
                  <tr key={lot.id} className="hover:bg-stone-750">
                    <td className="p-3.5 font-mono font-bold text-amber-400">{lot.lotNumber}</td>
                    <td className="p-3.5">{lot.farmer?.name}</td>
                    <td className="p-3.5 font-bold text-white">{lot.crop?.name}</td>
                    <td className="p-3.5 font-bold text-emerald-400">{lot.quantityKg} kg</td>
                    <td className="p-3.5">{lot.grade}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {lot.status}
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
