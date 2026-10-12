"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryDbStore = void 0;
const DEFAULT_CROPS = [
    { id: 'CROP-TOMATO-01', name: 'Tomato', localName: 'Tameta / ટામેટા', category: 'Vegetable', shelfLifeDays: 4 },
    { id: 'CROP-ONION-02', name: 'Red Onion', localName: 'Dungri / ડુંગળી', category: 'Vegetable', shelfLifeDays: 20 },
    { id: 'CROP-POTATO-03', name: 'Potato', localName: 'Bataka / બટાકા', category: 'Tuber', shelfLifeDays: 45 },
    { id: 'CROP-COTTON-04', name: 'Cotton', localName: 'Kapas / કપાસ', category: 'Fiber', shelfLifeDays: 180 },
    { id: 'CROP-GROUNDNUT-05', name: 'Groundnut', localName: 'Magfali / મગફળી', category: 'Oilseed', shelfLifeDays: 90 },
    { id: 'CROP-WHEAT-06', name: 'Wheat', localName: 'Gahu / ઘઉં', category: 'Grain', shelfLifeDays: 120 },
];
const DEFAULT_USERS = [
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
        id: 'DEMO-FARMER-002',
        name: 'Maganbhai Patel',
        email: 'magan@demo.krishiintel.local',
        phone: '9876543213',
        role: 'FARMER',
        status: 'ACTIVE',
        preferredLanguage: 'gu',
        createdAt: new Date().toISOString(),
        farmerProfile: { id: 'FP-002', village: 'Nadiad', taluka: 'Nadiad', district: 'Kheda', state: 'Gujarat', landArea: 6.0, primaryCrops: 'Potato, Wheat' },
    },
    {
        id: 'DEMO-FARMER-003',
        name: 'Sureshbhai Parmar',
        email: 'suresh@demo.krishiintel.local',
        phone: '9876543214',
        role: 'FARMER',
        status: 'ACTIVE',
        preferredLanguage: 'hi',
        createdAt: new Date().toISOString(),
        farmerProfile: { id: 'FP-003', village: 'Borsad', taluka: 'Borsad', district: 'Anand', state: 'Gujarat', landArea: 8.2, primaryCrops: 'Cotton, Groundnut' },
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
];
const DEFAULT_BUYERS = [
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
    {
        id: 'BUYER-03',
        businessName: 'Reliance Retail Agro Division',
        buyerType: 'RETAILER',
        city: 'Ahmedabad',
        district: 'Ahmedabad',
        rating: 4.9,
        contactPhone: '9825099887',
        requirements: [{ cropId: 'CROP-POTATO-03', minQuantityKg: 2000, maxPricePerKg: 25 }],
    },
    {
        id: 'BUYER-04',
        businessName: 'Amul Dairy & Produce Co-operative',
        buyerType: 'INSTITUTION',
        city: 'Anand',
        district: 'Anand',
        rating: 4.9,
        contactPhone: '9825011223',
        requirements: [{ cropId: 'CROP-GROUNDNUT-05', minQuantityKg: 1500, maxPricePerKg: 62 }],
    },
    {
        id: 'BUYER-05',
        businessName: 'Adani Wilmar Agri Export House',
        buyerType: 'EXPORTER',
        city: 'Mundra',
        district: 'Kutch',
        rating: 4.7,
        contactPhone: '9825033445',
        requirements: [{ cropId: 'CROP-COTTON-04', minQuantityKg: 3000, maxPricePerKg: 72 }],
    },
];
const DEFAULT_OFFERS = [
    {
        id: 'OFFER-01',
        offerNumber: 'OFF-9011',
        lotId: 'LOT-DEMO-001',
        buyerId: 'BUYER-01',
        offeredPrice: 34.5,
        quantityKg: 5000,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        buyer: DEFAULT_BUYERS[0],
    },
    {
        id: 'OFFER-02',
        offerNumber: 'OFF-9012',
        lotId: 'LOT-DEMO-002',
        buyerId: 'BUYER-02',
        offeredPrice: 31.5,
        quantityKg: 1200,
        status: 'ACCEPTED',
        createdAt: new Date().toISOString(),
        buyer: DEFAULT_BUYERS[1],
    },
    {
        id: 'OFFER-03',
        offerNumber: 'OFF-9013',
        lotId: 'LOT-DEMO-003',
        buyerId: 'BUYER-03',
        offeredPrice: 22.0,
        quantityKg: 8000,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        buyer: DEFAULT_BUYERS[2],
    },
    {
        id: 'OFFER-04',
        offerNumber: 'OFF-9014',
        lotId: 'LOT-DEMO-004',
        buyerId: 'BUYER-05',
        offeredPrice: 68.0,
        quantityKg: 3500,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        buyer: DEFAULT_BUYERS[4],
    },
    {
        id: 'OFFER-05',
        offerNumber: 'OFF-9015',
        lotId: 'LOT-DEMO-005',
        buyerId: 'BUYER-04',
        offeredPrice: 59.0,
        quantityKg: 6000,
        status: 'ACCEPTED',
        createdAt: new Date().toISOString(),
        buyer: DEFAULT_BUYERS[3],
    },
];
const DEFAULT_LOTS = [
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
        offers: [DEFAULT_OFFERS[0]],
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
        offers: [DEFAULT_OFFERS[1]],
        shipments: [],
    },
    {
        id: 'LOT-DEMO-003',
        lotNumber: 'LOT-882010',
        farmerId: 'DEMO-FARMER-002',
        fpoId: 'FPO-001',
        cropId: 'CROP-POTATO-03',
        quantityKg: 8000,
        grade: 'Grade B',
        moisture: '15%',
        farmPlot: 'Nadiad North Field',
        harvestDate: new Date().toISOString(),
        location: 'Nadiad, Gujarat',
        status: 'READY',
        createdAt: new Date().toISOString(),
        crop: DEFAULT_CROPS[2],
        farmer: { id: 'DEMO-FARMER-002', name: 'Maganbhai Patel', phone: '9876543213' },
        fpo: { id: 'FPO-001', name: 'Anand Tomato & Produce Co-operative Ltd' },
        offers: [DEFAULT_OFFERS[2]],
        shipments: [],
    },
    {
        id: 'LOT-DEMO-004',
        lotNumber: 'LOT-882009',
        farmerId: 'DEMO-FARMER-003',
        fpoId: 'FPO-001',
        cropId: 'CROP-COTTON-04',
        quantityKg: 3500,
        grade: 'Grade A',
        moisture: '8%',
        farmPlot: 'Borsad Cotton Estate',
        harvestDate: new Date().toISOString(),
        location: 'Borsad, Gujarat',
        status: 'READY',
        createdAt: new Date().toISOString(),
        crop: DEFAULT_CROPS[3],
        farmer: { id: 'DEMO-FARMER-003', name: 'Sureshbhai Parmar', phone: '9876543214' },
        fpo: { id: 'FPO-001', name: 'Anand Tomato & Produce Co-operative Ltd' },
        offers: [DEFAULT_OFFERS[3]],
        shipments: [],
    },
    {
        id: 'LOT-DEMO-005',
        lotNumber: 'LOT-882008',
        farmerId: 'DEMO-FARMER-001',
        fpoId: 'FPO-001',
        cropId: 'CROP-GROUNDNUT-05',
        quantityKg: 6000,
        grade: 'Grade A',
        moisture: '10%',
        farmPlot: 'Rajkot Field 3',
        harvestDate: new Date().toISOString(),
        location: 'Rajkot, Gujarat',
        status: 'READY',
        createdAt: new Date().toISOString(),
        crop: DEFAULT_CROPS[4],
        farmer: { id: 'DEMO-FARMER-001', name: 'Ramesh Patel', phone: '9876543210' },
        fpo: { id: 'FPO-001', name: 'Anand Tomato & Produce Co-operative Ltd' },
        offers: [DEFAULT_OFFERS[4]],
        shipments: [],
    },
];
const DEFAULT_PROVIDERS = [
    {
        id: 'LOG-01',
        name: 'Saurashtra Agro Logistics Pvt Ltd',
        contactPhone: '9876500001',
        rating: 4.8,
        vehicles: [{ id: 'VEH-01', vehicleType: 'Eicher Pro 2059 (14ft)', registrationNumber: 'GJ-07-AT-8821', driverName: 'Vikrambhai' }],
    },
    {
        id: 'LOG-02',
        name: 'Gujarat Express Transport Co.',
        contactPhone: '9876500002',
        rating: 4.7,
        vehicles: [{ id: 'VEH-02', vehicleType: 'Tata 407 LPT (10ft)', registrationNumber: 'GJ-01-EX-4412', driverName: 'Jigneshbhai' }],
    },
    {
        id: 'LOG-03',
        name: 'APMC Trucking Federation',
        contactPhone: '9876500003',
        rating: 4.9,
        vehicles: [{ id: 'VEH-03', vehicleType: 'BharatBenz 6-Wheeler (19ft)', registrationNumber: 'GJ-06-TF-9901', driverName: 'Rajeshbhai' }],
    },
    {
        id: 'LOG-04',
        name: 'Kheda Cargo Carriers',
        contactPhone: '9876500004',
        rating: 4.6,
        vehicles: [{ id: 'VEH-04', vehicleType: 'Mahindra Blazo X (24ft)', registrationNumber: 'GJ-23-CC-7711', driverName: 'Hiteshbhai' }],
    },
    {
        id: 'LOG-05',
        name: 'Rajkot Freight Lines',
        contactPhone: '9876500005',
        rating: 4.8,
        vehicles: [{ id: 'VEH-05', vehicleType: 'Ashok Leyland Dost (8ft)', registrationNumber: 'GJ-03-FL-3320', driverName: 'Pravinbhai' }],
    },
];
const DEFAULT_SHIPMENTS = [
    {
        id: 'SHIP-DEMO-01',
        trackingNumber: 'TRK-982104',
        status: 'IN_TRANSIT',
        originLocation: 'Anand, Gujarat',
        destinationLocation: 'Vadodara APMC',
        estimatedDelivery: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        provider: DEFAULT_PROVIDERS[0],
        vehicle: DEFAULT_PROVIDERS[0].vehicles[0],
        locations: [{ latitude: 22.5645, longitude: 72.9289, speed: 45, recordedAt: new Date().toISOString() }],
    },
    {
        id: 'SHIP-DEMO-02',
        trackingNumber: 'TRK-982105',
        status: 'DISPATCHED',
        originLocation: 'Mogri, Gujarat',
        destinationLocation: 'Rajkot APMC',
        estimatedDelivery: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
        provider: DEFAULT_PROVIDERS[1],
        vehicle: DEFAULT_PROVIDERS[1].vehicles[0],
        locations: [{ latitude: 22.2981, longitude: 70.8067, speed: 50, recordedAt: new Date().toISOString() }],
    },
    {
        id: 'SHIP-DEMO-03',
        trackingNumber: 'TRK-982106',
        status: 'DELIVERED',
        originLocation: 'Nadiad, Gujarat',
        destinationLocation: 'Ahmedabad Vasna APMC',
        estimatedDelivery: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        provider: DEFAULT_PROVIDERS[2],
        vehicle: DEFAULT_PROVIDERS[2].vehicles[0],
        locations: [{ latitude: 23.0225, longitude: 72.5714, speed: 0, recordedAt: new Date().toISOString() }],
    },
    {
        id: 'SHIP-DEMO-04',
        trackingNumber: 'TRK-982107',
        status: 'IN_TRANSIT',
        originLocation: 'Borsad, Gujarat',
        destinationLocation: 'Mundra Port Export Terminal',
        estimatedDelivery: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
        provider: DEFAULT_PROVIDERS[3],
        vehicle: DEFAULT_PROVIDERS[3].vehicles[0],
        locations: [{ latitude: 22.8396, longitude: 69.7131, speed: 62, recordedAt: new Date().toISOString() }],
    },
    {
        id: 'SHIP-DEMO-05',
        trackingNumber: 'TRK-982108',
        status: 'DISPATCHED',
        originLocation: 'Rajkot, Gujarat',
        destinationLocation: 'Anand APMC Yard',
        estimatedDelivery: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
        provider: DEFAULT_PROVIDERS[4],
        vehicle: DEFAULT_PROVIDERS[4].vehicles[0],
        locations: [{ latitude: 22.5645, longitude: 72.9289, speed: 40, recordedAt: new Date().toISOString() }],
    },
];
const DEFAULT_ALERTS = [
    {
        id: 'ALT-01',
        title: 'Tomato Mandi Price Rally',
        message: 'Rajkot APMC Tomato modal price surged +4.8% to ₹3,620/qtl based on SerpApi live signal.',
        type: 'PRICE_ALERT',
        read: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'ALT-02',
        title: 'New Red Onion Buyer Offer Received',
        message: 'Gujarat Agro Processors Ltd submitted an offer of ₹34.5/kg for Lot #LOT-882012.',
        type: 'OFFER_RECEIVED',
        read: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: 'ALT-03',
        title: 'Shipment Dispatch Confirmation',
        message: 'Logistics truck TRK-982104 has departed Anand APMC en route to Vadodara.',
        type: 'SHIPMENT_UPDATE',
        read: true,
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    },
    {
        id: 'ALT-04',
        title: 'GSAMB Mandi Fee Policy Revision',
        message: 'Gujarat State Agricultural Marketing Board updated APMC cess structure to 0.8%.',
        type: 'SYSTEM_NOTICE',
        read: true,
        createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    },
    {
        id: 'ALT-05',
        title: 'High Buyer Demand Signal Detected',
        message: 'SerpApi Google Search & News show +18% increased demand for Grade A Cotton in Rajkot.',
        type: 'DEMAND_ALERT',
        read: false,
        createdAt: new Date().toISOString(),
    },
];
class MemoryDbStore {
    users = [...DEFAULT_USERS];
    crops = [...DEFAULT_CROPS];
    lots = [...DEFAULT_LOTS];
    fpos = [
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
                { farmerId: 'DEMO-FARMER-002', status: 'ACTIVE' },
                { farmerId: 'DEMO-FARMER-003', status: 'ACTIVE' },
            ],
        },
    ];
    buyers = [...DEFAULT_BUYERS];
    offers = [...DEFAULT_OFFERS];
    shipments = [...DEFAULT_SHIPMENTS];
    alerts = [...DEFAULT_ALERTS];
    // LOTS OPERATIONS
    getLots(filter) {
        let result = [...this.lots];
        if (filter?.farmerId) {
            result = result.filter((l) => l.farmerId === filter.farmerId);
        }
        if (filter?.fpoId) {
            result = result.filter((l) => l.fpoId === filter.fpoId);
        }
        if (filter?.cropId) {
            result = result.filter((l) => l.cropId === filter.cropId);
        }
        return result;
    }
    getLotById(id) {
        return this.lots.find((l) => l.id === id || l.lotNumber === id) || null;
    }
    createLot(data) {
        const cropObj = this.crops.find((c) => c.id === data.cropId) || {
            id: data.cropId || 'CROP-01',
            name: data.cropName || 'Agricultural Produce',
            localName: data.cropName || 'Produce',
            category: 'Vegetable',
            shelfLifeDays: 14,
        };
        const lotNumber = `LOT-${Date.now().toString().slice(-6)}`;
        const newLot = {
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
        };
        this.lots.unshift(newLot);
        return newLot;
    }
    // CROPS
    getCrops() {
        return [...this.crops];
    }
    // USERS
    getUsers() {
        return [...this.users];
    }
    getUserById(id) {
        return this.users.find((u) => u.id === id || u.email === id || u.phone === id) || null;
    }
    addUser(user) {
        const existing = this.getUserById(user.id || user.email);
        if (!existing) {
            this.users.unshift(user);
        }
        return user;
    }
    updateUserStatus(userId, status) {
        const user = this.users.find((u) => u.id === userId);
        if (user) {
            user.status = status;
        }
        return user;
    }
    // FPO
    getFpos() {
        return [...this.fpos];
    }
    getFpoById(id) {
        return this.fpos.find((f) => f.id === id || f.managerUserId === id) || this.fpos[0];
    }
    // BUYERS & OFFERS
    getBuyers() {
        return [...this.buyers];
    }
    getOffers(lotId) {
        if (lotId) {
            return this.offers.filter((o) => o.lotId === lotId);
        }
        return [...this.offers];
    }
    createOffer(data) {
        const newOffer = {
            id: `OFFER-${Date.now().toString(36).toUpperCase()}`,
            offerNumber: `OFF-${Date.now().toString().slice(-5)}`,
            lotId: data.lotId,
            buyerId: data.buyerId || 'BUYER-01',
            offeredPrice: parseFloat(data.offeredPrice) || 32,
            quantityKg: parseFloat(data.quantityKg) || 500,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            buyer: this.buyers[0],
        };
        this.offers.unshift(newOffer);
        return newOffer;
    }
    // LOGISTICS
    getProviders() {
        return [...DEFAULT_PROVIDERS];
    }
    getShipments() {
        return [...this.shipments];
    }
    // ALERTS
    getAlerts() {
        return [...this.alerts];
    }
}
exports.memoryDbStore = new MemoryDbStore();
