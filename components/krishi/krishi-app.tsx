'use client'

import React, { useState } from 'react'
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
} from './krishi-extra-views'
import {
  KisanBahiSlipModal,
  KisanAIAssistantModal,
  SwitchLotModal,
  RouteProtocolModal,
} from './krishi-modals'
import { Menu, X } from 'lucide-react'

export function KrishiApp() {
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard')
  const [currentLang, setCurrentLang] = useState<Language>('en')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Modals state
  const [isBahiOpen, setIsBahiOpen] = useState(false)
  const [isAiOpen, setIsAiOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined)
  const [isSwitchLotOpen, setIsSwitchLotOpen] = useState(false)
  const [isRouteOpen, setIsRouteOpen] = useState(false)
  const [lockedSlotInfo, setLockedSlotInfo] = useState<{ mandi: string; net: number } | null>(null)

  // Selected Lot
  const [currentLot, setCurrentLot] = useState({
    crop: 'Tomato (Tameta)',
    qty: 500,
    grade: 'Grade A',
    loc: 'Anand',
  })

  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiPrompt(prompt)
    setIsAiOpen(true)
  }

  const handleLockSlot = (mandiName: string, netAmount: number) => {
    setLockedSlotInfo({ mandi: mandiName, net: netAmount })
    setIsBahiOpen(true)
  }

  const handleShareFPO = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        'KrishiIntel Bahi-Khata: Anand Local APMC nets ₹13,500 for Lot #4 (Tomato 500kg). FPO group shared truck dispatch verified for 04:30 AM.'
      )
    }
    alert('Realization Ledger summary copied! Shared to Anand Tomato FPO WhatsApp Group.')
  }

  const handleSearchQuery = (query: string) => {
    if (query.toLowerCase().includes('mandi') || query.toLowerCase().includes('rate') || query.toLowerCase().includes('price')) {
      setActiveTab('market-intel')
    } else if (query.toLowerCase().includes('buyer')) {
      setActiveTab('buyers')
    } else {
      handleOpenAiWithPrompt(query)
    }
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
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-xs">
            <div className="relative w-64 bg-white h-full shadow-2xl flex flex-col">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#edf4ec] text-[#143d2b]"
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
                onOpenSwitchLot={() => setIsSwitchLotOpen(true)}
                onOpenRouteProtocol={() => setIsRouteOpen(true)}
                onOpenBuyers={() => setActiveTab('buyers')}
                onOpenCalculator={() => setActiveTab('market-intel')}
                onAskAI={handleOpenAiWithPrompt}
                onViewEvidence={() => setActiveTab('evidence')}
              />
            )}

            {activeTab === 'market-intel' && (
              <KrishiMarketIntelView
                currentLang={currentLang}
                onOpenKisanBahi={() => setIsBahiOpen(true)}
                onLockSlot={handleLockSlot}
                onShareFPO={handleShareFPO}
                onViewRouteDetails={() => setIsRouteOpen(true)}
              />
            )}

            {activeTab === 'buyers' && <KrishiBuyersView currentLang={currentLang} />}
            {activeTab === 'my-crop' && <KrishiMyCropView />}
            {activeTab === 'sell-vs-wait' && <KrishiSellVsWaitView />}
            {activeTab === 'net-calculator' && (
              <KrishiMarketIntelView
                currentLang={currentLang}
                onOpenKisanBahi={() => setIsBahiOpen(true)}
                onLockSlot={handleLockSlot}
                onShareFPO={handleShareFPO}
                onViewRouteDetails={() => setIsRouteOpen(true)}
              />
            )}
            {activeTab === 'logistics' && <KrishiLogisticsView />}
            {activeTab === 'evidence' && <KrishiEvidenceView />}
            {activeTab === 'fpo' && <KrishiFpoView />}
            {activeTab === 'alerts' && <KrishiSellVsWaitView />}
          </main>
        </div>
      </div>

      {/* Interactive Modals */}
      <KisanBahiSlipModal
        isOpen={isBahiOpen}
        onClose={() => setIsBahiOpen(false)}
        lotQuantity={currentLot.qty}
        selectedMandi={lockedSlotInfo?.mandi ?? 'Anand Local Mandi'}
        netAmount={lockedSlotInfo?.net ?? 13500}
      />

      <KisanAIAssistantModal
        isOpen={isAiOpen}
        onClose={() => {
          setIsAiOpen(false)
          setAiPrompt(undefined)
        }}
        initialPrompt={aiPrompt}
      />

      <SwitchLotModal
        isOpen={isSwitchLotOpen}
        onClose={() => setIsSwitchLotOpen(false)}
        onSelectLot={(lot) => {
          setCurrentLot(lot)
          alert(`Switched to ${lot.crop} (${lot.qty} kg). Re-running telemetry for ${lot.loc}...`)
        }}
      />

      <RouteProtocolModal
        isOpen={isRouteOpen}
        onClose={() => setIsRouteOpen(false)}
        mandiName="Ahmedabad Wholesale Mandi (APMC Jamalpur)"
      />
    </div>
  )
}
