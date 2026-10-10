'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FpoShell } from '@/components/fpo/FpoShell'
import { getFpoFarmersApi, getFpoLotsApi, getShipmentsApi, getOffersApi } from '@/services/api/krishi-api'
import { useAuth } from '@/context/auth-context'
import { useLanguage } from '@/context/language-context'
import {
  Users,
  Package,
  Layers,
  Store,
  Truck,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react'

export default function FpoDashboardPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [farmers, setFarmers] = useState<any[]>([])
  const [lots, setLots] = useState<any[]>([])
  const [offers, setOffers] = useState<any[]>([])
  const [shipments, setShipments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [farmersRes, lotsRes, offersRes, shipmentsRes] = await Promise.all([
          getFpoFarmersApi(),
          getFpoLotsApi(),
          getOffersApi(),
          getShipmentsApi(),
        ])

        if (farmersRes.success && farmersRes.data) setFarmers(farmersRes.data)
        if (lotsRes.success && lotsRes.data) setLots(lotsRes.data)
        if (offersRes.success && offersRes.data) setOffers(offersRes.data)
        if (shipmentsRes.success && shipmentsRes.data) setShipments(shipmentsRes.data)
      } catch (err) {
        console.error('FPO Dashboard Load Error:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const totalQuantityKg = lots.reduce((acc, lot) => acc + (lot.quantityKg || 0), 0)
  const pendingProcurement = lots.filter((l) => l.status === 'READY' || l.status === 'PROCUREMENT_PENDING').length

  return (
    <FpoShell>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 rounded-2xl p-6 text-white shadow-lg border border-emerald-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider">
                {t('FPO Co-operative Operations Console', 'FPO Co-operative Operations Console')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {user?.managedFpo?.name || 'Anand Tomato Producer Co-operative Ltd'}
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                {t('fpoConsoleDesc', 'Aggregating member produce, managing procurement workflows, and matching bulk institutional buyers.')}
              </p>
            </div>
            <Link
              href="/fpo/procurement"
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all whitespace-nowrap"
            >
              <Package className="w-4 h-4" />
              {t('Manage Procurement', 'Manage Procurement')} ({pendingProcurement})
            </Link>
          </div>
        </div>

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
              <span>{t('MEMBER FARMERS', 'MEMBER FARMERS')}</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">{farmers.length} {t('Registered', 'Registered')}</div>
            <div className="text-xs text-emerald-700 font-bold mt-1">{t('Active Co-op Members', 'Active Co-op Members')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
              <span>{t('TOTAL PRODUCE VOLUME', 'TOTAL PRODUCE VOLUME')}</span>
              <Layers className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-stone-900">{(totalQuantityKg / 1000).toFixed(1)} Tons</div>
            <div className="text-xs text-stone-600 mt-1">{lots.length} {t('Harvest Lots Pooled', 'Harvest Lots Pooled')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
              <span>{t('ACTIVE BUYER OFFERS', 'ACTIVE BUYER OFFERS')}</span>
              <Store className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">{offers.length} {t('Offers', 'Offers')}</div>
            <div className="text-xs text-blue-700 font-bold mt-1">{t('Bulk Institutional Demand', 'Bulk Institutional Demand')}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
              <span>{t('FLEET IN TRANSIT', 'FLEET IN TRANSIT')}</span>
              <Truck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">{shipments.length} {t('Active', 'Active')}</div>
            <div className="text-xs text-emerald-700 font-bold mt-1">{t('APMC Dispatches Tracked', 'APMC Dispatches Tracked')}</div>
          </div>
        </div>

        {/* Quick Operations Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
              <Package className="w-5 h-5 text-emerald-600" />
              {t('Member Procurement', 'Member Procurement')}
            </div>
            <p className="text-stone-600 text-xs leading-relaxed">
              Review farmer produce lot submissions, verify quality moisture levels, and approve for batch aggregation.
            </p>
            <Link
              href="/fpo/procurement"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline pt-2"
            >
              {t('Open Procurement Queue', 'Open Procurement Queue')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
              <Layers className="w-5 h-5 text-amber-500" />
              {t('Lot Aggregation & Pooling', 'Lot Aggregation & Pooling')}
            </div>
            <p className="text-stone-600 text-xs leading-relaxed">
              Combine small farmer lots (300kg + 500kg + 700kg = 1500kg) to unlock 25% bulk freight discount.
            </p>
            <Link
              href="/fpo/lots"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline pt-2"
            >
              {t('Manage Aggregated Pools', 'Manage Aggregated Pools')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              {t('WhatsApp Realization Ledger', 'WhatsApp Realization Ledger')}
            </div>
            <p className="text-stone-600 text-xs leading-relaxed">
              Generate official Kisan Bahi realization vouchers and export shared co-op ledger summaries via WhatsApp.
            </p>
            <Link
              href="/fpo/reports"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline pt-2"
            >
              {t('Generate Shared Ledger', 'Generate Shared Ledger')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Recent Farmer Lots Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base">{t('Recent Member Farmer Harvest Submissions', 'Recent Member Farmer Harvest Submissions')}</h3>
            <Link href="/fpo/lots" className="text-xs text-emerald-700 font-bold hover:underline">
              {t('View All Lots', 'View All Lots')}
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-600 font-bold uppercase border-b border-stone-200">
                <tr>
                  <th className="p-3.5">{t('Lot Number', 'Lot Number')}</th>
                  <th className="p-3.5">{t('Farmer Name', 'Farmer Name')}</th>
                  <th className="p-3.5">{t('Crop', 'Crop')}</th>
                  <th className="p-3.5">{t('Quantity', 'Quantity (kg)')}</th>
                  <th className="p-3.5">{t('Grade Quality', 'Grade Quality')}</th>
                  <th className="p-3.5">{t('Status', 'Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {lots.slice(0, 5).map((lot) => (
                  <tr key={lot.id} className="hover:bg-stone-50">
                    <td className="p-3.5 font-bold font-mono text-stone-900">{lot.lotNumber}</td>
                    <td className="p-3.5">{lot.farmer?.name || 'Farmer Member'}</td>
                    <td className="p-3.5">{t(lot.crop?.name, lot.crop?.name)}</td>
                    <td className="p-3.5 font-bold text-stone-900">{lot.quantityKg} kg</td>
                    <td className="p-3.5">{lot.grade}</td>
                    <td className="p-3.5">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {t(lot.status, lot.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FpoShell>
  )
}
