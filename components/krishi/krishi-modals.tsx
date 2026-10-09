'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  QrCode,
  Sparkles,
  Send,
  Mic,
  Truck,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  FileText,
  AlertTriangle,
} from 'lucide-react'

// 1. KISAN BAHI SLIP MODAL
export function KisanBahiSlipModal({
  isOpen,
  onClose,
  lotQuantity = 500,
  selectedMandi = 'Anand Local Mandi',
  netAmount = 13500,
}: {
  isOpen: boolean
  onClose: () => void
  lotQuantity?: number
  selectedMandi?: string
  netAmount?: number
}) {
  if (!isOpen) return null

  const grossAmount = Math.round((netAmount * 1.09))
  const freight = selectedMandi.includes('Anand') ? 450 : 900
  const cess = 120
  const handling = 180

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#72f5b5]" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Kisan Bahi Realization Voucher
              </h3>
              <span className="text-[10px] text-[#a0cbaf]">
                ખેડૂત ચોપડો વેચાણ સ્લિપ • APMC Validated
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Body (Paper simulation) */}
        <div className="p-6 space-y-4 text-xs text-[#203a2a] bg-[#fafcfa]">
          {/* Top metadata */}
          <div className="flex justify-between items-start border-b border-dashed border-[#cfe0cc] pb-3">
            <div>
              <div className="font-bold text-sm text-[#112d1e]">Ramesh Patel</div>
              <div className="text-[11px] text-[#556e60]">Anand Taluka, Gujarat • Reg #GJ-AND-4821</div>
              <div className="text-[10px] text-[#718b7c] mt-0.5">Lot #4 • Tomato (Grade A Firm)</div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded bg-[#e8f5e9] text-[#1b5e20] font-bold text-[10px] border border-[#c8e6c9]">
                VERIFIED READY
              </span>
              <div className="text-[10px] text-[#60776b] mt-1">Date: 09 Oct 2026</div>
              <div className="text-[10px] font-mono text-[#405648]">Voucher: #KB-8924</div>
            </div>
          </div>

          {/* Mandi & Dispatch */}
          <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-[#e0ece0]">
            <div>
              <span className="text-[10px] text-[#698274] font-medium">Designated APMC</span>
              <div className="font-bold text-[#143224]">{selectedMandi}</div>
            </div>
            <div>
              <span className="text-[10px] text-[#698274] font-medium">Batch Weight</span>
              <div className="font-bold text-[#143224]">{lotQuantity} kg ({lotQuantity / 100} Quintals)</div>
            </div>
          </div>

          {/* Itemized Calculation */}
          <div className="space-y-1.5 py-2">
            <div className="flex justify-between text-[#385242]">
              <span>Gross Sale Value (સૂચક વેચાણ મૂલ્ય):</span>
              <span className="font-bold">₹{grossAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#c2410c]">
              <span>(-) Mini-Truck Freight (Mogri Hub):</span>
              <span>-₹{freight.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#c2410c]">
              <span>(-) GSAMB Mandi Cess (0.8%):</span>
              <span>-₹{cess}</span>
            </div>
            <div className="flex justify-between text-[#c2410c]">
              <span>(-) Hamali & Weighing:</span>
              <span>-₹{handling}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t-2 border-[#164731] text-sm">
              <span className="font-black text-[#143525]">
                NET TAKE-HOME IN-HAND (ખરી ચોખ્ખી ઉપજ):
              </span>
              <span className="font-black text-lg text-[#165a36]">
                ₹{netAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* QR Code & Digital Stamp */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#f0f6ee] border border-[#d2e2d0]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded border border-[#bed4bc] flex items-center justify-center p-1">
                <QrCode className="w-10 h-10 text-[#1b4e36]" />
              </div>
              <div className="text-[10px] text-[#4d6657]">
                <strong className="block text-[#1b4e36]">KrishiIntel Escrow Token</strong>
                Scan at APMC weighbridge for priority unloading lane #2.
              </div>
            </div>
            <ShieldCheck className="w-8 h-8 text-[#1b7340] shrink-0" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#f0f5ee] p-3.5 border-t border-[#dce6dc] flex items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#fafbfa] text-[#1e5238] border border-[#cce0cb] font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print Slip
          </button>

          <button
            onClick={() => {
              alert('Kisan Bahi realization slip link copied to clipboard & prepared for WhatsApp!')
              onClose()
            }}
            className="px-4 py-2 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Share2 className="w-4 h-4 text-[#72f5b5]" />
            Share on WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

// 2. KISAN AI ASSISTANT CHAT MODAL
export function KisanAIAssistantModal({
  isOpen,
  onClose,
  initialPrompt,
}: {
  isOpen: boolean
  onClose: () => void
  initialPrompt?: string
}) {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: 'નમસ્તે રમેશ ભાઈ! હું કૃષિઇન્ટેલ સહાયક છું. તમારા ટામેટા પાક, મંડી ભાવ અથવા પરિવહન વિશે કોઈ પણ પ્રશ્ન પૂછો.',
      time: '06:12 AM',
    },
    ...(initialPrompt
      ? [
          { sender: 'user' as const, text: initialPrompt, time: 'Just now' },
          {
            sender: 'ai' as const,
            text: getAiAnswer(initialPrompt),
            time: 'Just now',
          },
        ]
      : []),
  ])
  const [input, setInput] = useState('')

  if (!isOpen) return null

  function getAiAnswer(prompt: string) {
    if (prompt.toLowerCase().includes('saturday') || prompt.toLowerCase().includes('wait')) {
      return 'રમેશ ભાઈ, શનિવાર સુધી રાહ ન જોવાની સલાહ છે! હવામાન રિપોર્ટ મુજબ આવતીકાલથી તાપમાન 38°C થશે અને ખુલ્લા ક્રેટ્સમાં 8% થી 10% વજન ઘટશે (Shrinkage loss). ઉપરાંત, સુરત અને અમદાવાદમાં શનિવારે નાસિકથી 45 ટ્રક ટામેટાંની આવક થવાની છે જેનાથી ભાવ ₹200-₹300 ઘટી શકે છે. આજનો કે આવતીકાલનો આણંદ/અમદાવાદ સ્લોટ સૌથી ઉત્તમ છે.'
    }
    if (prompt.toLowerCase().includes('magan') || prompt.toLowerCase().includes('driver') || prompt.toLowerCase().includes('truck')) {
      return 'મગન ભાઈ (ટાટા એસ - GJ-23-AT-8492) હાલ મોગરી ચોકડી પાસે હાજર છે. તેમનો મોબાઈલ નંબર: +91 98250 41289 છે. આણંદથી અમદાવાદ માટે તેમનો વન-વે સ્પેશિયલ દર ₹900 નક્કી છે. શું હું તેમનો સંપર્ક કરાવી આપું?'
    }
    if (prompt.toLowerCase().includes('fpo') || prompt.toLowerCase().includes('pool')) {
      return 'હા રમેશ ભાઈ! આણંદ ટોમેટો પ્રોડ્યુસર FPO આવતીકાલે સવારે 05:00 વાગ્યે 15 ખેડૂતોનો 7,500 કિલો જથ્થો અમદાવાદ લઈ જાય છે. તમારો 500 કિલો લોટ તેમાં જોડવાથી તમારું પરિવહન ભાડું 30% ઘટીને માત્ર ₹630 થશે. FPO સુપરવાઈઝર હરેશ ભાઈ સાથે બુકિંગ ચાલુ છે.'
    }
    return 'તમારા પ્રશ્નનું વિશ્લેષણ કરવામાં આવ્યું છે: આણંદ લોકલ મંડીમાં હાલ 18 સક્રિય વેપારીઓ છે અને સેમ-ડે UPI પેમેન્ટ મળી રહ્યું છે. 500 કિલો માટે આણંદમાં ₹13,500 નેટ મળે છે જ્યારે સુરતમાં ભાડું અને વજન ઘટને કારણે ₹11,850 જ મળશે.'
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input
    setInput('')
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Just now' },
      { sender: 'ai', text: getAiAnswer(userMsg), time: 'Just now' },
    ])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full h-[540px] shadow-2xl flex flex-col overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#236043] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#72f5b5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Kisan AI Voice & Market Advisor
              </h3>
              <span className="text-[10px] text-[#a0cbaf]">
                કૃષિઇન્ટેલ ડિસિઝન સહાયક (Live Gujarat Telemetry)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fbf7]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#184e36] text-white rounded-br-none'
                    : 'bg-white text-[#153424] border border-[#d6e5d3] rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-[#789182] mt-0.5 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Suggested Quick Buttons */}
        <div className="px-3 py-2 bg-[#f0f6ee] border-t border-[#dce6dc] flex gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => {
              setMessages((prev) => [
                ...prev,
                { sender: 'user', text: 'Can I wait till Saturday for higher rates?', time: 'Just now' },
                { sender: 'ai', text: getAiAnswer('Saturday'), time: 'Just now' },
              ])
            }}
            className="px-2.5 py-1 bg-white hover:bg-[#eaf4ea] rounded-full border border-[#cfe0cc] text-[#1c4d34] font-medium shrink-0"
          >
            Can I wait till Saturday?
          </button>
          <button
            onClick={() => {
              setMessages((prev) => [
                ...prev,
                { sender: 'user', text: 'Connect me with Magan mini-truck driver', time: 'Just now' },
                { sender: 'ai', text: getAiAnswer('Magan'), time: 'Just now' },
              ])
            }}
            className="px-2.5 py-1 bg-white hover:bg-[#eaf4ea] rounded-full border border-[#cfe0cc] text-[#1c4d34] font-medium shrink-0"
          >
            Magan Driver Number
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#dce6dc] flex items-center gap-2">
          <button
            onClick={() => alert('Voice listening in Gujarati/Hindi/English enabled...')}
            className="p-2 rounded-full bg-[#f0f6ee] text-[#1b7340] hover:bg-[#e2f0e0]"
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="તમારો પ્રશ્ન લખો અથવા પૂછો..."
            className="flex-1 px-3 py-2 text-xs bg-[#f8fbf7] border border-[#d2e2d0] rounded-full outline-none focus:border-[#1b7340]"
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-full bg-[#184e36] text-white hover:bg-[#123e2b]"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// 3. SWITCH LOT MODAL
export function SwitchLotModal({
  isOpen,
  onClose,
  onSelectLot,
}: {
  isOpen: boolean
  onClose: () => void
  onSelectLot: (lot: { crop: string; qty: number; grade: string; loc: string }) => void
}) {
  if (!isOpen) return null

  const lots = [
    { id: 'LOT-04', crop: 'Tomato (Tameta)', qty: 500, grade: 'Grade A', loc: 'Anand', moisture: '84%', ready: true },
    { id: 'LOT-05', crop: 'Red Onion (ડુંગળી)', qty: 1200, grade: 'Grade B', loc: 'Anand', moisture: '14%', ready: true },
    { id: 'LOT-06', crop: 'Potato (બટાકા)', qty: 2000, grade: 'Grade A', loc: 'Deesa', moisture: '78%', ready: false },
    { id: 'LOT-07', crop: 'Groundnut (મગફળી)', qty: 2500, grade: 'Grade A', loc: 'Rajkot', moisture: '8%', ready: true },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base">
            Select Harvest Lot for Telemetry
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 bg-[#f8fbf7]">
          {lots.map((lot) => (
            <div
              key={lot.id}
              onClick={() => {
                onSelectLot(lot)
                onClose()
              }}
              className="p-3.5 rounded-xl bg-white border border-[#d6e5d3] hover:border-[#1b7340] cursor-pointer shadow-xs transition-all flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-xs text-[#143825]">{lot.crop}</strong>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#e8f5e9] text-[#1e7e34]">
                    {lot.grade}
                  </span>
                </div>
                <div className="text-[11px] text-[#556e60] mt-0.5">
                  {lot.id} • {lot.qty} kg • {lot.loc}, Gujarat • Moisture {lot.moisture}
                </div>
              </div>

              <span className="text-xs font-bold text-[#1b7340]">Select ➔</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 4. ROUTE PROTOCOL MODAL
export function RouteProtocolModal({
  isOpen,
  onClose,
  mandiName = 'Ahmedabad Wholesale Mandi (APMC Jamalpur)',
}: {
  isOpen: boolean
  onClose: () => void
  mandiName?: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#72f5b5]" />
            <h3 className="font-extrabold text-sm sm:text-base">
              Transit Route & Gate Entry Protocol
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-[#203a2a] bg-[#fafcfa]">
          <div className="bg-[#eef7ec] p-3 rounded-xl border border-[#cbe2c8] space-y-1">
            <div className="font-bold text-[#153f2c]">{mandiName}</div>
            <div className="text-[11px] text-[#4d6657]">
              Origin: Anand Farm Plot 2B ➔ Distance: 65 km • Estimated Transit: 1h 45m
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1b7340] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-[#143825]">04:30 AM Departure (Optimal Thermal Window)</strong>
                <p className="text-[11px] text-[#556e60] mt-0.5">
                  Load Tata Ace with tarpaulin covering to prevent moisture transpiration in transit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1b7340] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-[#143825]">05:40 AM NH-64 Toll & Fastag Corridor</strong>
                <p className="text-[11px] text-[#556e60] mt-0.5">
                  Direct corridor via Bareja. Live traffic index: Green (zero bottle-neck).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1b7340] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-[#143825]">06:15 AM APMC Gate #3 Entry & Lot Registration</strong>
                <p className="text-[11px] text-[#556e60] mt-0.5">
                  Present Kisan Bahi Slip token for priority weighing. First-line auction begins 06:45 AM.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f0f5ee] p-3.5 border-t border-[#dce6dc] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#143d2b] text-white font-bold text-xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  )
}
