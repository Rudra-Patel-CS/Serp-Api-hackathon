import { PrismaClient, Role, UserStatus, FpoStatus, MemberStatus, LotStatus, BuyerType, OfferStatus, ShipmentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting KrishiIntel database seeding...')

  // Clear existing records in reverse dependency order
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.shipmentLocation.deleteMany()
  await prisma.shipment.deleteMany()
  await prisma.transportVehicle.deleteMany()
  await prisma.logisticsProvider.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.buyerCropRequirement.deleteMany()
  await prisma.buyer.deleteMany()
  await prisma.marketPrice.deleteMany()
  await prisma.market.deleteMany()
  await prisma.harvestLot.deleteMany()
  await prisma.crop.deleteMany()
  await prisma.fPOMember.deleteMany()
  await prisma.fPO.deleteMany()
  await prisma.farmerProfile.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleaned existing database tables.')

  // Password hashes for demo accounts
  const farmerPassword = await bcrypt.hash('Farmer123!', 10)
  const fpoPassword = await bcrypt.hash('Fpo123!', 10)
  const adminPassword = await bcrypt.hash('Admin123!', 10)

  // 1. Create Demo Users
  const farmerUser = await prisma.user.create({
    data: {
      name: 'Ramesh Patel',
      email: 'farmer@demo.krishiintel.local',
      phone: '9876543210',
      passwordHash: farmerPassword,
      role: Role.FARMER,
      status: UserStatus.ACTIVE,
      avatarUrl: '/images/ramesh-patel.jpg',
      preferredLanguage: 'gu',
      farmerProfile: {
        create: {
          village: 'Mogri',
          taluka: 'Anand',
          district: 'Anand',
          state: 'Gujarat',
          pincode: '388345',
          landArea: 4.5,
          landUnit: 'Acre',
          primaryCrops: 'Tomato, Red Onion, Potato',
          farmLocationLat: 22.5645,
          farmLocationLng: 72.9289,
        },
      },
    },
  })

  const farmerUser2 = await prisma.user.create({
    data: {
      name: 'Maganbhai Patel',
      email: 'magan@demo.krishiintel.local',
      phone: '9876543213',
      passwordHash: farmerPassword,
      role: Role.FARMER,
      status: UserStatus.ACTIVE,
      preferredLanguage: 'gu',
      farmerProfile: {
        create: {
          village: 'Nadiad',
          taluka: 'Nadiad',
          district: 'Kheda',
          state: 'Gujarat',
          pincode: '387001',
          landArea: 6.0,
          landUnit: 'Acre',
          primaryCrops: 'Wheat, Tomato',
          farmLocationLat: 22.6916,
          farmLocationLng: 72.8634,
        },
      },
    },
  })

  const farmerUser3 = await prisma.user.create({
    data: {
      name: 'Sureshbhai Parmar',
      email: 'suresh@demo.krishiintel.local',
      phone: '9876543214',
      passwordHash: farmerPassword,
      role: Role.FARMER,
      status: UserStatus.ACTIVE,
      preferredLanguage: 'hi',
      farmerProfile: {
        create: {
          village: 'Borsad',
          taluka: 'Borsad',
          district: 'Anand',
          state: 'Gujarat',
          pincode: '388540',
          landArea: 8.2,
          landUnit: 'Acre',
          primaryCrops: 'Cotton, Groundnut',
          farmLocationLat: 22.4107,
          farmLocationLng: 72.8997,
        },
      },
    },
  })

  const fpoUser = await prisma.user.create({
    data: {
      name: 'Anand Farmers Co-operative',
      email: 'fpo@demo.krishiintel.local',
      phone: '9876543211',
      passwordHash: fpoPassword,
      role: Role.FPO_MANAGER,
      status: UserStatus.ACTIVE,
      avatarUrl: '/images/gujarat-farm.png',
      preferredLanguage: 'en',
    },
  })

  const adminUser = await prisma.user.create({
    data: {
      name: 'KrishiIntel Super Admin',
      email: 'admin@demo.krishiintel.local',
      phone: '9876543212',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      preferredLanguage: 'en',
    },
  })

  console.log('✅ Created Demo Users (Farmer, FPO Manager, Admin).')

  // 2. Create FPO Entity & Memberships
  const fpoEntity = await prisma.fPO.create({
    data: {
      name: 'Anand Tomato & Produce Co-operative Ltd',
      registrationNumber: 'FPO-GUJ-2024-8891',
      managerUserId: fpoUser.id,
      address: 'APMC Market Yard Complex, Gate 2',
      village: 'Anand',
      taluka: 'Anand',
      district: 'Anand',
      state: 'Gujarat',
      pincode: '388001',
      latitude: 22.5645,
      longitude: 72.9289,
      contactPhone: '9876543211',
      email: 'fpo@demo.krishiintel.local',
      status: FpoStatus.ACTIVE,
      members: {
        create: [
          { farmerId: farmerUser.id, status: MemberStatus.ACTIVE },
          { farmerId: farmerUser2.id, status: MemberStatus.ACTIVE },
          { farmerId: farmerUser3.id, status: MemberStatus.ACTIVE },
        ],
      },
    },
  })

  console.log('✅ Created FPO Entity & Associated Farmer Members.')

  // 3. Create Crops
  const cropTomato = await prisma.crop.create({
    data: {
      name: 'Tomato',
      localName: 'Tameta',
      gujaratiName: 'ટામેટા (ટમેટા)',
      hindiName: 'टमाटर',
      category: 'Vegetable',
      shelfLifeDays: 4,
    },
  })

  const cropOnion = await prisma.crop.create({
    data: {
      name: 'Onion',
      localName: 'Red Onion / Dungri',
      gujaratiName: 'લાલ ડુંગળી (કાંદા)',
      hindiName: 'लाल प्याज',
      category: 'Vegetable',
      shelfLifeDays: 20,
    },
  })

  const cropPotato = await prisma.crop.create({
    data: {
      name: 'Potato',
      localName: 'Bataka',
      gujaratiName: 'બટાકા (બટાટા)',
      hindiName: 'आलू',
      category: 'Tuber',
      shelfLifeDays: 30,
    },
  })

  const cropWheat = await prisma.crop.create({
    data: {
      name: 'Wheat',
      localName: 'Sharbati Ghau',
      gujaratiName: 'શરબતી ઘઉં',
      hindiName: 'शरबती गेहूं',
      category: 'Grain',
      shelfLifeDays: 180,
    },
  })

  const cropCotton = await prisma.crop.create({
    data: {
      name: 'Cotton',
      localName: 'Shankar Kapas',
      gujaratiName: 'શંકર કપાસ',
      hindiName: 'कपास',
      category: 'Cash Crop',
      shelfLifeDays: 120,
    },
  })

  const cropGroundnut = await prisma.crop.create({
    data: {
      name: 'Groundnut',
      localName: 'Magfali',
      gujaratiName: 'મગફળી',
      hindiName: 'मूंगफली',
      category: 'Oilseed',
      shelfLifeDays: 90,
    },
  })

  console.log('✅ Created Base Crops.')

  // 4. Create Markets
  const marketAhmedabad = await prisma.market.create({
    data: {
      name: 'Ahmedabad APMC Market (Jamalpur)',
      marketType: 'APMC_WHOLESALE',
      city: 'Ahmedabad',
      district: 'Ahmedabad',
      state: 'Gujarat',
      latitude: 23.0125,
      longitude: 72.5804,
      distanceKm: 78,
    },
  })

  const marketVadodara = await prisma.market.create({
    data: {
      name: 'Vadodara Sayajigunj Mandi',
      marketType: 'APMC_WHOLESALE',
      city: 'Vadodara',
      district: 'Vadodara',
      state: 'Gujarat',
      latitude: 22.3072,
      longitude: 73.1812,
      distanceKm: 43,
    },
  })

  const marketAnand = await prisma.market.create({
    data: {
      name: 'Anand APMC Local Yard',
      marketType: 'APMC_WHOLESALE',
      city: 'Anand',
      district: 'Anand',
      state: 'Gujarat',
      latitude: 22.5645,
      longitude: 72.9289,
      distanceKm: 6,
    },
  })

  const marketSurat = await prisma.market.create({
    data: {
      name: 'Surat APMC Mandi (Sahara Darwaja)',
      marketType: 'APMC_WHOLESALE',
      city: 'Surat',
      district: 'Surat',
      state: 'Gujarat',
      latitude: 21.1702,
      longitude: 72.8311,
      distanceKm: 195,
    },
  })

  console.log('✅ Created APMC Markets.')

  // 5. Create Historical Market Prices
  const now = new Date()
  const oneDay = 24 * 60 * 60 * 1000

  const priceHistory = [
    { marketId: marketAhmedabad.id, cropId: cropTomato.id, min: 3200, max: 4000, modal: 3600 },
    { marketId: marketVadodara.id, cropId: cropTomato.id, min: 3000, max: 3700, modal: 3400 },
    { marketId: marketAnand.id, cropId: cropTomato.id, min: 2800, max: 3500, modal: 3200 },

    { marketId: marketAhmedabad.id, cropId: cropOnion.id, min: 2000, max: 2400, modal: 2250 },
    { marketId: marketVadodara.id, cropId: cropOnion.id, min: 1900, max: 2300, modal: 2150 },
    { marketId: marketAnand.id, cropId: cropOnion.id, min: 1800, max: 2200, modal: 2050 },

    { marketId: marketAhmedabad.id, cropId: cropPotato.id, min: 1800, max: 2200, modal: 2000 },
    { marketId: marketVadodara.id, cropId: cropPotato.id, min: 1750, max: 2100, modal: 1950 },

    { marketId: marketAhmedabad.id, cropId: cropWheat.id, min: 2750, max: 3100, modal: 2900 },
    { marketId: marketAnand.id, cropId: cropWheat.id, min: 2700, max: 3000, modal: 2850 },

    { marketId: marketSurat.id, cropId: cropCotton.id, min: 7200, max: 7900, modal: 7600 },
  ]

  for (const ph of priceHistory) {
    for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
      const observedAt = new Date(now.getTime() - dayOffset * oneDay)
      const variance = (dayOffset % 2 === 0 ? 1 : -1) * (dayOffset * 30)
      await prisma.marketPrice.create({
        data: {
          marketId: ph.marketId,
          cropId: ph.cropId,
          minPrice: ph.min + variance,
          maxPrice: ph.max + variance,
          modalPrice: ph.modal + variance,
          unit: 'Quintal',
          source: 'Agmarknet APMC Daily Bulletin',
          sourceUrl: 'https://agmarknet.gov.in',
          observedAt,
        },
      })
    }
  }

  console.log('✅ Created Market Price History Records.')

  // 6. Create Harvest Lots
  const lot1 = await prisma.harvestLot.create({
    data: {
      lotNumber: 'LOT-2026-TOM-01',
      farmerId: farmerUser.id,
      fpoId: fpoEntity.id,
      cropId: cropTomato.id,
      quantityKg: 500,
      grade: 'Grade A',
      moisture: '84%',
      farmPlot: 'Field Plot 2B, Mogri Belt',
      harvestDate: new Date(now.getTime() - oneDay),
      expectedReadyDate: now,
      location: 'Anand, Gujarat',
      latitude: 22.5645,
      longitude: 72.9289,
      status: LotStatus.READY,
    },
  })

  const lot2 = await prisma.harvestLot.create({
    data: {
      lotNumber: 'LOT-2026-ONI-02',
      farmerId: farmerUser.id,
      fpoId: fpoEntity.id,
      cropId: cropOnion.id,
      quantityKg: 1200,
      grade: 'Grade B',
      moisture: '14%',
      farmPlot: 'Plot 1A, Mogri Belt',
      harvestDate: new Date(now.getTime() - 2 * oneDay),
      expectedReadyDate: now,
      location: 'Anand, Gujarat',
      latitude: 22.5645,
      longitude: 72.9289,
      status: LotStatus.READY,
    },
  })

  const lot3 = await prisma.harvestLot.create({
    data: {
      lotNumber: 'LOT-2026-POT-03',
      farmerId: farmerUser2.id,
      fpoId: fpoEntity.id,
      cropId: cropPotato.id,
      quantityKg: 2500,
      grade: 'Grade A',
      moisture: '78%',
      farmPlot: 'North Block C, Nadiad',
      harvestDate: new Date(now.getTime() - 3 * oneDay),
      expectedReadyDate: now,
      location: 'Nadiad, Gujarat',
      latitude: 22.6916,
      longitude: 72.8634,
      status: LotStatus.PROCURED,
    },
  })

  console.log('✅ Created Harvest Lots.')

  // 7. Create Buyers & Buyer Crop Requirements
  const buyer1 = await prisma.buyer.create({
    data: {
      businessName: 'Gujarat Fresh Wholesale Traders Pvt Ltd',
      contactName: 'Jayeshbhai Shah',
      phone: '9825011223',
      email: 'jayesh@gujaratfresh.com',
      buyerType: BuyerType.WHOLESALER,
      city: 'Ahmedabad',
      district: 'Ahmedabad',
      state: 'Gujarat',
      latitude: 23.0225,
      longitude: 72.5714,
      verified: true,
      rating: 4.8,
      minQuantityKg: 200,
      maxQuantityKg: 10000,
      requirements: {
        create: [
          {
            cropId: cropTomato.id,
            minimumQuantityKg: 200,
            maximumQuantityKg: 5000,
            acceptedGrades: 'Grade A, Grade B',
            targetPrice: 36.5,
          },
          {
            cropId: cropOnion.id,
            minimumQuantityKg: 500,
            maximumQuantityKg: 10000,
            acceptedGrades: 'Grade A, Grade B',
            targetPrice: 22.0,
          },
        ],
      },
    },
  })

  const buyer2 = await prisma.buyer.create({
    data: {
      businessName: 'Sahyog Agri Procurement Co-operative',
      contactName: 'Prafulbhai Patel',
      phone: '9898033445',
      email: 'procurement@sahyogagri.in',
      buyerType: BuyerType.TRADER,
      city: 'Vadodara',
      district: 'Vadodara',
      state: 'Gujarat',
      latitude: 22.3072,
      longitude: 73.1812,
      verified: true,
      rating: 4.6,
      minQuantityKg: 500,
      maxQuantityKg: 20000,
      requirements: {
        create: [
          {
            cropId: cropTomato.id,
            minimumQuantityKg: 500,
            maximumQuantityKg: 10000,
            acceptedGrades: 'Grade A',
            targetPrice: 35.0,
          },
          {
            cropId: cropPotato.id,
            minimumQuantityKg: 1000,
            maximumQuantityKg: 20000,
            acceptedGrades: 'Grade A, Grade B',
            targetPrice: 20.0,
          },
        ],
      },
    },
  })

  const buyer3 = await prisma.buyer.create({
    data: {
      businessName: 'GreenHarvest Foods Processing Ltd',
      contactName: 'Nitin Vora',
      phone: '9909055667',
      email: 'sourcing@greenharvest.co.in',
      buyerType: BuyerType.PROCESSOR,
      city: 'Surat',
      district: 'Surat',
      state: 'Gujarat',
      latitude: 21.1702,
      longitude: 72.8311,
      verified: true,
      rating: 4.9,
      minQuantityKg: 1000,
      maxQuantityKg: 50000,
      requirements: {
        create: [
          {
            cropId: cropTomato.id,
            minimumQuantityKg: 1000,
            maximumQuantityKg: 15000,
            acceptedGrades: 'Grade A',
            targetPrice: 38.0,
          },
        ],
      },
    },
  })

  console.log('✅ Created Verified Buyers & Crop Requirements.')

  // 8. Create Offers
  const offer1 = await prisma.offer.create({
    data: {
      lotId: lot1.id,
      buyerId: buyer1.id,
      offeredPrice: 36.0,
      quantityKg: 500,
      status: OfferStatus.ACCEPTED,
      expiresAt: new Date(now.getTime() + 2 * oneDay),
    },
  })

  const offer2 = await prisma.offer.create({
    data: {
      lotId: lot2.id,
      buyerId: buyer2.id,
      offeredPrice: 21.5,
      quantityKg: 1200,
      status: OfferStatus.PENDING,
      expiresAt: new Date(now.getTime() + 3 * oneDay),
    },
  })

  console.log('✅ Created Sample Offers.')

  // 9. Create Logistics, Vehicles, & Active Shipment
  const provider = await prisma.logisticsProvider.create({
    data: {
      name: 'Shree Ram Transport & Cold Express',
      contactPerson: 'Rakesh Kumar',
      phone: '9712044556',
      email: 'logistics@shreeram.co.in',
      rating: 4.9,
    },
  })

  const vehicle = await prisma.transportVehicle.create({
    data: {
      providerId: provider.id,
      vehicleNumber: 'GJ-07-AX-4821',
      vehicleType: 'Eicher 14ft Temperature Controlled Truck',
      capacityKg: 4000,
      status: 'IN_TRANSIT',
    },
  })

  const shipment = await prisma.shipment.create({
    data: {
      lotId: lot1.id,
      providerId: provider.id,
      vehicleId: vehicle.id,
      pickupLocation: 'Anand Produce Hub, Mogri',
      pickupLat: 22.5645,
      pickupLng: 72.9289,
      destination: 'Ahmedabad Wholesale Mandi (APMC Jamalpur)',
      destinationLat: 23.0125,
      destinationLng: 72.5804,
      status: ShipmentStatus.IN_TRANSIT,
      startedAt: new Date(now.getTime() - 2 * 3600 * 1000),
      estimatedArrival: new Date(now.getTime() + 1.5 * 3600 * 1000),
      locations: {
        create: [
          { latitude: 22.5645, longitude: 72.9289, speed: 0, heading: 0, recordedAt: new Date(now.getTime() - 2 * 3600 * 1000) },
          { latitude: 22.6845, longitude: 72.7889, speed: 48, heading: 315, recordedAt: new Date(now.getTime() - 1 * 3600 * 1000) },
          { latitude: 22.8445, longitude: 72.6889, speed: 52, heading: 320, recordedAt: new Date(now.getTime() - 15 * 60 * 1000) },
        ],
      },
    },
  })

  console.log('✅ Created Active Shipment & Tracking Snapshot Feeds.')

  // 10. Create Initial Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: farmerUser.id,
        type: 'OFFER_ACCEPTED',
        title: 'Offer Accepted by Gujarat Fresh Traders!',
        message: 'Your Tomato Lot #LOT-2026-TOM-01 offer of ₹36.0/kg has been accepted.',
        entityType: 'Offer',
        entityId: offer1.id,
        read: false,
      },
      {
        userId: farmerUser.id,
        type: 'SHIPMENT_UPDATE',
        title: 'Shipment Dispatched to Ahmedabad APMC',
        message: 'Vehicle GJ-07-AX-4821 is currently in transit. Estimated arrival in 1 hr 30 mins.',
        entityType: 'Shipment',
        entityId: shipment.id,
        read: false,
      },
      {
        userId: fpoUser.id,
        type: 'PROCUREMENT_REQUEST',
        title: 'New Harvest Lot Registered in Mogri',
        message: 'Farmer Ramesh Patel submitted 500kg Tomato Lot ready for procurement.',
        entityType: 'HarvestLot',
        entityId: lot1.id,
        read: false,
      },
    ],
  })

  // 11. Create Audit Log Entry
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_INITIALIZED',
      entityType: 'System',
      entityId: 'SEED_RUN',
      metadata: JSON.stringify({ version: '1.0.0', initializedAt: new Date() }),
      ipAddress: '127.0.0.1',
      userAgent: 'Prisma Seed Script',
    },
  })

  console.log('✅ Created Notifications & Initial Audit Log.')
  console.log('🎉 KrishiIntel Database Seeding Complete!')
}

main()
  .catch((e) => {
    console.error('❌ Database Seeding Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
