'use client'

import React from 'react'
import {
  Sparkles,
  MapPin,
  TrendingUp,
  Clock,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Store,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react'
import { Language } from './krishi-topbar'
import { HarvestLot, MandiCalculation, money, numberFormat, cropsList } from '@/lib/market-service'
import { useTranslation } from '@/lib/translations'

interface DashboardViewProps {
  currentLang: Language
  activeLot: HarvestLot
  mandiCalculations?: MandiCalculation[]
  onOpenSwitchLot: () => void
  onOpenRouteProtocol: () => void
  onOpenBuyers: () => void
  onOpenCalculator: () => void
  onAskAI: (prompt: string) => void
  onViewEvidence: () => void
  onLockSlot: (mandiName: string, netAmount: number) => void
}

export function KrishiDashboardView({
  currentLang,
  activeLot,
  mandiCalculations = [],
  onOpenSwitchLot,
  onOpenRouteProtocol,
  onOpenBuyers,
  onOpenCalculator,
  onAskAI,
  onViewEvidence,
  onLockSlot,
}: DashboardViewProps) {
  const t = useTranslation(currentLang)

  const bestMandi: MandiCalculation = (mandiCalculations && mandiCalculations.length > 0)
    ? mandiCalculations[0]
    : {
        id: 'ahmedabad',
        name: 'Ahmedabad Wholesale Mandi (APMC Jamalpur)',
        nameGu: 'અમદાવાદ જથ્થાબંધ મંડી (એપીએમસી જમાલપુર)',
        nameHi: 'अहमदाबाद थोक मंडी (एपीएमसी जमालपुर)',
        distanceKm: 65,
        transitTime: '1 hr 45 min',
        grossPerQtl: 2850,
        freightPerQtl: 180,
        handlingPerQtl: 30,
        shrinkagePerQtl: 50,
        cessPerQtl: 22.8,
        totalGross: 14250,
        totalFreight: 900,
        totalHandling: 150,
        totalCess: 114,
        totalShrinkage: 250,
        totalNet: 13500,
        netPerQtl: 2700,
        opportunityScore: 89,
        buyerCount: 32,
        statusBadge: 'Top Recommended Choice',
        badgeVariant: 'recommended' as const,
        paymentSpeed: 'Instant RTGS',
        turnaroundTime: '2.5 hrs',
        notes: 'Optimal dispatch corridor via NE-1 Expressway.',
      }

  const deductionsTotal = bestMandi.totalFreight + bestMandi.totalHandling + bestMandi.totalCess + bestMandi.totalShrinkage
  const netPercentage = Math.max(10, Math.min(90, Math.round((bestMandi.totalNet / (bestMandi.totalGross || 1)) * 100)))
  const freightPercentage = Math.max(5, Math.min(30, Math.round((bestMandi.totalFreight / (bestMandi.totalGross || 1)) * 100)))
  const handlingPercentage = Math.max(3, Math.min(20, Math.round(((bestMandi.totalHandling + bestMandi.totalCess) / (bestMandi.totalGross || 1)) * 100)))
  const shrinkPercentage = Math.max(0, 100 - netPercentage - freightPercentage - handlingPercentage)

  // Local farmgate comparison
  const localFarmgateRate = Math.round(bestMandi.grossPerQtl * 0.82)
  const localFarmgateTotal = Math.round(localFarmgateRate * (activeLot.quantity / 100))
  const cashGainVsFarmgate = Math.max(0, bestMandi.totalNet - localFarmgateTotal)

  const cropLabel = currentLang === 'gu'
    ? (cropsList.find((c) => c.id === activeLot.baseCrop)?.labelGu || activeLot.crop)
    : currentLang === 'hi'
    ? (cropsList.find((c) => c.id === activeLot.baseCrop)?.labelHi || activeLot.crop)
    : activeLot.crop

  const mandiDisplayName = (m: MandiCalculation) => {
    if (currentLang === 'gu' && m.nameGu) return m.nameGu
    if (currentLang === 'hi' && m.nameHi) return m.nameHi
    return m.name
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Telemetry Strip & Location Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#1b5e20] font-semibold border border-[#c8e6c9]">
            <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse"></span>
            {currentLang === 'gu' ? 'ગુજરાત • લાઈવ એપીએમસી ડેટા' : currentLang === 'hi' ? 'गुजरात • लाइव एपीएमसी डेटा' : 'GUJARAT • LIVE APMC TELEMETRY'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f1f5ef] text-[#3e5647] font-medium border border-[#dce6dc]">
            <MapPin className="w-3.5 h-3.5 text-[#2b724f]" />
            {currentLang === 'gu' ? `વિસ્તાર: ${activeLot.location}` : currentLang === 'hi' ? `क्षेत्र: ${activeLot.location}` : `Reg: ${activeLot.location}`}
          </span>
        </div>

        <div className="text-[11px] text-[#5e7768] font-medium flex items-center gap-1">
          <span>{currentLang === 'gu' ? 'લાઈવ અપડેટ:' : currentLang === 'hi' ? 'लाइव अपडेट:' : 'Telemetry sync:'}</span>
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
            {t.heroSubtitle}
          </p>
        </div>

        {/* Quick Query / Switchlot Card */}
        <div
          onClick={onOpenSwitchLot}
          className="bg-white border border-[#d6e3d3] hover:border-[#206342] p-3.5 rounded-xl shadow-xs cursor-pointer transition-all hover:shadow-sm flex flex-col gap-1 max-w-sm shrink-0"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#1c5d3f]">
              {t.activeLotBadge} / {t.switchLot}
            </span>
            <span className="text-xs font-semibold text-[#1c5d3f] flex items-center gap-1">
              {currentLang === 'gu' ? 'બદલવા માટે ક્લિક કરો ➔' : currentLang === 'hi' ? 'बदलने के लिए क्लिक करें ➔' : 'Tap to switch ➔'}
            </span>
          </div>
          <div className="text-xs font-bold text-[#143223]">
            {cropLabel} • {numberFormat(activeLot.quantity)} kg ({activeLot.grade})
          </div>
          <div className="text-[10px] text-[#61796b] flex items-center gap-1">
            <span>💡</span> {t.farmOrigin}: {activeLot.location} • {t.moistureLevel}: {activeLot.moisture}
          </div>
        </div>
      </div>

      {/* Active Lot Chips Row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-3 py-1.5 rounded-lg bg-white border border-[#d1e0ce] text-xs font-bold text-[#183d2a] flex items-center gap-1.5 shadow-2xs">
          🌱 {cropLabel}
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-white border border-[#d1e0ce] text-xs font-medium text-[#2d4738] shadow-2xs">
          {numberFormat(activeLot.quantity)} kg ({activeLot.quantity / 100} Qtl)
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-[#eaf4ea] border border-[#bfe0be] text-xs font-semibold text-[#196939] flex items-center gap-1 shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5" /> {activeLot.grade}
        </span>
        <span className="px-3 py-1.5 rounded-lg bg-white border border-[#d1e0ce] text-xs text-[#526a5c] shadow-2xs">
          {activeLot.farmPlot}
        </span>
        <button
          onClick={onOpenSwitchLot}
          className="text-xs text-[#206342] font-semibold hover:underline px-2 py-1"
        >
          {t.switchLot} ▾
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
              {t.topChoice}
            </span>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#20724d] text-white shadow-2xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#72f5b5]"></span>
              {bestMandi.opportunityScore} / 100 {t.opportunityScore}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#a9cfbb]">
            <span className="font-semibold text-white">{currentLang === 'gu' ? 'અંતર અને સમય:' : currentLang === 'hi' ? 'दूरी व समय:' : 'Distance & Transit:'}</span>
            <span className="bg-[#1b4433] px-2.5 py-0.5 rounded border border-[#2b5e46]">
              {bestMandi.distanceKm} km • ~{bestMandi.transitTime}
            </span>
          </div>
        </div>

        {/* Mandi Headline */}
        <div className="pt-5 pb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {mandiDisplayName(bestMandi)}
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
                    {t.grossApmcRate}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#276e4b] text-[#78f1b6]">
                    APMC
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {money(bestMandi.grossPerQtl)}
                  </span>
                  <span className="text-xs text-[#a3c9b5]">/ {currentLang === 'gu' ? 'ક્વિન્ટલ' : currentLang === 'hi' ? 'क्विंटल' : 'quintal'}</span>
                </div>
                <div className="text-[11px] text-[#9fc4b0] mt-1">
                  ₹{(bestMandi.grossPerQtl / 100).toFixed(2)} / kg
                </div>
              </div>

              {/* Est. Net Realisation */}
              <div className="bg-[#1a4332] p-4 rounded-xl border border-[#275c44]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-[#a0cbb4] font-medium">
                    {t.netInHand}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#33815b] text-white">
                    {currentLang === 'gu' ? 'હાથમાં રોકડા' : currentLang === 'hi' ? 'हाथ में शुद्ध' : 'In-Hand Cash'}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#78f5b8]">
                    {money(bestMandi.totalNet)}
                  </span>
                  <span className="text-xs text-[#a3c9b5]">({numberFormat(activeLot.quantity)} kg)</span>
                </div>
                <div className="text-[11px] text-[#9fc4b0] mt-1 font-semibold">
                  ₹{(bestMandi.netPerQtl / 100).toFixed(2)} / kg{' '}
                  <span className="text-[#64a080] font-normal">({money(bestMandi.netPerQtl)} / Qtl)</span>
                </div>
              </div>
            </div>

            {/* Bahi-Khata Realization Breakdown Progress Bar */}
            <div className="bg-[#183e2e] p-4 rounded-xl border border-[#25523d] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#d2ede0] flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#73ebb2]" />
                  {currentLang === 'gu' ? 'બહી-ખાતા ખર્ચ વિશ્લેષણ' : currentLang === 'hi' ? 'बही-खाता खर्च विश्लेषण' : 'Bahi-Khata Realization Breakdown'}
                </span>
                <span className="text-[11px] font-semibold text-[#f08c7d]">
                  {t.simDeductions}: {money(deductionsTotal)}
                </span>
              </div>

              {/* Segmented Progress Bar */}
              <div className="h-3 w-full bg-[#112a1f] rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-[#3ec07f]"
                  style={{ width: `${netPercentage}%` }}
                  title={`Net Take Home (${money(bestMandi.totalNet)})`}
                ></div>
                <div
                  className="h-full bg-[#f39c12]"
                  style={{ width: `${freightPercentage}%` }}
                  title={`Freight (${money(bestMandi.totalFreight)})`}
                ></div>
                <div
                  className="h-full bg-[#3498db]"
                  style={{ width: `${handlingPercentage}%` }}
                  title={`APMC Cess & Handling (${money(bestMandi.totalCess + bestMandi.totalHandling)})`}
                ></div>
                <div
                  className="h-full bg-[#9b59b6]"
                  style={{ width: `${shrinkPercentage}%` }}
                  title={`Thermal Shrinkage (${money(bestMandi.totalShrinkage)})`}
                ></div>
              </div>

              {/* Breakdown Labels */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-[#a4c9b6] pt-1">
                <div>
                  <span className="block text-[#6be3a7] font-semibold">{t.simGrossVal}</span>
                  <span className="text-white font-bold text-xs">{money(bestMandi.totalGross)}</span>
                </div>
                <div>
                  <span className="block text-[#f7b731] font-semibold">{t.freightExpense}</span>
                  <span className="text-white font-bold text-xs">- {money(bestMandi.totalFreight)}</span>
                </div>
                <div>
                  <span className="block text-[#4bcffa] font-semibold">{t.apmcCess}</span>
                  <span className="text-white font-bold text-xs">- {money(bestMandi.totalCess + bestMandi.totalHandling)}</span>
                </div>
                <div>
                  <span className="block text-[#d980fa] font-semibold">{t.transitShrinkage}</span>
                  <span className="text-white font-bold text-xs">- {money(bestMandi.totalShrinkage)}</span>
                </div>
              </div>
            </div>

            {/* vs Local Farmgate Trader Alert Box */}
            <div className="p-3.5 rounded-xl bg-[#1c4835] border border-[#2b654a] flex items-center gap-3 text-xs">
              <span className="text-lg shrink-0">🚚</span>
              <div className="text-[#cce8dc] leading-relaxed">
                <strong className="text-white">{t.netGainHeadline}:</strong> {t.netGainDesc}
              </div>
            </div>
          </div>

          {/* Right Column: Rationale, Optimal Window, Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-[#17412f] p-5 rounded-xl border border-[#275c43]">
            <div className="space-y-3.5">
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#8cf0be] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#73ebb2]" />
                {currentLang === 'gu' ? 'શા માટે આ નિર્ણય શ્રેષ્ઠ છે?' : currentLang === 'hi' ? 'यह निर्णय क्यों सर्वश्रेष्ठ है?' : 'WHY THIS DECISION RIGHT NOW?'}
              </div>

              <p className="text-xs text-[#c6e6d6] leading-relaxed">
                {bestMandi.notes}
              </p>

              {/* Optimal Dispatch Window Callout */}
              <div className="p-3.5 rounded-lg bg-[#123425] border border-[#235c3e] space-y-1">
                <div className="text-[11px] font-bold text-[#f5d76e] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {currentLang === 'gu' ? 'ઉત્તમ પ્રસ્થાન સમય વિન્ડો:' : currentLang === 'hi' ? 'उत्तम प्रस्थान समय विंडो:' : 'Optimal Dispatch Window:'}
                </div>
                <div className="text-xs text-[#d1ebde] leading-snug">
                  {currentLang === 'gu'
                    ? 'સવારે ૦૪:૩૦ વાગ્યે આણંદથી નીકળો જેથી સવારે ૦૬:૧૫ વાગ્યે પ્રથમ લાઈન હરાજીમાં લાભ મળે.'
                    : currentLang === 'hi'
                    ? 'सुबह 04:30 बजे आणंद से निकलें ताकि सुबह 06:15 बजे पहली नीलामी लाइन में लाभ मिले।'
                    : 'Depart Anand by 4:30 AM tomorrow for 6:15 AM gate weighing and priority first-line auctioning.'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => onLockSlot(bestMandi.name, bestMandi.totalNet)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#276e4b] hover:bg-[#205b3e] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#72f5b5]" />
                {t.lockSlotBtn} ({money(bestMandi.totalNet)})
              </button>

              <button
                onClick={onOpenRouteProtocol}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0e271c] hover:bg-[#091b13] text-white font-bold text-xs flex items-center justify-center gap-2 border border-[#2a6147] transition-all shadow-xs"
              >
                <Truck className="w-4 h-4 text-[#6be3a7]" />
                {t.routeBtn}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4-PILLAR MARKET TELEMETRY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <h3 className="font-bold text-[#143224] text-sm sm:text-base">
            {t.pillarsTitle} ({cropLabel})
          </h3>
          <span className="text-[11px] text-[#607a6c] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1b7340]"></span>
            {currentLang === 'gu' ? '૧૦ મિનિટ પહેલા અપડેટ થયેલ' : currentLang === 'hi' ? '10 मिनट पहले अपडेट' : 'Refreshed 10 mins ago'}
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
                {currentLang === 'gu' ? 'સક્રિય આવક' : currentLang === 'hi' ? 'सक्रिय आवक' : 'Active Inflow'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#60776b] font-medium block">
                {t.grossApmcRate}
              </span>
              <div className="text-xl font-extrabold text-[#112d1e] mt-0.5">
                {money(bestMandi.grossPerQtl)}<span className="text-xs text-[#526a5c] font-medium">/qtl</span>
              </div>
            </div>
            <p className="text-[11px] text-[#556d60] leading-snug">
              {t.pillar1Desc}
            </p>
          </div>

          {/* Card 2: Institutional Buyers */}
          <div className="bg-white p-4 rounded-xl border border-[#d6e3d3] shadow-xs flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-[#e3f2fd] text-[#0d47a1]">
                <Store className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e0f2f1] text-[#00695c] border border-[#b2dfdb]">
                {currentLang === 'gu' ? 'ઊંચી માગ' : currentLang === 'hi' ? 'उच्च मांग' : 'High Intensity'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#60776b] font-medium block">
                {t.activeBuyersCount}
              </span>
              <div className="text-xl font-extrabold text-[#112d1e] mt-0.5">
                {bestMandi.buyerCount} {currentLang === 'gu' ? 'વેપારીઓ' : currentLang === 'hi' ? 'व्यापारी' : 'Verified'}
              </div>
            </div>
            <p className="text-[11px] text-[#556d60] leading-snug">
              {t.pillar2Desc}
            </p>
          </div>

          {/* Card 3: Local Pickup Availability */}
          <div className="bg-white p-4 rounded-xl border border-[#d6e3d3] shadow-xs flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-[#fff8e1] text-[#b78103]">
                <Truck className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#1e7e34] border border-[#c8e6c9]">
                {currentLang === 'gu' ? 'ઉપલબ્ધ' : currentLang === 'hi' ? 'उपलब्ध' : 'Available'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#60776b] font-medium block">
                {t.logisticsTitle}
              </span>
              <div className="text-xl font-extrabold text-[#112d1e] mt-0.5">
                {currentLang === 'gu' ? 'મગનભાઈ (ટાટા એસ)' : currentLang === 'hi' ? 'मगनभाई (टाटा ऐस)' : 'Magan Bhai (Tata Ace)'}
              </div>
            </div>
            <p className="text-[11px] text-[#556d60] leading-snug">
              {t.pillar3Desc}
            </p>
          </div>

          {/* Card 4: Spoilage & Glut Threat */}
          <div className="bg-white p-4 rounded-xl border border-[#d6e3d3] shadow-xs flex flex-col justify-between space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-[#e8f5e9] text-[#1b5e20]">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#1e7e34] border border-[#c8e6c9]">
                {currentLang === 'gu' ? 'શ્રેષ્ઠ સમય' : currentLang === 'hi' ? 'अनुकूल समय' : 'Optimal Window'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#60776b] font-medium block">
                {t.moistureLevel}
              </span>
              <div className="text-xl font-extrabold text-[#112d1e] mt-0.5">
                {activeLot.moisture} ({activeLot.grade})
              </div>
            </div>
            <p className="text-[11px] text-[#556d60] leading-snug">
              {t.pillar4Desc}
            </p>
          </div>
        </div>
      </div>

      {/* LOWER 2-COLUMN SECTION: Explainable Intelligence + Alternative Mandi Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Explainable Intelligence */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-[#133424]">
                  {currentLang === 'gu' ? 'નિર્ણય પારદર્શિતા અને વિશ્લેષણ' : currentLang === 'hi' ? 'निर्णय पारदर्शिता व विश्लेषण' : 'Explainable Decision Intelligence'}
                </h3>
                <ShieldCheck className="w-4 h-4 text-[#1e7e34]" />
              </div>
              <p className="text-xs text-[#5e7768] mt-0.5">
                {currentLang === 'gu'
                  ? 'એપીએમસી દૈનિક હરાજી અને વાહન ખર્ચ આધારે તૈયાર કરાયેલ ઓડિટ યોગ્ય વિગતો'
                  : currentLang === 'hi'
                  ? 'एपीएमसी दैनिक नीलामी व वाहन खर्च आधारित प्रमाणित विवरण'
                  : 'Audit-able rationale backed by APMC daily auctions and verifiable logistics costs'}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {[
              {
                id: '1',
                title: currentLang === 'gu' ? 'સ્થાનિક દલાલ કરતાં ઊંચો ચોખ્ખો નફો' : currentLang === 'hi' ? 'स्थानीय व्यापारी से अधिक शुद्ध लाभ' : 'High net return spread over local sales',
                desc: currentLang === 'gu'
                  ? `${mandiDisplayName(bestMandi)} માં વેચવાથી ગામના દલાલ કરતાં +${money(cashGainVsFarmgate)} વધુ ચોખ્ખા હાથમાં મળે છે.`
                  : currentLang === 'hi'
                  ? `${mandiDisplayName(bestMandi)} में बेचने पर स्थानीय व्यापारी की तुलना में +${money(cashGainVsFarmgate)} अधिक शुद्ध लाभ मिलता है।`
                  : `Selling at ${bestMandi.name.split('(')[0].trim()} yields ${money(cashGainVsFarmgate)} more cash in pocket than local bids.`,
              },
              {
                id: '2',
                title: currentLang === 'gu' ? `${bestMandi.buyerCount} સત્યાપિત સંસ્થાકીય ખરીદદારો` : currentLang === 'hi' ? `${bestMandi.buyerCount} सत्यापित संस्थागत खरीदार` : `${bestMandi.buyerCount} institutional buyers registered on corridor`,
                desc: currentLang === 'gu'
                  ? 'સુપરમાર્કેટ અને ઝડપી ઈ-કોમર્સ સપ્લાયર્સ દ્વારા ગુણવત્તાયુક્ત માલની ભારે માગ.'
                  : currentLang === 'hi'
                  ? 'सुपरमार्केट व ई-कॉमर्स सप्लायर्स द्वारा गुणवत्तापूर्ण उपज की मजबूत खरीद मांग।'
                  : 'Strong procurement demand for verified produce from supermarket and quick-procurement networks.',
              },
              {
                id: '3',
                title: currentLang === 'gu' ? 'ઝડપી પહોંચ અને ઓછો વજન સુકારો' : currentLang === 'hi' ? 'तेज परिवहन व न्यूनतम वजन घट' : 'Fast transit & minimal heat shrinkage',
                desc: currentLang === 'gu'
                  ? `${bestMandi.distanceKm} કિમી અંતર ${bestMandi.transitTime} માં કપાય છે, બપોરના તડકાથી બચે છે.`
                  : currentLang === 'hi'
                  ? `${bestMandi.distanceKm} किमी की दूरी ${bestMandi.transitTime} में तय होती है, जिससे दोपहर की धूप से बचाव होता है।`
                  : `Transit distance of ${bestMandi.distanceKm} km is covered in ${bestMandi.transitTime}, avoiding hot midday exposure.`,
              },
              {
                id: '4',
                title: t.statutoryCessRule,
                desc: t.cessExplanation,
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
                  onClick={onViewEvidence}
                  className="text-[11px] font-bold text-[#1b5e20] hover:text-[#143e18] shrink-0 hover:underline flex items-center gap-0.5 pt-0.5"
                >
                  {currentLang === 'gu' ? 'વિગતો જુઓ ›' : currentLang === 'hi' ? 'विवरण देखें ›' : 'View evidence ›'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Comparative Mandi Ledger */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#d6e3d3] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base sm:text-lg text-[#133424]">
                {t.tableTitle}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#edf4ec] text-[#2d563e] border border-[#d2e2d0]">
                {numberFormat(activeLot.quantity)} kg {cropLabel}
              </span>
            </div>
            <p className="text-xs text-[#5e7768] mt-0.5">
              {t.tableSubtitle}
            </p>
          </div>

          <div className="space-y-3">
            {mandiCalculations.slice(0, 3).map((m, idx) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                  idx === 0
                    ? 'bg-[#edf5eb] border-2 border-[#2f7551]'
                    : 'bg-[#f8fbf7] border-[#d8e4d6]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm text-[#143625] block truncate max-w-[190px]">
                      {mandiDisplayName(m).split('(')[0].trim()}
                    </span>
                    <div className="text-[10px] text-[#556e60]">
                      {t.colModalRate}: {money(m.grossPerQtl)} • {t.colFreight}: {money(m.freightPerQtl)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      idx === 0 ? 'bg-[#184e36] text-white' : 'bg-[#e2ece0] text-[#335640]'
                    }`}>
                      {t.colScore}: {m.opportunityScore}/100
                    </span>
                    <div className="text-sm font-extrabold text-[#184e36] mt-0.5">
                      {money(m.netPerQtl)} / qtl
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#2e5d44] font-medium border-t border-[#d2e2d0] pt-1.5 flex justify-between">
                  <span>{t.colNetInHand}: <strong>{money(m.totalNet)}</strong></span>
                  <span className="text-[10px] text-[#556e60]">{m.distanceKm} km</span>
                </div>
              </div>
            ))}
          </div>

          {/* Calculator Trigger Button */}
          <button
            onClick={onOpenCalculator}
            className="w-full py-2.5 px-4 rounded-xl bg-[#f0f6ee] hover:bg-[#e4efe1] border border-[#c2dac0] text-[#1b5037] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#206342]" />
            {t.intelHeroTitle}
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
                {t.aiTitle}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#1b4e36] text-white">
                {currentLang === 'gu' ? 'કિસાન એઆઈ' : currentLang === 'hi' ? 'किसान एआई' : 'Kisan AI'}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-extrabold text-[#123122] mt-0.5">
              {currentLang === 'gu'
                ? `&quot;આજે મારા ${cropLabel} નું શું કરવું, રમેશ ભાઈ?&quot;`
                : currentLang === 'hi'
                ? `&quot;आज मेरे ${cropLabel} का क्या करना चाहिए, रमेश भाई?&quot;`
                : `"What should I do with my ${activeLot.crop} today, Ramesh Bhai?"`}
            </h4>
            <p className="text-xs text-[#526b5d] mt-1 max-w-xl">
              {t.aiSubtitle}
            </p>
          </div>
        </div>

        {/* 3 Quick AI Prompts */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
          <button
            onClick={() => onAskAI(t.query1)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#fafdfa] border border-[#c8ddc5] text-xs font-semibold text-[#18432f] text-left hover:border-[#206342] transition-all shadow-2xs flex items-center justify-between gap-3"
          >
            <span>{t.query1}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6c8677]" />
          </button>
          <button
            onClick={() => onAskAI(t.query2)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#fafdfa] border border-[#c8ddc5] text-xs font-semibold text-[#18432f] text-left hover:border-[#206342] transition-all shadow-2xs flex items-center justify-between gap-3"
          >
            <span>{t.query2}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6c8677]" />
          </button>
          <button
            onClick={() => onAskAI(t.query4)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#fafdfa] border border-[#c8ddc5] text-xs font-semibold text-[#18432f] text-left hover:border-[#206342] transition-all shadow-2xs flex items-center justify-between gap-3"
          >
            <span>{t.query4}</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#6c8677]" />
          </button>
        </div>
      </div>

      {/* Trust & Methodology Footer */}
      <footer className="pt-4 border-t border-[#e2ebe0] text-center space-y-1">
        <p className="text-[11px] text-[#637d6e] max-w-3xl mx-auto leading-relaxed">
          <strong>{currentLang === 'gu' ? 'ડેટા વિશ્વસનીયતા:' : currentLang === 'hi' ? 'डेटा विश्वसनीयता:' : 'Data Trust & Methodology:'}</strong>{' '}
          {currentLang === 'gu'
            ? 'તમામ ભાવો અને ખર્ચ ગણતરી ગુજરાત રાજ્ય કૃષિ બજાર બોર્ડ (GSAMB) ના લાઈવ એપીએમસી ગેટ એન્ટ્રી અને હરાજી આધારિત છે.'
            : currentLang === 'hi'
            ? 'सभी मूल्य और कटौती गणना गुजरात राज्य कृषि विपणन बोर्ड (GSAMB) के लाइव एपीएमसी गेट प्रविष्टि और दैनिक नीलामी आधारित हैं।'
            : 'All prices and deductions are real telemetry filtered from APMC Agmarknet daily protocols, verified mandi gate entries, and on-ground auctions.'}
        </p>
        <p className="text-[10px] text-[#839b8d]">
          {t.appName} • {t.appSubtitle}
        </p>
      </footer>
    </div>
  )
}
