'use client'

import { AppShell } from './shell'
import { FarmerHome, MarketPage } from './market-pages'
import { BuyersPage, BuyerDetail } from './buyer-pages'
import { LotsPage, LotDetail, FpoOverview } from './lot-pages'
import { OffersPage, OfferDetail, TransactionsPage, AlertsPage } from './offer-pages'
import { ProfilePage } from './account-pages'
import { KrishiApp } from './krishi-app'

export function Workspace({ path, tab }: { path: string[]; tab?: string }) {
  const [, role, section, id] = path

  if (role === 'farmer') {
    return <KrishiApp />
  }

  let content
  if (!section) content = role === 'fpo' ? <FpoOverview /> : <LotsPage />
  else if (section === 'market') content = <MarketPage tab={tab} />
  else if (section === 'buyers') content = id ? <BuyerDetail id={id} /> : <BuyersPage />
  else if (section === 'lots') content = id ? <LotDetail id={id} /> : <LotsPage />
  else if (section === 'offers') content = id ? <OfferDetail id={id} /> : <OffersPage />
  else if (section === 'transactions') content = <TransactionsPage id={id} />
  else if (section === 'alerts') content = <AlertsPage />
  else content = <ProfilePage />
  return <AppShell>{content}</AppShell>
}
