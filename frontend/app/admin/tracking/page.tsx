'use client'

import React, { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getShipmentsApi } from '@/services/api/krishi-api'
import { MapPin, Truck, Radio, Loader2 } from 'lucide-react'

export default function AdminTrackingPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getShipmentsApi()
        if (res.success && res.data) setShipments(res.data)
      } catch (err) {
        console.error('Error fetching fleet tracking', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="bg-stone-800/90 border border-stone-700 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-rose-400" />
              Live Fleet GPS Telemetry Monitoring
            </h1>
            <p className="text-stone-400 text-xs mt-1">Platform-wide Socket.IO telemetry tracking feed.</p>
          </div>
          <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-400">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Socket.IO Fleet Relay Active</span>
          </div>
        </div>

        {/* Live Fleet Canvas */}
        <div className="bg-stone-950 rounded-2xl p-6 border border-stone-800 shadow-2xl relative min-h-[420px] flex flex-col justify-between overflow-hidden">
          <div className="relative z-10 flex items-center justify-between text-xs text-stone-400 font-mono">
            <span>ACTIVE VEHICLES: {shipments.length} TRUCKS</span>
            <span>REGION: GUJARAT AGRI CORRIDOR</span>
          </div>

          <div className="relative z-10 my-12 px-8">
            <div className="flex items-center justify-between relative">
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                ANAND
              </div>

              <div className="flex-1 h-2 bg-stone-800 mx-2 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 w-3/4"></div>
              </div>

              <div className="absolute left-[60%] -top-6 flex flex-col items-center">
                <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded mb-1">
                  GJ-07-AX-4821 (IN TRANSIT)
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
              </div>

              <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center font-bold text-xs text-white">
                AHM
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-stone-900 p-4 rounded-xl border border-stone-800 text-xs font-mono text-stone-300">
            Current Telemetry Snapshot: Vehicle GJ-07-AX-4821 • Route: Anand Hub → APMC Jamalpur • Speed: 48 km/h • ETA: 1 hr 12 min
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
