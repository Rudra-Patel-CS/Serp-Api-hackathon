'use client'

import React, { useState, useEffect } from 'react'
import { FpoShell } from '@/components/fpo/FpoShell'
import { getFpoFarmersApi } from '@/services/api/krishi-api'
import { Users, Search, MapPin, Tractor, Loader2 } from 'lucide-react'

export default function FpoFarmersPage() {
  const [farmers, setFarmers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getFpoFarmersApi()
        if (res.success && res.data) {
          setFarmers(res.data)
        }
      } catch (err) {
        console.error('Error fetching FPO farmers', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const filteredFarmers = farmers.filter((m) =>
    m.farmer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.farmer?.phone?.includes(search)
  )

  return (
    <FpoShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              Member Farmer Management Directory
            </h1>
            <p className="text-stone-600 text-xs mt-1">
              Registered co-operative farmers, acreage, and active harvest lot submissions.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farmer name or mobile..."
              className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading member farmers...
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-600 font-bold uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Farmer Name</th>
                    <th className="p-3.5">Mobile Contact</th>
                    <th className="p-3.5">Village & District</th>
                    <th className="p-3.5">Land Area</th>
                    <th className="p-3.5">Primary Crops</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {filteredFarmers.map((item) => {
                    const farmer = item.farmer
                    const profile = farmer?.farmerProfile
                    return (
                      <tr key={item.id} className="hover:bg-stone-50">
                        <td className="p-3.5 font-bold text-stone-900">{farmer?.name}</td>
                        <td className="p-3.5">{farmer?.phone}</td>
                        <td className="p-3.5">{profile ? `${profile.village}, ${profile.district}` : 'Anand'}</td>
                        <td className="p-3.5 font-bold text-stone-900">{profile?.landArea || 4.5} Acres</td>
                        <td className="p-3.5">{profile?.primaryCrops || 'Tomato'}</td>
                        <td className="p-3.5">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </FpoShell>
  )
}
