'use client'

import React, { useState, useEffect } from 'react'
import { FarmerShell } from '@/components/farmer/FarmerShell'
import { getOffersApi, updateOfferStatusApi } from '@/services/api/krishi-api'
import { toast } from 'sonner'
import { Tag, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react'

export default function FarmerOffersPage() {
  const [offers, setOffers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadOffers = async () => {
    try {
      const res = await getOffersApi()
      if (res.success && res.data) {
        setOffers(res.data)
      }
    } catch (err) {
      console.error('Error fetching offers', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOffers()
  }, [])

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await updateOfferStatusApi(id, status)
      if (res.success) {
        toast.success(`Offer ${status.toLowerCase()} successfully!`)
        loadOffers()
      } else {
        toast.error(res.error?.message || 'Failed to update offer')
      }
    } catch (err) {
      toast.error('Error updating offer status')
    }
  }

  return (
    <FarmerShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-500" />
            My Harvest Lot Buyer Offers
          </h1>
          <p className="text-stone-600 text-xs mt-1">
            Review offers made by verified regional wholesalers and processors.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading offers...
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
            <Tag className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">No active offers yet</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              Open the Find Buyers directory to send your harvest lot details to interested buyers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">{offer.buyer?.businessName}</h3>
                    <div className="text-xs text-stone-500">Contact: {offer.buyer?.contactName} ({offer.buyer?.phone})</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                      offer.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : offer.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {offer.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-stone-500 block">Offered Rate:</span>
                    <span className="font-extrabold text-stone-900 text-base">₹{offer.offeredPrice} / kg</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Total Lot Value:</span>
                    <span className="font-extrabold text-emerald-800 text-base">
                      ₹{(offer.offeredPrice * offer.quantityKg).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <div>Harvest Lot: <strong>{offer.lot?.lotNumber}</strong> ({offer.lot?.crop?.name})</div>
                  <div>Quantity: <strong>{offer.quantityKg} kg</strong></div>
                  <div>Expires: {new Date(offer.expiresAt).toLocaleDateString('en-GB')}</div>
                </div>

                {offer.status === 'PENDING' && (
                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => handleUpdateStatus(offer.id, 'REJECTED')}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 border border-rose-200"
                    >
                      <XCircle className="w-4 h-4" /> Reject Offer
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(offer.id, 'ACCEPTED')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Offer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FarmerShell>
  )
}
