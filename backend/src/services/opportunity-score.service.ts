export interface OpportunityScoreParams {
  netPerQtl: number
  grossPerQtl: number
  distanceKm: number
  buyerCount: number
  priceTrendPct?: number
}

export interface OpportunityScoreResult {
  score: number
  badgeText: string
  badgeVariant: 'recommended' | 'warning' | 'neutral'
  components: {
    priceSignal: number
    demand: number
    buyerAvailability: number
    logistics: number
    stability: number
  }
}

export function calculateOpportunityScore(params: OpportunityScoreParams): OpportunityScoreResult {
  const { netPerQtl, grossPerQtl, distanceKm, buyerCount, priceTrendPct = 2.5 } = params

  // 1. Price Signal score (ratio of net to gross)
  const netRatio = grossPerQtl > 0 ? netPerQtl / grossPerQtl : 0
  const priceSignal = Math.min(100, Math.max(30, Math.round(netRatio * 110)))

  // 2. Buyer Availability score
  const buyerAvailability = Math.min(100, Math.round(buyerCount * 18 + 40))

  // 3. Demand score
  const demand = Math.min(100, Math.round(75 + priceTrendPct * 4))

  // 4. Logistics convenience score (penalize longer distances)
  const logistics = Math.max(30, Math.round(100 - distanceKm * 0.45))

  // 5. Stability score
  const stability = 82

  const weightedScore = Math.round(
    priceSignal * 0.35 + buyerAvailability * 0.25 + demand * 0.2 + logistics * 0.1 + stability * 0.1
  )

  const score = Math.min(99, Math.max(40, weightedScore))

  let badgeText = 'Recommended'
  let badgeVariant: 'recommended' | 'warning' | 'neutral' = 'recommended'

  if (score >= 82) {
    badgeText = 'Top Net Realization'
    badgeVariant = 'recommended'
  } else if (score >= 70) {
    badgeText = 'Balanced Option'
    badgeVariant = 'neutral'
  } else {
    badgeText = 'High Transit Loss Risk'
    badgeVariant = 'warning'
  }

  return {
    score,
    badgeText,
    badgeVariant,
    components: {
      priceSignal,
      demand,
      buyerAvailability,
      logistics,
      stability,
    },
  }
}
