'use client'

import React, { useState, useEffect } from 'react'
import { FarmerShell } from '@/components/farmer/FarmerShell'
import { analyzeMarketApi } from '@/services/api/krishi-api'
import { useLanguage } from '@/context/language-context'
import { toast } from 'sonner'
import {
  Store,
  TrendingUp,
  Calculator,
  Award,
  Sparkles,
  FileText,
  Loader2,
  Share2,
  ExternalLink,
  Globe,
} from 'lucide-react'

export default function FarmerMarketsPage() {
  const [cropName, setCropName] = useState('Tomato')
  const [quantityKg, setQuantityKg] = useState('500')
  const [location, setLocation] = useState('Anand, Gujarat')
  const [isFpoPool, setIsFpoPool] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  // Kisan Bahi Voucher Modal state
  const [showBahiModal, setShowBahiModal] = useState(false)
  const [selectedMandi, setSelectedMandi] = useState<any>(null)

  const runAnalysis = async () => {
    setIsLoading(true)
    try {
      const res = await analyzeMarketApi({
        cropName,
        quantityKg: parseFloat(quantityKg) || 500,
        location,
        isFpoPool,
      })

      if (res.success && res.data) {
        setAnalysis(res.data)
      } else {
        toast.error(t('Market analysis query failed', 'Market analysis query failed'))
      }
    } catch (err) {
      toast.error(t('Connection error running market analysis', 'Connection error running market analysis'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runAnalysis()
  }, [])

  const handleOpenBahi = (mandi: any) => {
    setSelectedMandi(mandi)
    setShowBahiModal(true)
  }

  const handleShareWhatsApp = () => {
    if (!selectedMandi) return
    const text = `*KrishiIntel Kisan Bahi Realization Voucher*
• Crop: ${cropName} (${quantityKg} kg)
• Recommended Mandi: ${selectedMandi.name}
• Gross Rate: ₹${selectedMandi.grossPerQtl}/qtl
• Freight Deduction: -₹${selectedMandi.totalFreight}
• Estimated Net In-Hand: ₹${selectedMandi.totalNet.toLocaleString('en-IN')}
• Validated by KrishiIntel Platform`

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')
    toast.success(t('Kisan Bahi Realization Voucher shared via WhatsApp!', 'Kisan Bahi Realization Voucher shared via WhatsApp!'))
  }

  return (
    <FarmerShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Store className="w-6 h-6 text-amber-500" />
              {t('Market Intelligence & Mandi Comparison', 'Market Intelligence & Mandi Comparison')}
            </h1>
            <p className="text-stone-600 text-xs mt-1">
              {t(
                'Compare APMC market rates after accounting for distance, transport freight, mandi cess, and moisture shrinkage.',
                'Compare APMC market rates after accounting for distance, transport freight, mandi cess, and moisture shrinkage.'
              )}
            </p>
          </div>

          {/* Data Status Badge */}
          {analysis?.dataStatus && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold border shadow-xs bg-emerald-50 border-emerald-300 text-emerald-900">
              <Globe className="w-4 h-4 text-emerald-700 animate-pulse" />
              <span>{t(analysis.dataStatus.badge, analysis.dataStatus.badge || 'LIVE WEB EVIDENCE')}</span>
            </div>
          )}
        </div>

        {/* Input Parameters Form */}
        <div className="bg-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">
            <Calculator className="w-4 h-4" />
            {t('Net Realization Calculator Query', 'Net Realization Calculator Query')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-emerald-200 font-semibold mb-1">{t('Crop', 'Crop Type')}</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full bg-emerald-900 border border-emerald-700 rounded-lg p-2.5 text-white font-medium focus:ring-1 focus:ring-amber-400"
              >
                <option value="Tomato">{t('Tomato', 'Tomato (Tameta)')}</option>
                <option value="Onion">{t('Onion', 'Red Onion (Dungri)')}</option>
                <option value="Potato">{t('Potato', 'Potato (Bataka)')}</option>
                <option value="Wheat">{t('Wheat', 'Sharbati Wheat')}</option>
                <option value="Cotton">{t('Cotton', 'Cotton (Kapas)')}</option>
                <option value="Groundnut">{t('Groundnut', 'Groundnut (Magfali)')}</option>
              </select>
            </div>

            <div>
              <label className="block text-emerald-200 font-semibold mb-1">{t('Quantity', 'Quantity (in kg)')}</label>
              <input
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full bg-emerald-900 border border-emerald-700 rounded-lg p-2.5 text-white font-medium focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-emerald-200 font-semibold mb-1">{t('Location', 'Origin Location')}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-emerald-900 border border-emerald-700 rounded-lg p-2.5 text-white font-medium focus:ring-1 focus:ring-amber-400"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={runAnalysis}
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 px-4 rounded-lg shadow transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-stone-950" /> : t('Run Market Analysis', 'Run Market Analysis')}
              </button>
            </div>
          </div>
        </div>

        {/* Mandi Comparison Table */}
        {analysis?.comparisons && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">{t('APMC Mandi Net Realization Comparison', 'APMC Mandi Net Realization Comparison')}</h2>
                  <p className="text-stone-500 text-xs mt-0.5">{t('Ranked by highest net cash return in your pocket.', 'Ranked by highest net cash return in your pocket.')}</p>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                  {analysis.comparisons.length} {t('Markets Evaluated', 'Markets Evaluated')}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 text-stone-600 font-bold uppercase border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">{t('Mandi Name', 'Mandi Name')}</th>
                      <th className="p-3.5">{t('Distance', 'Distance')}</th>
                      <th className="p-3.5">{t('Gross Rate (/qtl)', 'Gross Rate (/qtl)')}</th>
                      <th className="p-3.5">{t('Freight Deduction', 'Freight Deduction')}</th>
                      <th className="p-3.5">{t('Cess & Handling', 'Cess & Handling')}</th>
                      <th className="p-3.5">{t('Opportunity Score', 'Opportunity Score')}</th>
                      <th className="p-3.5">{t('Estimated Net In-Hand', 'Estimated Net In-Hand')}</th>
                      <th className="p-3.5 text-right">{t('Action', 'Action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {analysis.comparisons.map((mandi: any, index: number) => (
                      <tr key={mandi.id} className={index === 0 ? 'bg-amber-50/50' : 'hover:bg-stone-50'}>
                        <td className="p-3.5 font-bold text-stone-900">
                          {mandi.name}
                          {index === 0 && (
                            <span className="ml-2 text-[10px] bg-amber-500 text-stone-950 font-black px-2 py-0.5 rounded">
                              {t('BEST CHOICE', 'BEST CHOICE')}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">{mandi.distanceKm} km</td>
                        <td className="p-3.5 font-bold text-stone-900">
                          ₹{mandi.grossPerQtl}
                          <span className="block text-[10px] text-emerald-700 font-normal">{t('OFFICIAL MARKET DATA', 'OFFICIAL MARKET DATA')}</span>
                        </td>
                        <td className="p-3.5 text-rose-700">-₹{mandi.totalFreight}</td>
                        <td className="p-3.5 text-rose-700">-₹{mandi.totalCess + mandi.totalHandling}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-emerald-800">{mandi.score}/100</span>
                            <span className="text-[10px] text-stone-500">({t(mandi.badgeText, mandi.badgeText)})</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-black text-emerald-800 text-sm">
                          ₹{mandi.totalNet.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleOpenBahi(mandi)}
                            className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1 shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            {t('Kisan Bahi Slip', 'Kisan Bahi Slip')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Opportunity Score Breakdown */}
            {analysis.bestMarket && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    {t('Opportunity Score Breakdown', 'Opportunity Score Breakdown')} ({analysis.bestMarket.score}/100)
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {t('scoringModelDesc', 'Our scoring model evaluates 5 transparent metrics rather than a hidden AI score:')}
                  </p>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>{t('Price Signal Strength', 'Price Signal Strength')}</span>
                        <span>{analysis.bestMarket.components.priceSignal}/100</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${analysis.bestMarket.components.priceSignal}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>{t('Buyer Availability', 'Buyer Availability')}</span>
                        <span>{analysis.bestMarket.components.buyerAvailability}/100</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${analysis.bestMarket.components.buyerAvailability}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span>{t('Logistics Convenience', 'Logistics Convenience')}</span>
                        <span>{analysis.bestMarket.components.logistics}/100</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${analysis.bestMarket.components.logistics}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sell Now vs Wait Scenario */}
                <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm mb-1">{t('Sell Now vs. Wait Advice', 'Sell Now vs. Wait Advice')}</h4>
                    <div className="text-xs font-bold text-emerald-800 mb-2">
                      {t('Recommendation:', 'Recommendation:')} {analysis.sellVsWait.recommendation}
                    </div>
                    <p className="text-stone-700 text-xs leading-relaxed mb-3">
                      {analysis.sellVsWait.reasoning}
                    </p>
                  </div>
                  <div className="text-[11px] text-amber-900/80 bg-amber-100 p-2.5 rounded-lg border border-amber-300">
                    <strong>{t('Disclaimer:', 'Disclaimer:')}</strong> {analysis.sellVsWait.disclaimer}
                  </div>
                </div>
              </div>
            )}

            {/* Supporting Evidence Records with Status Badges */}
            {analysis.evidence && (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-700" />
                    {t('Supporting Web Market Evidence & News Signals', 'Supporting Web Market Evidence & News Signals')}
                  </h3>
                  <span className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full border border-emerald-300">
                    {t(analysis.dataStatus?.badge, analysis.dataStatus?.badge || 'LIVE WEB EVIDENCE')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.evidence.map((ev: any) => (
                    <div key={ev.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-stone-500 text-[10px] mb-1">
                          <span className="font-bold text-emerald-800">
                            {typeof ev.sourceName === 'string'
                              ? ev.sourceName
                              : ev.sourceName?.name || (typeof ev.source === 'string' ? ev.source : ev.source?.name || 'Live Market Signal')}
                          </span>
                          <span>{ev.observedAt}</span>
                        </div>
                        <h4 className="font-bold text-stone-900 mb-1 leading-snug">{ev.title}</h4>
                        <p className="text-stone-600 text-[11px] line-clamp-3">{ev.snippet}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-stone-200 flex items-center justify-between">
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                          {ev.sourceType === 'google_news' ? t('GOOGLE NEWS', 'GOOGLE NEWS') : ev.sourceType === 'google_search' ? t('GOOGLE SEARCH', 'GOOGLE SEARCH') : t('DEMO SIGNAL', 'DEMO SIGNAL')}
                        </span>
                        <a
                          href={ev.sourceUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          {t('Verify Source', 'Verify Source')} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kisan Bahi Slip Modal */}
        {showBahiModal && selectedMandi && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-lg">Kisan Bahi Realization Voucher</h3>
                  <p className="text-xs text-stone-500">Official KrishiIntel Sale Ledger</p>
                </div>
                <button onClick={() => setShowBahiModal(false)} className="text-stone-400 hover:text-stone-600 text-sm font-bold">
                  ✕
                </button>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3 text-xs">
                <div className="flex justify-between border-b border-amber-200/60 pb-2">
                  <span className="text-stone-600">Crop Harvest Lot:</span>
                  <span className="font-bold text-stone-900">{cropName} ({quantityKg} kg)</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 pb-2">
                  <span className="text-stone-600">Target APMC Mandi:</span>
                  <span className="font-bold text-stone-900">{selectedMandi.name}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 pb-2">
                  <span className="text-stone-600">Gross Mandi Rate:</span>
                  <span className="font-bold text-stone-900">₹{selectedMandi.grossPerQtl} / quintal</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 pb-2 text-rose-700">
                  <span>Transport Freight Deduction:</span>
                  <span className="font-bold">-₹{selectedMandi.totalFreight}</span>
                </div>
                <div className="flex justify-between border-b border-amber-200/60 pb-2 text-rose-700">
                  <span>Mandi Cess & Handling:</span>
                  <span className="font-bold">-₹{selectedMandi.totalCess + selectedMandi.totalHandling}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm">
                  <span className="font-bold text-stone-900">Estimated Net In-Hand:</span>
                  <span className="font-black text-emerald-800 text-base">
                    ₹{selectedMandi.totalNet.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
                >
                  <Share2 className="w-4 h-4" />
                  Share Voucher on WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FarmerShell>
  )
}
