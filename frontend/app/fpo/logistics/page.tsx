'use client'

import React, { useState, useEffect } from 'react'
import { FpoShell } from '@/components/fpo/FpoShell'
import { getShipmentsApi } from '@/services/api/krishi-api'
import { Truck, MapPin, Loader2 } from 'lucide-react'

export default function FpoLogisticsPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getShipmentsApi()
        if (res.success && res.data) setShipments(res.data)
      } catch (err) {
        console.error('Error fetching shipments', err)
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
            <Truck className="w-6 h-6 text-blue-600" />
            FPO Logistics Fleet & Dispatch Coordination
          </h1>
          <p className="text-stone-600 text-xs mt-1">
            Track multi-farmer aggregated lot dispatches and refrigerated truck fleets.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading logistics fleet...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shipments.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-base">{s.vehicle?.vehicleNumber || 'GJ-07-AX-4821'}</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    {s.status}
                  </span>
                </div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div>Driver: <strong>{s.provider?.contactPerson || 'Rakesh Kumar'}</strong></div>
                  <div>Origin: {s.pickupLocation}</div>
                  <div>Destination: {s.destination}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FpoShell>
  )
}
