'use client'

import React, { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { KrishiTopbar, Language } from './krishi-topbar'
import { KrishiSidebar, NavItem } from './krishi-sidebar'
import { KrishiDashboardView } from './krishi-dashboard-view'
import { KrishiMarketIntelView } from './krishi-market-intel-view'
import {
  KrishiBuyersView,
  KrishiMyCropView,
  KrishiLogisticsView,
  KrishiFpoView,
  KrishiEvidenceView,
  KrishiSellVsWaitView,
  KrishiAlertsView,
} from './krishi-extra-views'
import {
  KisanBahiSlipModal,
  KisanAIAssistantModal,
  SwitchLotModal,
  RegisterLotModal,
  RouteProtocolModal,
  BookDriverModal,
  BookColdStorageModal,
  FpoPoolModal,
  BuyerContactModal,
  MandiCessModal,
  DisputeRateModal,
} from './krishi-modals'
import {
  HarvestLot,
  initialLots,
  computeMandiRealization,
  MandiCalculation,
  money,
} from '@/lib/market-service'
import { Menu, X } from 'lucide-react'

export function KrishiApp() {
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard')
  const [currentLang, setCurrentLang] = useState<Language>('en')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Lots state
  const [lots, setLots] = useState<HarvestLot[]>(initialLots)
  const [activeLot, setActiveLot] = useState<HarvestLot>(initialLots[0])

  // Dynamic simulation state
  const [lotQuantity, setLotQuantity] = useState<number>(initialLots[0].quantity)
  const [freightVariance, setFreightVariance] = useState<number>(0)
  const [isFpoMode, setIsFpoMode] = useState<boolean>(false)

  // Unified Mandi Calculation Model
  const mandiCalculations = useMemo(() => {
    return computeMandiRealization(
      activeLot.baseCrop,
      lotQuantity,
      activeLot.location,
      freightVariance,
      isFpoMode
    )
  }, [activeLot.baseCrop, activeLot.location, lotQuantity, freightVariance, isFpoMode])

  // Modals state
  const [isBahiOpen, setIsBahiOpen] = useState(false)
  const [selectedMandiForBahi, setSelectedMandiForBahi] = useState<MandiCalculation | undefined>(undefined)

  const [isAiOpen, setIsAiOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined)

  const [isSwitchLotOpen, setIsSwitchLotOpen] = useState(false)
  const [isRegisterLotOpen, setIsRegisterLotOpen] = useState(false)

  const [isRouteOpen, setIsRouteOpen] = useState(false)
  const [routeTargetMandi, setRouteTargetMandi] = useState('Ahmedabad Wholesale Mandi (APMC Jamalpur)')

  const [isBookDriverOpen, setIsBookDriverOpen] = useState(false)
  const [isBookColdStorageOpen, setIsBookColdStorageOpen] = useState(false)
  const [isFpoPoolOpen, setIsFpoPoolOpen] = useState(false)

  const [contactBuyerData, setContactBuyerData] = useState<any | null>(null)
  const [isCessScheduleOpen, setIsCessScheduleOpen] = useState(false)
  const [isDisputeOpen, setIsDisputeOpen] = useState(false)

  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiPrompt(prompt)
    setIsAiOpen(true)
  }

  const handleLockSlot = (mandiName: string, netAmount: number) => {
    const found = mandiCalculations.find((m) => m.name.includes(mandiName) || mandiName.includes(m.name))
    setSelectedMandiForBahi(found ?? mandiCalculations[0])
    setIsBahiOpen(true)
    toast.success(`Slot locked for ${mandiName}! Generated official realization voucher.`)
  }

  const handleShareFPO = () => {
    const top = mandiCalculations[0]
    const text = `*KrishiIntel FPO Realization Ledger*
• Lot: ${activeLot.crop} (${lotQuantity} kg)
• Recommended APMC: ${top.name}
• Estimated Net In-Hand: ${money(top.totalNet)}
• FPO Shared Dispatch Target: 04:30 AM Tomorrow. Anand Tomato Producer Co. Ltd.`

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')
    toast.success('Realization Ledger summary copied & WhatsApp opened for FPO Group!')
  }

  const handleSearchQuery = (query: string) => {
    const q = query.toLowerCase()
    if (q.includes('mandi') || q.includes('rate') || q.includes('price') || q.includes('ભાવ')) {
      setActiveTab('market-intel')
    } else if (q.includes('buyer') || q.includes('ખરીદદાર') || q.includes('વેપારી')) {
      setActiveTab('buyers')
    } else if (q.includes('logistics') || q.includes('truck') || q.includes('વાહન')) {
      setActiveTab('logistics')
    } else if (q.includes('alert') || q.includes('warning') || q.includes('સૂચના')) {
      setActiveTab('alerts')
    } else {
      handleOpenAiWithPrompt(query)
    }
  }

  const handleSelectLot = (newLot: HarvestLot) => {
    setActiveLot(newLot)
    setLotQuantity(newLot.quantity)
    toast.success(`Active lot changed to ${newLot.crop} (${newLot.quantity} kg)`)
  }

  const handleSaveNewLot = (newLot: HarvestLot) => {
    setLots((prev) => [newLot, ...prev])
    setActiveLot(newLot)
    setLotQuantity(newLot.quantity)
  }

  const handleOpenRoute = (targetMandiName?: string) => {
    if (targetMandiName) {
      setRouteTargetMandi(targetMandiName)
    } else {
      setRouteTargetMandi(mandiCalculations[0]?.name ?? 'Ahmedabad Wholesale Mandi (APMC Jamalpur)')
    }
    setIsRouteOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#f7faf6] flex flex-col font-sans antialiased text-[#152e20]">
      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <KrishiSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            currentLang={currentLang}
            onLangChange={setCurrentLang}
            onOpenSwitchLot={() => setIsSwitchLotOpen(true)}
            activeLot={activeLot}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-xs">
            <div className="relative w-64 bg-white h-full shadow-2xl flex flex-col">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#edf4ec] text-[#143d2b]"
                aria-label="Close mobile navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
              <KrishiSidebar
                activeTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab)
                  setMobileMenuOpen(false)
                }}
                currentLang={currentLang}
                onLangChange={setCurrentLang}
                onOpenSwitchLot={() => {
                  setIsSwitchLotOpen(true)
                  setMobileMenuOpen(false)
                }}
                activeLot={activeLot}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-3 text-[#143d2b] hover:bg-[#edf5eb] shrink-0"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <KrishiTopbar
                currentLang={currentLang}
                onLangChange={setCurrentLang}
                onOpenNotifications={() => setActiveTab('alerts')}
                onSearchQuery={handleSearchQuery}
              />
            </div>
          </div>

          {/* Canvas */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
            {activeTab === 'dashboard' && (
              <KrishiDashboardView
                currentLang={currentLang}
                activeLot={activeLot}
                mandiCalculations={mandiCalculations}
                onOpenSwitchLot={() => setIsSwitchLotOpen(true)}
                onOpenRouteProtocol={() => handleOpenRoute()}
                onOpenBuyers={() => setActiveTab('buyers')}
                onOpenCalculator={() => setActiveTab('market-intel')}
                onAskAI={handleOpenAiWithPrompt}
                onViewEvidence={() => setActiveTab('evidence')}
                onLockSlot={handleLockSlot}
              />
            )}

            {activeTab === 'market-intel' && (
              <KrishiMarketIntelView
                currentLang={currentLang}
                activeLot={activeLot}
                mandiCalculations={mandiCalculations}
                lotQuantity={lotQuantity}
                setLotQuantity={setLotQuantity}
                freightVariance={freightVariance}
                setFreightVariance={setFreightVariance}
                isFpoMode={isFpoMode}
                setIsFpoMode={setIsFpoMode}
                onOpenKisanBahi={() => {
                  setSelectedMandiForBahi(mandiCalculations[0])
                  setIsBahiOpen(true)
                }}
                onLockSlot={handleLockSlot}
                onShareFPO={handleShareFPO}
                onViewRouteDetails={(name) => handleOpenRoute(name)}
                onOpenCessSchedule={() => setIsCessScheduleOpen(true)}
                onOpenDispute={() => setIsDisputeOpen(true)}
              />
            )}

            {activeTab === 'buyers' && (
              <KrishiBuyersView
                currentLang={currentLang}
                activeLot={activeLot}
                onContactBuyer={(buyer) => setContactBuyerData(buyer)}
              />
            )}

            {activeTab === 'my-crop' && (
              <KrishiMyCropView
                currentLang={currentLang}
                lots={lots}
                activeLot={activeLot}
                onSelectLot={handleSelectLot}
                onOpenRegisterLot={() => setIsRegisterLotOpen(true)}
              />
            )}

            {activeTab === 'sell-vs-wait' && (
              <KrishiSellVsWaitView
                currentLang={currentLang}
                activeLot={activeLot}
                mandiCalculation={mandiCalculations[0]}
              />
            )}

            {activeTab === 'net-calculator' && (
              <KrishiMarketIntelView
                currentLang={currentLang}
                activeLot={activeLot}
                mandiCalculations={mandiCalculations}
                lotQuantity={lotQuantity}
                setLotQuantity={setLotQuantity}
                freightVariance={freightVariance}
                setFreightVariance={setFreightVariance}
                isFpoMode={isFpoMode}
                setIsFpoMode={setIsFpoMode}
                onOpenKisanBahi={() => {
                  setSelectedMandiForBahi(mandiCalculations[0])
                  setIsBahiOpen(true)
                }}
                onLockSlot={handleLockSlot}
                onShareFPO={handleShareFPO}
                onViewRouteDetails={(name) => handleOpenRoute(name)}
                onOpenCessSchedule={() => setIsCessScheduleOpen(true)}
                onOpenDispute={() => setIsDisputeOpen(true)}
              />
            )}

            {activeTab === 'logistics' && (
              <KrishiLogisticsView
                currentLang={currentLang}
                activeLot={activeLot}
                onOpenBookDriver={() => setIsBookDriverOpen(true)}
                onOpenBookColdStorage={() => setIsBookColdStorageOpen(true)}
              />
            )}

            {activeTab === 'evidence' && <KrishiEvidenceView currentLang={currentLang} />}

            {activeTab === 'fpo' && (
              <KrishiFpoView
                currentLang={currentLang}
                activeLot={activeLot}
                onOpenFpoPool={() => setIsFpoPoolOpen(true)}
              />
            )}

            {activeTab === 'alerts' && (
              <KrishiAlertsView
                currentLang={currentLang}
                onOpenDriver={() => setIsBookDriverOpen(true)}
                onOpenRoute={() => handleOpenRoute()}
                onOpenBuyers={() => setActiveTab('buyers')}
              />
            )}
          </main>
        </div>
      </div>

      {/* Interactive Modals */}
      <KisanBahiSlipModal
        isOpen={isBahiOpen}
        onClose={() => setIsBahiOpen(false)}
        lot={activeLot}
        mandiCalculation={selectedMandiForBahi ?? mandiCalculations[0]}
        currentLang={currentLang}
      />

      <KisanAIAssistantModal
        isOpen={isAiOpen}
        onClose={() => {
          setIsAiOpen(false)
          setAiPrompt(undefined)
        }}
        initialPrompt={aiPrompt}
        currentLang={currentLang}
      />

      <SwitchLotModal
        isOpen={isSwitchLotOpen}
        onClose={() => setIsSwitchLotOpen(false)}
        lots={lots}
        activeLotId={activeLot.id}
        onSelectLot={handleSelectLot}
        onOpenRegisterLot={() => setIsRegisterLotOpen(true)}
        currentLang={currentLang}
      />

      <RegisterLotModal
        isOpen={isRegisterLotOpen}
        onClose={() => setIsRegisterLotOpen(false)}
        onSaveLot={handleSaveNewLot}
        currentLang={currentLang}
      />

      <RouteProtocolModal
        isOpen={isRouteOpen}
        onClose={() => setIsRouteOpen(false)}
        mandiName={routeTargetMandi}
        currentLang={currentLang}
      />

      <BookDriverModal
        isOpen={isBookDriverOpen}
        onClose={() => setIsBookDriverOpen(false)}
        lotQuantity={lotQuantity}
        currentLang={currentLang}
      />

      <BookColdStorageModal
        isOpen={isBookColdStorageOpen}
        onClose={() => setIsBookColdStorageOpen(false)}
        currentLang={currentLang}
      />

      <FpoPoolModal
        isOpen={isFpoPoolOpen}
        onClose={() => setIsFpoPoolOpen(false)}
        lotQuantity={lotQuantity}
        currentLang={currentLang}
      />

      <BuyerContactModal
        isOpen={Boolean(contactBuyerData)}
        onClose={() => setContactBuyerData(null)}
        buyer={contactBuyerData}
        lot={activeLot}
        currentLang={currentLang}
      />

      <MandiCessModal
        isOpen={isCessScheduleOpen}
        onClose={() => setIsCessScheduleOpen(false)}
        currentLang={currentLang}
      />

      <DisputeRateModal
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        currentLang={currentLang}
      />
    </div>
  )
}
