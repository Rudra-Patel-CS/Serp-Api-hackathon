'use client'

import React, { useState, useEffect } from 'react'
import { FarmerShell } from '@/components/farmer/FarmerShell'
import { getBuyersApi, createOfferApi, getFarmerLotsApi } from '@/services/api/krishi-api'
import { toast } from 'sonner'
import { Users, ShieldCheck, Phone, MapPin, Tag, Star, Loader2, ChevronDown } from 'lucide-react'

export default function FarmerBuyersPage() {
  const [buyers, setBuyers] = useState<any[]>([])
  const [lots, setLots] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState('ALL')

  // Offer Modal State
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null)
  const [selectedLotId, setSelectedLotId] = useState('')
  const [offeredPrice, setOfferedPrice] = useState('36.0')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [buyersRes, lotsRes] = await Promise.all([getBuyersApi(), getFarmerLotsApi()])
        if (buyersRes.success && buyersRes.data) setBuyers(buyersRes.data)
        if (lotsRes.success && lotsRes.data) {
          setLots(lotsRes.data)
          if (lotsRes.data.length > 0) setSelectedLotId(lotsRes.data[0].id)
        }
      } catch (err) {
        console.error('Error loading buyers', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const filteredBuyers = filterType === 'ALL' ? buyers : buyers.filter((b) => b.buyerType === filterType)

  const handleMakeOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBuyer || !selectedLotId || !offeredPrice) {
      toast.error('Please select a lot and offer price')
      return
    }

    setIsSubmitting(true)
    try {
      const selectedLot = lots.find((l) => l.id === selectedLotId)
      const res = await createOfferApi({
        lotId: selectedLotId,
        buyerId: selectedBuyer.id,
        offeredPrice: parseFloat(offeredPrice),
        quantityKg: selectedLot ? selectedLot.quantityKg : 500,
      })

      if (res.success) {
        toast.success(`Offer sent to ${selectedBuyer.businessName}!`)
        setSelectedBuyer(null)
      } else {
        toast.error(res.error?.message || 'Failed to send offer')
      }
    } catch (err) {
      toast.error('Error sending offer')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FarmerShell>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              Verified Buyer Matching Directory
            </h1>
            <p className="text-stone-600 text-xs mt-1">
              Discover verified regional wholesalers, traders, and food processors seeking produce matching your harvest.
            </p>
          </div>

          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterType === 'ALL' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('WHOLESALER')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterType === 'WHOLESALER' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Wholesalers
            </button>
            <button
              onClick={() => setFilterType('PROCESSOR')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterType === 'PROCESSOR' ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              Processors
            </button>
          </div>
        </div>

        {/* Buyers Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading compatible buyers...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuyers.map((buyer) => (
              <div key={buyer.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full uppercase">
                      {buyer.buyerType}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{buyer.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-extrabold text-stone-900 mb-1">{buyer.businessName}</h3>
                  <div className="text-xs text-stone-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{buyer.city}, {buyer.district}</span>
                  </div>

                  {/* Requirements List */}
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1.5 mb-4">
                    <div className="font-bold text-stone-700">Buying Requirements:</div>
                    {buyer.requirements?.map((req: any, index: number) => (
                      <div key={req.id || `buyer-${buyer.id || 'b'}-req-${index}`} className="flex justify-between text-[11px] text-stone-600">
                        <span>{req.crop?.name || 'Crop'} ({req.acceptedGrades})</span>
                        <span className="font-bold text-emerald-700">Target: ₹{req.targetPrice}/kg</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBuyer(buyer)}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Tag className="w-4 h-4" />
                  Prepare Offer to Buyer
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Offer Modal */}
        {selectedBuyer && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 mb-1">Make Offer to {selectedBuyer.businessName}</h3>
              <p className="text-xs text-stone-500 mb-4">Select harvest lot and specify your price per kg.</p>

              <form onSubmit={handleMakeOffer} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5 text-xs">
                    Select Harvest Lot *
                  </label>
                  <div className="relative">
                    <select
                      value={selectedLotId}
                      onChange={(e) => setSelectedLotId(e.target.value)}
                      required
                      className="w-full appearance-none bg-white border border-stone-300 hover:border-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none rounded-xl px-3.5 py-2.5 pr-10 text-stone-900 text-xs font-medium transition-all shadow-sm cursor-pointer"
                    >
                      {lots.length === 0 ? (
                        <option value="" disabled>
                          No harvest lots available (Please add a lot first)
                        </option>
                      ) : (
                        lots.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.lotNumber} — {l.crop?.name || 'Crop'} ({l.quantityKg} kg)
                          </option>
                        ))
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-stone-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  {lots.length === 0 && (
                    <p className="text-[11px] text-amber-600 mt-1">
                      ⚠️ You do not have any registered harvest lots yet. Please register a harvest lot first.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5 text-xs">
                    Offered Price (₹ / kg) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    required
                    placeholder="Enter price per kg"
                    className="w-full bg-white border border-stone-300 hover:border-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none rounded-xl px-3.5 py-2.5 text-stone-900 font-bold text-sm transition-all shadow-sm"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedBuyer(null)}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold py-2.5 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Offer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FarmerShell>
  )
}
