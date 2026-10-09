'use client'

import { useState } from 'react'
import { ArrowUpRight, ArrowRight, Check, TrendingUp, Truck, Users, FileText, MapPin, ShieldCheck, X } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useDemo } from './provider'
import { LinkButton, Note } from './shell'
import { money, evidence, type Market, type Evidence, type AnalysisInput } from '@/lib/market-service'
import { cn } from '@/lib/utils'

export function OpportunityCard({ market, compact = false, base = '/demo/farmer', input }: { market: Market; compact?: boolean; base?: string; input?: AnalysisInput }) {
  const { t, setAnalysis } = useDemo()
  const preserveContext = () => { if (input) setAnalysis(input) }
  return <article className={cn('opportunity-card', compact && 'opportunity-compact')}><div className="opportunity-top"><span className="eyebrow"><span className="status-dot" />{t('bestMarket')}</span><Badge variant="outline">{t('sample')}</Badge></div><div className="opportunity-main"><div><h2>{market.name}</h2><p className="small-muted"><MapPin size={13} />{input ? `${market.distance} km · ${t(input.crop)} · ${input.quantity.toLocaleString('en-IN')} kg` : 'Gujarat, India'}</p></div><div className="score"><strong>{market.score}</strong><span>/ 100</span><small>{t('strong')}</small></div></div><Separator /><div className="realization"><div><span className="small-muted">{t('net')}</span><p className="money-value">{money(market.net)}</p></div><div className="realization-note"><ArrowUpRight size={17} /><span>{t('afterCosts')}</span></div></div>{!compact && <div className="opportunity-signals">{['High demand', 'suitableBuyers', 'goodLogistics'].map(key => <span key={key}><Check size={14} />{t(key)}</span>)}</div>}<div className="opportunity-actions"><LinkButton href={`${base}/market?tab=why`} variant="outline" arrow onClick={preserveContext}>{t('seeWhy')}</LinkButton><LinkButton href={`${base}/buyers`} arrow onClick={preserveContext}>{t('findBuyers')}</LinkButton></div></article>
}
export function MarketTable({ markets }: { markets: Market[] }) {
  const { t } = useDemo()
  return <div className="market-table-wrap"><table className="market-table"><thead><tr>{['Market', 'Price', 'Distance', 'Demand', 'Transport', 'net', 'score'].map(key => <th key={key}>{t(key)}</th>)}</tr></thead><tbody>{markets.map((market, index) => <tr key={market.name} className={cn(index === 0 && 'recommended-row')}><td data-label={t('Market')}><strong>{market.name}</strong>{index === 0 && <span className="table-recommendation"><Check size={12} />{t('recommended')}</span>}</td><td data-label={t('Price')}>{money(market.price)}<span className="small-muted"> / kg</span></td><td data-label={t('Distance')}>{market.distance} km</td><td data-label={t('Demand')}><span className="demand-label">{t(market.demand)}</span></td><td data-label={t('Transport')}>{money(market.transport)}</td><td data-label={t('net')}><strong>{money(market.net)}</strong></td><td data-label={t('score')}><strong className="text-primary">{market.score}</strong><span className="small-muted"> / 100</span></td></tr>)}</tbody></table></div>
}
export function EvidenceList({ compact = false }: { compact?: boolean }) {
  const { t } = useDemo()
  const [selected, setSelected] = useState<Evidence | null>(null)
  const icons = [Users, TrendingUp, Truck]
  return <><div className={cn('evidence-list', compact && 'evidence-compact')}>{evidence.map((item, index) => { const Icon = icons[index]; return <button className="evidence-item" key={item.id} onClick={() => setSelected(item)}><span className="evidence-icon"><Icon size={20} strokeWidth={1.6} /></span><span className="evidence-copy"><span className="eyebrow">{t(item.category)}</span><strong>{t(item.title)}</strong>{!compact && <span className="small-muted">{t('sampleSource')} · 09 Oct 2026</span>}</span><ArrowUpRight size={18} /></button> })}</div><EvidenceDrawer evidence={selected} onClose={() => setSelected(null)} /></>
}
export function EvidenceDrawer({ evidence: item, onClose }: { evidence: Evidence | null; onClose: () => void }) {
  const { t } = useDemo()
  return <Sheet open={Boolean(item)} onOpenChange={open => !open && onClose()}><SheetContent className="evidence-drawer" showCloseButton={false}><SheetHeader><div className="flex items-center justify-between"><Badge variant="secondary">{t('Evidence')}</Badge><SheetClose render={<Button variant="ghost" size="icon" aria-label={t('close')} />}><X /></SheetClose></div><SheetTitle>{item && t(item.title)}</SheetTitle><SheetDescription>{t('sampleSource')}</SheetDescription></SheetHeader>{item && <div className="drawer-body"><div className="source-row"><FileText size={20} /><div><span className="small-muted">{t('source')}</span><p>{t(item.category)} · {t('sample')}</p><span className="small-muted">09 Oct 2026</span></div></div><Separator /><p>{t(item.summary)}</p><section className="relevance-box"><ShieldCheck size={22} /><h3>{t('relevance')}</h3><p>{t(item.relevance)}</p></section><Note>{t('noLiveEvidence')}</Note></div>}</SheetContent></Sheet>
}
export function ScoreBreakdown() {
  const { t } = useDemo()
  return <section className="panel"><div className="section-heading"><h2>{t('score')}</h2><Badge variant="outline">{t('sample')}</Badge></div><div className="score-breakdown">{[['Price', 94], ['Demand', 92], ['Logistics', 84], ['buyerAvailability', 93], ['Risk', 87]].map(([key, score]) => <div className="score-line" key={key}><div><span>{t(String(key))}</span><strong>{score}<span className="small-muted"> / 100</span></strong></div><div className="score-track"><div style={{ width: `${score}%` }} /></div></div>)}</div><p className="small-muted mt-5">{t('scoreNote')}</p></section>
}
