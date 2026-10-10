'use client'

import React from 'react'
import { FpoShell } from '@/components/fpo/FpoShell'
import { toast } from 'sonner'
import { FileSpreadsheet, Share2, Download, CheckCircle2 } from 'lucide-react'

export default function FpoReportsPage() {
  const handleShareWhatsApp = () => {
    const text = `*KrishiIntel FPO Co-operative Realization Ledger*
• FPO: Anand Tomato Producer Co-operative Ltd
• Active Member Farmers: 124 Farmers
• Total Pooled Harvest Volume: 8.4 Tons Tomato
• Top APMC Target: Ahmedabad APMC (₹36.0/kg)
• Estimated Net Co-op In-Hand: ₹2,88,400
• Dispatched via Shared Refrigerated Logistics Fleet`

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')
    toast.success('Shared FPO Realization Ledger summary exported to WhatsApp Group!')
  }

  return (
    <FpoShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
              Settlements & Kisan Bahi Realization Ledger
            </h1>
            <p className="text-stone-600 text-xs mt-1">
              Co-operative member payout settlement ledgers and WhatsApp group summary exports.
            </p>
          </div>
          <button
            onClick={handleShareWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
          >
            <Share2 className="w-4 h-4" />
            Share Co-op Ledger on WhatsApp
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
          <h2 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-2">
            Current Co-operative Dispatch & Settlement Ledger
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-500 block">Total Member Farmers:</span>
              <span className="font-bold text-stone-900 text-sm">124 Farmers</span>
            </div>
            <div>
              <span className="text-stone-500 block">Aggregated Produce:</span>
              <span className="font-bold text-stone-900 text-sm">8.4 Metric Tons</span>
            </div>
            <div>
              <span className="text-stone-500 block">Logistics Pooling Discount:</span>
              <span className="font-bold text-emerald-700 text-sm">27.5% Savings</span>
            </div>
            <div>
              <span className="text-stone-500 block">Expected Settlement:</span>
              <span className="font-black text-emerald-800 text-base">₹2,88,400</span>
            </div>
          </div>
        </div>
      </div>
    </FpoShell>
  )
}
