export type Role = 'farmer' | 'fpo' | 'buyer'
export type Crop = 'Tomato' | 'Onion' | 'Potato' | 'Wheat' | 'Cotton' | 'Groundnut'
export type AnalysisInput = { crop: Crop; quantity: number; location: string; date: string }
export type Lot = AnalysisInput & { id: string; grade: string; status: string; farmer: string; harvest: string }
export type Offer = { id: string; buyerId: string; lotId: string; crop: Crop; quantity: number; price: number; status: 'Draft' | 'Accepted' | 'Rejected'; date: string }
export const crops: Crop[] = ['Tomato', 'Onion', 'Potato', 'Wheat', 'Cotton', 'Groundnut']
export const locations = ['Anand', 'Ahmedabad', 'Vadodara', 'Surat', 'Rajkot']
export const initialAnalysis: AnalysisInput = { crop: 'Tomato', quantity: 500, location: 'Anand', date: 'Tomorrow' }
export const sampleLots: Lot[] = [
  { ...initialAnalysis, id: 'LOT-101', grade: 'A', status: 'Available', farmer: 'Ramesh Patel', harvest: '2026-10-08' },
  { crop: 'Onion', quantity: 1200, location: 'Anand', date: 'In 2 days', id: 'LOT-102', grade: 'B', status: 'Available', farmer: 'Meena Shah', harvest: '2026-10-07' },
  { crop: 'Groundnut', quantity: 2500, location: 'Rajkot', date: 'Today', id: 'LOT-103', grade: 'A', status: 'Matched', farmer: 'Kiran Parmar', harvest: '2026-10-06' },
]
export const buyers = [
  { id: 'freshlink', name: 'FreshLink Produce', initials: 'FP', city: 'Ahmedabad', type: 'Wholesaler', crops: ['Tomato', 'Onion', 'Potato'], min: 200, max: 5000, grade: 'A', distance: 78, score: 96, verification: 'Sample verified', description: 'buyerFresh', terms: 'Payment on delivery' },
  { id: 'sahyog', name: 'Sahyog Agri Traders', initials: 'SA', city: 'Vadodara', type: 'Trader', crops: ['Tomato', 'Onion', 'Potato', 'Wheat', 'Groundnut'], min: 100, max: 3000, grade: 'A / B', distance: 43, score: 89, verification: 'Sample verified', description: 'buyerSahyog', terms: 'Payment within 2 days' },
  { id: 'greenbasket', name: 'GreenBasket Foods', initials: 'GF', city: 'Ahmedabad', type: 'Processor', crops: ['Tomato', 'Potato', 'Groundnut'], min: 500, max: 20000, grade: 'A / B', distance: 84, score: 86, verification: 'Sample verified', description: 'buyerGreen', terms: 'Payment within 3 days' },
  { id: 'saurashtra', name: 'Saurashtra Cotton Co.', initials: 'SC', city: 'Rajkot', type: 'Processor', crops: ['Cotton', 'Wheat', 'Groundnut'], min: 500, max: 15000, grade: 'A / B', distance: 240, score: 88, verification: 'Sample verified', description: 'buyerCotton', terms: 'Payment on delivery' },
]
export type Buyer = typeof buyers[number]
export const evidence = [
  { id: 'demand', category: 'Buyer demand', title: 'demandTitle', summary: 'demandSummary', relevance: 'demandRelevance', source: 'Sample buyer requirements', date: '2026-10-09', icon: 'demand' },
  { id: 'prices', category: 'Market prices', title: 'pricesTitle', summary: 'pricesSummary', relevance: 'pricesRelevance', source: 'Illustrative mandi price sheet', date: '2026-10-09', icon: 'price' },
  { id: 'logistics', category: 'Logistics', title: 'logisticsTitle', summary: 'logisticsSummary', relevance: 'logisticsRelevance', source: 'Illustrative transport estimate', date: '2026-10-09', icon: 'logistics' },
]
export type Evidence = typeof evidence[number]
const basePrices: Record<Crop, number> = { Tomato: 36, Onion: 27, Potato: 24, Wheat: 29, Cotton: 76, Groundnut: 67 }
const distances: Record<string, number[]> = { Anand: [78, 43, 8], Ahmedabad: [8, 112, 78], Vadodara: [112, 8, 43], Surat: [265, 155, 198], Rajkot: [215, 280, 245] }
export function analyzeMarkets(input: AnalysisInput) {
  if (!crops.includes(input.crop) || !locations.includes(input.location) || !Number.isFinite(input.quantity) || input.quantity < 1 || input.quantity > 1000000) throw new Error('invalidAnalysis')
  const distance = distances[input.location]
  return ['Ahmedabad', 'Vadodara', 'Anand'].map((name, index) => {
    const price = basePrices[input.crop] - index * 2
    const transport = Math.round((distance[index] * 18 + 396) * Math.max(1, input.quantity / 2000))
    const handling = Math.round(input.quantity * 0.4)
    const gross = price * input.quantity
    return { name, price, distance: distance[index], transport, handling, gross, net: gross - transport - handling, demand: index === 0 ? 'High demand' : index === 1 ? 'Steady demand' : 'Moderate demand', score: [91, 84, 78][index] }
  }).sort((a, b) => b.net - a.net).map((market, index) => ({ ...market, score: [91, 84, 78][index] }))
}
export type Market = ReturnType<typeof analyzeMarkets>[number]
export function matchingBuyers(input: AnalysisInput) {
  return buyers.filter(buyer => buyer.crops.includes(input.crop) && buyer.min <= input.quantity && buyer.max >= input.quantity)
}
export function money(value: number) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value) }
export function number(value: number) { return new Intl.NumberFormat('en-IN').format(value) }
export function sellingScenarios(input: AnalysisInput) {
  const market = analyzeMarkets(input)[0]
  return [{ day: 'Today', gross: market.gross, costs: market.transport + market.handling, net: market.net }, { day: 'Tomorrow', gross: Math.round(market.gross * 1.04), costs: market.transport + market.handling + input.quantity * 0.6, net: Math.round(market.gross * 1.04) - market.transport - market.handling - input.quantity * 0.6 }, { day: 'In 2 days', gross: Math.round(market.gross * 1.045), costs: market.transport + market.handling + input.quantity * 1.5, net: Math.round(market.gross * 1.045) - market.transport - market.handling - input.quantity * 1.5 }]
}
