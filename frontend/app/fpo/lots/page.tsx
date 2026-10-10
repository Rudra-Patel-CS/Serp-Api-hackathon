'use client'

import React, { useState, useEffect } from 'react'
import { FpoShell } from '@/components/fpo/FpoShell'
import { getFpoLotsApi } from '@/services/api/krishi-api'
import { Layers, Sparkles, Scale, Truck, Loader2 } from 'lucide-react'

export default function FpoLotsPage() {
  const [lots, setLots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getFpoLotsApi()
        if (res.success && res.data) setLots(res.data)
      } catch (err) {
        console.error('Error loading lots', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const totalVolumeKg = lots.reduce((acc, l) => acc + (l.quantityKg || 0), 0)

  return (
    <FpoShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-amber-500" />
              Aggregated Lot Pooling & Freight Optimization
            </h1>
            <p className="text-stone-600 text-xs mt-1">
              Combine member farmer lots into aggregated bulk batches to reduce transport costs and gain buyer leverage.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Total Pooled Volume: {(totalVolumeKg / 1000).toFixed(2)} Metric Tons</span>
          </div>
        </div>

        {/* Aggregation Demonstration Banner */}
        <div className="bg-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-lg space-y-3">
          <h3 className="font-bold text-base text-amber-400">Co-operative Aggregation Example</h3>
          <p className="text-xs text-emerald-100 leading-relaxed">
            By pooling Ramesh Patel (500 kg Tomato) + Maganbhai Patel (1,000 kg Tomato) + Sureshbhai Parmar (1,500 kg Tomato), the FPO achieves a bulk 3.0 Ton dispatch, reducing transport freight from ₹1.45/kg/km to ₹1.05/kg/km (27.5% Savings).
          </p>
        </div>

        {/* Lots List */}
        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading aggregated lots...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lots.map((lot) => (
              <div key={lot.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-500">{lot.lotNumber}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {lot.status}
                  </span>
                </div>
                <h3 className="font-extrabold text-stone-900 text-lg">
                  {lot.crop?.name} ({lot.quantityKg} kg)
                </h3>
                <div className="text-xs text-stone-600 space-y-1">
                  <div>Farmer Member: <strong>{lot.farmer?.name}</strong></div>
                  <div>Grade: {lot.grade}</div>
                  <div>Location: {lot.location}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FpoShell>
  )
}
