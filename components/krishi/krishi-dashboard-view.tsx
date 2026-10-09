'use client'

import React from 'react'
import {
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  Truck,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Store,
  ChevronRight,
  MessageSquare,
  Volume2,
  Info,
  Layers,
  FileSpreadsheet,
} from 'lucide-react'
import { Language } from './krishi-topbar'

interface DashboardViewProps {
  currentLang: Language
  onOpenSwitchLot: () => void
  onOpenRouteProtocol: () => void
  onOpenBuyers: () => void
  onOpenCalculator: () => void
  onAskAI: (prompt: string) => void
  onViewEvidence: (evidenceKey: string) => void
}

export function KrishiDashboardView({
  currentLang,
  onOpenSwitchLot,
  onOpenRouteProtocol,
  onOpenBuyers,
  onOpenCalculator,
  onAskAI,
  onViewEvidence,
}: DashboardViewProps) {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Telemetry Strip & Location Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#1b5e20] font-semibold border border-[#c8e6c9]">
            <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse"></span>
            GUJARAT • LIVE APMC TELEMETRY
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f1f5ef] text-[#3e5647] font-medium border border-[#dce6dc]">
            <MapPin className="w-3.5 h-3.5 text-[#2b724f]" />
            Reg: Anand Rural HUB
          </span>
        </div>

        <div className="text-[11px] text-[#5e7768] font-medium flex items-center gap-1">
          <span>Telemetry sync:</span>
          <span className="font-semibold text-[#1f4a35]">09 Oct 2026, 06:10 AM</span>
        </div>
      </div>

      {/* Greeting & Active Lot Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#112d1e] tracking-tight flex items-center gap-2">
            {currentLang === 'gu'
              ? 'શુભ પ્રભાત, રમેશ ભાઈ'
              : currentLang === 'hi'
              ? 'सुप्रभात, रमेश भाई'
              : 'Good morning, Ramesh Bhai'}{' '}
            <span>👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#4d6657] mt-1 max-w-2xl leading-relaxed">
            {currentLang === 'gu'
              ? 'આજના મંડી ટ્રેડિંગ વિન્ડો સક્રિય છે. આણંદ-અમદાવાદ NH-64 કોરિડોર પર ટ્રાફિક અને લોજિસ્ટિક્સ ક્લિયર છે.'
              : currentLang === 'hi'
              ? 'आज की मंडी ट्रेडिंग विंडो सक्रिय हैं। आणंद-अहमदाबाद NH-64 कॉरिडोर पर लॉजिस्टिक्स सुचारू है।'
              : "Today's mandi trading windows are active. Anand-Ahmedabad NH-64 corridor reports clear logistics."}
          </p>
        </div>

        {/* Quick Query / Switchlot Card */}
        <div
          onClick={onOpenSwitchLot}
          className="bg-white border border-[#d6e3d3] hover:border-[#206342] p-3.5 rounded-xl shadow-xs cursor-pointer transition-all hover:shadow-sm flex flex-col gap-1 max-w-sm shrink-0"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#1c5d3f]">
              QUICK QUERY / SWITCHLOT
            </span>
            <span className="text-xs font-semibold text-[#1c5d3f] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              ➔
            </span>
          </div>
          <div className="text-xs font-bold text-[#143223]">
            500 kg Grade-A tomatoes in Anand ready from
          </div>
          <div className="text-[10px] text-[#61796b] flex items-center gap-1">
            <span>💡</span> Tap to run scenario analysis for other mandis or grades
          </div>
        </div>
      </div>

      {/* Active Lot Chips Row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-3 py-1.5 rounded-lg bg-white border border-[#d1e0ce] text-xs font-bold text-[#183d2a] flex items-center gap-1.5 shadow-2xs">
          🍅 Tomato (Tameta)
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-white border border-[#d1e0ce] text-xs font-medium text-[#2d4738] shadow-2xs">
          500 kg (5 Quintals)
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-[#eaf4ea] border border-[#bfe0be] text-xs font-semibold text-[#196939] flex items-center gap-1 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5" /> Grade A Selected
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-white border border-[#d1e0ce] text-xs text-[#526a5c] shadow-2xs">
          Harvested Yesterday | Drop/Field
        </span>
        <button
          onClick={onOpenSwitchLot}
          className="text-xs text-[#206342] font-semibold hover:underline px-2 py-1"
        >
          Change lot ▾
        </button>
      </div>

      {/* HERO RECOMMENDED DECISION CARD (Deep Emerald Forest Container) */}
      <div className="relative rounded-2xl bg-[#143828] text-white p-6 sm:p-7 shadow-lg border border-[#1f543c] overflow-hidden">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#25734f]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#25523d]">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#1f523c] border border-[#3b7d5e] text-[#b4f0cf]">
              RECOMMENDED DECISION
            </span>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#20724d] text-white shadow-2xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#72f5b5]"></span>
              89 / 100 Opportunity Score
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#a9cfbb]">
            <span className="font-semibold text-white">Distance & Transit:</span>
            <span className="bg-[#1b4433] px-2.5 py-0.5 rounded border border-[#2b5e46]">
              65 km • ~1 hr 45 min
            </span>
          </div>
        </div>

        {/* Mandi Headline */}
        <div className="pt-5 pb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ahmedabad Wholesale Mandi (APMC Jamalpur)
          </h2>
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column: Numbers & Deductions Breakdown */}
          <div className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Indicative Gross Signal */}
              <div className="bg-[#1a4332] p-4 rounded-xl border border-[#275c44]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#a0cbb4] font-medium">
                    Indicative Gross Signal
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#276e4b] text-[#78f1b6]">
                    +8.4%
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">₹2,850</span>
                  <span className="text-xs text-[#a3c9b5]">/ quintal</span>
                </div>
                <div className="text-[11px] text-[#9fc4b0] mt-1">
                  Translates to ₹28.50 / kg vs local farm gate
                </div>
              </div>

              {/* Est. Net Realisation */}
              <div className="bg-[#1a4332] p-4 rounded-xl border border-[#275c44]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#a0cbb4] font-medium">
                    Est. Net Realisation
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#33815b] text-white">
                    In-Hand
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#78f5b8]">
                    ₹13,500
                  </span>
                  <span className="text-xs text-[#a3c9b5]">for 500 kg</span>
                </div>
                <div className="text-[11px] text-[#9fc4b0] mt-1 font-semibold">
                  ₹27.00 / kg <span className="text-[#64a080] font-normal">(₹2,700 / Qtl)</span>
                </div>
              </div>
            </div>

            {/* Bahi-Khata Realization Breakdown Progress Bar */}
            <div className="bg-[#183e2e] p-4 rounded-xl border border-[#25523d] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#d2ede0] flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#73ebb2]" />
                  Bahi-Khata Realization Breakdown
                </span>
                <span className="text-[11px] font-semibold text-[#f08c7d]">
                  Deductions: ₹1,250 Total
                </span>
              </div>

              {/* Segmented Progress Bar */}
              <div className="h-3 w-full bg-[#112a1f] rounded-full overflow-hidden flex shadow-inner">
                <div className="h-full bg-[#3ec07f]" style={{ width: '82%' }} title="Net Take Home (₹13,500)"></div>
                <div className="h-full bg-[#f39c12]" style={{ width: '9%' }} title="Mini-Truck Freight (₹900)"></div>
                <div className="h-full bg-[#3498db]" style={{ width: '4%' }} title="APMC & Handling (₹150)"></div>
                <div className="h-full bg-[#9b59b6]" style={{ width: '5%' }} title="Crate/Storage (₹200)"></div>
              </div>

              {/* Breakdown Labels */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-[#a4c9b6] pt-1">
                <div>
                  <span className="block text-[#6be3a7] font-semibold">Gross Yield</span>
                  <span className="text-white font-bold text-xs">₹14,250</span>
                </div>
                <div>
                  <span className="block text-[#f7b731] font-semibold">Mini-Truck Freight</span>
                  <span className="text-white font-bold text-xs">- ₹900</span>
                </div>
                <div>
                  <span className="block text-[#4bcffa] font-semibold">APMC & Handling</span>
                  <span className="text-white font-bold text-xs">- ₹150</span>
                </div>
                <div>
                  <span className="block text-[#d980fa] font-semibold">Crate / Storage</span>
                  <span className="text-white font-bold text-xs">- ₹200</span>
                </div>
              </div>
            </div>

            {/* vs Local Farmgate Trader Alert Box */}
            <div className="p-3.5 rounded-xl bg-[#1c4835] border border-[#2b654a] flex items-center gap-3 text-xs">
              <span className="text-lg shrink-0">🚚</span>
              <div className="text-[#cce8dc] leading-relaxed">
                <strong className="text-white">vs Local Farmgate Trader:</strong> Offering ₹23.50/kg (₹11,750 net). Dispatching to APMC Jamalpur generates{' '}
                <span className="font-extrabold text-[#75f8ba] bg-[#123625] px-1.5 py-0.5 rounded">
                  +₹1,750 extra cash in hand
                </span>.
              </div>
            </div>
          </div>

          {/* Right Column: Rationale, Optimal Window, Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-[#17412f] p-5 rounded-xl border border-[#275c43]">
            <div className="space-y-3.5">
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#8cf0be] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#73ebb2]" />
                WHY THIS DECISION RIGHT NOW?
              </div>

              <p className="text-xs text-[#c6e6d6] leading-relaxed">
                Ahmedabad offers higher net returns than Surat or Vadodara after freight due to an acute hotel & restaurant demand spike post-festive weekend. Local arrival volumes down 14% at Jamalpur this morning.
              </p>

              {/* Optimal Dispatch Window Callout */}
              <div className="p-3.5 rounded-lg bg-[#123425] border border-[#235c3e] space-y-1">
                <div className="text-[11px] font-bold text-[#f5d76e] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Optimal Dispatch Window:
                </div>
                <div className="text-xs text-[#d1ebde] leading-snug">
                  Depart Anand by <strong>4:30 AM tomorrow</strong> for <strong>6:15 AM</strong> lot registration and first-line auctioning.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={onOpenRouteProtocol}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0e271c] hover:bg-[#091b13] text-white font-bold text-xs flex items-center justify-center gap-2 border border-[#2a6147] transition-all shadow-xs"
              >
                <Truck className="w-4 h-4 text-[#6be3a7]" />
                View Route & Dispatch Protocol
              </button>

              <button
                onClick={onOpenBuyers}
                className="w-full py-2.5 px-4 rounded-lg bg-[#276e4b] hover:bg-[#205b3e] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Store className="w-4 h-4" />
                Discover Matching Buyers (12)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-PILLAR MARKET TELEMETRY (Anand & Ahmedabad Axis) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <h3 className="font-bold text-[#143224] text-sm sm:text-base">
            4–Pillar Market Telemetry (Anand & Ahmedabad Axis)
          </h3>
          <span className="text-[11px] text-[#607a6c] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1b7340]"></span>
            Refreshed 12 mins ago
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Mandi Average */}
          <div className="bg-white p-4 rounded-xl border border-[#d6e3d3] shadow-xs flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-[#eaf4ea] text-[#1c663b]">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#1e7e34] border border-[#c8e6c9]">
                +8.4% WoW
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#60776b] font-medium block">
                Indicative Mandi Average
              </span>
              <div className="text-xl font-extrabold text-[#112d1e] mt-0.5">
                ₹2,850<span className="text-xs text-[#526a5c] font-medium">/qtl</span>
              </div>
            </div>
            <p className="text-[11px] text-[#556d60] leading-snug">
              Modal auction rate steady across 28 recorded transactions at Jamalpur today.
            </p>
          </div>

          {/* Card 2: Institutional Buyers */}
          <div className="bg-white p-4 rounded-xl border border-[#d6e3d3] shadow-xs flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-[#e3f2fd] text-[#0d47a1]">
                <Store className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e0f2f1] text-[#00695c] border border-[#b2dfdb]">
                High Intensity
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#60776b] font-medium block">
                Institutional Buyers
              </span>
              <div className="text-xl font-extrabold text-[#112d1e] mt-0.5">
                12 Verified
              </div>
            </div>
            <p className="text-[11px] text-[#556d60] leading-snug">
              Active demand signals from quick-procurement & HoReCa Wholesalers within 70 km.
            </p>
          </div>

          {/* Card 3: Local Pickup Availability */}
          <div className="bg-white p-4 rounded-xl border border-[#d6e3d3] shadow-xs flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-[#fff8e1] text-[#b78103]">
                <Truck className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#1e7e34] border border-[#c8e6c9]">
                Favorable
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#60776b] font-medium block">
                Local Pickup Availability
              </span>
              <div className="text-xl font-extrabold text-[#112d1e] mt-0.5">
                4 Trucks
              </div>
            </div>
            <p className="text-[11px] text-[#556d60] leading-snug">
              Chota Hathi/Tata Ace available in Mogri. Dedicated trip rate locked at ~₹900.
            </p>
          </div>

          {/* Card 4: Spoilage & Glut Threat */}
          <div className="bg-white p-4 rounded-xl border border-[#d6e3d3] shadow-xs flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-[#e8f5e9] text-[#1b5e20]">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#1e7e34] border border-[#c8e6c9]">
                Minimal Risk
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#60776b] font-medium block">
                Spoilage & Glut Threat
              </span>
              <div className="text-xl font-extrabold text-[#112d1e] mt-0.5">
                Low Level
              </div>
            </div>
            <p className="text-[11px] text-[#556d60] leading-snug">
              No market glut alert. Weather clear (31°C dry) to protect edible harvest shelf-life.
            </p>
          </div>
        </div>
      </div>

      {/* LOWER 2-COLUMN SECTION: Explainable Intelligence + Alternative Mandi Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Why Ahmedabad Mandi? (Explainable Intelligence) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-[#133424]">
                  Why Ahmedabad Mandi? (Explainable Intelligence)
                </h3>
                <ShieldCheck className="w-4 h-4 text-[#1e7e34]" />
              </div>
              <p className="text-xs text-[#5e7768] mt-0.5">
                Audit-able rationale backed by Agmarknet telemetry and live mandi ledger records
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {[
              {
                id: 'momentum',
                title: 'Strong recent price upward momentum',
                desc: 'APMC Jamalpur modal rate rose +₹220/qtl over the last 72 hours due to tight supply.',
              },
              {
                id: 'buyers',
                title: '12 active institutional buyers registered',
                desc: 'Premium Grade A firm tomatoes specifically requested by Quick-Commerce hubs & Guj supermarket chain.',
              },
              {
                id: 'transport',
                title: 'High transport availability on NH-64 corridor',
                desc: 'Direct express highway route: negligible en-route heat loss compared to Saurashtra transit.',
              },
              {
                id: 'inhand',
                title: 'Net in-hand exceeds Anand local mandi by ₹850',
                desc: 'Freight differentials are fully offset by the ₹320/qtl gross spread, producing higher net pocket cash.',
              },
              {
                id: 'bottleneck',
                title: 'Zero arrival bottlenecks or truck hold-ups',
                desc: 'Arrival yard toll telemetry reports inspection and unloading cycle wait under 25-minute turnaround.',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0] flex items-start justify-between gap-3 hover:border-[#2b724f] transition-all"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#206342] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#143525]">{item.title}</div>
                    <div className="text-[11px] text-[#556e60] mt-0.5 leading-snug">{item.desc}</div>
                  </div>
                </div>

                <button
                  onClick={() => onViewEvidence(item.id)}
                  className="text-[11px] font-bold text-[#1b5e20] hover:text-[#143e18] shrink-0 hover:underline flex items-center gap-0.5 pt-0.5"
                >
                  View evidence &rsaquo;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Alternative Mandi Comparison (500 kg Lot) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#d6e3d3] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base sm:text-lg text-[#133424]">
                Alternative Mandi Comparison
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#edf4ec] text-[#2d563e] border border-[#d2e2d0]">
                500 kg Lot
              </span>
            </div>
            <p className="text-xs text-[#5e7768] mt-0.5">
              Real-time estimated net returns calculated for your exact coordinates:
            </p>
          </div>

          <div className="space-y-3">
            {/* Card 1: Ahmedabad */}
            <div className="p-3.5 rounded-xl bg-[#edf5eb] border-2 border-[#2f7551] flex flex-col gap-2 relative">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-[#143625]">Ahmedabad (Jamalpur)</span>
                  <div className="text-[10px] text-[#556e60]">Gross: ₹2,850/qtl • Freight: ₹180/qtl</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#184e36] text-white">
                    Recommended 89/100
                  </span>
                  <div className="text-sm font-extrabold text-[#184e36] mt-1">
                    Net: ₹2,700 / qtl
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-[#2e5d44] font-medium border-t border-[#d2e2d0] pt-1.5 flex justify-between">
                <span>Total In-Hand: <strong>₹13,500</strong></span>
                <span className="text-[10px] text-[#556e60]">(Highest payout; escrowed 3-car lot)</span>
              </div>
            </div>

            {/* Card 2: Anand Local */}
            <div className="p-3.5 rounded-xl bg-[#f8fbf7] border border-[#d8e4d6] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#193828]">Anand APMC (Local)</span>
                    <span className="text-[10px] text-[#698072]">8 km away</span>
                  </div>
                  <div className="text-[10px] text-[#556e60]">Gross: ₹2,600/qtl • Freight: ₹40/qtl</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-[#5a7465]">81 / 100</span>
                  <div className="text-sm font-bold text-[#143224] mt-0.5">
                    Net: ₹2,520 / qtl
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-[#556e60] border-t border-[#e2ece0] pt-1.5 flex justify-between">
                <span>Total In-Hand: <strong>₹12,600</strong></span>
                <span className="text-[10px] text-[#a04030] font-semibold">(₹900 lower than Ahmedabad)</span>
              </div>
            </div>

            {/* Card 3: Vadodara */}
            <div className="p-3.5 rounded-xl bg-[#f8fbf7] border border-[#d8e4d6] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#193828]">Vadodara (Sayajipura)</span>
                    <span className="text-[10px] text-[#698072]">44 km away</span>
                  </div>
                  <div className="text-[10px] text-[#556e60]">Gross: ₹2,750/qtl • Freight: ₹140/qtl</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-[#5a7465]">79 / 100</span>
                  <div className="text-sm font-bold text-[#143224] mt-0.5">
                    Net: ₹2,560 / qtl
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-[#556e60] border-t border-[#e2ece0] pt-1.5 flex justify-between">
                <span>Total In-Hand: <strong>₹12,800</strong></span>
                <span className="text-[10px] text-[#556e60]">(Higher freight eats 1-hour margin)</span>
              </div>
            </div>
          </div>

          {/* Calculator Trigger Button */}
          <button
            onClick={onOpenCalculator}
            className="w-full py-2.5 px-4 rounded-xl bg-[#f0f6ee] hover:bg-[#e4efe1] border border-[#c2dac0] text-[#1b5037] font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#206342]" />
            Open Interactive Net Realization Calculator
          </button>
        </div>
      </div>

      {/* BOTTOM KISAN AI ASSISTANT BOX */}
      <div className="bg-[#f0f6ee] border border-[#cfe2cc] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#184e36] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Sparkles className="w-6 h-6 text-[#72f5b5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1b4e36] uppercase tracking-wider">
                Ask KrishiIntel Assistant
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#1b4e36] text-white">
                Kisan AI
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-extrabold text-[#123122] mt-0.5">
              &quot;What should I do with my tomatoes today, Ramesh Bhai?&quot;
            </h4>
            <p className="text-xs text-[#526b5d] mt-1 max-w-xl">
              Ask in Gujarati, Hindi, or English. Instant advice factoring in current haul windows, transit waste fees, and truck rates.
            </p>
          </div>
        </div>

        {/* 3 Quick AI Prompts */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
          <button
            onClick={() => onAskAI('Can I wait till Saturday for higher rates?')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#fafdfa] border border-[#c8ddc5] text-xs font-semibold text-[#18432f] text-left hover:border-[#206342] transition-all shadow-2xs flex items-center justify-between gap-3"
          >
            <span>Can I wait till Saturday for higher rates?</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6c8677]" />
          </button>
          <button
            onClick={() => onAskAI('Connect me with Magan mini-truck driver')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#fafdfa] border border-[#c8ddc5] text-xs font-semibold text-[#18432f] text-left hover:border-[#206342] transition-all shadow-2xs flex items-center justify-between gap-3"
          >
            <span>Connect me with Magan mini-truck driver</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6c8677]" />
          </button>
          <button
            onClick={() => onAskAI('Can I pool transport with Anand FPO?')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#fafdfa] border border-[#c8ddc5] text-xs font-semibold text-[#18432f] text-left hover:border-[#206342] transition-all shadow-2xs flex items-center justify-between gap-3"
          >
            <span>Can I pool transport with Anand FPO?</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6c8677]" />
          </button>
        </div>
      </div>

      {/* Trust & Methodology Footer */}
      <footer className="pt-4 border-t border-[#e2ebe0] text-center space-y-1">
        <p className="text-[11px] text-[#637d6e] max-w-3xl mx-auto leading-relaxed">
          <strong>Data Trust & Methodology:</strong> All prices and deductions are real telemetry filtered from APMC Agmarknet daily protocols, verified mandi gate entries, and on-ground FPO wholesale auctions. Never speculative futures.
        </p>
        <p className="text-[10px] text-[#839b8d]">
          KrishiIntel Version 2.4 • Dedicated to empowering farmers across Gujarat, Maharashtra & Rajasthan
        </p>
      </footer>
    </div>
  )
}
