'use client'

import React, { useState, useEffect } from 'react'
import { FarmerShell } from '@/components/farmer/FarmerShell'
import { getAlertsApi, markAlertReadApi } from '@/services/api/krishi-api'
import { Bell, CheckCircle2, Loader2 } from 'lucide-react'

export default function FarmerAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadAlerts = async () => {
    try {
      const res = await getAlertsApi()
      if (res.success && res.data) {
        setAlerts(res.data)
      }
    } catch (err) {
      console.error('Error fetching alerts', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
  }, [])

  const handleMarkRead = async (id: string) => {
    await markAlertReadApi(id)
    loadAlerts()
  }

  return (
    <FarmerShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            Market Alerts & Offer Notifications
          </h1>
          <p className="text-stone-600 text-xs mt-1">
            Real-time updates regarding buyer offer decisions, shipment dispatches, and APMC price signals.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading notifications...
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
            <Bell className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">You are all caught up!</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              No unread notifications at the moment. New offer updates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                  alert.read ? 'bg-white border-stone-200 opacity-75' : 'bg-amber-50/80 border-amber-200 shadow-sm'
                }`}
              >
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{alert.title}</h4>
                  <p className="text-stone-700 text-xs mt-0.5">{alert.message}</p>
                  <span className="text-[10px] text-stone-400 mt-2 block">
                    {new Date(alert.createdAt).toLocaleString('en-GB')}
                  </span>
                </div>
                {!alert.read && (
                  <button
                    onClick={() => handleMarkRead(alert.id)}
                    className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FarmerShell>
  )
}
