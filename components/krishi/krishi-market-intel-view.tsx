'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  FileText,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Flame,
  Truck,
  CheckCircle2,
  Lock,
  Share2,
  Download,
  HelpCircle,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Package,
} from 'lucide-react'
import { Language } from './krishi-topbar'

interface MarketIntelViewProps {
  currentLang: Language
  onOpenKisanBahi: () => void
  onLockSlot: (mandiName: string, netAmount: number) => void
  onShareFPO: () => void
  onViewRouteDetails: (mandiName: string) => void
}

export function KrishiMarketIntelView({
  currentLang,
  onOpenKisanBahi,
  onLockSlot,
  onShareFPO,
  onViewRouteDetails,
}: MarketIntelViewProps) {
  // Scenario state
  const [isFpoMode, setIsFpoMode] = useState(false)
  const [commodity, setCommodity] = useState('Tomato (ટમેટા)')
  const [lotQuantity, setLotQuantity] = useState(500) // in kg
  const [freightVariance, setFreightVariance] = useState(0) // -30 to +40%
  const [selectedMandi, setSelectedMandi] = useState('Anand Local APMC')

  // Live dynamic calculations based on sliders
  const dynamicCalc = useMemo(() => {
    const qtl = lotQuantity / 100 // quintals
    const freightMultiplier = 1 + freightVariance / 100

    // Anand
    const anandGrossPerQtl = 2850
    const anandFreightPerQtl = Math.round(90 * freightMultiplier)
    const anandHandlingPerQtl = 40
    const anandShrinkagePerQtl = 20
    const anandNetPerQtl = anandGrossPerQtl - anandFreightPerQtl - anandHandlingPerQtl - anandShrinkagePerQtl
    const anandTotalNet = Math.round(anandNetPerQtl * qtl)

    // Ahmedabad
    const ahmedGrossPerQtl = 3000
    // At higher volume, freight per qtl drops slightly due to shared truck scale
    const ahmedVolumeDiscount = lotQuantity >= 1800 ? 0.82 : 1
    const ahmedFreightPerQtl = Math.round(210 * freightMultiplier * ahmedVolumeDiscount)
    const ahmedHandlingPerQtl = 50
    const ahmedShrinkagePerQtl = 110
    const ahmedNetPerQtl = ahmedGrossPerQtl - ahmedFreightPerQtl - ahmedHandlingPerQtl - ahmedShrinkagePerQtl
    const ahmedTotalNet = Math.round(ahmedNetPerQtl * qtl)

    // Vadodara
    const vadoGrossPerQtl = 2900
    const vadoFreightPerQtl = Math.round(160 * freightMultiplier)
    const vadoHandlingPerQtl = 45
    const vadoShrinkagePerQtl = 85
    const vadoNetPerQtl = vadoGrossPerQtl - vadoFreightPerQtl - vadoHandlingPerQtl - vadoShrinkagePerQtl
    const vadoTotalNet = Math.round(vadoNetPerQtl * qtl)

    // Surat
    const suratGrossPerQtl = 3200
    const suratFreightPerQtl = Math.round(470 * freightMultiplier)
    const suratHandlingPerQtl = 55
    const suratShrinkagePerQtl = 305 // high heat transit
    const suratNetPerQtl = suratGrossPerQtl - suratFreightPerQtl - suratHandlingPerQtl - suratShrinkagePerQtl
    const suratTotalNet = Math.round(suratNetPerQtl * qtl)

    return {
      anand: { netPerQtl: anandNetPerQtl, totalNet: anandTotalNet, freight: anandFreightPerQtl, shrinkage: anandShrinkagePerQtl },
      ahmedabad: { netPerQtl: ahmedNetPerQtl, totalNet: ahmedTotalNet, freight: ahmedFreightPerQtl, shrinkage: ahmedShrinkagePerQtl },
      vadodara: { netPerQtl: vadoNetPerQtl, totalNet: vadoTotalNet, freight: vadoFreightPerQtl, shrinkage: vadoShrinkagePerQtl },
      surat: { netPerQtl: suratNetPerQtl, totalNet: suratTotalNet, freight: suratFreightPerQtl, shrinkage: suratShrinkagePerQtl },
      differenceVsSurat: anandTotalNet - suratTotalNet,
    }
  }, [lotQuantity, freightVariance])

  // 7-day trajectory chart data
  const chartPoints = [
    { day: '6 May', anand: 2600, ahmedabad: 2820 },
    { day: '7 May', anand: 2650, ahmedabad: 2850 },
    { day: '8 May', anand: 2700, ahmedabad: 2900 },
    { day: '9 May', anand: 2780, ahmedabad: 2950 },
    { day: '10 May', anand: 2820, ahmedabad: 2980 },
    { day: 'Yesterday', anand: 2840, ahmedabad: 2990 },
    { day: 'Today', anand: 2850, ahmedabad: 3000 },
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#edf4ec] text-[#1b5e20] border border-[#cbe0ca]">
              BAHI-KHATA INTELLIGENCE • ખેડૂત ચોપડો વેચાણ નિર્ણયો • APMC VERIFIED LIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#112d1e] tracking-tight">
            Where Does Your Crop Earn the Highest Practical Return?
          </h1>
          <p className="text-xs sm:text-sm text-[#4d6657] mt-1 max-w-3xl leading-relaxed">
            Don&apos;t just chase the highest gross price. Compare freight, mandi cess, handling, and transit shrinkage to find true net realization (ખરી ચોખ્ખી ઉપજ / શુદ્ધ કમાણી).
          </p>
        </div>

        {/* Right Badges & Bahi Slip Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#2e543e] font-semibold bg-[#f0f6ee] px-3 py-1.5 rounded-lg border border-[#d2e2d0]">
            <ShieldCheck className="w-4 h-4 text-[#1b7340]" />
            <span>Telemetry Confidence: <strong>98% Verified Index</strong></span>
          </div>

          <button
            onClick={onOpenKisanBahi}
            className="px-4 py-2 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            <FileText className="w-4 h-4 text-[#72f5b5]" />
            Kisan Bahi Slip
          </button>
        </div>
      </div>

      {/* ACTIVE CROP DISPATCH SCENARIO BAR (ઓર્ડર વિગતો) */}
      <div className="bg-white p-4 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#edf2ec]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#143825]">
              Active Crop Dispatch Scenario
            </span>
            <span className="text-xs text-[#627a6c] font-medium">(ઓર્ડર વિગતો)</span>
          </div>

          {/* Toggle: Single Farmer Lot vs FPO Consolidated */}
          <div className="flex items-center bg-[#f0f5ee] p-1 rounded-lg border border-[#d5e2d3] text-xs font-semibold">
            <button
              onClick={() => setIsFpoMode(false)}
              className={`px-3 py-1 rounded-md transition-all ${
                !isFpoMode
                  ? 'bg-white text-[#153825] shadow-xs font-bold'
                  : 'text-[#506c5b] hover:text-[#153825]'
              }`}
            >
              Single Farmer Lot
            </button>
            <button
              onClick={() => {
                setIsFpoMode(true)
                setLotQuantity(2500)
              }}
              className={`px-3 py-1 rounded-md transition-all ${
                isFpoMode
                  ? 'bg-white text-[#153825] shadow-xs font-bold'
                  : 'text-[#506c5b] hover:text-[#153825]'
              }`}
            >
              FPO Consolidated (15 Farmers)
            </button>
          </div>
        </div>

        {/* 6 Parameter Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              COMMODITY / પાક
            </span>
            <span className="text-xs font-bold text-[#143825] mt-0.5 block truncate">
              {commodity}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              QUANTITY / જથ્થો
            </span>
            <span className="text-xs font-extrabold text-[#143825] mt-0.5 block">
              {lotQuantity} kg ({lotQuantity / 100} Qtl)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              QUALITY SORT
            </span>
            <span className="text-xs font-bold text-[#1e6e3c] mt-0.5 flex items-center gap-1">
              Grade A (Firm/Red) ✓
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              FARM ORIGIN / સ્થળ
            </span>
            <span className="text-xs font-bold text-[#143825] mt-0.5 block truncate">
              Anand, Gujarat 📍
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              TARGET WINDOW
            </span>
            <span className="text-xs font-bold text-[#143825] mt-0.5 block truncate">
              Tomorrow 04:30 AM
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              PACKAGING TYPE
            </span>
            <span className="text-xs font-bold text-[#143825] mt-0.5 block truncate">
              Plastic Crates (25kg)
            </span>
          </div>
        </div>
      </div>

      {/* NET YIELD WINNER BANNER (Dark Emerald Green Container) */}
      <div className="rounded-2xl bg-[#143828] text-white p-5 sm:p-6 shadow-md border border-[#1f543c] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="w-10 h-10 rounded-xl bg-[#236043] flex items-center justify-center shrink-0 border border-[#3b8460]">
            <Sparkles className="w-5 h-5 text-[#75f8ba]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1e563b] text-[#8cf0be] border border-[#337a56]">
                NET YIELD WINNER
              </span>
              <span className="font-extrabold text-sm sm:text-base text-white">
                Anand Local Mandi Delivers Highest Pocket Return
              </span>
            </div>
            <p className="text-xs text-[#c4e6d4] leading-relaxed">
              Surat shows an attractive gross ₹3,200/qtl, but high transit freight (-₹470) and shrinkage (-₹120) penalize your payout. Anand Local nets ₹2,700/qtl vs Ahmedabad&apos;s ₹2,630/qtl, saving <strong>₹400 net cash</strong> on this {lotQuantity}kg lot.
            </p>
          </div>
        </div>

        {/* Extra Net & Lock Slot Action */}
        <div className="flex items-center gap-4 shrink-0 self-end md:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-[#9fc7b1] block">Difference vs Surat</span>
            <span className="text-lg sm:text-xl font-extrabold text-[#75f8ba]">
              +{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(dynamicCalc.differenceVsSurat)} Extra Net
            </span>
          </div>

          <button
            onClick={() => onLockSlot('Anand Local Mandi', dynamicCalc.anand.totalNet)}
            className="px-4 py-2.5 rounded-xl bg-[#25734e] hover:bg-[#1d5c3e] text-white text-xs font-bold flex items-center gap-2 border border-[#3a8b64] transition-all shadow-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock Anand Slot
          </button>
        </div>
      </div>

      {/* DIRECT MANDI REALIZATION LEDGER (4 Comparative Mandi Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base sm:text-lg text-[#123122]">
            Direct Mandi Realization Ledger
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-[#2f5d44]">
              <span className="w-2 h-2 rounded-full bg-[#1b7340]"></span>
              Recommended
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#844430]">
              <span className="w-2 h-2 rounded-full bg-[#e65100]"></span>
              Heavy Penalty
            </span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          
          {/* Card 1: Anand Local APMC (Highest Net Return) */}
          <div className="bg-white rounded-2xl border-2 border-[#2b724f] p-4 shadow-sm flex flex-col justify-between space-y-3 relative overflow-hidden">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#153f2c] text-white">
                  ▲ HIGHEST NET RETURN
                </span>
                <span className="text-xs font-extrabold text-[#153f2c]">89 <span className="text-[10px] text-[#60776b]">/100</span></span>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-[#112d1e]">Anand Local APMC</h4>
                <span className="text-[11px] text-[#556e60] block">📍 8 km • 20 min drive</span>
              </div>

              {/* Ledger Math */}
              <div className="space-y-1.5 pt-2 border-t border-[#e2ede0] text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#556e60]">Indicative Gross Price</span>
                  <span className="font-bold text-[#143224]">₹2,850 /qtl</span>
                </div>
                <div className="flex justify-between items-center text-[#c2410c]">
                  <span>Transport / Freight</span>
                  <span className="font-semibold">-₹{dynamicCalc.anand.freight}</span>
                </div>
                <div className="flex justify-between items-center text-[#c2410c]">
                  <span>Handling & APMC Cess</span>
                  <span className="font-semibold">-₹40</span>
                </div>
                <div className="flex justify-between items-center text-[#c2410c]">
                  <span>Transit Shrinkage</span>
                  <span className="font-semibold">-₹{dynamicCalc.anand.shrinkage}</span>
                </div>
              </div>

              {/* Net Result */}
              <div className="p-2.5 rounded-xl bg-[#eef7ec] border border-[#cbe2c8] space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase text-[#2b5e40]">ESTIMATED NET IN-HAND</span>
                  <span className="text-sm font-extrabold text-[#175235]">₹{dynamicCalc.anand.netPerQtl} /qtl</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-[#526f5d]">Total Net ({lotQuantity} kg)</span>
                  <span className="text-lg font-black text-[#175235]">₹{dynamicCalc.anand.totalNet.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[10px] font-semibold text-[#1c7438] bg-[#eef7ec] px-2 py-1 rounded flex items-center gap-1">
                <span>🟢</span> ₹400 freight saved vs Ahmedabad
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#e5ece2]">
              <div className="grid grid-cols-2 gap-1 text-[10px] text-[#556e60]">
                <div>Buyer Turnout: <strong className="text-[#133223] block">18 Active Traders</strong></div>
                <div>Payment Cycle: <strong className="text-[#133223] block">Same-Day UPI</strong></div>
              </div>

              <button
                onClick={() => {
                  setSelectedMandi('Anand Local APMC')
                  onLockSlot('Anand Local APMC', dynamicCalc.anand.totalNet)
                }}
                className="w-full py-2 px-3 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs transition-all shadow-xs"
              >
                Select Anand Mandi ➔
              </button>
            </div>
          </div>

          {/* Card 2: Ahmedabad APMC (Deep Liquidity) */}
          <div className="bg-white rounded-2xl border border-[#d6e3d3] p-4 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e3f2fd] text-[#0d47a1]">
                  DEEP LIQUIDITY
                </span>
                <span className="text-xs font-extrabold text-[#153f2c]">84 <span className="text-[10px] text-[#60776b]">/100</span></span>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-[#112d1e]">Ahmedabad APMC</h4>
                <span className="text-[11px] text-[#556e60] block">📍 65 km • 1 hr 45 min drive</span>
              </div>

              {/* Ledger Math */}
              <div className="space-y-1.5 pt-2 border-t border-[#e2ede0] text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#556e60]">Indicative Gross Price</span>
                  <span className="font-bold text-[#143224]">₹3,000 /qtl</span>
                </div>
                <div className="flex justify-between items-center text-[#c2410c]">
                  <span>Transport / Freight</span>
                  <span className="font-semibold">-₹{dynamicCalc.ahmedabad.freight}</span>
                </div>
                <div className="flex justify-between items-center text-[#c2410c]">
                  <span>Handling & APMC Cess</span>
                  <span className="font-semibold">-₹50</span>
                </div>
                <div className="flex justify-between items-center text-[#c2410c]">
                  <span>Transit Shrinkage</span>
                  <span className="font-semibold">-₹{dynamicCalc.ahmedabad.shrinkage}</span>
                </div>
              </div>

              {/* Net Result */}
              <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#dbe6da] space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase text-[#476352]">ESTIMATED NET IN-HAND</span>
                  <span className="text-sm font-extrabold text-[#153f2c]">₹{dynamicCalc.ahmedabad.netPerQtl} /qtl</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-[#526f5d]">Total Net ({lotQuantity} kg)</span>
                  <span className="text-lg font-black text-[#153f2c]">₹{dynamicCalc.ahmedabad.totalNet.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[10px] text-[#4d6657] bg-[#f4f7f2] px-2 py-1 rounded">
                32 Institutional buyers present
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#e5ece2]">
              <div className="grid grid-cols-2 gap-1 text-[10px] text-[#556e60]">
                <div>Risk Matrix: <strong className="text-[#133223] block">Very Low</strong></div>
                <div>Auction Speed: <strong className="text-[#133223] block">Under 40 Min</strong></div>
              </div>

              <button
                onClick={() => onViewRouteDetails('Ahmedabad APMC')}
                className="w-full py-2 px-3 rounded-lg bg-[#f0f5ee] hover:bg-[#e4eee1] text-[#164731] font-bold text-xs transition-all border border-[#cce0cb]"
              >
                Evaluate Route ➔
              </button>
            </div>
          </div>

          {/* Card 3: Vadodara (Sayajiganj) */}
          <div className="bg-white rounded-2xl border border-[#d6e3d3] p-4 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5e9] text-[#2e7d32]">
                  MODERATE RANGE
                </span>
                <span className="text-xs font-extrabold text-[#153f2c]">78 <span className="text-[10px] text-[#60776b]">/100</span></span>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-[#112d1e]">Vadodara (Sayajiganj)</h4>
                <span className="text-[11px] text-[#556e60] block">📍 44 km • 1 hr 10 min drive</span>
              </div>

              {/* Ledger Math */}
              <div className="space-y-1.5 pt-2 border-t border-[#e2ede0] text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#556e60]">Indicative Gross Price</span>
                  <span className="font-bold text-[#143224]">₹2,900 /qtl</span>
                </div>
                <div className="flex justify-between items-center text-[#c2410c]">
                  <span>Transport / Freight</span>
                  <span className="font-semibold">-₹{dynamicCalc.vadodara.freight}</span>
                </div>
                <div className="flex justify-between items-center text-[#c2410c]">
                  <span>Handling & APMC Cess</span>
                  <span className="font-semibold">-₹45</span>
                </div>
                <div className="flex justify-between items-center text-[#c2410c]">
                  <span>Transit Shrinkage</span>
                  <span className="font-semibold">-₹{dynamicCalc.vadodara.shrinkage}</span>
                </div>
              </div>

              {/* Net Result */}
              <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#dbe6da] space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase text-[#476352]">ESTIMATED NET IN-HAND</span>
                  <span className="text-sm font-extrabold text-[#153f2c]">₹{dynamicCalc.vadodara.netPerQtl} /qtl</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-[#526f5d]">Total Net ({lotQuantity} kg)</span>
                  <span className="text-lg font-black text-[#153f2c]">₹{dynamicCalc.vadodara.totalNet.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[10px] text-[#4d6657] bg-[#f4f7f2] px-2 py-1 rounded">
                Auction concludes 11:00 AM
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#e5ece2]">
              <div className="grid grid-cols-2 gap-1 text-[10px] text-[#556e60]">
                <div>Buyer Turnout: <strong className="text-[#133223] block">14 Wholesalers</strong></div>
                <div>Unloading Delay: <strong className="text-[#133223] block">Moderate (45m)</strong></div>
              </div>

              <button
                onClick={() => onViewRouteDetails('Vadodara (Sayajiganj)')}
                className="w-full py-2 px-3 rounded-lg bg-[#f0f5ee] hover:bg-[#e4eee1] text-[#164731] font-bold text-xs transition-all border border-[#cce0cb]"
              >
                Evaluate Route ➔
              </button>
            </div>
          </div>

          {/* Card 4: Surat (Majura Gate) - Freight Penalty Alert */}
          <div className="bg-white rounded-2xl border-2 border-[#f87171] p-4 shadow-2xs flex flex-col justify-between space-y-3 bg-[#fffafa]">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5]">
                  FREIGHT PENALTY ALERT
                </span>
                <span className="text-xs font-extrabold text-[#b91c1c]">64 <span className="text-[10px] text-[#888]">/100</span></span>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-[#112d1e]">Surat (Majura Gate)</h4>
                <span className="text-[11px] text-[#556e60] block">📍 180 km • 4 hr 20 min drive</span>
              </div>

              {/* Ledger Math */}
              <div className="space-y-1.5 pt-2 border-t border-[#f5dcd8] text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#556e60]">Indicative Gross Price</span>
                  <span className="font-extrabold text-[#143224]">₹3,200 /qtl</span>
                </div>
                <div className="flex justify-between items-center text-[#b91c1c] font-bold">
                  <span>Transport / Freight</span>
                  <span>-₹{dynamicCalc.surat.freight}</span>
                </div>
                <div className="flex justify-between items-center text-[#c2410c]">
                  <span>Handling & APMC Cess</span>
                  <span className="font-semibold">-₹55</span>
                </div>
                <div className="flex justify-between items-center text-[#b91c1c] font-bold">
                  <span>Transit Shrinkage</span>
                  <span>-₹{dynamicCalc.surat.shrinkage}</span>
                </div>
              </div>

              {/* Net Result */}
              <div className="p-2.5 rounded-xl bg-[#fef2f2] border border-[#fecaca] space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase text-[#991b1b]">ESTIMATED NET IN-HAND</span>
                  <span className="text-sm font-extrabold text-[#991b1b]">₹{dynamicCalc.surat.netPerQtl} /qtl</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-[#7f1d1d]">Total Net ({lotQuantity} kg)</span>
                  <span className="text-lg font-black text-[#991b1b]">₹{dynamicCalc.surat.totalNet.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="text-[10px] font-bold text-[#b91c1c] bg-[#fee2e2] px-2 py-1 rounded flex items-center gap-1">
                <span>⚠️</span> ₹1,650 loss vs selling in Anand
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[#f5dcd8]">
              <div className="grid grid-cols-2 gap-1 text-[10px] text-[#77443d]">
                <div>Shrinkage Risk: <strong className="text-[#991b1b] block">High (Heat & Miles)</strong></div>
                <div>Viability Batch: <strong className="text-[#133223] block">Min. 4,000 kg</strong></div>
              </div>

              <button
                onClick={() => onViewRouteDetails('Surat (Majura Gate)')}
                className="w-full py-2 px-3 rounded-lg bg-[#fff1f1] hover:bg-[#ffe4e4] text-[#991b1b] font-bold text-xs transition-all border border-[#fca5a5]"
              >
                View Route Details ➔
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SPLIT SECTION: 7-Day Trajectory + Telemetry (Left) & Dynamic Simulator + Photo (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 7-Day Trajectory & Ground Telemetry */}
        <div className="lg:col-span-6 space-y-5">
          {/* 7-Day Indicative Modal Price Trajectory */}
          <div className="bg-white p-5 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-[#112d1e]">
                  7–Day Indicative Modal Price Trajectory
                </h4>
                <span className="text-[11px] text-[#556e60]">
                  Daily closing modal rates (₹/quintal) across target hubs
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                Spread ₹150/qtl
              </span>
            </div>

            {/* SVG Line Chart */}
            <div className="h-44 w-full pt-2">
              <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible">
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f0f4ee" strokeWidth="1" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f0f4ee" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f0f4ee" strokeWidth="1" />

                {/* Left Y Labels */}
                <text x="0" y="24" fontSize="9" fill="#889c8e">₹3,200</text>
                <text x="0" y="64" fontSize="9" fill="#889c8e">₹2,900</text>
                <text x="0" y="104" fontSize="9" fill="#889c8e">₹2,600</text>

                {/* Ahmedabad Line (Top Green) */}
                <path
                  d="M 50,75 L 120,68 L 190,56 L 260,45 L 330,38 L 400,35 L 470,32"
                  fill="none"
                  stroke="#1b7340"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Anand Line (Lower Dark Green) */}
                <path
                  d="M 50,105 L 120,95 L 190,85 L 260,70 L 330,62 L 400,58 L 470,55"
                  fill="none"
                  stroke="#2c3e50"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Data Points on Ahmedabad */}
                {[[50,75],[120,68],[190,56],[260,45],[330,38],[400,35],[470,32]].map(([x,y], i) => (
                  <circle key={`ahmed-${i}`} cx={x} cy={y} r="3.5" fill="#1b7340" stroke="#ffffff" strokeWidth="1.5" />
                ))}

                {/* Data Points on Anand */}
                {[[50,105],[120,95],[190,85],[260,70],[330,62],[400,58],[470,55]].map(([x,y], i) => (
                  <circle key={`anand-${i}`} cx={x} cy={y} r="3.5" fill="#2c3e50" stroke="#ffffff" strokeWidth="1.5" />
                ))}

                {/* X Axis Labels */}
                {['6 May', '7 May', '8 May', '9 May', '10 May', 'Yesterday', 'Today'].map((day, idx) => (
                  <text key={day} x={50 + idx * 70} y="132" fontSize="9" fill="#657e70" textAnchor="middle">
                    {day}
                  </text>
                ))}
              </svg>
            </div>

            {/* Legend & Note */}
            <div className="flex items-center justify-between pt-1 border-t border-[#edf3ec] text-[11px] text-[#556e60]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#2c3e50] rounded-full"></span>
                  Anand Local
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#1b7340] rounded-full"></span>
                  Ahmedabad APMC
                </span>
              </div>
              <span className="text-[10px] text-[#718b7c]">
                Anand spread compressed by ₹120 this week due to local highway hotel procurement.
              </span>
            </div>
          </div>

          {/* Verified Ground Telemetry */}
          <div className="bg-white p-5 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm sm:text-base text-[#112d1e]">
                Verified Ground Telemetry
              </h4>
              <span className="text-[10px] text-[#708a7b]">Updated 14 mins ago</span>
            </div>

            <div className="space-y-2.5">
              {/* Tile 1 */}
              <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e2ede0] flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="p-1.5 rounded-lg bg-[#e8f5e9] text-[#1b5e20] shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#143525]">Anand Inflow Surge (+15%)</div>
                    <div className="text-[11px] text-[#556e60] mt-0.5">
                      Arrivals up 18% from Petlad belt. High volume handling smooth.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5e9] text-[#1e7e34] border border-[#c8e6c9] shrink-0">
                  Normal Absorb
                </span>
              </div>

              {/* Tile 2 */}
              <div className="p-3 rounded-xl bg-[#fffafa] border border-[#fed7d7] flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="p-1.5 rounded-lg bg-[#fee2e2] text-[#b91c1c] shrink-0">
                    <Flame className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#991b1b]">Transit Heat Index: 38°C</div>
                    <div className="text-[11px] text-[#77443d] mt-0.5">
                      Surat highway corridor prone to midday heat alert in open crates. Crates require tarpaulin shade.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5] shrink-0">
                  Serious Alert
                </span>
              </div>

              {/* Tile 3 */}
              <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e2ede0] flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="p-1.5 rounded-lg bg-[#e0f2f1] text-[#00695c] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#143525]">HoReCa Bulk Procurement Firm</div>
                    <div className="text-[11px] text-[#556e60] mt-0.5">
                      Ahmedabad-Vadodara Expressways restaurants institutional timeout Grade A at ₹2,800+ cash.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e0f2f1] text-[#00695c] border border-[#b2dfdb] shrink-0">
                  Firm Floor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Simulator + Lot Photo Preview */}
        <div className="lg:col-span-6 space-y-5">
          {/* DYNAMIC SIMULATOR: Net Realization Calculator */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e693e] bg-[#edf6eb] px-2 py-0.5 rounded border border-[#cbe2c8]">
                  DYNAMIC SIMULATOR
                </span>
              </div>
              <h4 className="font-extrabold text-base sm:text-lg text-[#112d1e] mt-1">
                Net Realization Calculator
              </h4>
              <p className="text-xs text-[#526d5f]">
                Adjust volume or negotiated freight to observe real-time pocket-earning shifts across mandis.
              </p>
            </div>

            {/* Slider 1: Dispatch Lot Quantity */}
            <div className="space-y-2 bg-[#f8fbf7] p-3.5 rounded-xl border border-[#e2ede0]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#153825]">Dispatch Lot Quantity</span>
                <span className="font-extrabold text-[#153825] bg-white px-2 py-0.5 rounded border border-[#d2e2d0]">
                  {lotQuantity} kg ({lotQuantity / 100} Qtl)
                </span>
              </div>

              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={lotQuantity}
                onChange={(e) => setLotQuantity(Number(e.target.value))}
                className="w-full accent-[#1b7340] cursor-pointer"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setLotQuantity(200)}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    lotQuantity === 200
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  Small Pick-up (200 kg)
                </button>
                <button
                  onClick={() => setLotQuantity(1200)}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    lotQuantity === 1200
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  Tempo Load (1,200 kg)
                </button>
                <button
                  onClick={() => setLotQuantity(2500)}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    lotQuantity === 2500
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  Mini Truck (2,500 kg)
                </button>
              </div>
            </div>

            {/* Slider 2: Freight Rate Variance */}
            <div className="space-y-2 bg-[#f8fbf7] p-3.5 rounded-xl border border-[#e2ede0]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#153825]">Freight Rate Variance</span>
                <span className="font-extrabold text-[#153825] bg-white px-2 py-0.5 rounded border border-[#d2e2d0]">
                  {freightVariance === 0 ? 'Base APMC Tariff (0%)' : `${freightVariance > 0 ? '+' : ''}${freightVariance}%`}
                </span>
              </div>

              <input
                type="range"
                min="-30"
                max="40"
                step="5"
                value={freightVariance}
                onChange={(e) => setFreightVariance(Number(e.target.value))}
                className="w-full accent-[#1b7340] cursor-pointer"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setFreightVariance(-30)}
                  className={`text-[10px] px-2.5 py-1 rounded border transition-all ${
                    freightVariance === -30
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  FPO Shared Discount (-30%)
                </button>
                <button
                  onClick={() => setFreightVariance(0)}
                  className={`text-[10px] px-2.5 py-1 rounded border transition-all ${
                    freightVariance === 0
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  Standard Base (0%)
                </button>
                <button
                  onClick={() => setFreightVariance(40)}
                  className={`text-[10px] px-2.5 py-1 rounded border transition-all ${
                    freightVariance === 40
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  Diesel Surcharge (+40%)
                </button>
              </div>
            </div>

            {/* Simulation Outcomes Output */}
            <div className="p-3.5 rounded-xl bg-[#edf6eb] border border-[#cbe2c8] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e633a] block">
                Simulation Outcome (Simulated on Dynamic Calc)
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#daead7]">
                  <span className="font-semibold text-[#143224]">Anand APMC (Local)</span>
                  <div className="text-right">
                    <strong className="text-[#175235] text-sm">₹{dynamicCalc.anand.totalNet.toLocaleString('en-IN')}</strong>
                    <span className="text-[10px] text-[#556e60] block font-normal">₹{dynamicCalc.anand.netPerQtl} /qtl net</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-[#daead7]">
                  <span className="font-semibold text-[#143224]">Ahmedabad APMC</span>
                  <div className="text-right">
                    <strong className="text-[#153f2c] text-sm">₹{dynamicCalc.ahmedabad.totalNet.toLocaleString('en-IN')}</strong>
                    <span className="text-[10px] text-[#556e60] block font-normal">₹{dynamicCalc.ahmedabad.netPerQtl} /qtl net</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="font-semibold text-[#991b1b]">Surat APMC</span>
                  <div className="text-right">
                    <strong className="text-[#991b1b] text-sm">₹{dynamicCalc.surat.totalNet.toLocaleString('en-IN')}</strong>
                    <span className="text-[10px] text-[#7f1d1d] block font-normal">₹{dynamicCalc.surat.netPerQtl} /qtl net</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Tip */}
              <div className="text-[11px] text-[#2b5e40] pt-1 leading-snug flex items-start gap-1">
                <span>💡</span>
                <span>
                  {lotQuantity >= 1800
                    ? 'At this large volume, shared truck freight makes Ahmedabad APMC competitive and offers deeper institutional buyer demand.'
                    : 'Tip: At batches above 1,800 kg, shared truck freight makes Ahmedabad APMC marginally higher in net cash.'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onLockSlot('Anand APMC', dynamicCalc.anand.totalNet)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-[#72f5b5]" />
                Confirm Dispatch for Anand ({lotQuantity} kg)
              </button>

              <button
                onClick={onShareFPO}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#f6faf4] border border-[#cbe0c7] text-[#1c4d34] font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-4 h-4" />
                Share Realization Ledger with FPO Group
              </button>
            </div>
          </div>

          {/* Lot #4 Tomato Harvest Ready Card with Real Photo */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#d6e3d3] shadow-xs flex items-center gap-3.5">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#cde0cb]">
              <Image
                src="/images/tomato-lot.jpg"
                alt="Lot #4 Fresh Tomato Harvest"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-extrabold text-[#143525] block truncate">
                Lot #4 Tomato Harvest Ready
              </span>
              <p className="text-[11px] text-[#556e60] mt-0.5 truncate">
                Field Plot 2B, Anand Taluka • Moisture standard 84%
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-[#1e6e3c] bg-[#eaf5e8] px-2 py-0.5 rounded">
                  ✓ Ready to dispatch
                </span>
                <span className="text-[10px] text-[#718b7c]">20 Crates (25kg)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Provenance & Actions */}
      <footer className="pt-4 border-t border-[#e2ebe0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#637d6e]">
        <div className="flex items-center gap-1.5 text-center sm:text-left">
          <span>🛡️</span>
          <span>
            <strong>Data Provenance:</strong> AGMARKNET official mandi bulletins, Gujarat State Agricultural Marketing Board (GSAMB), and verified Anand Krishi Vigyan Kendra ground spot calls.
          </span>
        </div>

        <div className="flex items-center gap-4 font-bold shrink-0">
          <button
            onClick={() => alert('Downloading official GSAMB APMC Cess Schedule 2026-27 (PDF)...')}
            className="hover:text-[#184e36] hover:underline"
          >
            Download Cess Schedule
          </button>
          <button
            onClick={() => alert('Dispute Mandi Rate form opened for Anand Agricultural Office.')}
            className="hover:text-[#184e36] hover:underline"
          >
            Dispute Mandi Rate
          </button>
        </div>
      </footer>
    </div>
  )
}
