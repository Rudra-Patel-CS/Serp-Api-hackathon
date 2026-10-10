'use client'

import React, { useState, useEffect } from 'react'
import { FarmerShell } from '@/components/farmer/FarmerShell'
import { getFarmerLotsApi, createLotApi, getMarketsApi } from '@/services/api/krishi-api'
import { toast } from 'sonner'
import { Sprout, Plus, CheckCircle2, Clock, MapPin, Scale, Loader2 } from 'lucide-react'

export default function FarmerProducePage() {
  const [lots, setLots] = useState<any[]>([])
  const [crops, setCrops] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // New Lot Form State
  const [cropId, setCropId] = useState('')
  const [quantityKg, setQuantityKg] = useState('500')
  const [grade, setGrade] = useState('Grade A')
  const [moisture, setMoisture] = useState('14%')
  const [farmPlot, setFarmPlot] = useState('Field Plot 1')
  const [location, setLocation] = useState('Anand, Gujarat')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [lotsRes, marketsRes] = await Promise.all([getFarmerLotsApi(), getMarketsApi()])
        if (lotsRes.success && lotsRes.data) setLots(lotsRes.data)
        if (marketsRes.success && marketsRes.data?.crops) {
          setCrops(marketsRes.data.crops)
          if (marketsRes.data.crops.length > 0) {
            setCropId(marketsRes.data.crops[0].id)
          }
        }
      } catch (err) {
        console.error('Error loading lots', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cropId || !quantityKg) {
      toast.error('Crop selection and quantity are required')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await createLotApi({
        cropId,
        quantityKg,
        grade,
        moisture,
        farmPlot,
        location,
      })

      if (res.success && res.data) {
        toast.success(`Harvest Lot ${res.data.lotNumber} created successfully!`)
        setLots([res.data, ...lots])
        setIsModalOpen(false)
      } else {
        toast.error(res.error?.message || 'Failed to create lot')
      }
    } catch (err) {
      toast.error('Network error creating lot')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FarmerShell>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Sprout className="w-6 h-6 text-emerald-600" />
              My Crop Produce Lots
            </h1>
            <p className="text-stone-600 text-xs mt-1">
              Manage your harvest lots, quality grading, and lot readiness for buyer matching.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            Register New Harvest Lot
          </button>
        </div>

        {/* Lots List */}
        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading harvest lots from database...
          </div>
        ) : lots.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
            <Sprout className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">You don't have any produce lots yet</h3>
            <p className="text-stone-500 text-xs max-w-sm mx-auto">
              Add your first crop harvest lot to compare market opportunities and match with verified buyers.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2"
            >
              + Add Your First Lot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lots.map((lot) => (
              <div key={lot.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-stone-500">{lot.lotNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        lot.status === 'READY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : lot.status === 'SOLD'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {lot.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-stone-900 mb-1">
                    {lot.crop?.name || 'Crop'} ({lot.quantityKg} kg)
                  </h3>

                  <div className="space-y-1.5 text-xs text-stone-600 mt-3">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-stone-400" />
                      <span>Quality Grade: <strong>{lot.grade}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-stone-400" />
                      <span>Location: <strong>{lot.location}</strong> ({lot.farmPlot || 'Field'})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <span>Harvest Date: {new Date(lot.harvestDate).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">FPO: {lot.fpo?.name ? 'Associated' : 'Individual'}</span>
                  <span className="text-emerald-700 font-bold">Active for Buyer Matching</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Lot Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
              <h2 className="text-xl font-bold text-stone-900 mb-1">Register Harvest Lot</h2>
              <p className="text-xs text-stone-500 mb-5">Enter crop specifications to analyze market realization.</p>

              <form onSubmit={handleCreateLot} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Select Crop *</label>
                  <select
                    value={cropId}
                    onChange={(e) => setCropId(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-1 focus:ring-amber-500"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.localName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Quantity (in kg) *</label>
                    <input
                      type="number"
                      value={quantityKg}
                      onChange={(e) => setQuantityKg(e.target.value)}
                      required
                      className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Grade Quality</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="Grade A">Grade A (Premium)</option>
                      <option value="Grade B">Grade B (Standard)</option>
                      <option value="Grade C">Grade C (Commercial)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Moisture Level</label>
                    <input
                      type="text"
                      value={moisture}
                      onChange={(e) => setMoisture(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Farm Plot</label>
                    <input
                      type="text"
                      value={farmPlot}
                      onChange={(e) => setFarmPlot(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Farm / Harvest Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl transition-colors"
                  >
                    {isSubmitting ? 'Saving Lot...' : 'Save Harvest Lot'}
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
