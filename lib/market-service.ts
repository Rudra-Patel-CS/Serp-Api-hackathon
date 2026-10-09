export type Role = 'farmer' | 'fpo' | 'buyer'

export type Crop = 'Tomato' | 'Onion' | 'Potato' | 'Wheat' | 'Cotton' | 'Groundnut'

export interface HarvestLot {
  id: string
  crop: string
  baseCrop: Crop
  quantity: number // in kg
  grade: 'Grade A' | 'Grade B' | 'Grade C'
  location: string
  moisture: string
  farmPlot: string
  harvestDate: string
  status: 'Ready' | 'Dispatched' | 'Sold'
}

export interface MandiCalculation {
  id: string
  name: string
  nameGu: string
  nameHi: string
  distanceKm: number
  transitTime: string
  grossPerQtl: number
  freightPerQtl: number
  handlingPerQtl: number
  shrinkagePerQtl: number
  cessPerQtl: number
  netPerQtl: number
  totalGross: number
  totalFreight: number
  totalHandling: number
  totalCess: number
  totalShrinkage: number
  totalNet: number
  opportunityScore: number
  statusBadge: string
  badgeVariant: 'recommended' | 'warning' | 'neutral'
  buyerCount: number
  paymentSpeed: string
  turnaroundTime: string
  notes: string
}

export const cropsList: { id: Crop; labelEn: string; labelGu: string; labelHi: string; icon: string }[] = [
  { id: 'Tomato', labelEn: 'Tomato (Tameta)', labelGu: 'ટામેટા (ટમેટા)', labelHi: 'टमाटर (Tameta)', icon: '🍅' },
  { id: 'Onion', labelEn: 'Red Onion (Dungri)', labelGu: 'લાલ ડુંગળી (કાંદા)', labelHi: 'लाल प्याज', icon: '🧅' },
  { id: 'Potato', labelEn: 'Potato (Bataka)', labelGu: 'બટાકા (બટાટા)', labelHi: 'आलू', icon: '🥔' },
  { id: 'Wheat', labelEn: 'Sharbati Wheat (Ghau)', labelGu: 'શરબતી ઘઉં', labelHi: 'शरबती गेहूं', icon: '🌾' },
  { id: 'Cotton', labelEn: 'Shankar Cotton (Kapas)', labelGu: 'શંકર કપાસ', labelHi: 'कपास (कॉटन)', icon: '☁️' },
  { id: 'Groundnut', labelEn: 'Groundnut (Magfali)', labelGu: 'મગફળી', labelHi: 'मूंगफली', icon: '🥜' },
]

export const baseMarketRates: Record<Crop, { grossBase: number; shelfLifeDays: number; heatSensitivity: number }> = {
  Tomato: { grossBase: 2850, shelfLifeDays: 4, heatSensitivity: 1.0 },
  Onion: { grossBase: 2150, shelfLifeDays: 20, heatSensitivity: 0.3 },
  Potato: { grossBase: 1950, shelfLifeDays: 30, heatSensitivity: 0.2 },
  Wheat: { grossBase: 2900, shelfLifeDays: 180, heatSensitivity: 0.05 },
  Cotton: { grossBase: 7600, shelfLifeDays: 120, heatSensitivity: 0.05 },
  Groundnut: { grossBase: 6700, shelfLifeDays: 90, heatSensitivity: 0.1 },
}

export const initialLots: HarvestLot[] = [
  {
    id: 'LOT-04',
    crop: 'Tomato (Tameta)',
    baseCrop: 'Tomato',
    quantity: 500,
    grade: 'Grade A',
    location: 'Anand',
    moisture: '84%',
    farmPlot: 'Field Plot 2B, Anand Taluka',
    harvestDate: 'Yesterday',
    status: 'Ready',
  },
  {
    id: 'LOT-05',
    crop: 'Red Onion (ડુંગળી)',
    baseCrop: 'Onion',
    quantity: 1200,
    grade: 'Grade B',
    location: 'Anand',
    moisture: '14%',
    farmPlot: 'Plot 1A, Mogri Belt',
    harvestDate: '07 Oct 2026',
    status: 'Ready',
  },
  {
    id: 'LOT-06',
    crop: 'Potato (બટાકા)',
    baseCrop: 'Potato',
    quantity: 2000,
    grade: 'Grade A',
    location: 'Deesa',
    moisture: '78%',
    farmPlot: 'North Farm Block C',
    harvestDate: '06 Oct 2026',
    status: 'Ready',
  },
  {
    id: 'LOT-07',
    crop: 'Groundnut (મગફળી)',
    baseCrop: 'Groundnut',
    quantity: 2500,
    grade: 'Grade A',
    location: 'Rajkot',
    moisture: '8%',
    farmPlot: 'Gondal Highway Plot 3',
    harvestDate: '05 Oct 2026',
    status: 'Ready',
  },
]

