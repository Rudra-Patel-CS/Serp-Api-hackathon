'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Users,
  Store,
  Phone,
  MessageCircle,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Building2,
  Calendar,
  FileText,
  ExternalLink,
  ChevronRight,
  Sprout,
  CheckCircle2,
  Bell,
  Check,
  Flame,
} from 'lucide-react'
import { toast } from 'sonner'
import { Language } from './krishi-topbar'
import { HarvestLot, MandiCalculation, money, numberFormat, cropsList } from '@/lib/market-service'
import { useTranslation } from '@/lib/translations'

// 1. BUYERS VIEW
export function KrishiBuyersView({
  currentLang = 'en',
  activeLot,
  onContactBuyer,
}: {
  currentLang?: Language
  activeLot: HarvestLot
  onContactBuyer: (buyer: any) => void
}) {
  const t = useTranslation(currentLang)
  const [filterType, setFilterType] = useState('all')

  const cropLabel = currentLang === 'gu'
    ? (cropsList.find((c) => c.id === activeLot.baseCrop)?.labelGu || activeLot.crop)
    : currentLang === 'hi'
    ? (cropsList.find((c) => c.id === activeLot.baseCrop)?.labelHi || activeLot.crop)
    : activeLot.crop

  const buyersList = [
    {
      id: 'b1',
      name: currentLang === 'gu' ? 'ફ્રેશડાયરેક્ટ ગુજરાત હોલસેલ' : currentLang === 'hi' ? 'फ्रेशडायरेक्ट गुजरात होलसेल' : 'FreshDirect Gujarat Wholesale',
      type: currentLang === 'gu' ? 'ઈ-કોમર્સ હબ' : currentLang === 'hi' ? 'ई-कॉमर्स हब' : 'Quick-Commerce Hub',
      city: currentLang === 'gu' ? 'અમદાવાદ (સરખેજ)' : currentLang === 'hi' ? 'अहमदाबाद (सरखेज)' : 'Ahmedabad (Sarkhej)',
      crops: ['Tomato (Grade A)', 'Bell Pepper', 'Cucumber'],
      minQty: '200 kg',
      priceQuote: '₹29.00 / kg',
      terms: currentLang === 'gu' ? 'તોલામણી સમયે તરત જ બેંક ટ્રાન્સફર / UPI' : currentLang === 'hi' ? 'तुलाई पर तत्काल बैंक ट्रांसफर / UPI' : 'Instant Bank Transfer / UPI upon weighing',
      phone: '+91 98251 10293',
      rating: '4.9 ★ (140 deals)',
      verified: true,
    },
    {
      id: 'b2',
      name: currentLang === 'gu' ? 'સહયોગ હોરેકા & હોટેલ સોર્સિંગ' : currentLang === 'hi' ? 'सहयोग होरेका व होटल सोर्सिंग' : 'Sahyog Horeca & Hotel Sourcing',
      type: currentLang === 'gu' ? 'હોટેલ સપ્લાયર' : currentLang === 'hi' ? 'होटल सप्लायर' : 'HoReCa Supplier',
      city: currentLang === 'gu' ? 'વડોદરા (અલકાપુરી)' : currentLang === 'hi' ? 'वडोदरा (अलकापुरी)' : 'Vadodara (Alkapuri)',
      crops: ['Tomato (Firm Red)', 'Onion', 'Potato'],
      minQty: '400 kg',
      priceQuote: '₹28.50 / kg',
      terms: currentLang === 'gu' ? 'તે જ દિવસે પેમેન્ટ, પ્લાસ્ટિક કેરેટ ઉપલબ્ધ' : currentLang === 'hi' ? 'उसी दिन भुगतान, प्लास्टिक क्रेट्स उपलब्ध' : 'Same day payment, plastic crates provided',
      phone: '+91 98244 88192',
      rating: '4.8 ★ (85 deals)',
      verified: true,
    },
    {
      id: 'b3',
      name: currentLang === 'gu' ? 'કિસાનસેતુ ફૂડ પ્રોસેસિંગ કોર્પોરેશન' : currentLang === 'hi' ? 'किसानसेतु फूड प्रोसेसिंग कॉर्पोरेशन' : 'KisanSetu Food Processing Corp',
      type: currentLang === 'gu' ? 'પ્રોસેસર / પ્યુરી' : currentLang === 'hi' ? 'प्रोसेसर / प्यूरी' : 'Processor / Puree',
      city: currentLang === 'gu' ? 'નડિયાદ GIDC' : currentLang === 'hi' ? 'नडियाद GIDC' : 'Nadiad GIDC',
      crops: ['Tomato (Processing Grade)', 'Chilli'],
      minQty: '1,000 kg',
      priceQuote: '₹26.80 / kg',
      terms: currentLang === 'gu' ? 'બીજા દિવસે RTGS, ફેક્ટરી ગેટ ડિલિવરી' : currentLang === 'hi' ? 'अगले दिन RTGS, फैक्ट्री गेट डिलीवरी' : 'Next day RTGS, factory gate delivery',
      phone: '+91 98790 33412',
      rating: '4.7 ★ (210 deals)',
      verified: true,
    },
    {
      id: 'b4',
      name: currentLang === 'gu' ? 'જમાલપુર બિગબાસ્કેટ સોર્સિંગ યુનિટ' : currentLang === 'hi' ? 'जमालपुर बिगबास्केट सोर्सिंग यूनिट' : 'Jamalpur BigBasket Sourcing Unit',
      type: currentLang === 'gu' ? 'રિટેલ સુપરમાર્કેટ' : currentLang === 'hi' ? 'रिटेल सुपरमार्केट' : 'Retail Supermarket',
      city: currentLang === 'gu' ? 'અમદાવાદ (જમાલપુર એપીએમસી)' : currentLang === 'hi' ? 'अहमदाबाद (जमालपुर एपीएमसी)' : 'Ahmedabad (Jamalpur APMC)',
      crops: ['Tomato (Grade A)', 'Leafy Greens'],
      minQty: '500 kg',
      priceQuote: '₹28.80 / kg',
      terms: currentLang === 'gu' ? 'સીધું એપીએમસી એસ્ક્રો સેટલમેન્ટ' : currentLang === 'hi' ? 'सीधा एपीएमसी एस्क्रो सेटलमेंट' : 'Direct APMC escrow settlement',
      phone: '+91 94260 55102',
      rating: '4.9 ★ (320 deals)',
      verified: true,
    },
  ]

  const filtered = filterType === 'all' ? buyersList : buyersList.filter((b) => b.type === filterType)

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#112d1e]">
          {t.buyersTitle} ({cropLabel})
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
          {t.buyersSubtitle}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold overflow-x-auto pb-1">
        {[
          { id: 'all', label: currentLang === 'gu' ? 'તમામ કેટેગરી' : currentLang === 'hi' ? 'सभी श्रेणियां' : 'All Categories' },
          { id: currentLang === 'gu' ? 'ઈ-કોમર્સ હબ' : currentLang === 'hi' ? 'ई-कॉमर्स हब' : 'Quick-Commerce Hub', label: currentLang === 'gu' ? 'ઈ-કોમર્સ હબ' : currentLang === 'hi' ? 'ई-कॉमर्स हब' : 'Quick-Commerce Hub' },
          { id: currentLang === 'gu' ? 'હોટેલ સપ્લાયર' : currentLang === 'hi' ? 'होटल सप्लायर' : 'HoReCa Supplier', label: currentLang === 'gu' ? 'હોટેલ સપ્લાયર' : currentLang === 'hi' ? 'होटल सप्लायर' : 'HoReCa Supplier' },
          { id: currentLang === 'gu' ? 'પ્રોસેસર / પ્યુરી' : currentLang === 'hi' ? 'प्रोसेसर / प्यूरी' : 'Processor / Puree', label: currentLang === 'gu' ? 'પ્રોસેસર' : currentLang === 'hi' ? 'प्रोसेसर' : 'Processor / Puree' },
          { id: currentLang === 'gu' ? 'રિટેલ સુપરમાર્કેટ' : currentLang === 'hi' ? 'रिटेल सुपरमार्केट' : 'Retail Supermarket', label: currentLang === 'gu' ? 'સુપરમાર્કેટ' : currentLang === 'hi' ? 'सुपरमार्केट' : 'Retail Supermarket' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-[#184e36] text-white border-[#184e36]'
                : 'bg-white text-[#4d6657] border-[#d2e2d0] hover:bg-[#edf5eb]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((buyer) => (
          <div
            key={buyer.id}
            className="bg-white p-5 rounded-2xl border border-[#d6e3d3] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#1b7340] transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-base text-[#112d1e]">{buyer.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-[#526d5f] mt-0.5">
                    <span className="font-semibold text-[#184e36]">{buyer.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {buyer.city}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9] shrink-0">
                  {buyer.rating}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#556e60]">{t.offeringRate}:</span>
                  <strong className="text-[#143825] text-sm">{buyer.priceQuote}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#556e60]">{t.procurementTarget}:</span>
                  <span className="font-semibold text-[#143825]">{buyer.minQty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#556e60]">{t.instantPayment}:</span>
                  <span className="font-medium text-[#2d563e]">{buyer.terms}</span>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#edf3ec]">
              <button
                onClick={() => onContactBuyer(buyer)}
                className="flex-1 py-2 px-3 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                {t.callBuyer}
              </button>

              <button
                onClick={() => onContactBuyer(buyer)}
                className="py-2 px-3 rounded-lg bg-[#eaf4ea] hover:bg-[#dfeede] text-[#1b5e20] border border-[#c2dac0] font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 2. MY CROP VIEW
export function KrishiMyCropView({
  currentLang = 'en',
  lots,
  activeLot,
  onSelectLot,
  onOpenRegisterLot,
}: {
  currentLang?: Language
  lots: HarvestLot[]
  activeLot: HarvestLot
  onSelectLot: (lot: HarvestLot) => void
  onOpenRegisterLot: () => void
}) {
  const t = useTranslation(currentLang)

  const cropLabel = currentLang === 'gu'
    ? (cropsList.find((c) => c.id === activeLot.baseCrop)?.labelGu || activeLot.crop)
    : currentLang === 'hi'
    ? (cropsList.find((c) => c.id === activeLot.baseCrop)?.labelHi || activeLot.crop)
    : activeLot.crop

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#112d1e]">
            {t.lotTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
            {t.lotSubtitle}
          </p>
        </div>

        <button
          onClick={onOpenRegisterLot}
          className="px-4 py-2 bg-[#184e36] hover:bg-[#123e2b] text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
        >
          <span>+</span> {t.registerLot}
        </button>
      </div>

      {/* Active Lot Highlight Card */}
      <div className="bg-white p-6 rounded-2xl border-2 border-[#1b7340] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-[#cfe0cc]">
            <Image
              src="/images/tomato-lot.jpg"
              alt="Harvest Lot"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                {t.activeLotBadge}
              </span>
              <span className="text-xs text-[#556e60]">{t.harvestDate}: {activeLot.harvestDate}</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#112d1e]">
              {cropLabel}
            </h3>
            <p className="text-xs text-[#556e60]">
              {activeLot.farmPlot} • {t.farmOrigin}: {activeLot.location}, Gujarat • {t.kisanProfile}
            </p>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] text-[#698274] font-bold uppercase">{t.lotVolume}</span>
            <div className="text-lg font-extrabold text-[#143224] mt-0.5">{numberFormat(activeLot.quantity)} kg</div>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] text-[#698274] font-bold uppercase">{t.moistureLevel}</span>
            <div className="text-lg font-extrabold text-[#143224] mt-0.5">{activeLot.moisture}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] text-[#698274] font-bold uppercase">{t.qualityGrade}</span>
            <div className="text-lg font-extrabold text-[#1b5e20] mt-0.5">{activeLot.grade}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] text-[#698274] font-bold uppercase">{currentLang === 'gu' ? 'જંતુનાશક અવશેષ' : currentLang === 'hi' ? 'कीटनाशक अवशेष' : 'Pesticide Residue'}</span>
            <div className="text-lg font-extrabold text-[#1b5e20] mt-0.5">{currentLang === 'gu' ? 'ઝીરો MRL (પાસ ✓)' : currentLang === 'hi' ? 'शून्य MRL (पास ✓)' : 'Zero MRL (Pass ✓)'}</div>
          </div>
        </div>
      </div>

      {/* All Harvest Lots Table / Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-[#143224] text-base">
          {currentLang === 'gu' ? 'નોંધાયેલા તમામ પાક લોટ' : currentLang === 'hi' ? 'सभी पंजीकृत फसल लॉट' : 'All Registered Farm Batches'} ({lots.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {lots.map((lot) => {
            const isSelected = lot.id === activeLot.id
            const lotCropName = currentLang === 'gu'
              ? (cropsList.find((c) => c.id === lot.baseCrop)?.labelGu || lot.crop)
              : currentLang === 'hi'
              ? (cropsList.find((c) => c.id === lot.baseCrop)?.labelHi || lot.crop)
              : lot.crop

            return (
              <div
                key={lot.id}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected ? 'bg-[#edf6eb] border-2 border-[#1b7340]' : 'bg-white border-[#d6e5d3]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-[#143825]">{lotCropName}</strong>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#e8f5e9] text-[#1e7e34]">
                      {lot.grade}
                    </span>
                  </div>
                  <div className="text-xs text-[#556e60] mt-0.5">
                    {lot.id} • {numberFormat(lot.quantity)} kg • {lot.location}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectLot(lot)
                    toast.success(`${lot.crop} ${currentLang === 'gu' ? 'સક્રિય થયેલ' : currentLang === 'hi' ? 'सक्रिय किया गया' : 'activated'}`)
                  }}
                  disabled={isSelected}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    isSelected
                      ? 'bg-[#1b7340] text-white cursor-default'
                      : 'bg-[#f0f6ee] text-[#1b4e36] hover:bg-[#e0eee0]'
                  }`}
                >
                  {isSelected ? (currentLang === 'gu' ? '✓ ચાલુ' : currentLang === 'hi' ? '✓ सक्रिय' : '✓ Active') : `${t.switchLot} ➔`}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 3. LOGISTICS & STORAGE VIEW
export function KrishiLogisticsView({
  currentLang = 'en',
  activeLot,
  onOpenBookDriver,
  onOpenBookColdStorage,
}: {
  currentLang?: Language
  activeLot: HarvestLot
  onOpenBookDriver: () => void
  onOpenBookColdStorage: () => void
}) {
  const t = useTranslation(currentLang)

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#112d1e]">
          {t.logisticsTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
          {t.logisticsSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Driver 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eaf4ea] flex items-center justify-center text-[#1b5e20]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#112d1e]">
                  {currentLang === 'gu' ? 'મગનભાઈ (ટાટા એસ)' : currentLang === 'hi' ? 'मगनभाई (टाटा ऐस)' : 'Magan Bhai (Tata Ace)'}
                </h4>
                <div className="text-xs text-[#526d5f]">GJ-23-AT-8492 • {currentLang === 'gu' ? 'મોગરી ચોકડી (૩ કિમી)' : currentLang === 'hi' ? 'मोगरी चौकड़ी (3 किमी)' : 'Mogri Chowkdi (3 km away)'}</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5e9] text-[#1b5e20]">
              {currentLang === 'gu' ? 'હાજર છે' : currentLang === 'hi' ? 'उपलब्ध' : 'Available Now'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e2ede0] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#556e60]">{t.capacity}:</span>
              <span className="font-bold">1,000 kg (40 crates)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#556e60]">{currentLang === 'gu' ? 'આણંદ ➔ અમદાવાદ ભાડું:' : currentLang === 'hi' ? 'आणंद ➔ अहमदाबाद भाड़ा:' : 'Anand ➔ Ahmedabad Trip Rate:'}</span>
              <strong className="text-[#175235]">₹900 locked tariff</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#556e60]">{currentLang === 'gu' ? 'તાડપત્રી સુરક્ષા:' : currentLang === 'hi' ? 'तिरपाल कवर:' : 'Tarpaulin Cover:'}</span>
              <span className="font-semibold text-[#1b5e20]">{currentLang === 'gu' ? 'હા (સાથે સામેલ)' : currentLang === 'hi' ? 'हाँ (शामिल)' : 'Yes (Included)'}</span>
            </div>
          </div>

          <button
            onClick={onOpenBookDriver}
            className="w-full py-2.5 px-3 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            {t.contactDriver} (+91 98250 41289)
          </button>
        </div>

        {/* Cold Storage Facility */}
        <div className="bg-white p-5 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e3f2fd] flex items-center justify-center text-[#0d47a1]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#112d1e]">
                  {currentLang === 'gu' ? 'ચિખોદરા એગ્રી કોલ્ડ સ્ટોરેજ' : currentLang === 'hi' ? 'चिखोदरा एग्री कोल्ड स्टोरेज' : 'Chikhodra Agri Cold Chamber'}
                </h4>
                <div className="text-xs text-[#526d5f]">NH-48 Bypass, Chikhodra • 7 km away</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e3f2fd] text-[#0d47a1]">
              450 Crates Open
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e2ede0] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#556e60]">{currentLang === 'gu' ? 'તાપમાન નિયંત્રણ:' : currentLang === 'hi' ? 'तापमान नियंत्रण:' : 'Temperature Control:'}</span>
              <span className="font-bold">12°C - 14°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#556e60]">{currentLang === 'gu' ? 'સંગ્રહ ખર્ચ:' : currentLang === 'hi' ? 'भंडारण शुल्क:' : 'Storage Fee:'}</span>
              <strong className="text-[#175235]">₹1.20 / crate / day</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#556e60]">{currentLang === 'gu' ? 'સુરક્ષિત સમય:' : currentLang === 'hi' ? 'सुरक्षित अवधि:' : 'Preservation Shelf:'}</span>
              <span className="font-semibold text-[#1b5e20]">{currentLang === 'gu' ? '૭ દિવસ સુધી કોઈ સુકારો નહિ' : currentLang === 'hi' ? '7 दिन तक कोई वजन घट नहीं' : 'Up to 7 days without shrink'}</span>
            </div>
          </div>

          <button
            onClick={onOpenBookColdStorage}
            className="w-full py-2.5 px-3 rounded-lg bg-[#f0f6ee] hover:bg-[#e4eee1] text-[#164731] font-bold text-xs border border-[#cce0cb] transition-all"
          >
            {currentLang === 'gu' ? 'કોલ્ડ સ્ટોરેજ બુક કરો (₹૧.૨૦/કેરેટ)' : currentLang === 'hi' ? 'कोल्ड स्टोरेज बुक करें (₹1.20/क्रेट)' : 'Reserve Chamber Space (₹1.20/crate)'}
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. FPO DASHBOARD VIEW
export function KrishiFpoView({
  currentLang = 'en',
  activeLot,
  onOpenFpoPool,
}: {
  currentLang?: Language
  activeLot: HarvestLot
  onOpenFpoPool: () => void
}) {
  const t = useTranslation(currentLang)

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#112d1e]">
          {t.fpoTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
          {t.fpoSubtitle}
        </p>
      </div>

      <div className="bg-[#143828] text-white p-6 rounded-2xl border border-[#1f543c] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#205b3e] text-[#8cf0be] border border-[#3b8460]">
            ACTIVE POOL BATCH #FPO-OCT-09
          </span>
          <span className="text-xs text-[#a0cbaf]">{t.departureTime}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <span className="text-xs text-[#a4c9b6]">{t.currentFill}:</span>
            <div className="text-2xl font-black text-white">7,500 kg (15 Farmers)</div>
          </div>
          <div>
            <span className="text-xs text-[#a4c9b6]">{t.freightSavingEstimate}:</span>
            <div className="text-2xl font-black text-[#75f8ba]">-30% Shared Freight</div>
          </div>
          <div>
            <span className="text-xs text-[#a4c9b6]">{currentLang === 'gu' ? 'સામૂહિક નફો:' : currentLang === 'hi' ? 'सामूहिक लाभ:' : 'Collective Net Benefit:'}</span>
            <div className="text-2xl font-black text-white">+₹4,200 Extra Payout</div>
          </div>
        </div>

        <button
          onClick={onOpenFpoPool}
          className="w-full py-3 rounded-xl bg-[#25734e] hover:bg-[#1d5c3e] text-white font-extrabold text-xs transition-all shadow-xs"
        >
          {t.joinPoolBtn} ({numberFormat(activeLot.quantity)} kg)
        </button>
      </div>
    </div>
  )
}

// 5. EVIDENCE & SOURCES VIEW
export function KrishiEvidenceView({
  currentLang = 'en',
}: {
  currentLang?: Language
}) {
  const t = useTranslation(currentLang)

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#112d1e]">
          {t.evidenceTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
          {t.evidenceSubtitle}
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            title: currentLang === 'gu' ? 'એપીએમસી જમાલપુર મોડલ ભાવ બુલેટિન' : currentLang === 'hi' ? 'एपीएमसी जमालपुर मॉडल भाव बुलेटिन' : 'APMC Jamalpur Modal Price Bulletin #AGM-2026-10-09',
            authority: 'Gujarat State Agricultural Marketing Board (GSAMB)',
            summary: currentLang === 'gu' ? '૪૫,૦૦૦ કિલો ટામેટાના ₹૨,૮૫૦ મોડલ ભાવે ૨૮ સોદા નોંધાયા.' : currentLang === 'hi' ? '45,000 किग्रा टमाटर के ₹2,850 मॉडल भाव पर 28 सौदे दर्ज।' : 'Recorded 28 transactions across 45,000 kg Grade A tomatoes at ₹2,850 modal rate.',
            time: currentLang === 'gu' ? 'આજે ૦૫:૪૫ AM' : currentLang === 'hi' ? 'आज 05:45 AM' : 'Today 05:45 AM',
          },
          {
            title: currentLang === 'gu' ? 'NH-64 બારેજા ટોલ સ્પીડ રેકોર્ડ' : currentLang === 'hi' ? 'NH-64 बारेजा टोल स्पीड रिकॉर्ड' : 'NH-64 Bareja Toll Weigh-In-Motion Speed Records',
            authority: 'National Highways Authority of India (NHAI)',
            summary: currentLang === 'gu' ? 'સરેરાશ ટ્રક નિકાલ સમય: ૩.૨ મિનિટ. હાઇવે કોરિડોર ક્લિયર.' : currentLang === 'hi' ? 'औसत ट्रक निकासी समय: 3.2 मिनट। हाईवे पूरी तरह खुला।' : 'Average freight truck clearance time: 3.2 minutes. Express corridor clear.',
            time: currentLang === 'gu' ? 'આજે ૦૬:૦૦ AM' : currentLang === 'hi' ? 'आज 06:00 AM' : 'Today 06:00 AM',
          },
          {
            title: t.statutoryCessRule,
            authority: 'Director of Agricultural Marketing, Gujarat',
            summary: t.cessExplanation,
            time: currentLang === 'gu' ? 'સરકારી ગેઝેટ' : currentLang === 'hi' ? 'सरकारी गजट' : 'Official Gazette',
          },
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#d6e3d3] shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#143825]">{item.title}</span>
              <span className="text-[10px] text-[#556e60]">{item.time}</span>
            </div>
            <div className="text-[11px] font-semibold text-[#184e36]">{item.authority}</div>
            <p className="text-xs text-[#556e60]">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// 6. SELL VS WAIT VIEW
export function KrishiSellVsWaitView({
  currentLang = 'en',
  activeLot,
  mandiCalculation,
}: {
  currentLang?: Language
  activeLot: HarvestLot
  mandiCalculation?: MandiCalculation
}) {
  const t = useTranslation(currentLang)
  const currentNet = mandiCalculation?.totalNet ?? 13500
  const tomorrowNet = Math.round(currentNet * 0.98)
  const saturdayNet = Math.round(currentNet * 0.84)

  const cropLabel = currentLang === 'gu'
    ? (cropsList.find((c) => c.id === activeLot.baseCrop)?.labelGu || activeLot.crop)
    : currentLang === 'hi'
    ? (cropsList.find((c) => c.id === activeLot.baseCrop)?.labelHi || activeLot.crop)
    : activeLot.crop

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#112d1e]">
          {t.sellWaitTitle} ({cropLabel})
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
          {t.sellWaitSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#1b7340] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#1b7340]">
              {currentLang === 'gu' ? 'આજે / આવતીકાલે ૦૪:૩૦ AM (ભલામણ)' : currentLang === 'hi' ? 'आज / कल 04:30 AM (सुझाव)' : 'TODAY / TOMORROW 04:30 AM'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5e9] text-[#1b5e20]">Score: 89</span>
          </div>
          <div className="text-2xl font-black text-[#143224]">
            {money(currentNet)} <span className="text-xs font-normal text-[#556e60]">net</span>
          </div>
          <p className="text-xs text-[#556e60]">
            {currentLang === 'gu'
              ? `તાજો પાક કડક છે (${activeLot.moisture}). કોઈ વજન ઘટ નહિ. હાથમાં તુરંત રોકડા.`
              : currentLang === 'hi'
              ? `ताजा फसल सख्त है (${activeLot.moisture})। नगण्य वजन घट। तत्काल नकद भुगतान।`
              : `Fresh harvest firmness ${activeLot.moisture}. Negligible heat shrinkage. Immediate cash payout.`}
          </p>
        </div>

        {/* In 2 Days */}
        <div className="bg-white p-5 rounded-2xl border border-[#d6e3d3] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#143224]">
              {currentLang === 'gu' ? '૨ દિવસમાં (ઓછો સુકારો)' : currentLang === 'hi' ? '2 दिन में (हल्की घट)' : 'IN 2 DAYS'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#edf4ec] text-[#335640]">Score: 82</span>
          </div>
          <div className="text-2xl font-black text-[#143224]">
            {money(tomorrowNet)} <span className="text-xs font-normal text-[#556e60]">net</span>
          </div>
          <p className="text-xs text-[#556e60]">
            {currentLang === 'gu'
              ? 'છાંયડામાં રાખવાની જરૂર. કોલ્ડ રૂમ વિના ૨-૩% ભેજ સુકાઈ જશે.'
              : currentLang === 'hi'
              ? 'छायादार भंडारण आवश्यक। बिना कोल्ड रूम 2-3% नमी कम होगी।'
              : 'Requires shaded storage. 2-3% moisture loss expected without cold room holding.'}
          </p>
        </div>

        {/* Saturday */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#f87171] bg-[#fffafa] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#b91c1c]">
              {currentLang === 'gu' ? 'શનિવારે (વધુ જોખમ)' : currentLang === 'hi' ? 'शनिवार को (अधिक जोखिम)' : 'WEEKEND (HIGH RISK)'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fee2e2] text-[#b91c1c]">Score: 61</span>
          </div>
          <div className="text-2xl font-black text-[#991b1b]">
            {money(saturdayNet)} <span className="text-xs font-normal text-[#888]">net</span>
          </div>
          <p className="text-xs text-[#77443d]">
            {currentLang === 'gu'
              ? 'ભારે જોખમ: ૩૮°C તાપથી ૮-૧૦% વજન ઘટશે + નાસિકથી ૪૫ ટ્રક આવકથી ભાવ ઘટશે.'
              : currentLang === 'hi'
              ? 'बड़ा जोखिम: 38°C धूप से 8-10% वजन घटेगा + नासिक से 45 ट्रक आवक से भाव गिरेंगे।'
              : 'Severe risk: 8-10% shrinkage loss from 38°C heat + 45 trucks arriving from Nasik creating price slump.'}
          </p>
        </div>
      </div>
    </div>
  )
}

// 7. DEDICATED ALERTS & NOTIFICATIONS VIEW
export function KrishiAlertsView({
  currentLang = 'en',
  onOpenDriver,
  onOpenRoute,
  onOpenBuyers,
}: {
  currentLang?: Language
  onOpenDriver: () => void
  onOpenRoute: () => void
  onOpenBuyers: () => void
}) {
  const t = useTranslation(currentLang)
  const [filter, setFilter] = useState<'all' | 'urgent' | 'logistics' | 'buyers'>('all')
  const [readAlerts, setReadAlerts] = useState<Record<string, boolean>>({})

  const alerts = [
    {
      id: 'a1',
      category: 'urgent',
      title: currentLang === 'gu' ? '🚨 નાસિક માલ આવક ચેતવણી (અમદાવાદ-સુરત)' : currentLang === 'hi' ? '🚨 नासिक माल आवक चेतावनी (अहमदाबाद-सूरत)' : '🚨 Nasik Influx Alert (Surat & Ahmedabad Hubs)',
      desc: currentLang === 'gu'
        ? 'શનિવાર સુધીમાં મહારાષ્ટ્ર સરહદેથી ૪૫ ટ્રક આવવાની શક્યતા. ભાવ ₹૨૫૦/ક્વિન્ટલ ઘટતા પહેલા આજે જ વેચો.'
        : currentLang === 'hi'
        ? 'शनिवार तक महाराष्ट्र सीमा से 45 ट्रक आने की संभावना। भाव ₹250/क्विंटल गिरने से पहले आज ही बेचें।'
        : '45 trucks of tomato arrivals projected by Saturday. Sell today or tomorrow to avoid ₹250/qtl price dip.',
      time: currentLang === 'gu' ? '૧૫ મિનિટ પહેલા' : currentLang === 'hi' ? '15 मिनट पहले' : '15 mins ago',
      actionLabel: currentLang === 'gu' ? 'ડિસ્પેચ સમય નક્કી કરો' : currentLang === 'hi' ? 'प्रेषण समय तय करें' : 'Schedule Morning Dispatch',
      action: onOpenRoute,
    },
    {
      id: 'a2',
      category: 'logistics',
      title: currentLang === 'gu' ? '🌡️ બપોરે ૩૮°C તાપમાન ચેતવણી (NH-64 બારેજા)' : currentLang === 'hi' ? '🌡️ दोपहर 38°C धूप चेतावनी (NH-64 बारेजा)' : '🌡️ 38°C Midday Heatwave Warning (NH-64 Bareja Axis)',
      desc: currentLang === 'gu'
        ? 'બપોરે ૧૨:૦૦ થી ૩:૩૦ દરમિયાન ભારે ગરમી. સવારે ૦૮:૩૦ પહેલા વાહન પહોંચાડવું અથવા તાડપત્રી ઢાંકવી.'
        : currentLang === 'hi'
        ? 'दोपहर 12:00 से 3:30 तक अत्यधिक धूप। सुबह 08:30 से पहले वाहन पहुँचना जरूरी या तिरपाल ढकें।'
        : 'Temperatures peak between 12:00 PM and 3:30 PM. Transit must conclude before 08:30 AM.',
      time: currentLang === 'gu' ? '૪૫ મિનિટ પહેલા' : currentLang === 'hi' ? '45 मिनट पहले' : '45 mins ago',
      actionLabel: currentLang === 'gu' ? 'ટાટા એસ બુક કરો' : currentLang === 'hi' ? 'टाटा ऐस बुक करें' : 'Book Tata Ace',
      action: onOpenDriver,
    },
    {
      id: 'a3',
      category: 'buyers',
      title: currentLang === 'gu' ? '💼 ફ્રેશડાયરેક્ટ સરખેજ મોટી ખરીદી માગ' : currentLang === 'hi' ? '💼 फ्रेशडायरेक्ट सरखेज बड़ी खरीद मांग' : '💼 FreshDirect Sarkhej Demand Surge',
      desc: currentLang === 'gu'
        ? 'સત્યાપિત ખરીદદારને ૫૦૦-૨,૦૦૦ કિલો ગ્રેડ A ટામેટા ₹૨૯.૦૦/કિલો ના ભાવે તાત્કાલિક જોઈએ છે.'
        : currentLang === 'hi'
        ? 'सत्यापित खरीदार को 500-2,000 किग्रा ग्रेड A टमाटर ₹29.00/किग्रा पर तत्काल चाहिए।'
        : 'Verified buyer FreshDirect seeking 500–2,000 kg Grade A tomatoes at premium ₹29.00/kg.',
      time: currentLang === 'gu' ? '૨ કલાક પહેલા' : currentLang === 'hi' ? '2 घंटे पहले' : '2 hours ago',
      actionLabel: currentLang === 'gu' ? 'વેપારીઓ જુઓ' : currentLang === 'hi' ? 'व्यापारी देखें' : 'View Matching Buyers',
      action: onOpenBuyers,
    },
    {
      id: 'a4',
      category: 'logistics',
      title: currentLang === 'gu' ? '🚛 આણંદ FPO વાહન કાલે ૦૫:૦૦ AM ઉપડશે' : currentLang === 'hi' ? '🚛 आणंद FPO वाहन कल 05:00 AM निकलेगा' : '🚛 Anand FPO Shared Truck Departs 05:00 AM Tomorrow',
      desc: currentLang === 'gu'
        ? '૧૫ ખેડૂતોએ ૭,૫૦૦ કિલો એકઠો કર્યો છે. સામૂહિક ભાડાથી ૩૦% ની બચત થાય છે.'
        : currentLang === 'hi'
        ? '15 किसानों ने 7,500 किग्रा माल इकट्ठा किया। सामूहिक भाड़े से 30% बचत होगी।'
        : '15 farmers have consolidated 7,500 kg. Shared freight rate provides 30% savings.',
      time: currentLang === 'gu' ? '૩ કલાક પહેલા' : currentLang === 'hi' ? '3 घंटे पहले' : '3 hours ago',
      actionLabel: currentLang === 'gu' ? 'જગ્યા બુક કરો' : currentLang === 'hi' ? 'स्थान आरक्षित करें' : 'Reserve Shared Space',
      action: onOpenDriver,
    },
  ]

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.category === filter)

  const markAllRead = () => {
    const updated: Record<string, boolean> = {}
    alerts.forEach((a) => (updated[a.id] = true))
    setReadAlerts(updated)
    toast.success(currentLang === 'gu' ? 'બધી સૂચનાઓ વાંચેલી ચિહ્નિત થઈ' : currentLang === 'hi' ? 'सभी सूचनाएं पढ़ी हुई चिह्नित की गईं' : 'All alerts marked as read')
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#112d1e] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#1b7340]" />
            {t.alertsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
            {t.alertsSubtitle}
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-3.5 py-1.5 rounded-lg bg-white border border-[#cce0cb] text-[#1b5037] text-xs font-bold hover:bg-[#f6faf4]"
        >
          {t.markAllRead}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        {(['all', 'urgent', 'logistics', 'buyers'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg border transition-all capitalize ${
              filter === cat
                ? 'bg-[#184e36] text-white border-[#184e36]'
                : 'bg-white text-[#4d6657] border-[#d2e2d0] hover:bg-[#edf5eb]'
            }`}
          >
            {cat === 'all' ? (currentLang === 'gu' ? 'બધી ચેતવણીઓ' : currentLang === 'hi' ? 'सभी अलर्ट' : 'All Alerts') : cat}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.map((alert) => {
          const isRead = Boolean(readAlerts[alert.id])

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isRead
                  ? 'bg-white/70 border-[#e0ece0] opacity-80'
                  : alert.category === 'urgent'
                  ? 'bg-[#fffafa] border-2 border-[#fca5a5]'
                  : 'bg-white border-[#d6e3d3] shadow-xs'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-[#143224]">{alert.title}</h4>
                  <span className="text-[10px] text-[#718b7c]">{alert.time}</span>
                </div>
                <p className="text-xs text-[#526d5f] max-w-2xl leading-relaxed">{alert.desc}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={alert.action}
                  className="px-3 py-2 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white text-xs font-bold transition-all shadow-xs"
                >
                  {alert.actionLabel} ➔
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
