'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  QrCode,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Volume2,
  Truck,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Building2,
  Plus,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { HarvestLot, cropsList, MandiCalculation, money } from '@/lib/market-service'
import { Language } from './krishi-topbar'

// 1. KISAN BAHI SLIP MODAL
export function KisanBahiSlipModal({
  isOpen,
  onClose,
  lot,
  mandiCalculation,
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  lot: HarvestLot
  mandiCalculation?: MandiCalculation
  currentLang?: Language
}) {
  if (!isOpen) return null

  const mandiName = currentLang === 'gu' && mandiCalculation?.nameGu
    ? mandiCalculation.nameGu
    : currentLang === 'hi' && mandiCalculation?.nameHi
    ? mandiCalculation.nameHi
    : (mandiCalculation?.name ?? 'Ahmedabad Wholesale Mandi (APMC Jamalpur)')

  const gross = mandiCalculation?.totalGross ?? Math.round(lot.quantity * 28.5)
  const freight = mandiCalculation?.totalFreight ?? 900
  const cess = mandiCalculation?.totalCess ?? Math.round(gross * 0.008)
  const handling = mandiCalculation?.totalHandling ?? 150
  const net = mandiCalculation?.totalNet ?? gross - freight - cess - handling

  const voucherSummary = currentLang === 'gu'
    ? `*કૃષિઇન્ટેલ કિસાન બહી વેચાણ સ્લિપ*
• ખેડૂત: રમેશભાઈ પટેલ (નોંધણી #GJ-AND-4821)
• પાક: ${lot.crop} (${lot.quantity} કિલો, ${lot.grade})
• નિયત એપીએમસી: ${mandiName}
• કુલ સૂચક વેચાણ: ${money(gross)}
• (-) વાહન ભાડું: -${money(freight)}
• (-) સરકારી સેસ (૦.૮%): -${money(cess)}
• (-) હમાલી અને તોલામણી: -${money(handling)}
*ચોખ્ખી હાથમાં મળવાપાત્ર રકમ: ${money(net)}*
વાઉચર ટોકન: #KB-8924 • એપીએમસી માન્ય`
    : currentLang === 'hi'
    ? `*कृषि-इंटेल किसान बही प्राप्ति पर्ची*
• किसान: रमेश पटेल (पंजीकरण #GJ-AND-4821)
• फसल: ${lot.crop} (${lot.quantity} किग्रा, ${lot.grade})
• गंतव्य एपीएमसी: ${mandiName}
• सकल बिक्री मूल्य: ${money(gross)}
• (-) वाहन भाड़ा: -${money(freight)}
• (-) सरकारी सेस (0.8%): -${money(cess)}
• (-) हमाली व तुलाई: -${money(handling)}
*शुद्ध हाथ में मिलने वाली राशि: ${money(net)}*
पर्ची टोकन: #KB-8924 • एपीएमसी सत्यापित`
    : `*KrishiIntel Kisan Bahi Realization Voucher*
• Farmer: Ramesh Patel (Reg #GJ-AND-4821)
• Harvest: ${lot.crop} (${lot.quantity} kg, ${lot.grade})
• Designated APMC: ${mandiName}
• Gross Indicative Sale: ${money(gross)}
• (-) Mini-Truck Freight: -${money(freight)}
• (-) GSAMB Mandi Cess (0.8%): -${money(cess)}
• (-) Hamali & Weighing: -${money(handling)}
*NET TAKE-HOME CASH IN-HAND: ${money(net)}*
Voucher Token: #KB-8924 • APMC Validated`

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(voucherSummary)}`
    window.open(url, '_blank')
    toast.success(currentLang === 'gu' ? 'બહી સ્લિપ વોટ્સએપ પર શેર થઈ!' : currentLang === 'hi' ? 'बही पर्ची व्हाट्सएप पर साझा की गई!' : 'Bahi-Khata Voucher shared to WhatsApp!')
  }

  const handleCopyClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(voucherSummary)
      toast.success(currentLang === 'gu' ? 'સ્લિપ વિગતો કોપી થઈ ગઈ!' : currentLang === 'hi' ? 'पर्ची विवरण कॉपी हो गया!' : 'Voucher summary copied to clipboard!')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#72f5b5]" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {currentLang === 'gu' ? 'કિસાન બહી વેચાણ સ્લિપ' : currentLang === 'hi' ? 'किसान बही प्राप्ति पर्ची' : 'Kisan Bahi Realization Voucher'}
              </h3>
              <span className="text-[10px] text-[#a0cbaf]">
                {currentLang === 'gu' ? 'ખેડૂત ચોપડો વેચાણ સ્લિપ • એપીએમસી માન્ય' : currentLang === 'hi' ? 'किसान खाता पर्ची • एपीएमसी सत्यापित' : 'Kisan Ledger • APMC Validated'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Body (Paper simulation) */}
        <div id="printable-voucher" className="p-6 space-y-4 text-xs text-[#203a2a] bg-[#fafcfa]">
          {/* Top metadata */}
          <div className="flex justify-between items-start border-b border-dashed border-[#cfe0cc] pb-3">
            <div>
              <div className="font-bold text-sm text-[#112d1e]">Ramesh Patel</div>
              <div className="text-[11px] text-[#556e60]">Anand Taluka, Gujarat • Reg #GJ-AND-4821</div>
              <div className="text-[10px] text-[#718b7c] mt-0.5">
                {lot.id} • {lot.crop} ({lot.grade})
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded bg-[#e8f5e9] text-[#1b5e20] font-bold text-[10px] border border-[#c8e6c9]">
                APMC VERIFIED READY
              </span>
              <div className="text-[10px] text-[#60776b] mt-1">Date: 09 Oct 2026</div>
              <div className="text-[10px] font-mono text-[#405648]">Voucher: #KB-8924</div>
            </div>
          </div>

          {/* Mandi & Dispatch */}
          <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-[#e0ece0]">
            <div>
              <span className="text-[10px] text-[#698274] font-medium">
                {currentLang === 'gu' ? 'નિયત મંડી (એપીએમસી)' : currentLang === 'hi' ? 'गंतव्य मंडी (एपीएमसी)' : 'Designated APMC'}
              </span>
              <div className="font-bold text-[#143224] truncate">{mandiName}</div>
            </div>
            <div>
              <span className="text-[10px] text-[#698274] font-medium">
                {currentLang === 'gu' ? 'કુલ જથ્થો' : currentLang === 'hi' ? 'कुल मात्रा' : 'Batch Weight'}
              </span>
              <div className="font-bold text-[#143224]">
                {lot.quantity} kg ({lot.quantity / 100} {currentLang === 'gu' ? 'ક્વિન્ટલ' : currentLang === 'hi' ? 'क्विंटल' : 'Quintals'})
              </div>
            </div>
          </div>

          {/* Itemized Calculation */}
          <div className="space-y-1.5 py-2">
            <div className="flex justify-between text-[#385242]">
              <span>{currentLang === 'gu' ? 'કુલ સૂચક વેચાણ મૂલ્ય:' : currentLang === 'hi' ? 'सकल बिक्री मूल्य:' : 'Gross Sale Signal:'}</span>
              <span className="font-bold">{money(gross)}</span>
            </div>
            <div className="flex justify-between text-[#c2410c]">
              <span>{currentLang === 'gu' ? '(-) વાહન ભાડું:' : currentLang === 'hi' ? '(-) वाहन भाड़ा:' : '(-) Mini-Truck Freight:'}</span>
              <span>-{money(freight)}</span>
            </div>
            <div className="flex justify-between text-[#c2410c]">
              <span>{currentLang === 'gu' ? '(-) સરકારી સેસ (૦.૮%):' : currentLang === 'hi' ? '(-) सरकारी सेस (0.8%):' : '(-) GSAMB Statutory Mandi Cess (0.8%):'}</span>
              <span>-{money(cess)}</span>
            </div>
            <div className="flex justify-between text-[#c2410c]">
              <span>{currentLang === 'gu' ? '(-) મંડી હમાલી અને તોલામણી:' : currentLang === 'hi' ? '(-) हमाली व तुलाई शुल्क:' : '(-) Hamali & Weighbridge Handling:'}</span>
              <span>-{money(handling)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t-2 border-[#164731] text-sm">
              <span className="font-black text-[#143525]">
                {currentLang === 'gu' ? 'ખરી ચોખ્ખી ઉપજ (હાથમાં રોકડ):' : currentLang === 'hi' ? 'शुद्ध हाथ में मिलने वाली राशि:' : 'NET TAKE-HOME CASH IN-HAND:'}
              </span>
              <span className="font-black text-lg text-[#165a36]">
                {money(net)}
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
                <strong className="block text-[#1b4e36]">
                  {currentLang === 'gu' ? 'કૃષિઇન્ટેલ ડિજિટલ ટોકન #KB-8924' : currentLang === 'hi' ? 'कृषि-इंटेल डिजिटल टोकन #KB-8924' : 'KrishiIntel Escrow Token #KB-8924'}
                </strong>
                {currentLang === 'gu' ? 'ગેટ એન્ટ્રી અને વજન કાંટા પર પ્રાથમિકતા અનલોડિંગ માટે સ્કેન કરો.' : currentLang === 'hi' ? 'धर्मकांटा व गेट एंट्री पर प्राथमिकता अनलोडिंग के लिए स्कैन करें।' : 'Scan at APMC weighbridge for priority unloading lane #2.'}
              </div>
            </div>
            <ShieldCheck className="w-8 h-8 text-[#1b7340] shrink-0" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#f0f5ee] p-3.5 border-t border-[#dce6dc] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg bg-white hover:bg-[#fafbfa] text-[#1e5238] border border-[#cce0cb] font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              {currentLang === 'gu' ? 'સ્લિપ પ્રિન્ટ કરો' : currentLang === 'hi' ? 'पर्ची प्रिंट करें' : 'Print Slip'}
            </button>

            <button
              onClick={handleCopyClipboard}
              className="px-3 py-2 rounded-lg bg-white hover:bg-[#fafbfa] text-[#1e5238] border border-[#cce0cb] font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5" />
              {currentLang === 'gu' ? 'કોપી' : currentLang === 'hi' ? 'कॉपी' : 'Copy'}
            </button>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2 rounded-lg bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#72f5b5]" />
            {currentLang === 'gu' ? 'વોટ્સએપ પર મોકલો' : currentLang === 'hi' ? 'व्हाट्सएप पर साझा करें' : 'Share on WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  )
}

// 2. KISAN AI ASSISTANT CHAT MODAL WITH SPEECH RECOGNITION & SYNTHESIS
export function KisanAIAssistantModal({
  isOpen,
  onClose,
  initialPrompt,
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  initialPrompt?: string
  currentLang?: Language
}) {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text:
        currentLang === 'gu'
          ? 'નમસ્તે રમેશ ભાઈ! હું કૃષિઇન્ટેલ ડિસિઝન સહાયક છું. તમારા પાક, મંડી ભાવ, ટ્રાન્સપોર્ટ અથવા વેચાણ સમય વિશે કોઈ પણ પ્રશ્ન પૂછો.'
          : currentLang === 'hi'
          ? 'नमस्ते रमेश भाई! मैं कृषि-इंटेल सहायक हूँ। अपनी फसल, मंडी भाव, परिवहन या बिक्री के समय के बारे में कोई भी सवाल पूछें।'
          : 'Namaste Ramesh Bhai! I am your KrishiIntel Decision Advisor. Ask me anything about mandi rates, optimal timing, logistics, or buyer demand.',
      time: '06:10 AM',
    },
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleUserQuery(initialPrompt)
    }
  }, [initialPrompt, isOpen])

  if (!isOpen) return null

  function getKnowledgeResponse(query: string): string {
    const q = query.toLowerCase()

    if (q.includes('saturday') || q.includes('wait') || q.includes('રાહ') || q.includes('रुकें') || q.includes('शनिवार')) {
      if (currentLang === 'hi') {
        return 'रमेश भाई, शनिवार तक रुकने की सलाह नहीं है! मौसम रिपोर्ट के अनुसार कल से तापमान 38°C होगा और खुले क्रेट्स में 8% से 10% वजन घट (Shrinkage loss) होगी। इसके अलावा, शनिवार को नासिक से 45 ट्रक टमाटर की भारी आवक से भाव ₹200-₹300 गिर सकते हैं। आज या कल सुबह 04:30 बजे अहमदाबाद भेजना सर्वाधिक लाभकारी है।'
      }
      if (currentLang === 'en') {
        return 'Ramesh Bhai, we advise against waiting until Saturday! High temperatures reaching 38°C will cause 8% to 10% shrinkage weight loss. Additionally, 45 trucks arriving from Nasik on Saturday will drop mandi prices by ₹200-₹300/qtl. Dispatching to Ahmedabad or Anand today or tomorrow 04:30 AM delivers maximum profit.'
      }
      return 'રમેશ ભાઈ, શનિવાર સુધી રાહ ન જોવાની સલાહ છે! હવામાન રિપોર્ટ મુજબ આવતીકાલથી તાપમાન 38°C થશે અને ખુલ્લા ક્રેટ્સમાં 8% થી 10% વજન ઘટશે (Shrinkage loss). ઉપરાંત, સુરત અને અમદાવાદમાં શનિવારે નાસિકથી 45 ટ્રક ટામેટાંની આવક થવાની છે જેનાથી ભાવ ₹200-₹300 ઘટી શકે છે. આજનો કે આવતીકાલનો આણંદ/અમદાવાદ સ્લોટ સૌથી ઉત્તમ છે.'
    }

    if (q.includes('magan') || q.includes('driver') || q.includes('truck') || q.includes('વાહન') || q.includes('ટ્રક') || q.includes('ड्राइवर')) {
      if (currentLang === 'hi') {
        return 'मगन भाई (टाटा ऐस - GJ-23-AT-8492) मोगरी चौकड़ी के पास उपलब्ध हैं। उनका मोबाइल नंबर: +91 98250 41289 है। आणंद से अहमदाबाद के लिए उनका तय भाड़ा ₹900 (तिरपाल सहित) है। आप लॉजिस्टिक्स टैब से सीधे कॉल या बुकिंग कर सकते हैं।'
      }
      if (currentLang === 'en') {
        return 'Magan Bhai (Tata Ace - GJ-23-AT-8492) is stationed near Mogri Chowkdi (3 km away). Phone: +91 98250 41289. Locked fixed tariff for Anand to Ahmedabad is ₹900 (including tarpaulin). You can directly call or book from the Logistics tab.'
      }
      return 'મગન ભાઈ (ટાટા એસ - GJ-23-AT-8492) હાલ મોગરી ચોકડી પાસે હાજર છે. તેમનો મોબાઈલ નંબર: +91 98250 41289 છે. આણંદથી અમદાવાદ માટે તેમનો વન-વે સ્પેશિયલ દર ₹900 નક્કી છે (તાડપત્રી સહિત). તમે લોજિસ્ટિક્સ ટેબમાંથી સીધો કોલ અથવા બુકિંગ કરી શકો છો.'
    }

    if (q.includes('fpo') || q.includes('pool') || q.includes('જૂથ') || q.includes('સમૂહ') || q.includes('पूलिंग')) {
      if (currentLang === 'hi') {
        return 'हाँ रमेश भाई! आणंद टोमैटो प्रोड्यूसर एफपीओ कल सुबह 05:00 बजे 15 किसानों का 7,500 किग्रा माल अहमदाबाद ले जा रहा है। अपनी फसल जोड़ने पर आपका भाड़ा 30% घटकर मात्र ₹630 रह जाएगा। एफपीओ सुपरवाइजर के साथ बुकिंग सक्रिय है।'
      }
      if (currentLang === 'en') {
        return 'Yes Ramesh Bhai! The Anand Tomato Producer FPO is dispatching 7,500 kg from 15 farmers to Ahmedabad tomorrow at 05:00 AM. Pooling your lot saves 30% freight (costs ₹630 instead of ₹900). Booking is open now.'
      }
      return 'હા રમેશ ભાઈ! આણંદ ટોમેટો પ્રોડ્યુસર FPO આવતીકાલે સવારે 05:00 વાગ્યે 15 ખેડૂતોનો 7,500 કિલો જથ્થો અમદાવાદ લઈ જાય છે. તમારો 500 કિલો લોટ તેમાં જોડવાથી તમારું પરિવહન ભાડું 30% ઘટીને માત્ર ₹630 થશે. FPO સુપરવાઈઝર હરેશ ભાઈ સાથે બુકિંગ ચાલુ છે.'
    }

    if (q.includes('cess') || q.includes('tax') || q.includes('સેસ') || q.includes('કમિશન') || q.includes('सेस')) {
      if (currentLang === 'hi') {
        return 'गुजरात कृषि विपणन बोर्ड (GSAMB) नियमानुसार पंजीकृत किसानों से एपीएमसी सेस केवल 0.8% ही काटा जा सकता है। कोई भी आढ़ती या बिचौलिया किसान से 2% से अधिक कमीशन नहीं ले सकता। शिकायत होने पर तुरंत विवाद फॉर्म भरें।'
      }
      if (currentLang === 'en') {
        return 'Under GSAMB statutory rules, the mandi market cess deduction is strictly capped at 0.8% of gross trade value. No commission agent may deduct unauthorized cuts. You can file a formal dispute grievance ticket anytime.'
      }
      return 'ગુજરાત રાજ્ય કૃષિ બજાર બોર્ડ (GSAMB) ના નિયમ મુજબ નોંધાયેલા ખેડૂતો પાસેથી મંડી સેસ માત્ર 0.8% જ કાપી શકાય છે. કોઈ પણ આડતિયો 2% થી વધુ કમિશન ખેડૂત પાસેથી લઈ શકતો નથી. જો કોઈ અનિયમિતતા જણાય તો નીચે ડિસ્પ્યુટ ફોર્મ ભરી શકાય છે.'
    }

    if (q.includes('buyer') || q.includes('વેપારી') || q.includes('ખરીદદાર') || q.includes('खरीदार')) {
      if (currentLang === 'hi') {
        return 'अहमदाबाद और वडोदरा एक्सप्रेसवे पर वर्तमान में 12 सत्यापित संस्थागत खरीदार (क्विक-कॉमर्स व सुपरमार्केट्स) सक्रिय हैं, जो ग्रेड-A टमाटर के लिए ₹28.50 से ₹29.00/किग्रा का भाव दे रहे हैं। तत्काल UPI भुगतान उपलब्ध है।'
      }
      if (currentLang === 'en') {
        return '12 verified institutional buyers and quick-commerce procurement hubs are actively bidding on the Ahmedabad-Vadodara corridor, quoting ₹28.50 to ₹29.00/kg for Grade A produce with immediate UPI or escrow settlement.'
      }
      return 'હાલમાં અમદાવાદ અને વડોદરા એક્સપ્રેસવે પટ્ટા પર 12 વેરિફાઇડ સંસ્થાકીય ખરીદદારો (Quick-Commerce અને HoReCa) સક્રિય છે. ફ્રેમ ગ્રેડ-A ટામેટા માટે ₹28.50 થી ₹29.00/kg ઓફર કરી રહ્યા છે. સેમ-ડે UPI અથવા APMC એસ્ક્રો પેમેન્ટ ઉપલબ્ધ છે.'
    }

    if (q.includes('weather') || q.includes('તાપમાન') || q.includes('હવામાન') || q.includes('heat') || q.includes('मौसम')) {
      if (currentLang === 'hi') {
        return 'आणंद-अहमदाबाद कॉरिडोर पर आज मौसम 31°C शुष्क है, जो परिवहन के लिए अनुकूल है। दोपहर 12:00 से 3:30 के बीच तापमान 37°C पार कर सकता है, इसलिए सुबह 04:30 से 06:30 के बीच माल भेजना सर्वोत्तम रहेगा।'
      }
      if (currentLang === 'en') {
        return 'Weather along the Anand-Ahmedabad highway is currently 31°C dry. Midday heat reaches 37°C between 12:00 PM and 3:30 PM. Morning dispatch between 04:30 AM and 06:30 AM prevents produce shrinkage.'
      }
      return 'આણંદ-અમદાવાદ કોરિડોર પર આજે હવામાન 31°C ડ્રાય છે, જે ટ્રાન્સપોર્ટ માટે અનુકૂળ છે. પરંતુ બપોરે 12:00 થી 3:30 દરમિયાન તાપમાન 37°C વટાવી શકે છે, તેથી સવારે 04:30 થી 06:30 વાગ્યા વચ્ચે લોટ મોકલવો શ્રેષ્ઠ રહેશે.'
    }

    if (currentLang === 'hi') {
      return 'आपके प्रश्न का विश्लेषण: आणंद लोकल मंडी में 18 सक्रिय व्यापारी हैं और तत्काल UPI भुगतान मिल रहा है। अहमदाबाद में 500 किग्रा पर ₹13,500 शुद्ध मिलेंगे जबकि सूरत में भाड़े और गर्मी के कारण ₹11,850 ही मिलेंगे। सर्वोत्तम विकल्प: कल सुबह 04:30 बजे अहमदाबाद या आणंद लोकल यार्ड।'
    }
    if (currentLang === 'en') {
      return 'Realization recommendation: Anand local mandi has 18 active traders with same-day settlement. Dispatching to Ahmedabad yields ₹13,500 net for 500 kg, whereas Surat yields only ₹11,850 due to high diesel freight and midday heat shrinkage. Best window: Tomorrow 04:30 AM.'
    }
    return 'તમારા પ્રશ્નનું વિશ્લેષણ કરવામાં આવ્યું છે: આણંદ લોકલ મંડીમાં હાલ 18 સક્રિય વેપારીઓ છે અને સેમ-ડે UPI પેમેન્ટ મળી રહ્યું છે. 500 કિલો માટે અમદાવાદમાં ₹13,500 નેટ મળે છે જ્યારે સુરતમાં ભાડું અને ગરમીને કારણે ₹11,850 જ મળશે. શ્રેષ્ઠ વિકલ્પ: સવારે 04:30 AM અમદાવાદ અથવા આણંદ લોકલ યાર્ડ.'
  }

  function handleUserQuery(text: string) {
    if (!text.trim()) return
    const userMsg = text.trim()
    setInput('')
    const aiAnswer = getKnowledgeResponse(userMsg)

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Just now' },
      { sender: 'ai', text: aiAnswer, time: 'Just now' },
    ])
  }

  const handleToggleVoice = () => {
    if (typeof window === 'undefined') return
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec) {
      toast.info('Speech recognition not available on this browser. You can type your query.')
      return
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    try {
      const recognition = new SpeechRec()
      recognition.lang = currentLang === 'gu' ? 'gu-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
        toast.info('Listening... Speak now in Gujarati, Hindi or English')
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setIsListening(false)
        if (transcript) {
          handleUserQuery(transcript)
        }
      }

      recognition.onerror = () => {
        setIsListening(false)
        toast.error('Voice input cancelled or unavailable')
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch {
      setIsListening(false)
      toast.error('Could not initialize microphone')
    }
  }

  const handleSpeakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.info('Text-to-speech not supported on this browser.')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = currentLang === 'gu' ? 'gu-IN' : currentLang === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full h-[560px] shadow-2xl flex flex-col overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#236043] flex items-center justify-center shadow-xs">
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
            aria-label="Close assistant"
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
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs relative group ${
                  m.sender === 'user'
                    ? 'bg-[#184e36] text-white rounded-br-none'
                    : 'bg-white text-[#153424] border border-[#d6e5d3] rounded-bl-none'
                }`}
              >
                {m.text}
                {m.sender === 'ai' && (
                  <button
                    onClick={() => handleSpeakText(m.text)}
                    className="mt-1.5 pt-1.5 border-t border-[#e2ece0] w-full flex items-center gap-1 text-[10px] text-[#1b7340] font-semibold hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>સાંભળો / Listen</span>
                  </button>
                )}
              </div>
              <span className="text-[9px] text-[#789182] mt-0.5 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[#f0f6ee] border-t border-[#dce6dc] flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <button
            onClick={() => handleUserQuery('Can I wait till Saturday for higher rates?')}
            className="px-2.5 py-1 bg-white hover:bg-[#eaf4ea] rounded-full border border-[#cfe0cc] text-[#1c4d34] font-medium shrink-0 shadow-2xs"
          >
            Can I wait till Saturday?
          </button>
          <button
            onClick={() => handleUserQuery('Connect me with Magan mini-truck driver')}
            className="px-2.5 py-1 bg-white hover:bg-[#eaf4ea] rounded-full border border-[#cfe0cc] text-[#1c4d34] font-medium shrink-0 shadow-2xs"
          >
            Magan Driver Number
          </button>
          <button
            onClick={() => handleUserQuery('What are statutory GSAMB cess rates?')}
            className="px-2.5 py-1 bg-white hover:bg-[#eaf4ea] rounded-full border border-[#cfe0cc] text-[#1c4d34] font-medium shrink-0 shadow-2xs"
          >
            Mandi Cess Limits
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#dce6dc] flex items-center gap-2">
          <button
            onClick={handleToggleVoice}
            className={`p-2 rounded-full transition-all ${
              isListening
                ? 'bg-[#c5221f] text-white animate-pulse'
                : 'bg-[#f0f6ee] text-[#1b7340] hover:bg-[#e2f0e0]'
            }`}
            title={isListening ? 'Stop listening' : 'Voice input (Gujarati / Hindi / English)'}
            aria-label="Voice input"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUserQuery(input)}
            placeholder="તમારો પ્રશ્ન લખો અથવા પૂછો..."
            className="flex-1 px-3 py-2 text-xs bg-[#f8fbf7] border border-[#d2e2d0] rounded-full outline-none focus:border-[#1b7340]"
          />

          <button
            onClick={() => handleUserQuery(input)}
            disabled={!input.trim()}
            className="p-2 rounded-full bg-[#184e36] hover:bg-[#123e2b] disabled:opacity-40 text-white"
            aria-label="Send message"
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
  lots,
  activeLotId,
  onSelectLot,
  onOpenRegisterLot,
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  lots: HarvestLot[]
  activeLotId: string
  onSelectLot: (lot: HarvestLot) => void
  onOpenRegisterLot: () => void
  currentLang?: Language
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">
              {currentLang === 'gu' ? 'ચાલુ પાક (લોટ) બદલો' : currentLang === 'hi' ? 'सक्रिय फसल लॉट बदलें' : 'Select Harvest Lot for Telemetry'}
            </h3>
            <span className="text-[10px] text-[#a0cbaf]">
              {currentLang === 'gu' ? 'તમામ મંડી ભાવ અને નફા ગણતરી તુરંત બદલાશે' : currentLang === 'hi' ? 'सभी मंडी भाव व शुद्ध आय तुरंत अपडेट होगी' : 'Live telemetry & realization updates immediately'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 bg-[#f8fbf7] max-h-[400px] overflow-y-auto">
          {lots.map((lot) => {
            const isSelected = lot.id === activeLotId
            const lotName = currentLang === 'gu'
              ? (cropsList.find((c) => c.id === lot.baseCrop)?.labelGu || lot.crop)
              : currentLang === 'hi'
              ? (cropsList.find((c) => c.id === lot.baseCrop)?.labelHi || lot.crop)
              : lot.crop

            return (
              <div
                key={lot.id}
                onClick={() => {
                  onSelectLot(lot)
                  toast.success(`${lot.crop} ${currentLang === 'gu' ? 'સક્રિય થયેલ' : currentLang === 'hi' ? 'सक्रिय किया गया' : 'selected'}`)
                  onClose()
                }}
                className={`p-3.5 rounded-xl border cursor-pointer shadow-xs transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#edf6eb] border-2 border-[#1b7340]'
                    : 'bg-white border-[#d6e5d3] hover:border-[#1b7340]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs text-[#143825]">{lotName}</strong>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#e8f5e9] text-[#1e7e34]">
                      {lot.grade}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#556e60] mt-0.5">
                    {lot.id} • {lot.quantity} kg • {lot.location}, Gujarat • Moisture {lot.moisture}
                  </div>
                </div>

                <span className={`text-xs font-bold ${isSelected ? 'text-[#1b7340]' : 'text-[#506e5b]'}`}>
                  {isSelected ? (currentLang === 'gu' ? '✓ ચાલુ' : currentLang === 'hi' ? '✓ सक्रिय' : '✓ Active') : (currentLang === 'gu' ? 'પસંદ કરો ➔' : currentLang === 'hi' ? 'चुनें ➔' : 'Select ➔')}
                </span>
              </div>
            )
          })}
        </div>

        <div className="p-3 bg-white border-t border-[#dce6dc] flex justify-between items-center">
          <span className="text-[11px] text-[#556e60]">
            {currentLang === 'gu' ? 'નવી લણણી થયેલ છે?' : currentLang === 'hi' ? 'नई फसल की कटाई हुई है?' : 'Have a new harvest batch?'}
          </span>
          <button
            onClick={() => {
              onClose()
              onOpenRegisterLot()
            }}
            className="px-3 py-1.5 rounded-lg bg-[#184e36] text-white font-bold text-xs flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            {currentLang === 'gu' ? '+ નવો પાક ઉમેરો' : currentLang === 'hi' ? '+ नई फसल जोड़ें' : '+ Add New Lot'}
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. REGISTER NEW HARVEST LOT MODAL
export function RegisterLotModal({
  isOpen,
  onClose,
  onSaveLot,
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  onSaveLot: (lot: HarvestLot) => void
  currentLang?: Language
}) {
  const [selectedCrop, setSelectedCrop] = useState<any>(cropsList[0])
  const [quantity, setQuantity] = useState(600)
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A')
  const [location, setLocation] = useState('Anand')
  const [moisture, setMoisture] = useState('82%')
  const [plot, setPlot] = useState('Plot 3A, South Anand')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cropName =
      currentLang === 'gu'
        ? selectedCrop.labelGu
        : currentLang === 'hi'
        ? selectedCrop.labelHi
        : selectedCrop.labelEn

    const newLot: HarvestLot = {
      id: `LOT-${Math.floor(10 + Math.random() * 90)}`,
      crop: selectedCrop.labelEn,
      baseCrop: selectedCrop.id,
      quantity: Number(quantity),
      grade,
      location,
      moisture,
      farmPlot: plot,
      harvestDate: currentLang === 'gu' ? 'આજે' : currentLang === 'hi' ? 'आज' : 'Today',
      status: 'Ready',
    }
    onSaveLot(newLot)
    toast.success(
      currentLang === 'gu'
        ? `${cropName} (${newLot.quantity} કિલો) સફળતાપૂર્વક નોંધાયો!`
        : currentLang === 'hi'
        ? `${cropName} (${newLot.quantity} किग्रा) सफलतापूर्वक दर्ज हुआ!`
        : `Successfully registered ${newLot.crop} (${newLot.quantity} kg)!`
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">
              {currentLang === 'gu' ? 'નવો પાક લોટ નોંધણી કરો' : currentLang === 'hi' ? 'नया फसल लॉट दर्ज करें' : 'Register New Harvest Lot'}
            </h3>
            <span className="text-[10px] text-[#a0cbaf]">
              {currentLang === 'gu' ? 'એપીએમસી હરાજી ટેલિમેટ્રી માટે નવી ઉપજ ઉમેરો' : currentLang === 'hi' ? 'एपीएमसी नीलामी टेलीमेट्री हेतु नई उपज जोड़ें' : 'Add fresh crop batch for APMC auction telemetry'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 bg-[#fafcfa] text-xs">
          <div>
            <label className="block text-[#153424] font-bold mb-1">
              {currentLang === 'gu' ? 'પાક પ્રકાર' : currentLang === 'hi' ? 'फसल किस्म' : 'Crop Variety'}
            </label>
            <select
              value={selectedCrop.id}
              onChange={(e) => {
                const found = cropsList.find((c) => c.id === e.target.value)
                if (found) setSelectedCrop(found)
              }}
              className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
            >
              {cropsList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {currentLang === 'gu' ? c.labelGu : currentLang === 'hi' ? c.labelHi : c.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#153424] font-bold mb-1">
                {currentLang === 'gu' ? 'જથ્થો (કિલો)' : currentLang === 'hi' ? 'मात्रा (किग्रा)' : 'Quantity (kg)'}
              </label>
              <input
                type="number"
                min="50"
                max="50000"
                step="50"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
                required
              />
            </div>
            <div>
              <label className="block text-[#153424] font-bold mb-1">
                {currentLang === 'gu' ? 'ગુણવત્તા ગ્રેડ' : currentLang === 'hi' ? 'गुणवत्ता ग्रेड' : 'Quality Grade'}
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
              >
                <option value="Grade A">
                  {currentLang === 'gu' ? 'Grade A (ઉચ્ચ / નિકાસ સ્તર)' : currentLang === 'hi' ? 'Grade A (उच्च / निर्यात स्तर)' : 'Grade A (Firm / Export Sort)'}
                </option>
                <option value="Grade B">
                  {currentLang === 'gu' ? 'Grade B (સામાન્ય બજાર)' : currentLang === 'hi' ? 'Grade B (सामान्य मंडी)' : 'Grade B (Standard Market)'}
                </option>
                <option value="Grade C">
                  {currentLang === 'gu' ? 'Grade C (પ્રોસેસિંગ / પલ્પ)' : currentLang === 'hi' ? 'Grade C (प्रोसेसिंग / पल्प)' : 'Grade C (Processing / Pulp)'}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#153424] font-bold mb-1">
                {currentLang === 'gu' ? 'ખેતરનું સ્થળ' : currentLang === 'hi' ? 'खेत का स्थान' : 'Farm Location'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
                required
              />
            </div>
            <div>
              <label className="block text-[#153424] font-bold mb-1">
                {currentLang === 'gu' ? 'ભેજનું પ્રમાણ' : currentLang === 'hi' ? 'नमी सूचकांक' : 'Moisture Index'}
              </label>
              <input
                type="text"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#153424] font-bold mb-1">
              {currentLang === 'gu' ? 'પ્લોટ / ખેતર ખાતા નંબર' : currentLang === 'hi' ? 'प्लॉट / खसरा संख्या' : 'Farm Plot / Registry Name'}
            </label>
            <input
              type="text"
              value={plot}
              onChange={(e) => setPlot(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#cce0cb] text-[#2c533e] font-bold text-xs"
            >
              {currentLang === 'gu' ? 'રદ કરો' : currentLang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#143d2b] text-white font-bold text-xs shadow-xs"
            >
              {currentLang === 'gu' ? 'સાચવો અને સક્રિય કરો' : currentLang === 'hi' ? 'सहेजें व सक्रिय करें' : 'Save & Activate Lot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// 5. ROUTE PROTOCOL MODAL
export function RouteProtocolModal({
  isOpen,
  onClose,
  mandiName = 'Ahmedabad Wholesale Mandi (APMC Jamalpur)',
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  mandiName?: string
  currentLang?: Language
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#72f5b5]" />
            <h3 className="font-extrabold text-sm sm:text-base">
              {currentLang === 'gu' ? 'પરિવહન માર્ગ અને ગેટ એન્ટ્રી પ્રોટોકોલ' : currentLang === 'hi' ? 'परिवहन मार्ग एवं गेट एंट्री प्रोटोकॉल' : 'Transit Route & Gate Entry Protocol'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-[#203a2a] bg-[#fafcfa]">
          <div className="bg-[#eef7ec] p-3 rounded-xl border border-[#cbe2c8] space-y-1">
            <div className="font-bold text-[#153f2c]">{mandiName}</div>
            <div className="text-[11px] text-[#4d6657]">
              {currentLang === 'gu'
                ? 'ઉદ્ગમ: આણંદ ખેતર ➔ અંદાજિત સમય: ~૧ કલાક ૪૫ મિનિટ • NH-64 કોરિડોર'
                : currentLang === 'hi'
                ? 'मूल: आणंद खेत ➔ अनुमानित समय: ~1 घंटा 45 मिनट • NH-64 कॉरिडोर'
                : 'Origin: Anand Farm Plot ➔ Estimated Transit: ~1 hr 45 min • NH-64 Corridor'}
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1b7340] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="text-[#143825]">
                  {currentLang === 'gu' ? '04:30 AM રવાનગી (શ્રેષ્ઠ ઠંડક સમયગાળો)' : currentLang === 'hi' ? '04:30 AM प्रस्थान (शीतल तापमान विंडो)' : '04:30 AM Departure (Optimal Thermal Window)'}
                </strong>
                <p className="text-[11px] text-[#556e60] mt-0.5">
                  {currentLang === 'gu'
                    ? 'ટાટા એસમાં તાડપત્રી ઢાંકીને લોડિંગ કરો જેથી રસ્તામાં ભેજ સુકારો અટકી શકે.'
                    : currentLang === 'hi'
                    ? 'टाटा एस पर तिरपाल ढकें जिससे रास्ते में नमी उड़ने व वजन घटने से बचा जा सके।'
                    : 'Load Tata Ace with tarpaulin covering to prevent moisture transpiration in transit.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1b7340] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="text-[#143825]">
                  {currentLang === 'gu' ? '05:40 AM NH-64 ટોલ અને ફાસ્ટેગ કોરિડોર' : currentLang === 'hi' ? '05:40 AM NH-64 टोल एवं फास्टैग कॉरिडोर' : '05:40 AM NH-64 Toll & Fastag Corridor'}
                </strong>
                <p className="text-[11px] text-[#556e60] mt-0.5">
                  {currentLang === 'gu'
                    ? 'બારેજા થઈને સીધો માર્ગ. લાઈવ ટ્રાફિક: લીલો (કોઈ અડચણ નહીં).'
                    : currentLang === 'hi'
                    ? 'बारेजा होते हुए सीधा रास्ता। लाइव ट्रैफिक: हरा (कोई रुकावट नहीं)।'
                    : 'Direct corridor via Bareja. Live traffic index: Green (zero bottle-neck).'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#1b7340] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="text-[#143825]">
                  {currentLang === 'gu' ? '06:15 AM APMC ગેટ #3 એન્ટ્રી અને લોટ નોંધણી' : currentLang === 'hi' ? '06:15 AM APMC गेट #3 एंट्री व लॉट रजिस्ट्रेशन' : '06:15 AM APMC Gate #3 Entry & Lot Registration'}
                </strong>
                <p className="text-[11px] text-[#556e60] mt-0.5">
                  {currentLang === 'gu'
                    ? 'પ્રાથમિકતા વજન માટે કિસાન બહી ટોકન બતાવો. પ્રથમ હરાજી સવારે 06:45 શરૂ થાય છે.'
                    : currentLang === 'hi'
                    ? 'प्राथमिकता तौल हेतु किसान बही टोकन दिखाएं। पहली नीलामी सुबह 06:45 बजे शुरू होगी।'
                    : 'Present Kisan Bahi Slip token for priority weighing. First-line auction begins 06:45 AM.'}
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
            {currentLang === 'gu' ? 'સમજાયું અને બંધ કરો' : currentLang === 'hi' ? 'स्वीकार करें व बंद करें' : 'Acknowledge & Close'}
          </button>
        </div>
      </div>
    </div>
  )
}

// 6. BOOK MINI-TRUCK LOGISTICS MODAL
export function BookDriverModal({
  isOpen,
  onClose,
  lotQuantity,
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  lotQuantity: number
  currentLang?: Language
}) {
  const [pickupTime, setPickupTime] = useState('04:30 AM Tomorrow')
  const [hasTarp, setHasTarp] = useState(true)

  if (!isOpen) return null

  const handleConfirmBooking = () => {
    toast.success(
      currentLang === 'gu'
        ? `મગનભાઈ બુક થઈ ગયા! વાહન GJ-23-AT-8492 સમય: ${pickupTime}`
        : currentLang === 'hi'
        ? `मगन भाई बुक हो गए! वाहन GJ-23-AT-8492 समय: ${pickupTime}`
        : `Magan Bhai booked successfully! Vehicle GJ-23-AT-8492 scheduled for ${pickupTime}`
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#72f5b5]" />
            <h3 className="font-extrabold text-sm sm:text-base">
              {currentLang === 'gu' ? 'મિની ટ્રક / છોટા હાથી બુક કરો' : currentLang === 'hi' ? 'मिनी ट्रक / छोटा हाथी बुक करें' : 'Book Mini-Truck Logistics'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 bg-[#fafcfa] text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#d6e5d3] space-y-1">
            <strong className="text-sm text-[#143825] block">
              {currentLang === 'gu' ? 'મગનભાઈ (ટાટા એસ છોટા હાથી)' : currentLang === 'hi' ? 'मगन भाई (टाटा एस छोटा हाथी)' : 'Magan Bhai (Tata Ace Chota Hathi)'}
            </strong>
            <div className="text-[11px] text-[#556e60]">
              {currentLang === 'gu' ? 'નંબર: GJ-23-AT-8492 • મોગરી ચોકડી (૩ કિમી દૂર)' : currentLang === 'hi' ? 'नंबर: GJ-23-AT-8492 • मोगरी चौकड़ी (3 किमी दूर)' : 'Reg: GJ-23-AT-8492 • Mogri Chowkdi (3 km away)'}
            </div>
            <div className="text-[11px] text-[#1b7340] font-semibold mt-1">
              ✓ {currentLang === 'gu' ? 'ચકાસાયેલ કૃષિ ટ્રાન્સપોર્ટર • 4.9 ★ રેટિંગ' : currentLang === 'hi' ? 'सत्यापित कृषि ट्रांसपोर्टर • 4.9 ★ रेटिंग' : 'Verified KrishiTransporter • 4.9 ★ Rating'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-[#f0f6ee] rounded-xl border border-[#d2e2d0]">
              <span className="text-[#648070] text-[10px] block">
                {currentLang === 'gu' ? 'વહન ક્ષમતા' : currentLang === 'hi' ? 'भार क्षमता' : 'Carrying Capacity'}
              </span>
              <strong className="text-[#143224]">1,000 kg (40 Crates)</strong>
            </div>
            <div className="p-2.5 bg-[#f0f6ee] rounded-xl border border-[#d2e2d0]">
              <span className="text-[#648070] text-[10px] block">
                {currentLang === 'gu' ? 'આણંદ ➔ અમદાવાદ ભાડું' : currentLang === 'hi' ? 'आणंद ➔ अहमदाबाद भाड़ा' : 'Anand ➔ Ahmedabad Tariff'}
              </span>
              <strong className="text-[#143224]">₹900 {currentLang === 'gu' ? 'નક્કી ભાડું' : currentLang === 'hi' ? 'निश्चित भाड़ा' : 'Fixed Tariff'}</strong>
            </div>
          </div>

          <div>
            <label className="block text-[#153424] font-bold mb-1">
              {currentLang === 'gu' ? 'ઉપાડવાનો સમય (પિકઅપ)' : currentLang === 'hi' ? 'पिकअप समय' : 'Pickup Schedule'}
            </label>
            <select
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
            >
              <option value="04:30 AM Tomorrow">
                {currentLang === 'gu' ? 'આવતીકાલે 04:30 AM (ઉત્તમ ઠંડી હવા)' : currentLang === 'hi' ? 'कल 04:30 AM (अनुकूल शीतल समय)' : '04:30 AM Tomorrow (Optimal Cool Window)'}
              </option>
              <option value="05:15 AM Tomorrow">
                {currentLang === 'gu' ? 'આવતીકાલે 05:15 AM' : currentLang === 'hi' ? 'कल 05:15 AM' : '05:15 AM Tomorrow'}
              </option>
              <option value="06:00 AM Tomorrow">
                {currentLang === 'gu' ? 'આવતીકાલે 06:00 AM' : currentLang === 'hi' ? 'कल 06:00 AM' : '06:00 AM Tomorrow'}
              </option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={hasTarp}
              onChange={(e) => setHasTarp(e.target.checked)}
              className="accent-[#184e36]"
            />
            <span className="text-[11px] text-[#3d5648]">
              {currentLang === 'gu'
                ? 'તાડપત્રી સુરક્ષા કવર સામેલ છે (ભાડામાં શામેલ)'
                : currentLang === 'hi'
                ? 'तिरपाल थर्मल कवर अनुरोध (भाड़े में शामिल)'
                : 'Tarpaulin thermal cover requested (Included in rate)'}
            </span>
          </label>

          <div className="pt-2 flex items-center justify-between gap-2">
            <a
              href="tel:+919825041289"
              className="px-3 py-2 rounded-xl bg-white border border-[#cce0cb] text-[#1e5238] font-bold text-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              {currentLang === 'gu' ? 'મગનભાઈને કોલ કરો' : currentLang === 'hi' ? 'मगन भाई को कॉल करें' : 'Call Magan Bhai'}
            </a>

            <button
              onClick={handleConfirmBooking}
              className="px-4 py-2 rounded-xl bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs shadow-xs"
            >
              {currentLang === 'gu' ? 'બુકિંગ કન્ફર્મ કરો' : currentLang === 'hi' ? 'बुकिंग कन्फर्म करें' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 7. BOOK COLD STORAGE CHAMBER MODAL
export function BookColdStorageModal({
  isOpen,
  onClose,
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  currentLang?: Language
}) {
  const [crates, setCrates] = useState(20)
  const [days, setDays] = useState(3)

  if (!isOpen) return null

  const dailyFee = 1.2
  const totalCost = Math.round(crates * days * dailyFee)

  const handleConfirm = () => {
    toast.success(
      currentLang === 'gu'
        ? `ચીખોદરા એગ્રી કોલ્ડ ચેમ્બર ${crates} કેરેટ (${days} દિવસ) માટે બુક થઈ! ટોકન: #CC-4190`
        : currentLang === 'hi'
        ? `चिखोदरा एग्री कोल्ड चैंबर ${crates} क्रेट (${days} दिन) हेतु आरक्षित! टोकन: #CC-4190`
        : `Chikhodra Agri Chamber reserved for ${crates} crates (${days} days)! Token: #CC-4190`
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#72f5b5]" />
            <h3 className="font-extrabold text-sm sm:text-base">
              {currentLang === 'gu' ? 'કોલ્ડ સ્ટોરેજ ચેમ્બર બુકિંગ' : currentLang === 'hi' ? 'कोल्ड स्टोरेज चैंबर आरक्षण' : 'Cold Chamber Reservation'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 bg-[#fafcfa] text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#d6e5d3] space-y-1">
            <strong className="text-sm text-[#143825] block">
              {currentLang === 'gu' ? 'ચીખોદરા એગ્રી કોલ્ડ ચેમ્બર' : currentLang === 'hi' ? 'चिखोदरा एग्री कोल्ड चैंबर' : 'Chikhodra Agri Cold Chamber'}
            </strong>
            <div className="text-[11px] text-[#556e60]">
              {currentLang === 'gu' ? 'NH-48 બાયપાસ, ચીખોદરા • આણંદ કેન્દ્રથી ૭ કિમી' : currentLang === 'hi' ? 'NH-48 बाईपास, चिखोदरा • आणंद केंद्र से 7 किमी' : 'NH-48 Bypass, Chikhodra • 7 km from Anand Hub'}
            </div>
            <div className="text-[11px] text-[#0d47a1] font-semibold mt-1">
              ✓ {currentLang === 'gu' ? 'તાપમાન: 12°C - 14°C (પ્રી-કૂલિંગ અને ભેજ નિયંત્રિત)' : currentLang === 'hi' ? 'तापमान: 12°C - 14°C (प्री-कूलिंग एवं आर्द्रता नियंत्रित)' : 'Temperature: 12°C - 14°C (Pre-cooling & humidity controlled)'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[#153424] font-bold mb-1">
                {currentLang === 'gu' ? 'કેરેટની સંખ્યા' : currentLang === 'hi' ? 'क्रेट की संख्या' : 'Crates to Store'}
              </label>
              <input
                type="number"
                min="5"
                max="200"
                value={crates}
                onChange={(e) => setCrates(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
              />
            </div>
            <div>
              <label className="block text-[#153424] font-bold mb-1">
                {currentLang === 'gu' ? 'સંગ્રહ દિવસો' : currentLang === 'hi' ? 'भंडारण दिन' : 'Storage Duration (Days)'}
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#eef7ec] rounded-xl border border-[#cbe2c8] flex justify-between items-center text-xs">
            <div>
              <span className="text-[10px] text-[#4d6657] block">
                {currentLang === 'gu' ? 'અંદાજિત ચેમ્બર ભાડું' : currentLang === 'hi' ? 'अनुमानित चैंबर शुल्क' : 'Estimated Chamber Fee'}
              </span>
              <strong className="text-sm text-[#143825]">
                ₹{totalCost} {currentLang === 'gu' ? 'કુલ (₹૧.૨૦/કેરેટ/દિવસ)' : currentLang === 'hi' ? 'कुल (₹1.20/क्रेट/दिन)' : 'total (₹1.20/crate/day)'}
              </strong>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#1b7340]">
              {currentLang === 'gu' ? 'શૂન્ય સુકારો' : currentLang === 'hi' ? 'शून्य वजन घट' : 'Zero Shrinkage'}
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#cce0cb] text-[#2c533e] font-bold text-xs"
            >
              {currentLang === 'gu' ? 'રદ કરો' : currentLang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl bg-[#143d2b] text-white font-bold text-xs shadow-xs"
            >
              {currentLang === 'gu' ? 'બુકિંગ કન્ફર્મ કરો' : currentLang === 'hi' ? 'आरक्षण कन्फर्म करें' : 'Confirm Reservation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 8. FPO POOL DISPATCH MODAL
export function FpoPoolModal({
  isOpen,
  onClose,
  lotQuantity,
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  lotQuantity: number
  currentLang?: Language
}) {
  if (!isOpen) return null

  const handleConfirm = () => {
    toast.success(
      currentLang === 'gu'
        ? `તમારો ${lotQuantity} કિલોનો લોટ એફપીઓ બેચ #FPO-OCT-09 માં ઉમેરાયો! ટ્રક 05:00 AM ઉપડશે.`
        : currentLang === 'hi'
        ? `आपका ${lotQuantity} किग्रा लॉट एफपीओ बैच #FPO-OCT-09 में शामिल हुआ! ट्रक 05:00 AM रवाना होगा।`
        : `Your ${lotQuantity} kg lot added to FPO Batch #FPO-OCT-09! Truck departs 05:00 AM.`
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#72f5b5]" />
            <h3 className="font-extrabold text-sm sm:text-base">
              {currentLang === 'gu' ? 'આણંદ એફપીઓ સંયુક્ત પરિવહન' : currentLang === 'hi' ? 'आणंद एफपीओ संयुक्त परिवहन' : 'Anand FPO Shared Dispatch'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 bg-[#fafcfa] text-xs">
          <div className="p-3 bg-[#143828] text-white rounded-xl border border-[#25523d] space-y-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#276e4b] text-[#75f8ba]">
              BATCH #FPO-OCT-09
            </span>
            <div className="font-bold text-sm mt-1">
              {currentLang === 'gu' ? 'આણંદ ટામેટા ઉત્પાદક કંપની લિમિટેડ' : currentLang === 'hi' ? 'आणंद टमाटर उत्पादक कंपनी लिमिटेड' : 'Anand Tomato Producer Company Ltd'}
            </div>
            <div className="text-[11px] text-[#a4c9b6]">
              {currentLang === 'gu' ? '૧૫ સભ્ય ખેડૂતો • ૭,૫૦૦ કિલો એકત્રિત માલ' : currentLang === 'hi' ? '15 सदस्य किसान • 7,500 किग्रा समेकित बैच' : '15 member farmers • 7,500 kg consolidated batch'}
            </div>
          </div>

          <div className="p-3 bg-[#eef7ec] rounded-xl border border-[#cbe2c8] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#556e60]">{currentLang === 'gu' ? 'તમારો ફાળો:' : currentLang === 'hi' ? 'आपका योगदान:' : 'Your Contribution:'}</span>
              <strong className="text-[#143825]">{lotQuantity} kg</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#556e60]">{currentLang === 'gu' ? 'ભાડામાં બચત:' : currentLang === 'hi' ? 'भाड़े में छूट:' : 'Freight Discount:'}</span>
              <strong className="text-[#1b7340]">-30% {currentLang === 'gu' ? 'સામૂહિક બચત' : currentLang === 'hi' ? 'साझा बचत' : 'Shared Economy'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#556e60]">{currentLang === 'gu' ? 'માલ ચઢાવવાનું સ્થળ:' : currentLang === 'hi' ? 'लोडिंग स्थल:' : 'Pickup Location:'}</span>
              <span className="text-[#143825]">
                {currentLang === 'gu' ? 'મોગરી એફપીઓ યાર્ડ (04:45 AM)' : currentLang === 'hi' ? 'मोगरी एफपीओ यार्ड (04:45 AM)' : 'Mogri FPO Aggregation Yard (04:45 AM)'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#cce0cb] text-[#2c533e] font-bold text-xs"
            >
              {currentLang === 'gu' ? 'રદ કરો' : currentLang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-xl bg-[#143d2b] text-white font-bold text-xs shadow-xs"
            >
              {currentLang === 'gu' ? 'ભાગીદારી કન્ફર્મ કરો' : currentLang === 'hi' ? 'भागीदारी कन्फर्म करें' : 'Confirm Participation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 9. BUYER CONTACT & OUTREACH MODAL
export function BuyerContactModal({
  isOpen,
  onClose,
  buyer,
  lot,
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  buyer: any
  lot: HarvestLot
  currentLang?: Language
}) {
  if (!isOpen || !buyer) return null

  const lotName = currentLang === 'gu'
    ? (cropsList.find((c) => c.id === lot.baseCrop)?.labelGu || lot.crop)
    : currentLang === 'hi'
    ? (cropsList.find((c) => c.id === lot.baseCrop)?.labelHi || lot.crop)
    : lot.crop

  const prefilledPitch =
    currentLang === 'gu'
      ? `નમસ્તે ${buyer.name}, હું આણંદથી રમેશ પટેલ વાત કરું છું. મારી પાસે તૈયાર ઉપજ છે: ${lotName} (${lot.quantity} કિલો, ${lot.grade}) તાત્કાલિક રવાનગી માટે ઉપલબ્ધ છે. કૃપા કરીને તમારો ખરીદ ભાવ અને અનલોડિંગ સ્લોટ જણાવો.`
      : currentLang === 'hi'
      ? `नमस्ते ${buyer.name}, मैं आणंद से रमेश पटेल बोल रहा हूँ। मेरे पास तैयार फसल उपलब्ध है: ${lotName} (${lot.quantity} किग्रा, ${lot.grade}) तत्काल डिलीवरी हेतु। कृपया अपना खरीद भाव व अनलोडिंग समय बताएं।`
      : `Namaste ${buyer.name}, I am Ramesh Patel from Anand. I have an active lot ready: ${lot.crop} (${lot.quantity} kg, ${lot.grade}) available for immediate dispatch. Please confirm your procurement rate and unloading slot.`

  const handleWhatsApp = () => {
    const cleanPhone = buyer.phone.replace(/[^0-9]/g, '')
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(prefilledPitch)}`
    window.open(url, '_blank')
    toast.success(
      currentLang === 'gu'
        ? `${buyer.name} સાથે વોટ્સએપ પર કનેક્ટ થયા!`
        : currentLang === 'hi'
        ? `${buyer.name} से व्हाट्सएप पर संपर्क स्थापित!`
        : `Connected to ${buyer.name} on WhatsApp!`
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">
              {currentLang === 'gu' ? 'ચકાસાયેલ ખરીદદાર સંપર્ક' : currentLang === 'hi' ? 'सत्यापित खरीदार संपर्क' : 'Verified Buyer Contact'}
            </h3>
            <span className="text-[10px] text-[#a0cbaf]">
              {currentLang === 'gu' ? 'એપીએમસી નોંધાયેલ વેપારી • એસ્ક્રો સુરક્ષિત' : currentLang === 'hi' ? 'एपीएमसी पंजीकृत व्यापारी • एस्क्रो सुरक्षित' : 'APMC Registered Merchant • Escrow Protected'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 bg-[#fafcfa] text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#d6e5d3] space-y-1">
            <strong className="text-base text-[#143825] block">{buyer.name}</strong>
            <div className="text-[11px] text-[#556e60]">{buyer.type} • {buyer.city}</div>
            <div className="text-[11px] font-semibold text-[#1b7340] mt-1">
              {currentLang === 'gu' ? 'ભાવ ઓફર:' : currentLang === 'hi' ? 'प्रस्तावित भाव:' : 'Quote:'} {buyer.priceQuote}
            </div>
          </div>

          <div className="p-3 bg-[#f8fbf7] rounded-xl border border-[#e1ece0] space-y-1">
            <span className="text-[10px] font-bold text-[#60776b] uppercase block">
              {currentLang === 'gu' ? 'વેચાણ સંદેશ (ડ્રાફ્ટ)' : currentLang === 'hi' ? 'व्यापार संदेश (प्रारूप)' : 'Draft Trade Pitch'}
            </span>
            <p className="text-[11px] text-[#2d563e] italic">{prefilledPitch}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href={`tel:${buyer.phone}`}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#f6faf4] border border-[#cbe0c7] text-[#1c4d34] font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
            >
              <Phone className="w-3.5 h-3.5" />
              {currentLang === 'gu' ? 'કોલ કરો' : currentLang === 'hi' ? 'कॉल करें' : 'Call'} ({buyer.phone})
            </a>

            <button
              onClick={handleWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-[#143d2b] hover:bg-[#0c261b] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#72f5b5]" />
              {currentLang === 'gu' ? 'વોટ્સએપ ખોલો' : currentLang === 'hi' ? 'व्हाट्सएप खोलें' : 'Open WhatsApp'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 10. MANDI CESS SCHEDULE VIEWER MODAL
export function MandiCessModal({
  isOpen,
  onClose,
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  currentLang?: Language
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#72f5b5]" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {currentLang === 'gu' ? 'GSAMB સત્તાવાર એપીએમસી સેસ દરો' : currentLang === 'hi' ? 'GSAMB वैधानिक एपीएमसी सेस अनुसूची' : 'GSAMB Statutory APMC Cess Schedule'}
              </h3>
              <span className="text-[10px] text-[#a0cbaf]">
                {currentLang === 'gu' ? 'ગુજરાત કૃષિ માર્કેટિંગ બોર્ડ સત્તાવાર પરિપત્ર 2026' : currentLang === 'hi' ? 'गुजरात कृषि विपणन बोर्ड आधिकारिक आदेश 2026' : 'Gujarat Agricultural Marketing Board Official Order 2026'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 bg-[#fafcfa] text-xs">
          <p className="text-[11px] text-[#556e60]">
            {currentLang === 'gu'
              ? 'ગુજરાત કૃષિ ઉત્પાદન બજાર અધિનિયમ હેઠળ તમામ અધિકૃત હરાજી યાર્ડમાં નીચે મુજબના વૈધાનિક દરો લાગુ પડે છે:'
              : currentLang === 'hi'
              ? 'गुजरात कृषि उपज मंडी अधिनियम के अंतर्गत सभी अधिकृत नीलामी प्रांगणों में निम्नलिखित वैधानिक दरें लागू हैं:'
              : 'Under the Gujarat Agricultural Produce Markets Act, the following statutory tariffs apply to all verified farm-gate auction yards:'}
          </p>

          <div className="border border-[#d6e3d3] rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#edf4ec] text-[#143825] font-bold">
                <tr>
                  <th className="p-2.5">{currentLang === 'gu' ? 'ચાર્જ ઘટક' : currentLang === 'hi' ? 'शुल्क मद' : 'Charge Component'}</th>
                  <th className="p-2.5">{currentLang === 'gu' ? 'મહત્તમ મર્યાદા' : currentLang === 'hi' ? 'वैधानिक सीमा' : 'Statutory Cap'}</th>
                  <th className="p-2.5">{currentLang === 'gu' ? 'લાગુ નિયમ' : currentLang === 'hi' ? 'लागू नियम' : 'Applicability'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2ede0]">
                <tr>
                  <td className="p-2.5 font-medium">
                    {currentLang === 'gu' ? 'મંડી વિકાસ સેસ' : currentLang === 'hi' ? 'मंडी विकास सेस' : 'Mandi Development Cess'}
                  </td>
                  <td className="p-2.5 font-bold text-[#1b7340]">0.8% of Gross</td>
                  <td className="p-2.5 text-[#556e60]">
                    {currentLang === 'gu' ? 'ખેડૂત ચુકવણી હિસાબ' : currentLang === 'hi' ? 'किसान भुगतान' : 'Farmer Settlement'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">
                    {currentLang === 'gu' ? 'માર્કેટ ખરીદદાર ફી' : currentLang === 'hi' ? 'बाजार क्रेता शुल्क' : 'Market Buyer Fee'}
                  </td>
                  <td className="p-2.5 font-bold text-[#1b7340]">1.2% of Gross</td>
                  <td className="p-2.5 text-[#556e60]">
                    {currentLang === 'gu' ? 'માત્ર ખરીદદાર પર લાગુ' : currentLang === 'hi' ? 'केवल क्रेता पर देय' : 'Levied on Buyer only'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">
                    {currentLang === 'gu' ? 'હમાલી (ઉતરાઈ અને તોલામણી)' : currentLang === 'hi' ? 'हमाली (उतराई व तुलाई)' : 'Hamali (Unloading & Weighing)'}
                  </td>
                  <td className="p-2.5 font-bold text-[#1b7340]">₹25–₹30 / Qtl</td>
                  <td className="p-2.5 text-[#556e60]">
                    {currentLang === 'gu' ? 'યાર્ડ નિયત દર' : currentLang === 'hi' ? 'प्रांगण निर्धारित दर' : 'Fixed Yard Rate'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">
                    {currentLang === 'gu' ? 'ખેડૂત ગેટ એન્ટ્રી ટોલ' : currentLang === 'hi' ? 'किसान गेट प्रवेश शुल्क' : 'Farmer Gate Entry Toll'}
                  </td>
                  <td className="p-2.5 font-bold text-[#1e7e34]">₹0.00 ({currentLang === 'gu' ? 'મુક્ત' : currentLang === 'hi' ? 'मुक्त' : 'EXEMPT'})</td>
                  <td className="p-2.5 text-[#556e60]">
                    {currentLang === 'gu' ? 'શૂન્ય પ્રવેશ ફી' : currentLang === 'hi' ? 'शून्य प्रवेश शुल्क' : 'Zero Entry Charge'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#f0f6ee] rounded-xl border border-[#d2e2d0] text-[11px] text-[#4d6657]">
            <strong>{currentLang === 'gu' ? 'ટોલ-ફ્રી ફરિયાદ હેલ્પલાઇન:' : currentLang === 'hi' ? 'टोल-फ्री शिकायत हेल्पलाइन:' : 'Toll-Free Grievance Helpline:'}</strong> 1800-233-0242 ({currentLang === 'gu' ? 'ગુજરાત કૃષિ બજાર નિયામક કચેરી' : currentLang === 'hi' ? 'गुजरात कृषि विपणन निदेशालय' : 'Gujarat Agri Marketing Directorate'})
          </div>
        </div>

        <div className="bg-[#f0f5ee] p-3 border-t border-[#dce6dc] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#143d2b] text-white font-bold text-xs"
          >
            {currentLang === 'gu' ? 'બંધ કરો' : currentLang === 'hi' ? 'बंद करें' : 'Close Schedule'}
          </button>
        </div>
      </div>
    </div>
  )
}

// 11. DISPUTE MANDI RATE GRIEVANCE MODAL
export function DisputeRateModal({
  isOpen,
  onClose,
  currentLang = 'en',
}: {
  isOpen: boolean
  onClose: () => void
  currentLang?: Language
}) {
  const [mandi, setMandi] = useState('Anand Local APMC')
  const [issue, setIssue] = useState('Improper hamali deduction or under-quoting')
  const [details, setDetails] = useState('')

  if (!isOpen) return null

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(
      currentLang === 'gu'
        ? 'ફરિયાદ સફળતાપૂર્વક નોંધાઈ ગઈ! કેસ ટિકિટ #GRV-9021 આણંદ જિલ્લા ખેતીવાડી નિરીક્ષકને મોકલાઈ.'
        : currentLang === 'hi'
        ? 'शिकायत सफलतापूर्वक दर्ज! केस टिकट #GRV-9021 आणंद जिला कृषि निरीक्षक को प्रेषित।'
        : 'Grievance filed successfully! Case Ticket #GRV-9021 sent to Anand District Agri Inspector.'
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#cfe0cc] animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#143d2b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#f5d76e]" />
            <h3 className="font-extrabold text-sm sm:text-base">
              {currentLang === 'gu' ? 'મંડી ભાવ / કપાત ફરિયાદ નોંધાવો' : currentLang === 'hi' ? 'मंडी दर / कटौती शिकायत दर्ज करें' : 'File Mandi Rate Grievance'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-white/80 hover:text-white" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleDisputeSubmit} className="p-5 space-y-3.5 bg-[#fafcfa] text-xs">
          <div>
            <label className="block text-[#153424] font-bold mb-1">
              {currentLang === 'gu' ? 'સંબંધિત મંડી યાર્ડ' : currentLang === 'hi' ? 'संबंधित मंडी प्रांगण' : 'Target Mandi Yard'}
            </label>
            <select
              value={mandi}
              onChange={(e) => setMandi(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
            >
              <option value="Anand Local APMC">
                {currentLang === 'gu' ? 'આણંદ લોકલ એપીએમસી' : currentLang === 'hi' ? 'आणंद स्थानीय एपीएमसी' : 'Anand Local APMC'}
              </option>
              <option value="Ahmedabad Wholesale Mandi">
                {currentLang === 'gu' ? 'અમદાવાદ જથ્થાબંધ મંડી (જમાલપુર)' : currentLang === 'hi' ? 'अहमदाबाद थोक मंडी (जमालपुर)' : 'Ahmedabad Wholesale Mandi (Jamalpur)'}
              </option>
              <option value="Vadodara Sayajipura APMC">
                {currentLang === 'gu' ? 'વડોદરા સયાજીપુરા એપીએમસી' : currentLang === 'hi' ? 'वडोदरा सयाजीपुरा एपीएमसी' : 'Vadodara Sayajipura APMC'}
              </option>
              <option value="Surat Majura Gate APMC">
                {currentLang === 'gu' ? 'સુરત મજુરા ગેટ એપીએમસી' : currentLang === 'hi' ? 'सूरत मजूरा गेट एपीएमसी' : 'Surat Majura Gate APMC'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[#153424] font-bold mb-1">
              {currentLang === 'gu' ? 'ફરિયાદનો પ્રકાર' : currentLang === 'hi' ? 'शिकायत की श्रेणी' : 'Issue Category'}
            </label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224]"
            >
              <option value="Improper hamali deduction or under-quoting">
                {currentLang === 'gu' ? 'વધારે પડતી હમાલી અથવા તોલામણી કપાત' : currentLang === 'hi' ? 'अत्यधिक हमाली या तुलाई कटौती' : 'Excessive hamali or weighbridge fee'}
              </option>
              <option value="Auction quote below declared modal price">
                {currentLang === 'gu' ? 'મોડલ ભાવ કરતાં ઓછો હરાજી ભાવ આપવો' : currentLang === 'hi' ? 'घोषित मॉडल भाव से कम में बोली लगाना' : 'Auction price settled below modal floor'}
              </option>
              <option value="Delay in same-day UPI/cash payout">
                {currentLang === 'gu' ? 'તે જ દિવસે ચુકવણી કરવામાં વિલંબ' : currentLang === 'hi' ? 'उसी दिन भुगतान करने में अनावश्यक देरी' : 'Unreasonable delay in payment settlement'}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-[#153424] font-bold mb-1">
              {currentLang === 'gu' ? 'વિગત / હરાજી સ્લિપ / વેપારી નોંધ' : currentLang === 'hi' ? 'विवरण / नीलामी पर्ची / व्यापारी विवरण' : 'Details & Auction Slip / Trader Note'}
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={
                currentLang === 'gu'
                  ? 'હરાજી લોટ નંબર, વેપારીનું નામ અથવા ફરિયાદ વિગત લખો...'
                  : currentLang === 'hi'
                  ? 'नीलामी लॉट संख्या, व्यापारी का नाम अथवा समस्या का विवरण लिखें...'
                  : 'Enter auction lot number, trader name or description...'
              }
              className="w-full p-2.5 bg-white border border-[#cde0cb] rounded-xl text-xs text-[#143224] resize-none"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#cce0cb] text-[#2c533e] font-bold text-xs"
            >
              {currentLang === 'gu' ? 'રદ કરો' : currentLang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#c5221f] text-white font-bold text-xs shadow-xs"
            >
              {currentLang === 'gu' ? 'ફરિયાદ સબમિટ કરો' : currentLang === 'hi' ? 'शिकायत दर्ज करें' : 'Submit Grievance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

