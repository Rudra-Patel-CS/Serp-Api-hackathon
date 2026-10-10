'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [mobile, setMobile] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
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

      <div className="max-w-md mx-auto w-full py-12">
        <div className="bg-stone-800/90 border border-stone-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-1">Reset Password</h1>
          <p className="text-stone-400 text-xs text-center mb-6">
            Enter your registered mobile number to receive a verification PIN.
          </p>

          {submitted ? (
            <div className="bg-emerald-950/60 border border-emerald-700 text-emerald-200 p-4 rounded-xl text-xs space-y-2 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-bold text-sm text-white">Reset Link Sent</div>
              <div>An SMS with password reset instructions has been sent to {mobile}.</div>
              <Link href="/auth/login" className="inline-block mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">Registered Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  required
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm"
              >
                Send Reset Verification PIN
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-stone-500">
        Need assistance? Contact KrishiIntel Helpline: +91 1800-KRISHI
      </div>
    </div>
  )
}
