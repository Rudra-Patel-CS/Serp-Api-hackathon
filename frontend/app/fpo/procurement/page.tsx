'use client'

import React, { useState, useEffect } from 'react'
import { FpoShell } from '@/components/fpo/FpoShell'
import { getFpoLotsApi, updateLotApi } from '@/services/api/krishi-api'
import { toast } from 'sonner'
import { Package, CheckCircle2, XCircle, Truck, Clock, Loader2 } from 'lucide-react'

export default function FpoProcurementPage() {
  const [lots, setLots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadLots = async () => {
    try {
      const res = await getFpoLotsApi()
      if (res.success && res.data) {
        setLots(res.data)
      }
    } catch (err) {
      console.error('Error fetching FPO procurement lots', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLots()
  }, [])

  const handleUpdateLotStatus = async (lotId: string, newStatus: string) => {
    try {
      const res = await updateLotApi(lotId, { status: newStatus })
      if (res.success) {
        toast.success(`Lot procurement status updated to ${newStatus}`)
        loadLots()
      } else {
        toast.error('Failed to update lot status')
      }
    } catch (err) {
      toast.error('Error updating procurement')
    }
  }

  return (
    <FpoShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            FPO Harvest Procurement Workflow
          </h1>
          <p className="text-stone-600 text-xs mt-1">
            Review member produce submissions, approve quality grading, and manage lot status lifecycle.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading procurement queue...
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-600 font-bold uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Lot #</th>
                    <th className="p-3.5">Farmer Member</th>
                    <th className="p-3.5">Crop Produce</th>
                    <th className="p-3.5">Quantity (kg)</th>
                    <th className="p-3.5">Moisture & Grade</th>
                    <th className="p-3.5">Current Status</th>
                    <th className="p-3.5 text-right">Workflow Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {lots.map((lot) => (
                    <tr key={lot.id} className="hover:bg-stone-50">
                      <td className="p-3.5 font-mono font-bold text-stone-900">{lot.lotNumber}</td>
                      <td className="p-3.5">{lot.farmer?.name}</td>
                      <td className="p-3.5 font-bold text-stone-900">{lot.crop?.name}</td>
                      <td className="p-3.5 font-bold text-emerald-800">{lot.quantityKg} kg</td>
                      <td className="p-3.5">{lot.moisture || '14%'} ({lot.grade})</td>
                      <td className="p-3.5">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {lot.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {lot.status === 'READY' && (
                          <button
                            onClick={() => handleUpdateLotStatus(lot.id, 'PROCURED')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                          >
                            Approve Procurement
                          </button>
                        )}
                        {lot.status === 'PROCURED' && (
                          <button
                            onClick={() => handleUpdateLotStatus(lot.id, 'DISPATCHED')}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                          >
                            Mark Dispatched
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </FpoShell>
  )
}
