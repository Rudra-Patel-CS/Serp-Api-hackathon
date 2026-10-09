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
  Award,
} from 'lucide-react'
import { Language } from './krishi-topbar'

// 1. BUYERS VIEW (12 Verified Buyers)
export function KrishiBuyersView({ currentLang }: { currentLang: Language }) {
  const [filterType, setFilterType] = useState('all')

  const buyersList = [
    {
      id: 'b1',
      name: 'FreshDirect Gujarat Wholesale',
      type: 'Quick-Commerce Hub',
      city: 'Ahmedabad (Sarkhej)',
      crops: ['Tomato (Grade A)', 'Bell Pepper', 'Cucumber'],
      minQty: '200 kg',
      priceQuote: '₹29.00 / kg',
      terms: 'Instant Bank Transfer / UPI upon weighing',
      phone: '+91 98251 10293',
      rating: '4.9 ★ (140 deals)',
      verified: true,
    },
    {
      id: 'b2',
      name: 'Sahyog Horeca & Hotel Sourcing',
      type: 'HoReCa Supplier',
      city: 'Vadodara (Alkapuri)',
      crops: ['Tomato (Firm Red)', 'Onion', 'Potato'],
      minQty: '400 kg',
      priceQuote: '₹28.50 / kg',
      terms: 'Same day payment, plastic crates provided',
      phone: '+91 98244 88192',
      rating: '4.8 ★ (85 deals)',
      verified: true,
    },
    {
      id: 'b3',
      name: 'KisanSetu Food Processing Corp',
      type: 'Processor / Puree',
      city: 'Nadiad GIDC',
      crops: ['Tomato (Processing Grade)', 'Chilli'],
      minQty: '1,000 kg',
      priceQuote: '₹26.80 / kg',
      terms: 'Next day RTGS, factory gate delivery',
      phone: '+91 98790 33412',
      rating: '4.7 ★ (210 deals)',
      verified: true,
    },
    {
      id: 'b4',
      name: 'Jamalpur BigBasket Sourcing Unit',
      type: 'Retail Supermarket',
      city: 'Ahmedabad (Jamalpur APMC)',
      crops: ['Tomato (Grade A)', 'Leafy Greens'],
      minQty: '500 kg',
      priceQuote: '₹28.80 / kg',
      terms: 'Direct APMC escrow settlement',
      phone: '+91 94260 55102',
      rating: '4.9 ★ (320 deals)',
      verified: true,
    },
  ]

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#112d1e]">
          12 Verified Institutional Buyers (Tomato Grade A)
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
          Active procurement signals within 75 km of Anand with verified payment guarantees.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        {['all', 'Quick-Commerce Hub', 'HoReCa Supplier', 'Processor / Puree'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filterType === type
                ? 'bg-[#184e36] text-white border-[#184e36]'
                : 'bg-white text-[#4d6657] border-[#d2e2d0] hover:bg-[#edf5eb]'
            }`}
          >
            {type === 'all' ? 'All Buyer Categories' : type}
          </button>
        ))}
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buyersList.map((buyer) => (
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
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{buyer.city}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9] shrink-0">
                  {buyer.rating}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#556e60]">Indicative Quote:</span>
                  <strong className="text-[#143825] text-sm">{buyer.priceQuote}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#556e60]">Min. Order Requirement:</span>
                  <span className="font-semibold text-[#143825]">{buyer.minQty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#556e60]">Settlement Terms:</span>
                  <span className="font-medium text-[#2d563e]">{buyer.terms}</span>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#edf3ec]">
              <button
                onClick={() => alert(`Calling ${buyer.name} (${buyer.phone})...`)}
                className="flex-1 py-2 px-3 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Buyer ({buyer.phone})
              </button>

              <button
                onClick={() => alert(`Connecting with ${buyer.name} on WhatsApp...`)}
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
export function KrishiMyCropView() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#112d1e]">
            My Active Crops & Harvest Batches
          </h2>
          <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
            Registered farm plots in Anand Rural Hub with laboratory moisture and grade telemetry.
          </p>
        </div>

        <button
          onClick={() => alert('New crop registration form opened')}
          className="px-4 py-2 bg-[#184e36] text-white rounded-lg text-xs font-bold"
        >
          + Register New Harvest Lot
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#d6e3d3] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0 border border-[#cfe0cc]">
            <Image
              src="/images/tomato-lot.jpg"
              alt="Harvested Tomato Lot #4"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5e9] text-[#1b5e20] border border-[#c8e6c9]">
                LOT #4 • READY FOR DISPATCH
              </span>
              <span className="text-xs text-[#556e60]">Planted 15 July 2026</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#112d1e]">
              Tomato (Tameta) — Gujarat Hybrid Ruby Firm
            </h3>
            <p className="text-xs text-[#556e60]">
              Field Plot 2B, Anand Taluka (1.8 Acres under Drip Irrigation) • Harvester: Ramesh Patel
            </p>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] text-[#698274] font-bold uppercase">Harvest Quantity</span>
            <div className="text-lg font-extrabold text-[#143224] mt-0.5">500 kg (20 Crates)</div>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] text-[#698274] font-bold uppercase">Moisture Content</span>
            <div className="text-lg font-extrabold text-[#143224] mt-0.5">84% (Ideal Firm)</div>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] text-[#698274] font-bold uppercase">Firmness Score</span>
            <div className="text-lg font-extrabold text-[#1b5e20] mt-0.5">8.2 N (Grade A)</div>
          </div>
          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e1ece0]">
            <span className="text-[10px] text-[#698274] font-bold uppercase">Pesticide Residue</span>
            <div className="text-lg font-extrabold text-[#1b5e20] mt-0.5">Zero MRL (Pass ✓)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 3. LOGISTICS & STORAGE VIEW
export function KrishiLogisticsView() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#112d1e]">
          Local Logistics & Cold Storage Hub (Anand Sector)
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
          Pre-negotiated mini-trucks, Tata Ace drivers, and regional cooling chambers.
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
                <h4 className="font-bold text-sm text-[#112d1e]">Magan Bhai (Tata Ace)</h4>
                <div className="text-xs text-[#526d5f]">GJ-23-AT-8492 • Mogri Chowkdi (3 km away)</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5e9] text-[#1b5e20]">
              Available Now
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e2ede0] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#556e60]">Capacity:</span>
              <span className="font-bold">1,000 kg (40 crates)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#556e60]">Anand ➔ Ahmedabad Trip Rate:</span>
              <strong className="text-[#175235]">₹900 locked tariff</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#556e60]">Tarpaulin Cover:</span>
              <span className="font-semibold text-[#1b5e20]">Yes (Included)</span>
            </div>
          </div>

          <button
            onClick={() => alert('Dialing Magan Bhai (+91 98250 41289)...')}
            className="w-full py-2.5 px-3 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            Book Magan Bhai (+91 98250 41289)
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
                <h4 className="font-bold text-sm text-[#112d1e]">Chikhodra Agri Cold Chamber</h4>
                <div className="text-xs text-[#526d5f]">NH-48 Bypass, Chikhodra • 7 km away</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e3f2fd] text-[#0d47a1]">
              450 Crates Open
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f8fbf7] border border-[#e2ede0] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#556e60]">Temperature Control:</span>
              <span className="font-bold">12°C - 14°C (Tomato safe)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#556e60]">Storage Fee:</span>
              <strong className="text-[#175235]">₹1.20 / crate / day</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#556e60]">Preservation Shelf:</span>
              <span className="font-semibold text-[#1b5e20]">Up to 7 days without shrink</span>
            </div>
          </div>

          <button
            onClick={() => alert('Chikhodra Cold Chamber slot reserved for 20 crates.')}
            className="w-full py-2.5 px-3 rounded-lg bg-[#f0f6ee] hover:bg-[#e4eee1] text-[#164731] font-bold text-xs border border-[#cce0cb]"
          >
            Reserve 20 Crates Chamber Space
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. FPO DASHBOARD VIEW
export function KrishiFpoView() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#112d1e]">
          Anand Tomato Producer Company Ltd (FPO Collective)
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
          Coordinated pooling of 15 member farmers for high-volume institutional bidding.
        </p>
      </div>

      <div className="bg-[#143828] text-white p-6 rounded-2xl border border-[#1f543c] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-[#205b3e] text-[#8cf0be] border border-[#3b8460]">
            ACTIVE POOL BATCH #FPO-OCT-09
          </span>
          <span className="text-xs text-[#a0cbaf]">Dispatch Target: Tomorrow 05:00 AM</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div>
            <span className="text-xs text-[#a4c9b6]">Consolidated Volume:</span>
            <div className="text-2xl font-black text-white">7,500 kg (15 Farmers)</div>
          </div>
          <div>
            <span className="text-xs text-[#a4c9b6]">Freight Rate Savings:</span>
            <div className="text-2xl font-black text-[#75f8ba]">-30% Shared Freight</div>
          </div>
          <div>
            <span className="text-xs text-[#a4c9b6]">Collective Net Benefit:</span>
            <div className="text-2xl font-black text-white">+₹4,200 Extra Payout</div>
          </div>
        </div>

        <button
          onClick={() => alert('Your 500 kg lot added to FPO shared truck batch #FPO-OCT-09!')}
          className="w-full py-3 rounded-xl bg-[#25734e] hover:bg-[#1d5c3e] text-white font-extrabold text-xs transition-all shadow-xs"
        >
          Add My 500 kg Lot to Tomorrow&apos;s FPO Shared Truck
        </button>
      </div>
    </div>
  )
}

// 5. EVIDENCE & SOURCES VIEW
export function KrishiEvidenceView() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#112d1e]">
          Agmarknet & Telemetry Provenance Records
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
          Audit-able records of live gate entries, weighbridge receipts, and state market cess schedules.
        </p>
      </div>

      <div className="space-y-3">
        {[
          {
            title: 'APMC Jamalpur Modal Price Bulletin #AGM-2026-10-09',
            authority: 'Gujarat State Agricultural Marketing Board (GSAMB)',
            summary: 'Recorded 28 transactions across 45,000 kg Grade A tomatoes at ₹2,850 modal rate.',
            time: 'Today 05:45 AM',
          },
          {
            title: 'NH-64 Bareja Toll Weigh-In-Motion Speed Records',
            authority: 'National Highways Authority of India (NHAI Logistics Telemetry)',
            summary: 'Average freight truck clearance time: 3.2 minutes. Express corridor clear.',
            time: 'Today 06:00 AM',
          },
          {
            title: 'Gujarat Mandi Cess Tariff Order No. 44/2026',
            authority: 'Director of Agricultural Marketing and Rural Finance',
            summary: 'Statutory market cess capped at 0.8% with zero additional entry duty for registered farmers.',
            time: 'Official Gazette',
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
export function KrishiSellVsWaitView() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#112d1e]">
          Sell Now vs Wait Decision Matrix (Tomato Grade A)
        </h2>
        <p className="text-xs sm:text-sm text-[#4d6657] mt-1">
          Evaluating 72-hour temperature heatwave risk against expected weekend price upticks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#1b7340] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#1b7340]">TODAY (RECOMMENDED)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#e8f5e9] text-[#1b5e20]">Score: 89</span>
          </div>
          <div className="text-2xl font-black text-[#143224]">₹13,500 <span className="text-xs font-normal text-[#556e60]">net</span></div>
          <p className="text-xs text-[#556e60]">
            Fresh harvest firmness 8.2N. Zero transit shrinkage penalty. Immediate cash settlement.
          </p>
        </div>

        {/* Tomorrow */}
        <div className="bg-white p-5 rounded-2xl border border-[#d6e3d3] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#143224]">TOMORROW (EARLY HAUL)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#edf4ec] text-[#335640]">Score: 84</span>
          </div>
          <div className="text-2xl font-black text-[#143224]">₹13,200 <span className="text-xs font-normal text-[#556e60]">net</span></div>
          <p className="text-xs text-[#556e60]">
            Acceptable if departing at 04:30 AM before midday 38°C heat spike.
          </p>
        </div>

        {/* Saturday */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#f87171] bg-[#fffafa] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#b91c1c]">SATURDAY (HIGH RISK)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fee2e2] text-[#b91c1c]">Score: 61</span>
          </div>
          <div className="text-2xl font-black text-[#991b1b]">₹11,400 <span className="text-xs font-normal text-[#888]">net</span></div>
          <p className="text-xs text-[#77443d]">
            Severe risk: 8-10% shrinkage loss from heat + 45 trucks arriving from Nasik creating price drop.
          </p>
        </div>
      </div>
    </div>
  )
}
