'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FarmerShell } from '@/components/farmer/FarmerShell'
import { getFarmerLotsApi, analyzeMarketApi, getOffersApi, getShipmentsApi } from '@/services/api/krishi-api'
import { useAuth } from '@/context/auth-context'
import {
  Sprout,
  Store,
  TrendingUp,
  Tag,
  Truck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react'

export default function FarmerDashboardPage() {
  const { user } = useAuth()
  const [lots, setLots] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [shipment, setShipment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [lotsRes, offersRes, shipmentsRes] = await Promise.all([
          getFarmerLotsApi(),
          getOffersApi(),
          getShipmentsApi(),
        ])

        if (lotsRes.success && lotsRes.data) {
          setLots(lotsRes.data)

          // Perform market analysis for active lot
          const activeLot = lotsRes.data[0]
          if (activeLot) {
            const intelRes = await analyzeMarketApi({
              cropName: activeLot.crop.name,
              quantityKg: activeLot.quantityKg,
              location: activeLot.location,
            })
            if (intelRes.success) {
              setAnalysis(intelRes.data)
            }
          }
        }

        if (offersRes.success && offersRes.data) {
          setOffers(offersRes.data)
        }

        if (shipmentsRes.success && shipmentsRes.data && shipmentsRes.data.length > 0) {
          setShipment(shipmentsRes.data[0])
        }
      } catch (err) {
        console.error('Farmer Dashboard Load Error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const activeLot = lots[0]

  return (
    <FarmerShell>
      <div className="space-[#11-y] space-y-6">
        {/* Welcome Greeting Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-2xl p-6 text-white shadow-lg border border-emerald-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Farmer Decision Dashboard</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Good Morning, {user?.name || 'Ramesh Patel'}
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1">
                Here is your harvest status and today's top market selling recommendations.
              </p>
            </div>
            <Link
              href="/farmer/produce"
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all whitespace-nowrap"
            >
              <Sprout className="w-4 h-4" />
              + Add New Harvest Lot
            </Link>
          </div>
        </div>

        {/* 4 Primary Question Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: What do I have? */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
                <span>WHAT DO I HAVE?</span>
                <Sprout className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold text-stone-900">
                {activeLot ? `${activeLot.crop?.name || 'Tomato'} Lot` : 'No Ready Produce'}
              </div>
              <div className="text-xs text-stone-600 mt-1 font-medium">
                {activeLot ? `${activeLot.quantityKg} kg • ${activeLot.grade}` : 'Register your first lot'}
              </div>
            </div>
            <Link
              href="/farmer/produce"
              className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              View My Produce Lots <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Where should I sell? */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
                <span>WHERE TO SELL?</span>
                <Store className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-stone-900 truncate">
                {analysis?.bestMarket ? analysis.bestMarket.name : 'Ahmedabad APMC'}
              </div>
              <div className="text-xs text-emerald-700 font-bold mt-1">
                Score: {analysis?.bestMarket ? `${analysis.bestMarket.score}/100` : '89/100'} • Recommended
              </div>
            </div>
            <Link
              href="/farmer/markets"
              className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              Compare Mandi Realizations <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: How much will I get? */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
                <span>ESTIMATED NET IN-HAND</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-800">
                ₹{analysis?.bestMarket ? analysis.bestMarket.totalNet.toLocaleString('en-IN') : '13,850'}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                After transport & handling deductions
              </div>
            </div>
            <Link
              href="/farmer/markets"
              className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              View Calculation Breakdown <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Active Offers & Shipment */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-2">
                <span>BUYER OFFERS</span>
                <Tag className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-stone-900">
                {offers.length} Active {offers.length === 1 ? 'Offer' : 'Offers'}
              </div>
              <div className="text-xs text-stone-600 mt-1">
                {offers[0] ? `Top offer: ₹${offers[0].offeredPrice}/kg` : 'Waiting for buyer offers'}
              </div>
            </div>
            <Link
              href="/farmer/offers"
              className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              Review Buyer Offers <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Detailed Recommendation Hero Banner */}
        {analysis?.bestMarket && (
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Opportunity Recommendation Engine
            </div>
            <h2 className="text-xl font-extrabold text-stone-900">
              Selling your {activeLot?.crop?.name || 'Tomato'} lot today in {analysis.bestMarket.name} is recommended.
            </h2>
            <p className="text-stone-700 text-sm mt-1 max-w-3xl">
              {analysis.sellVsWait.reasoning}
            </p>

            <div className="mt-4 pt-4 border-t border-amber-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-stone-500 block">Gross Rate:</span>
                <span className="font-bold text-stone-900 text-sm">₹{analysis.bestMarket.grossPerQtl} / quintal</span>
              </div>
              <div>
                <span className="text-stone-500 block">Estimated Freight:</span>
                <span className="font-bold text-rose-700 text-sm">-₹{analysis.bestMarket.totalFreight}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Mandis Cess & Shrinkage:</span>
                <span className="font-bold text-rose-700 text-sm">-₹{analysis.bestMarket.totalCess + analysis.bestMarket.totalShrinkage}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Expected Net In-Hand:</span>
                <span className="font-black text-emerald-800 text-base">₹{analysis.bestMarket.totalNet.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Active Shipment Banner if available */}
        {shipment && (
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">Shipment in Transit</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">LIVE</span>
                </div>
                <div className="text-xs text-stone-600 mt-0.5">
                  Driver: {shipment.provider?.contactPerson || 'Rakesh Kumar'} ({shipment.vehicle?.vehicleNumber || 'GJ-07-AX-4821'})
                </div>
              </div>
            </div>
            <Link
              href="/farmer/logistics"
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              Track Vehicle on Map
            </Link>
          </div>
        )}
      </div>
    </FarmerShell>
  )
}
