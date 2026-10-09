'use client'

import React, { useState } from 'react'
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
  Sparkles,
} from 'lucide-react'
import { Language } from './krishi-topbar'
import { HarvestLot, MandiCalculation, money, numberFormat, cropsList } from '@/lib/market-service'
import { useTranslation } from '@/lib/translations'

interface MarketIntelViewProps {
  currentLang: Language
  activeLot: HarvestLot
  mandiCalculations?: MandiCalculation[]
  lotQuantity: number
  setLotQuantity: (qty: number) => void
  freightVariance: number
  setFreightVariance: (variance: number) => void
  isFpoMode: boolean
  setIsFpoMode: (val: boolean) => void
  onOpenKisanBahi: () => void
  onLockSlot: (mandiName: string, netAmount: number) => void
  onShareFPO: () => void
  onViewRouteDetails: (mandiName: string) => void
  onOpenCessSchedule: () => void
  onOpenDispute: () => void
}

export function KrishiMarketIntelView({
  currentLang,
  activeLot,
  mandiCalculations = [],
  lotQuantity,
  setLotQuantity,
  freightVariance,
  setFreightVariance,
  isFpoMode,
  setIsFpoMode,
  onOpenKisanBahi,
  onLockSlot,
  onShareFPO,
  onViewRouteDetails,
  onOpenCessSchedule,
  onOpenDispute,
}: MarketIntelViewProps) {
  const t = useTranslation(currentLang)

  const topMandi: MandiCalculation = (mandiCalculations && mandiCalculations.length > 0)
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

  const worstMandi = (mandiCalculations && mandiCalculations.length > 0)
    ? (mandiCalculations.find((m) => m.id === 'surat') ?? mandiCalculations[mandiCalculations.length - 1])
    : topMandi

  const differenceVsWorst = Math.max(0, topMandi.totalNet - (worstMandi?.totalNet ?? 0))

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
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#edf4ec] text-[#1b5e20] border border-[#cbe0ca]">
              {currentLang === 'gu'
                ? 'બહી-ખાતા વિશ્લેષણ • ખેડૂત ચોપડો વેચાણ નિર્ણયો • લાઈવ એપીએમસી'
                : currentLang === 'hi'
                ? 'बही-खाता विश्लेषण • किसान खाता बिक्री निर्णय • लाइव एपीएमसी'
                : 'BAHI-KHATA INTELLIGENCE • APMC VERIFIED LIVE'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#112d1e] tracking-tight">
            {currentLang === 'gu'
              ? `તમારો ${cropLabel} ક્યાં સૌથી વધુ ચોખ્ખી આવક આપશે?`
              : currentLang === 'hi'
              ? `आपकी ${cropLabel} कहाँ सर्वाधिक शुद्ध आय देगी?`
              : `Where Does Your ${activeLot.crop} Earn the Highest Net In-Hand?`}
          </h1>
          <p className="text-xs sm:text-sm text-[#4d6657] mt-1 max-w-3xl leading-relaxed">
            {t.intelHeroSubtitle}
          </p>
        </div>

        {/* Right Badges & Bahi Slip Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#2e543e] font-semibold bg-[#f0f6ee] px-3 py-1.5 rounded-lg border border-[#d2e2d0]">
            <ShieldCheck className="w-4 h-4 text-[#1b7340]" />
            <span>
              {currentLang === 'gu' ? 'ડેટા ચોકસાઈ: ' : currentLang === 'hi' ? 'डेटा सटीकता: ' : 'Telemetry Confidence: '}
              <strong>98%</strong>
            </span>
          </div>

          <button
            onClick={onOpenKisanBahi}
            className="px-4 py-2 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
          >
            <FileText className="w-4 h-4 text-[#72f5b5]" />
            {t.bahiSlipBtn}
          </button>
        </div>
      </div>

      {/* ACTIVE CROP DISPATCH SCENARIO BAR */}
      <div className="bg-white p-4 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#edf2ec]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-[#143825]">
              {currentLang === 'gu' ? 'ચાલુ પાક ડિસ્પેચ વિગતો' : currentLang === 'hi' ? 'सक्रिय फसल प्रेषण विवरण' : 'Active Crop Dispatch Scenario'}
            </span>
            <span className="text-xs text-[#627a6c] font-medium">({activeLot.id} • {activeLot.farmPlot})</span>
          </div>

          {/* Toggle: Single Farmer Lot vs FPO Consolidated */}
          <div className="flex items-center bg-[#f0f5ee] p-1 rounded-lg border border-[#d5e2d3] text-xs font-semibold">
            <button
              onClick={() => {
                setIsFpoMode(false)
                setLotQuantity(activeLot.quantity)
              }}
              className={`px-3 py-1 rounded-md transition-all ${
                !isFpoMode
                  ? 'bg-white text-[#153825] shadow-xs font-bold'
                  : 'text-[#506c5b] hover:text-[#153825]'
              }`}
            >
              {currentLang === 'gu' ? `વ્યક્તિગત પાક (${numberFormat(activeLot.quantity)} કિલો)` : currentLang === 'hi' ? `व्यक्तिगत लॉट (${numberFormat(activeLot.quantity)} किग्रा)` : `Single Farmer Lot (${numberFormat(activeLot.quantity)} kg)`}
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
              {t.fpoToggleLabel}
            </button>
          </div>
        </div>

        {/* 6 Parameter Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              {t.cropType}
            </span>
            <span className="text-xs font-bold text-[#143825] mt-0.5 block truncate">
              {cropLabel}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              {t.lotVolume}
            </span>
            <span className="text-xs font-extrabold text-[#143825] mt-0.5 block">
              {numberFormat(lotQuantity)} kg ({lotQuantity / 100} Qtl)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              {t.qualityGrade}
            </span>
            <span className="text-xs font-bold text-[#1e6e3c] mt-0.5 flex items-center gap-1">
              {activeLot.grade} ✓
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              {t.farmOrigin}
            </span>
            <span className="text-xs font-bold text-[#143825] mt-0.5 block truncate">
              {activeLot.location} 📍
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              {currentLang === 'gu' ? 'પ્રસ્થાન સમય' : currentLang === 'hi' ? 'प्रस्थान समय' : 'TARGET WINDOW'}
            </span>
            <span className="text-xs font-bold text-[#143825] mt-0.5 block truncate">
              {currentLang === 'gu' ? 'આવતીકાલે ૦૪:૩૦ AM' : currentLang === 'hi' ? 'कल 04:30 AM' : 'Tomorrow 04:30 AM'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] uppercase font-bold text-[#627a6c] block">
              {currentLang === 'gu' ? 'પેકેજિંગ' : currentLang === 'hi' ? 'पैकेजिंग' : 'PACKAGING'}
            </span>
            <span className="text-xs font-bold text-[#143825] mt-0.5 block truncate">
              {currentLang === 'gu' ? 'પ્લાસ્ટિક કેરેટ (૨૫ કિલો)' : currentLang === 'hi' ? 'प्लास्टिक क्रेट्स (25 किग्रा)' : 'Plastic Crates (25kg)'}
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
                {t.topChoice}
              </span>
              <span className="font-extrabold text-sm sm:text-base text-white">
                {mandiDisplayName(topMandi).split('(')[0].trim()}{' '}
                {currentLang === 'gu' ? 'સૌથી વધુ આવક આપે છે' : currentLang === 'hi' ? 'सर्वाधिक आय देती है' : 'Delivers Highest Payout'}
              </span>
            </div>
            <p className="text-xs text-[#c4e6d4] leading-relaxed">
              {currentLang === 'gu'
                ? `દૂરના બજારો જેમ કે સુરત વધુ મોડલ ભાવ બતાવી શકે છે, પરંતુ ડીઝલ ભાડું અને બપોરનો વજન સુકારો તમારો નફો ઘટાડે છે. ${mandiDisplayName(topMandi).split('(')[0].trim()} માં વેચતા હાથમાં ${money(topMandi.totalNet)} ચોખ્ખા મળશે.`
                : currentLang === 'hi'
                ? `सूरत जैसे दूर के बाजार अधिक भाव दिखा सकते हैं, किंतु भारी डीजल भाड़ा और दोपहर की गर्मी से वजन घट मुनाफा कम कर देती है। ${mandiDisplayName(topMandi).split('(')[0].trim()} से आपको हाथ में ${money(topMandi.totalNet)} शुद्ध प्राप्त होंगे।`
                : `${topMandi.name.split('(')[0].trim()} yields ${money(topMandi.totalNet)} net take-home, saving ${money(differenceVsWorst)} over penalized long-haul routes.`}
            </p>
          </div>
        </div>

        {/* Extra Net & Lock Slot Action */}
        <div className="flex items-center gap-4 shrink-0 self-end md:self-auto">
          <div className="text-right">
            <span className="text-[10px] text-[#9fc7b1] block">
              {currentLang === 'gu' ? 'દૂરની મંડી કરતાં ફાયદો' : currentLang === 'hi' ? 'दूर की मंडी से अधिक लाभ' : 'Gain vs Distant Hubs'}
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[#75f8ba]">
              +{money(differenceVsWorst)}
            </span>
          </div>

          <button
            onClick={() => onLockSlot(topMandi.name, topMandi.totalNet)}
            className="px-4 py-2.5 rounded-xl bg-[#25734e] hover:bg-[#1d5c3e] text-white text-xs font-bold flex items-center gap-2 border border-[#3a8b64] transition-all shadow-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            {t.lockSlotBtn}
          </button>
        </div>
      </div>

      {/* DIRECT MANDI REALIZATION LEDGER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base sm:text-lg text-[#123122]">
            {t.tableTitle} ({mandiCalculations.length} {currentLang === 'gu' ? 'મંડીઓ' : currentLang === 'hi' ? 'मंडियाँ' : 'Hubs'})
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-[#2f5d44]">
              <span className="w-2 h-2 rounded-full bg-[#1b7340]"></span>
              {currentLang === 'gu' ? 'ભલામણ કરેલ' : currentLang === 'hi' ? 'सुझाई गई' : 'Recommended'}
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#844430]">
              <span className="w-2 h-2 rounded-full bg-[#e65100]"></span>
              {currentLang === 'gu' ? 'ઓછો નફો ચેતવણી' : currentLang === 'hi' ? 'कम लाभ चेतावनी' : 'Penalty Warning'}
            </span>
          </div>
        </div>

        {/* Mandi Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {mandiCalculations.slice(0, 4).map((mandi, idx) => {
            const isTop = idx === 0
            const isWarning = mandi.badgeVariant === 'warning'

            return (
              <div
                key={mandi.id}
                className={`rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 relative transition-all ${
                  isTop
                    ? 'bg-white border-2 border-[#2b724f] shadow-sm'
                    : isWarning
                    ? 'bg-[#fffafa] border-2 border-[#f87171]'
                    : 'bg-white border border-[#d6e3d3]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isTop
                          ? 'bg-[#153f2c] text-white'
                          : isWarning
                          ? 'bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5]'
                          : 'bg-[#edf4ec] text-[#245239]'
                      }`}
                    >
                      {isTop ? t.topChoice : mandi.statusBadge}
                    </span>
                    <span className="text-xs font-extrabold text-[#153f2c]">
                      {mandi.opportunityScore} <span className="text-[10px] text-[#60776b]">/100</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-[#112d1e] truncate" title={mandi.name}>
                      {mandiDisplayName(mandi).split('(')[0].trim()}
                    </h4>
                    <span className="text-[11px] text-[#556e60] block">
                      📍 {mandi.distanceKm} km • ~{mandi.transitTime}
                    </span>
                  </div>

                  {/* Ledger Math */}
                  <div className="space-y-1.5 pt-2 border-t border-[#e2ede0] text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-[#556e60]">{t.colModalRate}</span>
                      <span className="font-bold text-[#143224]">{money(mandi.grossPerQtl)} /qtl</span>
                    </div>
                    <div className="flex justify-between items-center text-[#c2410c]">
                      <span>{t.freightExpense}</span>
                      <span className="font-semibold">-{money(mandi.freightPerQtl)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#c2410c]">
                      <span>{t.hamaliWeighment}</span>
                      <span className="font-semibold">-{money(mandi.handlingPerQtl + mandi.cessPerQtl)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#c2410c]">
                      <span>{t.transitShrinkage}</span>
                      <span className="font-semibold">-{money(mandi.shrinkagePerQtl)}</span>
                    </div>
                  </div>

                  {/* Net Result */}
                  <div
                    className={`p-2.5 rounded-xl border space-y-1 ${
                      isTop
                        ? 'bg-[#eef7ec] border-[#cbe2c8]'
                        : isWarning
                        ? 'bg-[#fef2f2] border-[#fecaca]'
                        : 'bg-[#f8fbf7] border-[#dbe6da]'
                    }`}
                  >
                    <div className="flex justify-between items-baseline">
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          isWarning ? 'text-[#991b1b]' : 'text-[#2b5e40]'
                        }`}
                      >
                        {t.netInHand}
                      </span>
                      <span
                        className={`text-sm font-extrabold ${
                          isWarning ? 'text-[#991b1b]' : 'text-[#175235]'
                        }`}
                      >
                        {money(mandi.netPerQtl)} /qtl
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] text-[#526f5d]">
                        {currentLang === 'gu' ? `કુલ ચોખ્ખી રકમ (${numberFormat(lotQuantity)} કિલો)` : currentLang === 'hi' ? `कुल शुद्ध आय (${numberFormat(lotQuantity)} किग्रा)` : `Total Net (${numberFormat(lotQuantity)} kg)`}
                      </span>
                      <span
                        className={`text-lg font-black ${
                          isWarning ? 'text-[#991b1b]' : 'text-[#175235]'
                        }`}
                      >
                        {money(mandi.totalNet)}
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] font-semibold text-[#1c7438] bg-[#f4f8f3] px-2 py-1 rounded flex items-center justify-between">
                    <span>{mandi.buyerCount} {currentLang === 'gu' ? 'વેપારીઓ' : currentLang === 'hi' ? 'व्यापारी' : 'Traders'}</span>
                    <span>{mandi.paymentSpeed}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#e5ece2]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLockSlot(mandi.name, mandi.totalNet)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs transition-all shadow-xs"
                    >
                      {t.lockSlotBtn} ➔
                    </button>
                    <button
                      onClick={() => onViewRouteDetails(mandi.name)}
                      className="py-2 px-2.5 rounded-lg bg-[#f0f5ee] hover:bg-[#e4eee1] text-[#164731] font-bold text-xs border border-[#cce0cb]"
                      title="View Transit Route"
                    >
                      {currentLang === 'gu' ? 'રૂટ' : currentLang === 'hi' ? 'रूट' : 'Route'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* LOWER SPLIT SECTION: 7-Day Trajectory & Dynamic Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7-Day Trajectory & Telemetry */}
        <div className="lg:col-span-6 space-y-5">
          {/* 7-Day Indicative Modal Price Trajectory */}
          <div className="bg-white p-5 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-[#112d1e]">
                  {currentLang === 'gu' ? '૭-દિવસીય મોડલ ભાવ ટ્રેન્ડ' : currentLang === 'hi' ? '7-दिवसीय मॉडल भाव ट्रेंड' : '7–Day Indicative Modal Price Trajectory'}
                </h4>
                <span className="text-[11px] text-[#556e60]">
                  {currentLang === 'gu' ? `${cropLabel} ના દૈનિક એપીએમસી હરાજી ભાવ` : currentLang === 'hi' ? `${cropLabel} के दैनिक एपीएमसी नीलामी भाव` : `Daily modal auction rates (₹/quintal) for ${activeLot.crop}`}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                Spread ~₹150/qtl
              </span>
            </div>

            {/* SVG Line Chart */}
            <div className="h-44 w-full pt-2">
              <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible">
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f0f4ee" strokeWidth="1" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f0f4ee" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f0f4ee" strokeWidth="1" />

                <text x="0" y="24" fontSize="9" fill="#889c8e">₹3,200</text>
                <text x="0" y="64" fontSize="9" fill="#889c8e">₹2,900</text>
                <text x="0" y="104" fontSize="9" fill="#889c8e">₹2,600</text>

                {/* Top Green Trend */}
                <path
                  d="M 50,75 L 120,68 L 190,56 L 260,45 L 330,38 L 400,35 L 470,32"
                  fill="none"
                  stroke="#1b7340"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Lower Trend */}
                <path
                  d="M 50,105 L 120,95 L 190,85 L 260,70 L 330,62 L 400,58 L 470,55"
                  fill="none"
                  stroke="#2c3e50"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {[[50, 75], [120, 68], [190, 56], [260, 45], [330, 38], [400, 35], [470, 32]].map(
                  ([x, y], i) => (
                    <circle key={`top-${i}`} cx={x} cy={y} r="3.5" fill="#1b7340" stroke="#ffffff" strokeWidth="1.5" />
                  )
                )}

                {[[50, 105], [120, 95], [190, 85], [260, 70], [330, 62], [400, 58], [470, 55]].map(
                  ([x, y], i) => (
                    <circle key={`low-${i}`} cx={x} cy={y} r="3.5" fill="#2c3e50" stroke="#ffffff" strokeWidth="1.5" />
                  )
                )}

                {['03 Oct', '04 Oct', '05 Oct', '06 Oct', '07 Oct', currentLang === 'gu' ? 'ગઈકાલે' : currentLang === 'hi' ? 'कल' : 'Yesterday', currentLang === 'gu' ? 'આજે' : currentLang === 'hi' ? 'आज' : 'Today'].map(
                  (day, idx) => (
                    <text key={day} x={50 + idx * 70} y="132" fontSize="9" fill="#657e70" textAnchor="middle">
                      {day}
                    </text>
                  )
                )}
              </svg>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-[#edf3ec] text-[11px] text-[#556e60]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#2c3e50] rounded-full"></span>
                  {currentLang === 'gu' ? 'આણંદ લોકલ' : currentLang === 'hi' ? 'आणंद लोकल' : 'Anand Local'}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#1b7340] rounded-full"></span>
                  {currentLang === 'gu' ? 'અમદાવાદ જમાલપુર' : currentLang === 'hi' ? 'अहमदाबाद जमालपुर' : 'Ahmedabad Jamalpur'}
                </span>
              </div>
              <span className="text-[10px] text-[#718b7c]">
                {currentLang === 'gu' ? 'સત્યાપિત એપીએમસી ગેટ રેકોર્ડ' : currentLang === 'hi' ? 'सत्यापित एपीएमसी रिकॉर्ड' : 'Verified APMC gate records'}
              </span>
            </div>
          </div>

          {/* Verified Ground Telemetry */}
          <div className="bg-white p-5 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm sm:text-base text-[#112d1e]">
                {currentLang === 'gu' ? 'ગ્રાઉન્ડ ટેલિમેટ્રી સ્થિતિ' : currentLang === 'hi' ? 'धरातलीय लॉजिस्टिक्स स्थिति' : 'Verified Ground Telemetry'}
              </h4>
              <span className="text-[10px] text-[#708a7b]">
                {currentLang === 'gu' ? '૧૨ મિનિટ પહેલા અપડેટ' : currentLang === 'hi' ? '12 मिनट पहले अपडेट' : 'Updated 12 mins ago'}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e2ede0] flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="p-1.5 rounded-lg bg-[#e8f5e9] text-[#1b5e20] shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#143525]">
                      {currentLang === 'gu' ? 'આણંદ-અમદાવાદ હાઇવે ટ્રાફિક ક્લિયર' : currentLang === 'hi' ? 'आणंद-अहमदाबाद हाईवे ट्रैफिक सामान्य' : 'Anand-Ahmedabad Highway Corridor Flow'}
                    </div>
                    <div className="text-[11px] text-[#556e60] mt-0.5">
                      {currentLang === 'gu'
                        ? 'NH-64 ટ્રાફિક ઇન્ડેક્સ ગ્રીન. બારેજા ટોલ પ્લાઝા વજન કાંટો ૪ મિનિટમાં ક્લિયર.'
                        : currentLang === 'hi'
                        ? 'NH-64 ट्रैफिक इंडेक्स ग्रीन। बारेजा टोल प्लाजा धर्मकांटा 4 मिनट में क्लीयर।'
                        : 'NH-64 traffic index green. Bareja toll weighbridge clearance under 4 minutes.'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5e9] text-[#1e7e34] border border-[#c8e6c9] shrink-0">
                  {currentLang === 'gu' ? 'સામાન્ય' : currentLang === 'hi' ? 'सामान्य' : 'Normal'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#fffafa] border border-[#fed7d7] flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="p-1.5 rounded-lg bg-[#fee2e2] text-[#b91c1c] shrink-0">
                    <Flame className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-[#991b1b]">
                      {currentLang === 'gu' ? 'બપોરના તાપમાન ચેતવણી: ૩૮°C' : currentLang === 'hi' ? 'दोपहर तापमान चेतावनी: 38°C' : 'Transit Heat Index: 38°C Warning'}
                    </div>
                    <div className="text-[11px] text-[#77443d] mt-0.5">
                      {currentLang === 'gu'
                        ? 'સુરત રૂટ પર બપોરના તાપથી ૮-૧૦% વજન સુકારો સંભવ. તાડપત્રી ઢાંકવી અનિવાર્ય.'
                        : currentLang === 'hi'
                        ? 'सूरत रूट पर दोपहर की धूप से 8-10% वजन घट संभव। तिरपाल ढकना अनिवार्य।'
                        : 'Surat corridor midday heat causes 8-10% shrinkage loss. Tarpaulin cover mandatory.'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fee2e2] text-[#b91c1c] border border-[#fca5a5] shrink-0">
                  {currentLang === 'gu' ? 'ચેતવણી' : currentLang === 'hi' ? 'चेतावनी' : 'Alert'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Simulator */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e693e] bg-[#edf6eb] px-2 py-0.5 rounded border border-[#cbe2c8]">
                  {t.intelHeroTitle}
                </span>
              </div>
              <h4 className="font-extrabold text-base sm:text-lg text-[#112d1e] mt-1">
                {currentLang === 'gu' ? 'ચોખ્ખી આવક કેલ્ક્યુલેટર' : currentLang === 'hi' ? 'शुद्ध आय कैलकुलेटर' : 'Net Realization Calculator'}
              </h4>
              <p className="text-xs text-[#526d5f]">
                {t.intelHeroSubtitle}
              </p>
            </div>

            {/* Slider 1: Lot Quantity */}
            <div className="space-y-2 bg-[#f8fbf7] p-3.5 rounded-xl border border-[#e2ede0]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#153825]">{t.volumeSliderLabel}</span>
                <span className="font-extrabold text-[#153825] bg-white px-2 py-0.5 rounded border border-[#d2e2d0]">
                  {numberFormat(lotQuantity)} kg ({lotQuantity / 100} Qtl)
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

              <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                <button
                  onClick={() => setLotQuantity(200)}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    lotQuantity === 200
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  Pick-up (200 kg)
                </button>
                <button
                  onClick={() => setLotQuantity(500)}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    lotQuantity === 500
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  Standard (500 kg)
                </button>
                <button
                  onClick={() => setLotQuantity(1200)}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    lotQuantity === 1200
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  Tempo (1,200 kg)
                </button>
                <button
                  onClick={() => setLotQuantity(2500)}
                  className={`text-[10px] px-2 py-1 rounded border transition-all ${
                    lotQuantity === 2500
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  Truck (2,500 kg)
                </button>
              </div>
            </div>

            {/* Slider 2: Freight Variance */}
            <div className="space-y-2 bg-[#f8fbf7] p-3.5 rounded-xl border border-[#e2ede0]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#153825]">{t.freightSliderLabel}</span>
                <span className="font-extrabold text-[#153825] bg-white px-2 py-0.5 rounded border border-[#d2e2d0]">
                  {freightVariance === 0 ? 'Standard (0%)' : `${freightVariance > 0 ? '+' : ''}${freightVariance}%`}
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
                  {currentLang === 'gu' ? 'FPO બચત (-૩૦%)' : currentLang === 'hi' ? 'FPO बचत (-30%)' : 'FPO Discount (-30%)'}
                </button>
                <button
                  onClick={() => setFreightVariance(0)}
                  className={`text-[10px] px-2.5 py-1 rounded border transition-all ${
                    freightVariance === 0
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  {currentLang === 'gu' ? 'સામાન્ય (૦%)' : currentLang === 'hi' ? 'सामान्य (0%)' : 'Standard Base (0%)'}
                </button>
                <button
                  onClick={() => setFreightVariance(40)}
                  className={`text-[10px] px-2.5 py-1 rounded border transition-all ${
                    freightVariance === 40
                      ? 'bg-[#184e36] text-white border-[#184e36] font-bold'
                      : 'bg-white text-[#526d5f] border-[#d2e2d0] hover:bg-[#edf4ec]'
                  }`}
                >
                  {currentLang === 'gu' ? 'વધારો (+૪૦%)' : currentLang === 'hi' ? 'वृद्धि (+40%)' : 'Surcharge (+40%)'}
                </button>
              </div>
            </div>

            {/* Simulation Outcomes Output */}
            <div className="p-3.5 rounded-xl bg-[#edf6eb] border border-[#cbe2c8] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e633a] block">
                {t.simulationSummary} ({numberFormat(lotQuantity)} kg)
              </span>

              <div className="space-y-1.5 text-xs">
                {mandiCalculations.slice(0, 3).map((m) => (
                  <div key={m.id} className="flex justify-between items-center py-1 border-b border-[#daead7]">
                    <span className="font-semibold text-[#143224]">{mandiDisplayName(m).split('(')[0].trim()}</span>
                    <div className="text-right">
                      <strong className="text-[#175235] text-sm">{money(m.totalNet)}</strong>
                      <span className="text-[10px] text-[#556e60] block font-normal">
                        {money(m.netPerQtl)} /qtl net
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => onLockSlot(topMandi.name, topMandi.totalNet)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-[#72f5b5]" />
                {t.lockSlotBtn} ({mandiDisplayName(topMandi).split('(')[0].trim()})
              </button>

              <button
                onClick={onShareFPO}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#f6faf4] border border-[#cbe0c7] text-[#1c4d34] font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Share2 className="w-4 h-4" />
                {currentLang === 'gu' ? 'FPO ગ્રુપ સાથે હિસાબ શેર કરો' : currentLang === 'hi' ? 'FPO ग्रुप के साथ हिसाब शेयर करें' : 'Share Realization Ledger with FPO Group'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Provenance & Actions */}
      <footer className="pt-4 border-t border-[#e2ebe0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#637d6e]">
        <div className="flex items-center gap-1.5 text-center sm:text-left">
          <span>🛡️</span>
          <span>
            <strong>{currentLang === 'gu' ? 'ડેટા સ્ત્રોત:' : currentLang === 'hi' ? 'डेटा स्रोत:' : 'Data Provenance:'}</strong>{' '}
            {currentLang === 'gu'
              ? 'એગમાર્કનેટ અને ગુજરાત રાજ્ય કૃષિ બજાર બોર્ડ (GSAMB) ના અધિકૃત દૈનિક બુલેટિન.'
              : currentLang === 'hi'
              ? 'एगमार्कनेट और गुजरात राज्य कृषि विपणन बोर्ड (GSAMB) के आधिकारिक दैनिक बुलेटिन।'
              : 'AGMARKNET official mandi bulletins and GSAMB verified gate entries.'}
          </span>
        </div>

        <div className="flex items-center gap-4 font-bold shrink-0">
          <button
            onClick={onOpenCessSchedule}
            className="hover:text-[#184e36] hover:underline"
          >
            {t.evidence}
          </button>
          <button
            onClick={onOpenDispute}
            className="hover:text-[#184e36] hover:underline"
          >
            {t.disputeRate}
          </button>
        </div>
      </footer>
    </div>
  )
}
