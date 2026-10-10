export interface NetRealisationParams {
  grossPerQtl: number
  quantityKg: number
  distanceKm: number
  freightVariance?: number
  isFpoPool?: boolean
  shelfLifeDays?: number
}

export interface NetRealisationResult {
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
  calculationBreakdown: {
    grossSaleValue: number
    transportCost: number
    handlingCost: number
    cessCost: number
    expectedLoss: number
    netInHand: number
  }
}

export function calculateNetRealisation(params: NetRealisationParams): NetRealisationResult {
  const {
    grossPerQtl,
    quantityKg,
    distanceKm,
    freightVariance = 0,
    isFpoPool = false,
    shelfLifeDays = 4,
  } = params

  const qtlCount = quantityKg / 100

  // Freight calculation: base rate + distance scaling - FPO volume discount
  const baseFreightPerKmPerQtl = 1.45
  let freightPerQtl = Math.max(60, Math.round(distanceKm * baseFreightPerKmPerQtl + freightVariance))
  if (isFpoPool) {
    freightPerQtl = Math.round(freightPerQtl * 0.75) // 25% FPO logistics pooling savings
  }

  // Handling per quintal
  let handlingPerQtl = Math.round(45 + (quantityKg > 1000 ? 5 : 15))
  if (isFpoPool) {
    handlingPerQtl = Math.round(handlingPerQtl * 0.8)
  }

  // APMC Mandi Cess (0.8% - 1.0% of gross)
  const cessPerQtl = Math.round((grossPerQtl * 0.008))

  // Moisture shrinkage & transit spoilage (higher for perishable crops like tomato)
  const spoilageFactor = shelfLifeDays <= 5 ? 0.025 : 0.008
  const shrinkagePerQtl = Math.round(grossPerQtl * spoilageFactor)

  const netPerQtl = Math.max(0, grossPerQtl - freightPerQtl - handlingPerQtl - cessPerQtl - shrinkagePerQtl)

  const totalGross = Math.round(grossPerQtl * qtlCount)
  const totalFreight = Math.round(freightPerQtl * qtlCount)
  const totalHandling = Math.round(handlingPerQtl * qtlCount)
  const totalCess = Math.round(cessPerQtl * qtlCount)
  const totalShrinkage = Math.round(shrinkagePerQtl * qtlCount)
  const totalNet = Math.round(netPerQtl * qtlCount)

  return {
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
    calculationBreakdown: {
      grossSaleValue: totalGross,
      transportCost: totalFreight,
      handlingCost: totalHandling,
      cessCost: totalCess,
      expectedLoss: totalShrinkage,
      netInHand: totalNet,
    },
  }
}
