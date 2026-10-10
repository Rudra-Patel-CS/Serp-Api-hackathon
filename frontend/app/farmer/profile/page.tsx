'use client'

import React, { useState, useEffect } from 'react'
import { FarmerShell } from '@/components/farmer/FarmerShell'
import { getFarmerProfileApi, updateFarmerProfileApi } from '@/services/api/krishi-api'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'
import { User, MapPin, Tractor, Phone, Mail, ShieldCheck, Loader2 } from 'lucide-react'

export default function FarmerProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Edit fields
  const [name, setName] = useState('')
  const [village, setVillage] = useState('')
  const [district, setDistrict] = useState('')
  const [landArea, setLandArea] = useState('4.5')
  const [primaryCrops, setPrimaryCrops] = useState('Tomato')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await getFarmerProfileApi()
        if (res.success && res.data) {
          setProfile(res.data)
          setName(res.data.name || '')
          if (res.data.farmerProfile) {
            setVillage(res.data.farmerProfile.village || '')
            setDistrict(res.data.farmerProfile.district || '')
            setLandArea(res.data.farmerProfile.landArea ? String(res.data.farmerProfile.landArea) : '4.5')
            setPrimaryCrops(res.data.farmerProfile.primaryCrops || 'Tomato')
          }
        }
      } catch (err) {
        console.error('Error loading profile', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await updateFarmerProfileApi({
        name,
        village,
        district,
        landArea,
        primaryCrops,
      })
      if (res.success) {
        toast.success('Farmer profile updated successfully!')
      } else {
        toast.error(res.error?.message || 'Failed to update profile')
      }
    } catch (err) {
      toast.error('Error updating profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FarmerShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-800 text-amber-400 font-black text-2xl flex items-center justify-center border-2 border-emerald-600">
            {user?.name ? user.name[0] : 'R'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">{profile?.name || user?.name || 'Ramesh Patel'}</h1>
            <div className="text-xs text-stone-500 font-medium">Role: FARMER • Status: Active</div>
            <div className="text-xs text-emerald-700 font-bold mt-1">Verified KrishiIntel Seller</div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-stone-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading profile...
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
            <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-2">
              Edit Farmer Profile & Farm Details
            </h2>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Village</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Total Land Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Primary Crops Cultivated</label>
                <input
                  type="text"
                  value={primaryCrops}
                  onChange={(e) => setPrimaryCrops(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-md mt-2"
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>
        )}
      </div>
    </FarmerShell>
  )
}
