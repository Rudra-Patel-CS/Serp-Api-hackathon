'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { registerApi } from '@/services/api/auth-api'
import { useAuth } from '@/context/auth-context'
import { useLanguage } from '@/context/language-context'
import { LanguageSelector } from '@/components/LanguageSelector'
import { toast } from 'sonner'
import { Tractor, Users, ArrowLeft, Loader2, Sprout, Building2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { setUserSession } = useAuth()
  const { t } = useLanguage()
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
      toast.error(t('Name, mobile number, and password are required', 'Name, mobile number, and password are required'))
      return
    }

    if (roleTab === 'FPO_MANAGER' && (!fpoName || !fpoRegNum)) {
      toast.error(t('FPO Name and Registration Number are required for FPO Managers', 'FPO Name and Registration Number are required for FPO Managers'))
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
        toast.success(t('Registration successful! Welcome to KrishiIntel.', 'Registration successful! Welcome to KrishiIntel.'))
        setUserSession(res.data.user, res.data.token)

        if (roleTab === 'FARMER') {
          router.push('/farmer/dashboard')
        } else {
          router.push('/fpo/dashboard')
        }
      } else {
        toast.error(res.error?.message || t('Registration failed', 'Registration failed'))
      }
    } catch (err: any) {
      toast.error(t('Registration failed due to connection error', 'Registration failed due to connection error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Header Bar matching Login/Role Screens */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-emerald-800 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Login', 'Back to Login')}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-emerald-800 flex items-center justify-center font-extrabold text-amber-400 text-sm shadow-sm">
              K
            </div>
            <span className="font-bold text-stone-900 text-lg">KrishiIntel</span>
          </div>
        </div>
      </div>

      {/* Main Form Container matching Login Screen */}
      <div className="max-w-lg mx-auto w-full py-6">
        <div className="bg-white border border-emerald-100 rounded-2xl p-6 sm:p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-stone-900 text-center mb-1">
            {t('Create KrishiIntel Account', 'Create KrishiIntel Account')}
          </h1>
          <p className="text-stone-600 text-xs text-center mb-6">
            {t(
              'Register as a Farmer or FPO Manager to access real-time market intelligence.',
              'Register as a Farmer or FPO Manager to access real-time market intelligence.'
            )}
          </p>

          {/* Role Selection Toggle Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-emerald-50 p-1.5 rounded-xl border border-emerald-200 mb-6">
            <button
              type="button"
              onClick={() => setRoleTab('FARMER')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                roleTab === 'FARMER'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-100/50'
              }`}
            >
              <Tractor className="w-4 h-4" />
              {t('Farmer Registration', 'Farmer Registration')}
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('FPO_MANAGER')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                roleTab === 'FPO_MANAGER'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-stone-600 hover:text-emerald-800 hover:bg-emerald-100/50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              {t('FPO Manager Registration', 'FPO Manager Registration')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('Full Name', 'Full Name')} *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ramesh Patel"
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('Mobile Number', 'Mobile Number')} *
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('Email Address', 'Email Address')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  {t('Password', 'Password')} *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Farmer Specific Fields */}
            {roleTab === 'FARMER' ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t('Village', 'Village')}
                    </label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t('District', 'District')}
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t('State', 'State')}
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t('Primary Crop', 'Primary Crop')}
                    </label>
                    <select
                      value={primaryCrop}
                      onChange={(e) => setPrimaryCrop(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Tomato">{t('Tomato', 'Tomato')}</option>
                      <option value="Onion">{t('Onion', 'Red Onion')}</option>
                      <option value="Potato">{t('Potato', 'Potato')}</option>
                      <option value="Wheat">{t('Wheat', 'Wheat')}</option>
                      <option value="Cotton">{t('Cotton', 'Cotton')}</option>
                      <option value="Groundnut">{t('Groundnut', 'Groundnut')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t('Land Area (Acres)', 'Land Area (Acres)')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* FPO Manager Specific Fields */
              <>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t('FPO Name', 'FPO Organization Name')} *
                  </label>
                  <input
                    type="text"
                    value={fpoName}
                    onChange={(e) => setFpoName(e.target.value)}
                    placeholder="Anand Tomato Producer Co-operative Ltd"
                    required
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t('Registration Number', 'Registration Number')} *
                    </label>
                    <input
                      type="text"
                      value={fpoRegNum}
                      onChange={(e) => setFpoRegNum(e.target.value)}
                      placeholder="FPO-GUJ-2026-1029"
                      required
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {t('District', 'District')}
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {t('FPO Address', 'FPO Address')}
                  </label>
                  <input
                    type="text"
                    value={fpoAddress}
                    onChange={(e) => setFpoAddress(e.target.value)}
                    placeholder="APMC Market Yard Gate 2, Anand"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-4 ${
                roleTab === 'FARMER'
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('Creating Account...', 'Creating Account...')}
                </>
              ) : (
                `${t('Register', 'Complete Registration')}`
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-stone-600 pt-4 border-t border-stone-200">
            {t('Already registered?', 'Already registered?')}{' '}
            <Link href="/auth/login" className="text-emerald-700 font-bold hover:underline">
              {t('Sign In Here', 'Sign In Here')}
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
