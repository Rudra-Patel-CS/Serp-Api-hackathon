'use client'

import { useState } from 'react'
import { Check, Package, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useDemo } from './provider'
import { PageHeading, LinkButton, EmptyPanel, StatusBadge, BackLink, Note, useWorkspace } from './shell'
import { buyers, money, analyzeMarkets, type Offer } from '@/lib/market-service'

function OfferCard({ offer, transaction = false }: { offer: Offer; transaction?: boolean }) {
  const { t } = useDemo()
  const { base } = useWorkspace()
  const buyer = buyers.find(item => item.id === offer.buyerId)
  return <article className="offer-card"><div className="offer-card-heading"><div><h3>{buyer?.name}</h3><p className="small-muted mt-1">{offer.id} · {t('sample')}</p></div><StatusBadge status={transaction ? 'Pending' : offer.status} /></div><dl className="lot-facts"><div><dt>{t('Crop')}</dt><dd>{t(offer.crop)}</dd></div><div><dt>{t('Quantity')}</dt><dd>{offer.quantity.toLocaleString('en-IN')} kg</dd></div><div><dt>{t('Price')}</dt><dd>{money(offer.price)} / kg</dd></div><div><dt>{t('Value')}</dt><dd>{money(offer.quantity * offer.price)}</dd></div></dl><div className="lot-card-footer"><span>{offer.lotId}</span><LinkButton href={`${base}/${transaction ? 'transactions' : 'offers'}/${offer.id}`} variant="outline" arrow>{t(transaction ? 'transactionDetails' : 'review')}</LinkButton></div></article>
}
export function OffersPage() {
  const { t, offers } = useDemo()
  const { base } = useWorkspace()
  return <><PageHeading title={t('Offers')} description={t('offerIntro')} />{offers.length ? offers.map(offer => <OfferCard offer={offer} key={offer.id} />) : <EmptyPanel title={t('noOffers')} description={t('noOffersBody')} href={`${base}/buyers`} action={t('findBuyers')} />}</>
}
export function OfferDetail({ id }: { id: string }) {
  const { t, offers, lots, decideOffer } = useDemo()
  const { base } = useWorkspace()
  const [decision, setDecision] = useState<'Accepted' | 'Rejected' | null>(null)
  const offer = offers.find(item => item.id === id)
  if (!offer) return <EmptyPanel title={t('notFound')} description={t('demoNotice')} href={`${base}/offers`} action={t('Offers')} />
  const buyer = buyers.find(item => item.id === offer.buyerId)
  const lot = lots.find(item => item.id === offer.lotId)
  const market = lot ? analyzeMarkets(lot).find(item => item.name === buyer?.city) ?? analyzeMarkets(lot)[0] : null
  const net = offer.quantity * offer.price - (market?.transport ?? 0) - offer.quantity * 0.4
  function confirm() { if (!decision || !offer) return; decideOffer(offer.id, decision); setDecision(null); toast.success(t('decisionSaved')) }
  return <><BackLink href={`${base}/offers`}>{t('Offers')}</BackLink><PageHeading eyebrow={offer.id} title={t('offerDetails')} action={<StatusBadge status={offer.status} />} /><div className="detail-columns"><section className="panel"><h2>{buyer?.name}</h2><dl className="detail-facts">{[['seller', lot?.farmer ?? 'Demo farmer'], ['Crop', t(offer.crop)], ['Quantity', `${offer.quantity.toLocaleString('en-IN')} kg`], ['Price', `${money(offer.price)} / kg`], ['offerValue', money(offer.quantity * offer.price)], ['net', money(net)], ['validFor', t('day')]].map(([label, value]) => <div key={label}><dt>{t(label)}</dt><dd>{value}</dd></div>)}</dl><p className="small-muted mt-6">{t('afterCosts')} · {t('notForecast')}</p><div className="mt-6"><LinkButton href={`${base}/lots/${offer.lotId}`} variant="outline">{t('viewLot')}</LinkButton></div></section><aside className="panel"><span className="eyebrow">{t('demo')}</span><h2 className="mt-3">{t('review')}</h2><p className="page-description">{t('confirmBody')}</p>{offer.status === 'Draft' ? <div className="detail-actions"><Button onClick={() => setDecision('Accepted')}><Check data-icon="inline-start" />{t('accept')}</Button><Button variant="outline" onClick={() => setDecision('Rejected')}>{t('reject')}</Button></div> : offer.status === 'Accepted' ? <div className="mt-6"><LinkButton href={`${base}/transactions/${offer.id}`} arrow>{t('transactionDetails')}</LinkButton></div> : <div className="mt-6"><StatusBadge status="Rejected" /></div>}</aside></div><Dialog open={Boolean(decision)} onOpenChange={open => !open && setDecision(null)}><DialogContent><DialogHeader><DialogTitle>{t('confirmTitle')}</DialogTitle><DialogDescription>{t('confirmBody')}</DialogDescription></DialogHeader><p>{buyer?.name} · {money(offer.quantity * offer.price)}</p><Badge variant="outline">{t(decision ?? 'Draft')}</Badge><DialogFooter><Button variant="outline" onClick={() => setDecision(null)}>{t('cancel')}</Button><Button onClick={confirm}>{t('confirm')}</Button></DialogFooter></DialogContent></Dialog></>
}
export function TransactionsPage({ id }: { id?: string }) {
  const { t, offers, lots } = useDemo()
  const { base } = useWorkspace()
  const accepted = offers.filter(offer => offer.status === 'Accepted')
  if (id) {
    const offer = accepted.find(item => item.id === id)
    if (!offer) return <EmptyPanel title={t('notFound')} description={t('noTransactionsBody')} href={`${base}/transactions`} action={t('Transactions')} />
    return <><BackLink href={`${base}/transactions`}>{t('Transactions')}</BackLink><PageHeading eyebrow={offer.id} title={t('transactionDetails')} action={<StatusBadge status="Pending" />} /><div className="detail-columns"><section className="panel"><h2>{buyers.find(item => item.id === offer.buyerId)?.name}</h2><dl className="detail-facts">{[['seller', lots.find(lot => lot.id === offer.lotId)?.farmer ?? 'Demo farmer'], ['Crop', t(offer.crop)], ['Quantity', `${offer.quantity.toLocaleString('en-IN')} kg`], ['Price', `${money(offer.price)} / kg`], ['Value', money(offer.quantity * offer.price)], ['Date', new Date(offer.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })]].map(([label, value]) => <div key={label}><dt>{t(label)}</dt><dd>{value}</dd></div>)}</dl><div className="mt-6"><LinkButton href={`${base}/offers/${offer.id}`} variant="outline">{t('offerDetails')}</LinkButton></div></section><section className="panel"><h2>{t('Status')}</h2><div className="transaction-timeline"><div className="timeline-step"><span><FileText size={15} /></span>{t('Draft')}</div><div className="timeline-step"><span><Check size={15} /></span>{t('Accepted')} · {t('demo')}</div><div className="timeline-step"><span><Clock size={15} /></span>{t('deliveryPending')}</div></div></section></div><div className="mt-6"><Note>{t('noPayment')}</Note></div></>
  }
  return <><PageHeading title={t('Transactions')} description={t('transactionIntro')} />{accepted.length ? accepted.map(offer => <OfferCard key={offer.id} offer={offer} transaction />) : <EmptyPanel title={t('noTransactions')} description={t('noTransactionsBody')} href={`${base}/offers`} action={t('Offers')} />}</>
}
export function AlertsPage() {
  const { t } = useDemo()
  const { base } = useWorkspace()
  return <><PageHeading eyebrow={t('Alerts')} title={t('alertsTitle')} /><EmptyPanel title={t('noAlerts')} description={t('noAlertsBody')} href={`${base}/offers`} action={t('Offers')} /></>
}
