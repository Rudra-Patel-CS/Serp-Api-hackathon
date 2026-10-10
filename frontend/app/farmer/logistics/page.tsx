'use client'

import React, { useState, useEffect } from 'react'
import { FarmerShell } from '@/components/farmer/FarmerShell'
import { getShipmentsApi, getShipmentTrackApi } from '@/services/api/krishi-api'
import { io, Socket } from 'socket.io-client'
import { Truck, MapPin, Clock, ShieldCheck, Radio, Navigation, Loader2 } from 'lucide-react'

export default function FarmerLogisticsPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [activeShipment, setActiveShipment] = useState<any>(null)
  const [lastUpdatedSec, setLastUpdatedSec] = useState<number>(12)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getShipmentsApi()
        if (res.success && res.data && res.data.length > 0) {
          setShipments(res.data)
          const trackingRes = await getShipmentTrackApi(res.data[0].id)
          if (trackingRes.success) {
            setActiveShipment(trackingRes.data)
          }
        }
      } catch (err) {
        console.error('Error fetching logistics', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()

    // Timer for "Last updated X seconds ago"
    const interval = setInterval(() => {
      setLastUpdatedSec((prev) => (prev > 50 ? 5 : prev + 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Socket.IO Connection for Live Stream Snapshots
  useEffect(() => {
    if (!activeShipment?.id) return

    const socketUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
    const socket: Socket = io(socketUrl, { withCredentials: true })

    socket.emit('join_shipment_track', activeShipment.id)

    socket.on('shipment_location_updated', (data: any) => {
      setLastUpdatedSec(0)
      setActiveShipment((prev: any) => {
        if (!prev) return prev
        return {
          ...prev,
          locations: [...(prev.locations || []), data],
        }
      })
    })

    return () => {
      socket.emit('leave_shipment_track', activeShipment.id)
      socket.disconnect()
    }
  }, [activeShipment?.id])

  const latestLocation = activeShipment?.locations?.[activeShipment.locations.length - 1]

  return (
    <FarmerShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Truck className="w-6 h-6 text-blue-600" />
              Live Harvest Shipment Tracking
            </h1>
            <p className="text-stone-600 text-xs mt-1">
              Real-time vehicle GPS snapshot tracking from farm dispatch to destination APMC mandi.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-900 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>Socket.IO Stream Active</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Connecting to GPS telemetry feed...
          </div>
        ) : !activeShipment ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
            <Truck className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">No active shipments in transit</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              When an offer is accepted and transport vehicle is assigned, live tracking will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Status Panel */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded uppercase">
                    {activeShipment.status}
                  </span>
                  <h3 className="text-lg font-extrabold text-stone-900 mt-1">Shipment #SH-10042</h3>
                </div>
                <div className="text-xs text-right text-stone-500 font-mono">
                  ETA: <strong>1 hr 12 min</strong>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-stone-500 block">Transport Driver:</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {activeShipment.provider?.contactPerson || 'Rakesh Kumar'} ({activeShipment.provider?.phone})
                  </span>
                </div>

                <div>
                  <span className="text-stone-500 block">Vehicle Assigned:</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {activeShipment.vehicle?.vehicleNumber || 'GJ-07-AX-4821'}
                  </span>
                  <span className="text-stone-500 block text-[11px]">
                    {activeShipment.vehicle?.vehicleType || 'Eicher 14ft Refrigerated Truck'}
                  </span>
                </div>

                <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Origin Pickup</span>
                      <span className="font-bold text-stone-900">{activeShipment.pickupLocation}</span>
                    </div>
                  </div>
                  <div className="w-0.5 h-4 bg-stone-300 ml-2"></div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-rose-600" />
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase">Destination Mandi</span>
                      <span className="font-bold text-stone-900">{activeShipment.destination}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 text-center bg-stone-50 p-2.5 rounded-lg">
                Last updated {lastUpdatedSec} seconds ago
              </div>
            </div>

            {/* Right Map Canvas Visualizer */}
            <div className="lg:col-span-8 bg-stone-900 rounded-2xl p-6 text-white shadow-xl relative min-h-[400px] flex flex-col justify-between overflow-hidden border border-stone-800">
              {/* Map Background Grid Simulation */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 bg-stone-800/90 border border-stone-700 px-3 py-1.5 rounded-full text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Live GPS Snapshots Active
                </div>
                <span className="text-xs text-stone-400 font-mono">
                  Coordinates: {latestLocation?.latitude || 22.6845}° N, {latestLocation?.longitude || 72.7889}° E
                </span>
              </div>

              {/* Map Route Graphic Simulation */}
              <div className="relative z-10 my-12 px-8">
                <div className="relative flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs shadow-lg z-10">
                    ANAND
                  </div>

                  {/* Route Line */}
                  <div className="flex-1 h-2 bg-stone-700 mx-2 relative rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-blue-500 w-3/4 rounded-full"></div>
                  </div>

                  {/* Moving Vehicle Icon */}
                  <div className="absolute left-[65%] -top-5 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="bg-amber-500 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded shadow mb-1 whitespace-nowrap">
                      GJ-07-AX-4821 (48 km/h)
                    </div>
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg">
                      <Truck className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center font-bold text-xs shadow-lg z-10">
                    AHM
                  </div>
                </div>
              </div>

              <div className="relative z-10 bg-stone-800/80 p-4 rounded-xl border border-stone-700/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 block">Current Location:</span>
                  <span className="font-bold text-white text-sm">NH-48 Corridor (Nadiad - Kheda Segment)</span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block">Speed & Heading:</span>
                  <span className="font-bold text-amber-400 text-sm">48 km/h • NW 315°</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FarmerShell>
  )
}
