'use client'

import React, { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getShipmentsApi } from '@/services/api/krishi-api'
import { Truck, Loader2 } from 'lucide-react'

export default function AdminLogisticsPage() {
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
    <AdminShell>
      <div className="space-y-6">
        <div className="bg-stone-800/90 border border-stone-700 p-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" />
            Platform Logistics & Fleet Dispatches
          </h1>
          <p className="text-stone-400 text-xs mt-1">Overview of all active and completed transport shipments.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading fleet dispatches...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shipments.map((s) => (
              <div key={s.id} className="bg-stone-800/90 border border-stone-700 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">{s.vehicle?.vehicleNumber || 'GJ-07-AX-4821'}</h3>
                  <span className="bg-blue-900/60 text-blue-300 border border-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {s.status}
                  </span>
                </div>
                <div className="text-xs text-stone-400 space-y-1">
                  <div>Driver: <strong>{s.provider?.contactPerson}</strong></div>
                  <div>Origin: {s.pickupLocation}</div>
                  <div>Destination: {s.destination}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
