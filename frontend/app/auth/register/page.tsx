'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerApi } from '@/services/api/auth-api'
import { useAuth, PlatformRole } from '@/context/auth-context'
import { toast } from 'sonner'
import { Tractor, Users, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { setUserSession } = useAuth()
  const [roleTab, setRoleTab] = useState<'FARMER' | 'FPO_MANAGER'>('FARMER')

  // Form Fields
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [village, setVillage] = useState('Mogri')
  const [district, setDistrict] = useState('Anand')
  const [state, setState] = useState('Gujarat')
  const [primaryCrop, setPrimaryCrop] = useState('Tomato')
  const [landArea, setLandArea] = useState('4.5')

  // FPO Specific Fields
  const [fpoName, setFpoName] = useState('')
  const [fpoRegNum, setFpoRegNum] = useState('')
  const [fpoAddress, setFpoAddress] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !mobile || !password) {
      toast.error('Name, mobile number, and password are required')
      return
    }

    if (roleTab === 'FPO_MANAGER' && (!fpoName || !fpoRegNum)) {
      toast.error('FPO Name and Registration Number are required for FPO Managers')
      return
    }

    setIsLoading(true)

    try {
      const res = await registerApi({
        name,
        phone: mobile,
        email,
        password,
        role: roleTab,
        village,
        district,
        state,
        primaryCrops: primaryCrop,
        landArea,
        fpoName,
        fpoRegistrationNumber: fpoRegNum,
        fpoAddress,
      })

      if (res.success && res.data) {
        toast.success('Registration successful! Welcome to KrishiIntel.')
        setUserSession(res.data.user, res.data.token)

        if (roleTab === 'FARMER') {
          router.push('/farmer/dashboard')
        } else {
          router.push('/fpo/dashboard')
        }
      } else {
        toast.error(res.error?.message || 'Registration failed')
      }
    } catch (err: any) {
      toast.error('Registration failed due to connection error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-stone-400 hover:text-white text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
            K
          </div>
          <span className="font-bold text-white text-lg">KrishiIntel</span>
        </div>
      </div>

      {/* Register Box */}
      <div className="max-w-lg mx-auto w-full py-6">
        <div className="bg-stone-800/90 border border-stone-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white text-center mb-1">Create KrishiIntel Account</h1>
          <p className="text-stone-400 text-xs text-center mb-6">
            Register as a Farmer or FPO Manager to access real-time market intelligence.
          </p>

          {/* Role Toggle Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-stone-900 p-1.5 rounded-xl border border-stone-700 mb-6">
            <button
              type="button"
              onClick={() => setRoleTab('FARMER')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                roleTab === 'FARMER'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Tractor className="w-4 h-4" />
              Farmer Registration
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('FPO_MANAGER')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                roleTab === 'FPO_MANAGER'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              FPO Manager Registration
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Patel"
                  required
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  required
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Farmer Specific Fields */}
            {roleTab === 'FARMER' ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Village</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Primary Crop</label>
                    <select
                      value={primaryCrop}
                      onChange={(e) => setPrimaryCrop(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Tomato">Tomato</option>
                      <option value="Onion">Red Onion</option>
                      <option value="Potato">Potato</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Groundnut">Groundnut</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Land Area (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* FPO Manager Specific Fields */
              <>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">FPO Organization Name *</label>
                  <input
                    type="text"
                    value={fpoName}
                    onChange={(e) => setFpoName(e.target.value)}
                    placeholder="Anand Tomato Producer Co-operative Ltd"
                    required
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Registration Number *</label>
                    <input
                      type="text"
                      value={fpoRegNum}
                      onChange={(e) => setFpoRegNum(e.target.value)}
                      placeholder="FPO-GUJ-2026-1029"
                      required
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">FPO Address</label>
                  <input
                    type="text"
                    value={fpoAddress}
                    onChange={(e) => setFpoAddress(e.target.value)}
                    placeholder="APMC Market Yard Gate 2, Anand"
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm mt-4 ${
                roleTab === 'FARMER'
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                `Complete ${roleTab === 'FARMER' ? 'Farmer' : 'FPO Manager'} Registration`
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-stone-400">
            Already registered?{' '}
            <Link href="/auth/login" className="text-amber-400 font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-stone-500">
        Note: Administrator accounts are seeded or provisioned directly by system security admins.
      </div>
    </div>
  )
}
