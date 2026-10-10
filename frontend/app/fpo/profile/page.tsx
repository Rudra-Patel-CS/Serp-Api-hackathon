'use client'

import React from 'react'
import { FpoShell } from '@/components/fpo/FpoShell'
import { useAuth } from '@/context/auth-context'
import { Building2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react'

export default function FpoProfilePage() {
  const { user } = useAuth()
  const fpo = user?.managedFpo

  return (
    <FpoShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-emerald-400 font-black text-2xl flex items-center justify-center border-2 border-emerald-600">
            F
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">{fpo?.name || 'Anand Produce Co-operative Ltd'}</h1>
            <div className="text-xs text-stone-500 font-mono mt-0.5">
              Registration No: {fpo?.registrationNumber || 'FPO-GUJ-2024-8891'}
            </div>
            <div className="text-xs text-emerald-700 font-bold mt-1">Verified Agricultural Co-operative</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
          <h2 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
            FPO Manager Contact & Location
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-stone-500 block">Manager Name:</span>
              <span className="font-bold text-stone-900">{user?.name || 'FPO Manager'}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Contact Phone:</span>
              <span className="font-bold text-stone-900">{user?.phone || '9876543211'}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Email Address:</span>
              <span className="font-bold text-stone-900">{user?.email || 'fpo@demo.krishiintel.local'}</span>
            </div>
            <div>
              <span className="text-stone-500 block">District & State:</span>
              <span className="font-bold text-stone-900">Anand, Gujarat</span>
            </div>
          </div>
        </div>
      </div>
    </FpoShell>
  )
}