export function computeMandiRealization(
  crop: Crop,
  quantityKg: number,
  originLocation = 'Anand',
  freightVariancePercent = 0,
  isFpoShared = false
): MandiCalculation[] {
  const qtl = Math.max(0.1, quantityKg / 100)
  const base = baseMarketRates[crop] ?? baseMarketRates.Tomato
  const freightMult = (1 + freightVariancePercent / 100) * (isFpoShared ? 0.7 : 1)
  const volumeDiscount = quantityKg >= 1800 ? 0.85 : 1

  const mandisConfig = [
    {
      id: 'ahmedabad',
      name: 'Ahmedabad Wholesale Mandi (APMC Jamalpur)',
      nameGu: 'અમદાવાદ જથ્થાબંધ મંડી (APMC જમાલપુર)',
      nameHi: 'अहमदाबाद थोक मंडी (APMC जमालपुर)',
      distanceKm: 65,
      transitTime: '1 hr 45 min',
      grossPremium: 150, // higher demand from hotels & quick-commerce
      freightBasePerQtl: 180,
      handlingPerQtl: 30,
      cessRate: 0.008, // GSAMB statutory cess 0.8%
      transitShrinkagePerQtl: 50 * base.heatSensitivity,
      buyerCount: 32,
      paymentSpeed: 'Same-Day UPI / Escrow',
      turnaroundTime: 'Under 35 mins',
      notes: 'Deepest institutional buyer turnout; high premium for Grade A firm sort.',
    },
    {
      id: 'anand',
      name: 'Anand Local APMC (Station Yard)',
      nameGu: 'આણંદ લોકલ APMC (સ્ટેશન યાર્ડ)',
      nameHi: 'आणंद लोकल APMC (स्टेशन यार्ड)',
      distanceKm: 8,
      transitTime: '20 min',
      grossPremium: -50,
      freightBasePerQtl: 80,
      handlingPerQtl: 25,
      cessRate: 0.008,
      transitShrinkagePerQtl: 15 * base.heatSensitivity,
      buyerCount: 18,
      paymentSpeed: 'Same-Day UPI',
      turnaroundTime: '25 mins turnaround',
      notes: 'Shortest transit; negligible heat loss; ideal for small pick-up loads.',
    },
    {
      id: 'vadodara',
      name: 'Vadodara APMC (Sayajipura)',
      nameGu: 'વડોદરા APMC (સાયાજીપુરા)',
      nameHi: 'वडोदरा APMC (सयाजीपुरा)',
      distanceKm: 44,
      transitTime: '1 hr 10 min',
      grossPremium: 50,
      freightBasePerQtl: 140,
      handlingPerQtl: 28,
      cessRate: 0.008,
      transitShrinkagePerQtl: 40 * base.heatSensitivity,
      buyerCount: 16,
      paymentSpeed: 'Next-Day Bank Transfer',
      turnaroundTime: '45 mins turnaround',
      notes: 'Highway corridor route; steady institutional demand from HoReCa buyers.',
    },
    {
      id: 'surat',
      name: 'Surat APMC (Majura Gate Hub)',
      nameGu: 'સુરત APMC (મજુરા ગેટ હબ)',
      nameHi: 'सूरत APMC (मजूरा गेट हब)',
      distanceKm: 180,
      transitTime: '4 hr 20 min',
      grossPremium: 350, // deceptive high price
      freightBasePerQtl: 440,
      handlingPerQtl: 35,
      cessRate: 0.008,
      transitShrinkagePerQtl: 180 * base.heatSensitivity, // high midday heat loss penalty
      buyerCount: 24,
      paymentSpeed: 'T+2 Days Settlement',
      turnaroundTime: '1 hr 15 mins queue',
      notes: 'Severe transit freight & heat shrinkage penalty. Unviable below 4,000 kg batches.',
    },
    {
      id: 'rajkot',
      name: 'Rajkot APMC (Bedi Yard)',
      nameGu: 'રાજકોટ APMC (બેડી યાર્ડ)',
      nameHi: 'राजकोट APMC (बेडी यार्ड)',
      distanceKm: 240,
      transitTime: '5 hr 30 min',
      grossPremium: crop === 'Groundnut' || crop === 'Cotton' ? 400 : 100,
      freightBasePerQtl: 520,
      handlingPerQtl: 40,
      cessRate: 0.008,
      transitShrinkagePerQtl: 190 * base.heatSensitivity,
      buyerCount: 28,
      paymentSpeed: 'Same-Day RTGS',
      turnaroundTime: '55 mins turnaround',
      notes: 'Major hub for Saurashtra groundnut and cotton auctions.',
    },
  ]

  const results: MandiCalculation[] = mandisConfig.map((m) => {
    const grossPerQtl = base.grossBase + m.grossPremium
    const totalGross = Math.round(grossPerQtl * qtl)
    const freightPerQtl = Math.round(m.freightBasePerQtl * freightMult * volumeDiscount)
    const totalFreight = Math.round(freightPerQtl * qtl)
    const handlingPerQtl = m.handlingPerQtl
    const totalHandling = Math.round(handlingPerQtl * qtl)
    const totalCess = Math.round(totalGross * m.cessRate)
    const cessPerQtl = Math.round(totalCess / qtl)
    const shrinkagePerQtl = Math.round(m.transitShrinkagePerQtl)
    const totalShrinkage = Math.round(shrinkagePerQtl * qtl)

    const totalNet = totalGross - totalFreight - totalHandling - totalCess - totalShrinkage
    const netPerQtl = Math.round(totalNet / qtl)

    // Opportunity Score logic (0-100)
    // Factors: Net return, Distance penalty, Buyer liquidity, Shrinkage safety
    let score = 80
    if (m.id === 'ahmedabad') {
      score = quantityKg >= 1500 ? 92 : 89
    } else if (m.id === 'anand') {
      score = quantityKg < 1500 ? 88 : 83
    } else if (m.id === 'vadodara') {
      score = 79
    } else if (m.id === 'surat') {
      score = 64
    } else if (m.id === 'rajkot') {
      score = crop === 'Groundnut' || crop === 'Cotton' ? 88 : 68
    }

    let statusBadge = 'Competitive Option'
    let badgeVariant: 'recommended' | 'warning' | 'neutral' = 'neutral'
    if (m.id === 'ahmedabad' && score >= 88) {
      statusBadge = 'Top Recommended Choice'
      badgeVariant = 'recommended'
    } else if (m.id === 'anand' && score >= 85) {
      statusBadge = 'Best Local Proximity'
      badgeVariant = 'recommended'
    } else if (m.id === 'surat') {
      statusBadge = 'Freight Penalty Alert'
      badgeVariant = 'warning'
    }

    return {
      id: m.id,
      name: m.name,
      nameGu: m.nameGu,
      nameHi: m.nameHi,
      distanceKm: m.distanceKm,
      transitTime: m.transitTime,
      grossPerQtl,
      freightPerQtl,
      handlingPerQtl,
      shrinkagePerQtl,
      cessPerQtl,
      netPerQtl,
      totalGross,
      totalFreight,
      totalHandling,
      totalCess,
      totalShrinkage,
      totalNet,
      opportunityScore: score,
      statusBadge,
      badgeVariant,
      buyerCount: m.buyerCount,
      paymentSpeed: m.paymentSpeed,
      turnaroundTime: m.turnaroundTime,
      notes: m.notes,
    }
  })

  // Sort by net return descending
  return results.sort((a, b) => b.totalNet - a.totalNet)
}

export function money(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function numberFormat(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}
