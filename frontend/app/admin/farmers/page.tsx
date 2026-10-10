'use client'

import React, { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getAdminUsersApi } from '@/services/api/krishi-api'
import { Tractor, Loader2 } from 'lucide-react'

export default function AdminFarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getAdminUsersApi('', 'FARMER')
        if (res.success && res.data) setFarmers(res.data)
      } catch (err) {
        console.error('Error fetching admin farmers', err)
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
            <Tractor className="w-6 h-6 text-amber-400" />
            System-Wide Registered Farmers
          </h1>
          <p className="text-stone-400 text-xs mt-1">Platform overview of registered agricultural producers.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading farmers...
          </div>
        ) : (
          <div className="bg-stone-800/90 rounded-2xl border border-stone-700 shadow-xl overflow-hidden">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950 text-stone-400 font-mono font-bold uppercase border-b border-stone-700">
                <tr>
                  <th className="p-3.5">Farmer Name</th>
                  <th className="p-3.5">Contact Phone</th>
                  <th className="p-3.5">Village & District</th>
                  <th className="p-3.5">Land Area</th>
                  <th className="p-3.5">Primary Crops</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-700/60 font-medium">
                {farmers.map((f) => (
                  <tr key={f.id} className="hover:bg-stone-750">
                    <td className="p-3.5 font-bold text-white">{f.name}</td>
                    <td className="p-3.5">{f.phone}</td>
                    <td className="p-3.5">{f.farmerProfile?.village || 'Mogri'}, {f.farmerProfile?.district || 'Anand'}</td>
                    <td className="p-3.5 font-bold text-amber-400">{f.farmerProfile?.landArea || 4.5} Acres</td>
                    <td className="p-3.5">{f.farmerProfile?.primaryCrops || 'Tomato'}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-900/60 text-emerald-300 border border-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {f.status}
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
