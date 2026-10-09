'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, ArrowRight, ShieldCheck, Phone, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useDemo } from './provider'
import { PageHeading, LinkButton, SelectField, BackLink, EmptyPanel, Note, useWorkspace } from './shell'
import { buyers, crops, money, type Buyer, type Crop, type Lot } from '@/lib/market-service'

export function BuyerCard({ buyer, onSelect }: { buyer: Buyer; onSelect?: () => void }) {
  const { t } = useDemo()
  const { base } = useWorkspace()
  return <article className="buyer-card"><div className="buyer-card-top"><span className="buyer-monogram">{buyer.initials}</span><div><h3>{buyer.name}</h3><p>{t(buyer.type)} · {buyer.city}</p></div><div className="buyer-match"><strong>{buyer.score}%</strong><small>{t('match')}</small></div></div><Badge variant="secondary"><ShieldCheck data-icon="inline-start" />{t(buyer.verification)}</Badge><dl className="buyer-info"><div><dt>{t('requiredQuantity')}</dt><dd>{buyer.min.toLocaleString('en-IN')}–{buyer.max.toLocaleString('en-IN')} kg</dd></div><div><dt>{t('Grade')}</dt><dd>{buyer.grade}</dd></div><div><dt>{t('Crop')}</dt><dd>{buyer.crops.map(t).join(', ')}</dd></div><div><dt>{t('Location')}</dt><dd>{buyer.city}, Gujarat</dd></div></dl><div className="buyer-card-footer"><span className="small-muted">{t('sample')}</span><Link href={`${base}/buyers/${buyer.id}`} onClick={onSelect} className="text-link">{t('viewBuyer')}<ArrowRight size={15} /></Link></div></article>
}
export function BuyersPage() {
  const { t, analysis, setAnalysis } = useDemo()
  const { role } = useWorkspace()
  const [query, setQuery] = useState('')
  const [crop, setCrop] = useState<Crop>(analysis.crop)
  const [quantity, setQuantity] = useState(String(analysis.quantity))
  const [type, setType] = useState('all')
  const filtered = buyers.filter(buyer => buyer.crops.includes(crop) && Number(quantity) >= buyer.min && Number(quantity) <= buyer.max && (type === 'all' || buyer.type === type) && `${buyer.name} ${buyer.city}`.toLowerCase().includes(query.toLowerCase()))
  return <><PageHeading eyebrow={t(role === 'fpo' ? 'bulkBuyers' : 'Buyers')} title={t('buyersTitle')} description={t('buyersIntro')} /><FieldGroup className="filter-bar"><Field><FieldLabel htmlFor="buyer-search">{t('searchBuyers')}</FieldLabel><Input id="buyer-search" placeholder={t('searchBuyers')} value={query} onChange={e => setQuery(e.target.value)} /></Field><SelectField id="buyer-crop" label={t('Crop')} value={crop} onChange={value => setCrop(value as Crop)} options={crops.map(value => ({ value, label: t(value) }))} /><Field><FieldLabel htmlFor="buyer-quantity">{t('Quantity')} (kg)</FieldLabel><Input id="buyer-quantity" type="number" min={1} max={1000000} value={quantity} onChange={e => setQuantity(e.target.value)} className="w-28" /></Field><SelectField id="buyer-type" label={t('Buyer')} value={type} onChange={setType} options={['all', 'Wholesaler', 'Trader', 'Processor'].map(value => ({ value, label: t(value === 'all' ? 'allTypes' : value) }))} /></FieldGroup><div className="results-caption"><span>{filtered.length} {t('compatible')} · {t(crop)} · {quantity || '0'} kg</span><span>{t('sample')}</span></div>{filtered.length ? <div className="buyer-grid">{filtered.map(buyer => <BuyerCard key={buyer.id} buyer={buyer} onSelect={() => setAnalysis({ ...analysis, crop, quantity: Number(quantity) })} />)}</div> : <><EmptyPanel title={t('noBuyers')} description={t('noBuyersBody')} /><Button variant="outline" className="mt-5" onClick={() => { setQuery(''); setType('all'); setCrop('Tomato'); setQuantity('500') }}>{t('clearFilters')}</Button></>}</>
}
export function BuyerDetail({ id }: { id: string }) {
  const { t } = useDemo()
  const { base } = useWorkspace()
  const [offerOpen, setOfferOpen] = useState(false)
  const buyer = buyers.find(item => item.id === id)
  if (!buyer) return <EmptyPanel title={t('notFound')} description={t('noBuyersBody')} href={`${base}/buyers`} action={t('Buyers')} />
  return <><BackLink href={`${base}/buyers`}>{t('Buyers')}</BackLink><div className="detail-hero"><span className="buyer-monogram">{buyer.initials}</span><div><h1>{buyer.name}</h1><p><MapPin size={13} />{buyer.city}, Gujarat · {t(buyer.type)}</p></div></div><div className="detail-columns"><section className="panel"><Badge variant="secondary"><ShieldCheck />{t(buyer.verification)}</Badge><p className="mt-5">{t(buyer.description)}</p><h2 className="mt-7">{t('buyerRequirements')}</h2><dl className="detail-facts"><div><dt>{t('Crop')}</dt><dd>{buyer.crops.map(t).join(', ')}</dd></div><div><dt>{t('requiredQuantity')}</dt><dd>{buyer.min.toLocaleString('en-IN')}–{buyer.max.toLocaleString('en-IN')} kg</dd></div><div><dt>{t('Grade')}</dt><dd>{buyer.grade}</dd></div><div><dt>{t('terms')}</dt><dd>{t(buyer.terms)}</dd></div></dl></section><aside className="panel"><span className="eyebrow">{t('sample')}</span><h2 className="mt-3">{t('makeOffer')}</h2><p className="mt-3">{t('offerIntro')}</p><div className="detail-actions"><Button size="lg" onClick={() => setOfferOpen(true)}><FileText data-icon="inline-start" />{t('makeOffer')}</Button><Button size="lg" variant="outline" onClick={() => toast.info(t('contactUnavailable'))}><Phone data-icon="inline-start" />{t('contactBuyer')}</Button></div></aside></div><div className="mt-6"><Note>{t('buyersIntro')}</Note></div><OfferComposer buyer={buyer} open={offerOpen} onClose={() => setOfferOpen(false)} /></>
}
export function OfferComposer({ buyer, open, onClose, fixedLot }: { buyer: Buyer; open: boolean; onClose: () => void; fixedLot?: Lot }) {
  const { t, lots, analysis, addOffer } = useDemo()
  const { base } = useWorkspace()
  const router = useRouter()
  const compatible = lots.filter(lot => buyer.crops.includes(lot.crop) && lot.quantity >= buyer.min && lot.quantity <= buyer.max && buyer.grade.includes(lot.grade) && ['Available', 'Matched'].includes(lot.status))
  const [lotId, setLotId] = useState(fixedLot?.id ?? compatible.find(lot => lot.crop === analysis.crop)?.id ?? compatible[0]?.id ?? '')
  const [price, setPrice] = useState('36')
  const lot = fixedLot ?? compatible.find(item => item.id === lotId) ?? compatible[0]
  function submit(event: FormEvent) {
    event.preventDefault()
    if (!lot || !Number.isFinite(Number(price)) || Number(price) <= 0 || Number(price) > 10000) return
    const id = `OFF-${crypto.randomUUID().slice(0, 8)}`
    addOffer({ id, buyerId: buyer.id, lotId: lot.id, crop: lot.crop, quantity: lot.quantity, price: Number(price), status: 'Draft', date: new Date().toISOString() })
    toast.success(t('saved')); onClose(); router.push(`${base}/offers/${id}`)
  }
  return <Dialog open={open} onOpenChange={value => !value && onClose()}><DialogContent><DialogHeader><DialogTitle>{t('makeOffer')}</DialogTitle><DialogDescription>{buyer.name} · {t('offerIntro')}</DialogDescription></DialogHeader>{lot ? <form onSubmit={submit}><FieldGroup><SelectField id="offer-lot" label={t('Lots')} value={lot.id} onChange={setLotId} options={(fixedLot ? [fixedLot] : compatible).map(item => ({ value: item.id, label: `${item.id} · ${t(item.crop)} · ${item.quantity} kg` }))} /><Field><FieldLabel htmlFor="offer-price">{t('pricePerKg')}</FieldLabel><Input id="offer-price" type="number" min={0.01} max={10000} step={0.01} value={price} onChange={e => setPrice(e.target.value)} required /></Field><div className="offer-summary"><span>{t('offerValue')}</span><strong>{money(lot.quantity * (Number(price) || 0))}</strong></div><Note>{t('demoNotice')}</Note><Button type="submit" size="lg">{t('saveDraft')}<ArrowRight data-icon="inline-end" /></Button></FieldGroup></form> : <EmptyPanel title={t('noLots')} description={t('noOffersBody')} href={`${base}/lots`} action={t('addLot')} />}<DialogFooter><Button variant="outline" onClick={onClose}>{t('cancel')}</Button></DialogFooter></DialogContent></Dialog>
}
