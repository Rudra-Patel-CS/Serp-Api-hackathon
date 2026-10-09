'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Sprout, ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useDemo } from './provider'
import { PageHeading, LinkButton, StatusBadge, SelectField, BackLink, Note, EmptyPanel, useWorkspace } from './shell'
import { OpportunityCard } from './intelligence'
import { BuyerCard, OfferComposer } from './buyer-pages'
import { crops, locations, analyzeMarkets, matchingBuyers, buyers, number, type Lot, type Crop } from '@/lib/market-service'

export function LotCard({ lot }: { lot: Lot }) {
  const { t } = useDemo()
  const { base, role } = useWorkspace()
  return <article className="lot-card"><div className="lot-card-heading"><span className="lot-symbol"><Sprout size={23} /></span><div><h3>{t(lot.crop)}</h3><span className="small-muted">{lot.id} · {t('sample')}</span></div><StatusBadge status={lot.status} /></div><dl className="lot-facts"><div><dt>{t('Quantity')}</dt><dd>{number(lot.quantity)} kg</dd></div><div><dt>{t('Grade')}</dt><dd>{lot.grade}</dd></div><div><dt>{t('Location')}</dt><dd>{lot.location}, Gujarat</dd></div><div><dt>{t('sellingDate')}</dt><dd>{t(lot.date)}</dd></div></dl><div className="lot-card-footer"><span>{role === 'farmer' ? `${t('harvestDate')}: ${lot.harvest}` : lot.farmer}</span><LinkButton href={`${base}/lots/${lot.id}`} variant="ghost" arrow>{t('viewLot')}</LinkButton></div></article>
}
export function LotsPage() {
  const { t, lots, setAnalysis } = useDemo()
  const { base, role } = useWorkspace()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [grouped, setGrouped] = useState(false)
  const visible = lots.filter(lot => filter === 'all' || lot.crop === filter)
  const groups = crops.map(crop => ({ crop, lots: visible.filter(lot => lot.crop === crop) })).filter(group => group.lots.length)
  return <><PageHeading eyebrow={t(role === 'fpo' ? 'aggregatedLots' : role === 'buyer' ? 'Lots' : 'My lots')} title={t(role === 'buyer' ? 'buyerHome' : 'activeLots')} description={t(role === 'buyer' ? 'buyerHomeIntro' : 'lotsIntro')} action={role !== 'buyer' && <Button onClick={() => setOpen(true)}><Plus data-icon="inline-start" />{t('addLot')}</Button>} /><div className="filter-bar"><SelectField id="lot-crop-filter" label={t('Crop')} value={filter} onChange={setFilter} options={['all', ...crops].map(value => ({ value, label: t(value === 'all' ? 'allCrops' : value) }))} />{role === 'fpo' && <label className="toggle-label"><input type="checkbox" checked={grouped} onChange={e => setGrouped(e.target.checked)} />{t('groupCrop')}</label>}{role !== 'buyer' && <LinkButton href={`${base}/offers`} variant="outline">{t('Offers')}</LinkButton>}</div><div className="lots-list">{grouped ? groups.map(group => <article className="aggregate-row" key={group.crop}><div><h3>{t(group.crop)}</h3><p>{group.lots.length} {t('Lots')} · {group.lots.map(lot => lot.farmer).join(', ')}</p></div><strong>{number(group.lots.reduce((sum, lot) => sum + lot.quantity, 0))} kg</strong><Button variant="outline" onClick={() => { setAnalysis({ ...group.lots[0], quantity: group.lots.reduce((sum, lot) => sum + lot.quantity, 0) }); router.push(`${base}/market`) }}>{t('analyze')}<ArrowRight data-icon="inline-end" /></Button></article>) : visible.map(lot => <LotCard key={lot.id} lot={lot} />)}</div>{!visible.length && <EmptyPanel title={t('noLots')} description={t('noLotsBody')} />}<AddLotDialog open={open} onClose={() => setOpen(false)} /></>
}
function AddLotDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, analysis, addLot } = useDemo()
  const [crop, setCrop] = useState<Crop>(analysis.crop)
  const [quantity, setQuantity] = useState(String(analysis.quantity))
  const [location, setLocation] = useState(analysis.location)
  const [grade, setGrade] = useState('A')
  const [date, setDate] = useState('Tomorrow')
  const [harvest, setHarvest] = useState('2026-10-09')
  function submit(event: FormEvent) { event.preventDefault(); if (!Number.isFinite(Number(quantity)) || Number(quantity) < 1 || Number(quantity) > 1000000 || !harvest) return; addLot({ id: `LOT-${crypto.randomUUID().slice(0, 6)}`, crop, quantity: Number(quantity), location, date, grade, status: 'Available', farmer: 'Demo farmer', harvest }); onClose(); toast.success(t('saved')) }
  return <Dialog open={open} onOpenChange={value => !value && onClose()}><DialogContent><DialogHeader><DialogTitle>{t('addLot')}</DialogTitle><DialogDescription>{t('demoNotice')}</DialogDescription></DialogHeader><form onSubmit={submit}><FieldGroup><SelectField id="new-crop" label={t('Crop')} value={crop} onChange={value => setCrop(value as Crop)} options={crops.map(value => ({ value, label: t(value) }))} /><Field><FieldLabel htmlFor="new-quantity">{t('Quantity')} (kg)</FieldLabel><Input required id="new-quantity" type="number" min={1} max={1000000} step={1} value={quantity} onChange={e => setQuantity(e.target.value)} /></Field><SelectField id="new-location" label={t('Location')} value={location} onChange={setLocation} options={locations.map(value => ({ value, label: value }))} /><SelectField id="new-grade" label={t('Grade')} value={grade} onChange={setGrade} options={['A', 'B'].map(value => ({ value, label: value }))} /><Field><FieldLabel htmlFor="new-harvest">{t('harvestDate')}</FieldLabel><Input id="new-harvest" type="date" value={harvest} onChange={e => setHarvest(e.target.value)} required /></Field><SelectField id="new-date" label={t('sellingDate')} value={date} onChange={setDate} options={['Today', 'Tomorrow', 'In 2 days'].map(value => ({ value, label: t(value) }))} /><Button type="submit" size="lg">{t('saveDraft')}<ArrowRight data-icon="inline-end" /></Button></FieldGroup></form></DialogContent></Dialog>
}
export function LotDetail({ id }: { id: string }) {
  const { t, lots, offers, setAnalysis } = useDemo()
  const { base, role } = useWorkspace()
  const [open, setOpen] = useState(false)
  const lot = lots.find(item => item.id === id)
  if (!lot) return <EmptyPanel title={t('notFound')} description={t('noLotsBody')} href={`${base}/lots`} action={t('Lots')} />
  const matches = matchingBuyers(lot)
  const linkedOffers = offers.filter(offer => offer.lotId === id)
  return <><BackLink href={`${base}/lots`}>{t('Lots')}</BackLink><PageHeading eyebrow={lot.id} title={`${t(lot.crop)} · ${number(lot.quantity)} kg`} action={<StatusBadge status={lot.status} />} /><div className="detail-columns"><section className="panel"><h2>{t('lotDetails')}</h2><dl className="detail-facts">{[['seller', lot.farmer], ['Crop', t(lot.crop)], ['Quantity', `${number(lot.quantity)} kg`], ['Grade', lot.grade], ['Location', `${lot.location}, Gujarat`], ['harvestDate', lot.harvest], ['sellingDate', t(lot.date)]].map(([label, value]) => <div key={label}><dt>{t(label)}</dt><dd>{value}</dd></div>)}</dl><div className="detail-actions">{role === 'buyer' ? <Button onClick={() => setOpen(true)}>{t('makeOffer')}</Button> : <LinkButton href={`${base}/market`} arrow onClick={() => setAnalysis(lot)}>{t('analyze')}</LinkButton>}</div></section><OpportunityCard market={analyzeMarkets(lot)[0]} input={lot} base={base} /></div><div className="section-heading mt-8"><h2>{t('Offers')}</h2><LinkButton href={`${base}/offers`} variant="ghost" arrow>{t('Offers')}</LinkButton></div>{linkedOffers.length ? linkedOffers.map(offer => <div key={offer.id} className="recent-lot"><div><strong>{buyers.find(b => b.id === offer.buyerId)?.name}</strong><span className="small-muted">{offer.id}</span></div><StatusBadge status={offer.status} /><LinkButton href={`${base}/offers/${offer.id}`} variant="outline">{t('review')}</LinkButton></div>) : <Note>{t('noOffersBody')}</Note>}<div className="section-heading mt-8"><h2>{t('compatible')}</h2></div><div className="buyer-grid">{matches.map(buyer => <BuyerCard key={buyer.id} buyer={buyer} onSelect={() => setAnalysis(lot)} />)}</div>{matches.length === 0 && <EmptyPanel title={t('noBuyers')} description={t('noBuyersBody')} />}<OfferComposer open={open} onClose={() => setOpen(false)} buyer={matches[0] ?? buyers[0]} fixedLot={lot} /></>
}
export function FpoOverview() {
  const { t, lots, setAnalysis } = useDemo()
  const router = useRouter()
  const total = lots.reduce((sum, lot) => sum + lot.quantity, 0)
  const distinctFarmers = new Set(lots.map(lot => lot.farmer)).size
  const matched = new Set(lots.flatMap(lot => matchingBuyers(lot).map(buyer => buyer.id))).size
  return <><PageHeading eyebrow="Anand Growers Collective" title={t('fpoOverview')} description={t('fpoIntro')} action={<LinkButton href="/demo/fpo/lots" arrow>{t('aggregatedLots')}</LinkButton>} /><div className="stats-grid">{[['totalQuantity', number(total), 'kg'], ['members', distinctFarmers, ''], ['activeLots', lots.filter(lot => lot.status !== 'Sold').length, ''], ['buyerMatches', matched, '']].map(([label, value, unit]) => <div className="stat-item" key={label}><span>{t(String(label))}</span><strong>{value} <small>{unit}</small></strong></div>)}</div><div className="section-heading"><h2>{t('opportunity')}</h2><Badge variant="outline">{t('sample')}</Badge></div><div className="lots-list">{crops.map(crop => ({ crop, lots: lots.filter(lot => lot.crop === crop) })).filter(group => group.lots.length).map(group => <article className="aggregate-row" key={group.crop}><span className="lot-symbol"><Sprout size={20} /></span><div className="flex-1"><h3>{t(group.crop)}</h3><p>{group.lots.length} {t('Lots')} · {number(group.lots.reduce((sum, lot) => sum + lot.quantity, 0))} kg</p></div><Button variant="outline" onClick={() => { setAnalysis({ ...group.lots[0], quantity: group.lots.reduce((sum, lot) => sum + lot.quantity, 0) }); router.push('/demo/fpo/market') }}>{t('analyze')}<ArrowRight data-icon="inline-end" /></Button></article>)}</div><div className="section-heading mt-8"><h2>{t('bulkBuyers')}</h2><LinkButton href="/demo/fpo/buyers" variant="ghost" arrow>{t('Buyers')}</LinkButton></div><div className="buyer-grid">{buyers.filter(buyer => buyer.max >= 5000).slice(0, 2).map(buyer => <BuyerCard key={buyer.id} buyer={buyer} />)}</div></>
}
