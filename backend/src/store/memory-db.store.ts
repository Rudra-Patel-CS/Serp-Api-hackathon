import fs from 'fs'
import path from 'path'

export interface DemoCrop {
  id: string
  name: string
  localName: string
  category: string
  shelfLifeDays: number
}

export interface DemoLot {
  id: string
  lotNumber: string
  farmerId: string
  fpoId?: string | null
  cropId: string
  quantityKg: number
  grade: string
  moisture: string
  farmPlot: string
  harvestDate: string | Date
  location: string
  status: string
  createdAt: string | Date
  crop?: DemoCrop
  farmer?: any
  fpo?: any
  offers?: any[]
  shipments?: any[]
}

const DEFAULT_CROPS: DemoCrop[] = [
  { id: 'CROP-TOMATO-01', name: 'Tomato', localName: 'Tameta / ટામેટા', category: 'Vegetable', shelfLifeDays: 4 },
  { id: 'CROP-ONION-02', name: 'Red Onion', localName: 'Dungri / ડુંગળી', category: 'Vegetable', shelfLifeDays: 20 },
  { id: 'CROP-POTATO-03', name: 'Potato', localName: 'Bataka / બટાકા', category: 'Tuber', shelfLifeDays: 45 },
  { id: 'CROP-COTTON-04', name: 'Cotton', localName: 'Kapas / કપાસ', category: 'Fiber', shelfLifeDays: 180 },
  { id: 'CROP-GROUNDNUT-05', name: 'Groundnut', localName: 'Magfali / મગફળી', category: 'Oilseed', shelfLifeDays: 90 },
  { id: 'CROP-WHEAT-06', name: 'Wheat', localName: 'Gahu / ઘઉં', category: 'Grain', shelfLifeDays: 120 },
]

const DEFAULT_USERS: any[] = [
  {
    id: 'DEMO-FARMER-001',
    name: 'Ramesh Patel',
    email: 'farmer@demo.krishiintel.local',
    phone: '9876543210',
    role: 'FARMER',
    status: 'ACTIVE',
    avatarUrl: '/images/ramesh-patel.jpg',
    preferredLanguage: 'gu',
    createdAt: new Date().toISOString(),
    farmerProfile: { id: 'FP-001', village: 'Mogri', taluka: 'Anand', district: 'Anand', state: 'Gujarat', landArea: 4.5, primaryCrops: 'Tomato, Red Onion' },
  },
  {
    id: 'DEMO-FPO-001',
    name: 'Anand Farmers Co-operative',
    email: 'fpo@demo.krishiintel.local',
    phone: '9876543211',
    role: 'FPO_MANAGER',
    status: 'ACTIVE',
    avatarUrl: '/images/gujarat-farm.png',
    preferredLanguage: 'en',
    createdAt: new Date().toISOString(),
    managedFpo: { id: 'FPO-001', fpoName: 'Anand Tomato & Produce Co-operative Ltd', registrationNumber: 'FPO-GUJ-2024-8891', address: 'APMC Market Yard Complex, Gate 2' },
  },
  {
    id: 'DEMO-ADMIN-001',
    name: 'KrishiIntel Super Admin',
    email: 'admin@demo.krishiintel.local',
    phone: '9876543212',
    role: 'ADMIN',
    status: 'ACTIVE',
    preferredLanguage: 'en',
    createdAt: new Date().toISOString(),
  },
]

const DEFAULT_LOTS: DemoLot[] = [
  {
    id: 'LOT-DEMO-001',
    lotNumber: 'LOT-882012',
    farmerId: 'DEMO-FARMER-001',
    fpoId: 'FPO-001',
    cropId: 'CROP-ONION-02',
    quantityKg: 5000,
    grade: 'Grade A',
    moisture: '14%',
    farmPlot: 'Field Plot 1',
    harvestDate: new Date().toISOString(),
    location: 'Anand, Gujarat',
    status: 'READY',
    createdAt: new Date().toISOString(),
    crop: DEFAULT_CROPS[1],
    farmer: { id: 'DEMO-FARMER-001', name: 'Ramesh Patel', phone: '9876543210' },
    fpo: { id: 'FPO-001', name: 'Anand Tomato & Produce Co-operative Ltd' },
    offers: [],
    shipments: [],
  },
  {
    id: 'LOT-DEMO-002',
    lotNumber: 'LOT-882011',
    farmerId: 'DEMO-FARMER-001',
    fpoId: 'FPO-001',
    cropId: 'CROP-TOMATO-01',
    quantityKg: 1200,
    grade: 'Grade A',
    moisture: '12%',
    farmPlot: 'Greenhouse Plot A',
    harvestDate: new Date().toISOString(),
    location: 'Mogri, Gujarat',
    status: 'READY',
    createdAt: new Date().toISOString(),
    crop: DEFAULT_CROPS[0],
    farmer: { id: 'DEMO-FARMER-001', name: 'Ramesh Patel', phone: '9876543210' },
    fpo: { id: 'FPO-001', name: 'Anand Tomato & Produce Co-operative Ltd' },
    offers: [],
    shipments: [],
  },
]

