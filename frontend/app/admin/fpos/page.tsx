'use client'

import React, { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getFposApi } from '@/services/api/krishi-api'
import { Building2, Loader2 } from 'lucide-react'

export default function AdminFposPage() {
  const [fpos, setFpos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getFposApi()
        if (res.success && res.data) setFpos(res.data)
      } catch (err) {
        console.error('Error fetching FPOs', err)
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
            <Building2 className="w-6 h-6 text-amber-400" />
            Registered FPO Co-operatives
          </h1>
          <p className="text-stone-400 text-xs mt-1">Farmer Producer Organizations registered on KrishiIntel.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading FPO co-operatives...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fpos.map((fpo) => (
              <div key={fpo.id} className="bg-stone-800/90 border border-stone-700 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-stone-700 pb-3">
                  <h3 className="font-bold text-white text-base">{fpo.name}</h3>
                  <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                    {fpo.status}
                  </span>
                </div>
                <div className="text-xs text-stone-400 space-y-1">
                  <div>Registration Number: <strong className="text-amber-400 font-mono">{fpo.registrationNumber}</strong></div>
                  <div>Manager: <strong>{fpo.manager?.name}</strong> ({fpo.contactPhone})</div>
                  <div>Location: {fpo.district}, {fpo.state}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  )
}