class MemoryDbStore {
  private users: any[] = [...DEFAULT_USERS]
  private crops: DemoCrop[] = [...DEFAULT_CROPS]
  private lots: DemoLot[] = [...DEFAULT_LOTS]
  private fpos: any[] = [
    {
      id: 'FPO-001',
      name: 'Anand Tomato & Produce Co-operative Ltd',
      registrationNumber: 'FPO-GUJ-2024-8891',
      managerUserId: 'DEMO-FPO-001',
      address: 'APMC Market Yard Complex, Gate 2',
      village: 'Anand',
      district: 'Anand',
      state: 'Gujarat',
      status: 'ACTIVE',
      members: [
        { farmerId: 'DEMO-FARMER-001', status: 'ACTIVE' },
      ],
    },
  ]
  private buyers: any[] = [
    {
      id: 'BUYER-01',
      businessName: 'Gujarat Agro Processors Ltd',
      buyerType: 'PROCESSOR',
      city: 'Vadodara',
      district: 'Vadodara',
      rating: 4.8,
      contactPhone: '9825012345',
      requirements: [{ cropId: 'CROP-TOMATO-01', minQuantityKg: 500, maxPricePerKg: 35 }],
    },
    {
      id: 'BUYER-02',
      businessName: 'Saurashtra Wholesale Traders',
      buyerType: 'WHOLESALER',
      city: 'Rajkot',
      district: 'Rajkot',
      rating: 4.6,
      contactPhone: '9825054321',
      requirements: [{ cropId: 'CROP-ONION-02', minQuantityKg: 1000, maxPricePerKg: 38 }],
    },
  ]
  private offers: any[] = []
  private shipments: any[] = []

  // LOTS OPERATIONS
  getLots(filter?: { farmerId?: string; fpoId?: string; cropId?: string }) {
    let result = [...this.lots]
    if (filter?.farmerId) {
      result = result.filter((l) => l.farmerId === filter.farmerId)
    }
    if (filter?.fpoId) {
      result = result.filter((l) => l.fpoId === filter.fpoId)
    }
    if (filter?.cropId) {
      result = result.filter((l) => l.cropId === filter.cropId)
    }
    return result
  }

  getLotById(id: string) {
    return this.lots.find((l) => l.id === id || l.lotNumber === id) || null
  }

  createLot(data: any): DemoLot {
    const cropObj = this.crops.find((c) => c.id === data.cropId) || {
      id: data.cropId || 'CROP-01',
      name: data.cropName || 'Agricultural Produce',
      localName: data.cropName || 'Produce',
      category: 'Vegetable',
      shelfLifeDays: 14,
    }

    const lotNumber = `LOT-${Date.now().toString().slice(-6)}`
    const newLot: DemoLot = {
      id: `LOT-${Date.now().toString(36).toUpperCase()}`,
      lotNumber,
      farmerId: data.farmerId || 'DEMO-FARMER-001',
      fpoId: data.fpoId || 'FPO-001',
      cropId: data.cropId || 'CROP-01',
      quantityKg: parseFloat(data.quantityKg) || 500,
      grade: data.grade || 'Grade A',
      moisture: data.moisture || '14%',
      farmPlot: data.farmPlot || 'Field Plot 1',
      harvestDate: data.harvestDate || new Date().toISOString(),
      location: data.location || 'Anand, Gujarat',
      status: 'READY',
      createdAt: new Date().toISOString(),
      crop: cropObj,
      farmer: { id: data.farmerId || 'DEMO-FARMER-001', name: 'Ramesh Patel', phone: '9876543210' },
      fpo: { id: data.fpoId || 'FPO-001', name: 'Anand Tomato & Produce Co-operative Ltd' },
      offers: [],
      shipments: [],
    }

    this.lots.unshift(newLot)
    return newLot
  }

  // CROPS
  getCrops() {
    return [...this.crops]
  }

  // USERS
  getUsers() {
    return [...this.users]
  }

  getUserById(id: string) {
    return this.users.find((u) => u.id === id || u.email === id || u.phone === id) || null
  }

  addUser(user: any) {
    const existing = this.getUserById(user.id || user.email)
    if (!existing) {
      this.users.unshift(user)
    }
    return user
  }

  updateUserStatus(userId: string, status: string) {
    const user = this.users.find((u) => u.id === userId)
    if (user) {
      user.status = status
    }
    return user
  }

  // FPO
  getFpos() {
    return [...this.fpos]
  }

  getFpoById(id: string) {
    return this.fpos.find((f) => f.id === id || f.managerUserId === id) || this.fpos[0]
  }

  // BUYERS & OFFERS
  getBuyers() {
    return [...this.buyers]
  }

  getOffers(lotId?: string) {
    if (lotId) {
      return this.offers.filter((o) => o.lotId === lotId)
    }
    return [...this.offers]
  }

  createOffer(data: any) {
    const newOffer = {
      id: `OFFER-${Date.now().toString(36).toUpperCase()}`,
      offerNumber: `OFF-${Date.now().toString().slice(-5)}`,
      lotId: data.lotId,
      buyerId: data.buyerId || 'BUYER-01',
      offeredPricePerQtl: parseFloat(data.offeredPricePerQtl) || 3200,
      totalValue: parseFloat(data.totalValue) || 16000,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      buyer: this.buyers[0],
    }
    this.offers.unshift(newOffer)
    return newOffer
  }
}

export const memoryDbStore = new MemoryDbStore()
