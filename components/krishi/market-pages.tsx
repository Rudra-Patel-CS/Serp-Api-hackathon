'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Sprout, ArrowRight, MapPin, Info, CalendarDays, ArrowUpRight, TrendingUp, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel, FieldError } from '@/components/ui/field'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useDemo } from './provider'
import { PageHeading, LinkButton, Note, SelectField, PublicHeader, PublicFooter, useWorkspace } from './shell'
import { OpportunityCard, MarketTable, EvidenceList, ScoreBreakdown } from './intelligence'
import { crops, locations, analyzeMarkets, matchingBuyers, sellingScenarios, money, type Crop, type AnalysisInput } from '@/lib/market-service'

export function CropForm({ onAnalyze, compact = false }: { onAnalyze?: (input: AnalysisInput) => void; compact?: boolean }) {
  const { t, analysis, setAnalysis } = useDemo()
  const { base } = useWorkspace()
  const router = useRouter()
  const [crop, setCrop] = useState<Crop>(analysis.crop)
  const [quantity, setQuantity] = useState(String(analysis.quantity))
  const [location, setLocation] = useState(analysis.location)
  const [date, setDate] = useState(analysis.date)
  const [error, setError] = useState('')
  function submit(event: FormEvent) {
    event.preventDefault()
    const input = { crop, quantity: Number(quantity), location, date }
    try { analyzeMarkets(input); setError(''); setAnalysis(input); if (onAnalyze) onAnalyze(input); else router.push(`${base}/market`) } catch { setError(t('invalidAnalysis')) }
  }
  return <form onSubmit={submit} className={compact ? 'crop-form compact-form' : 'crop-form'}><FieldGroup className="crop-fields"><SelectField id="crop" label={t('Crop')} value={crop} onChange={value => setCrop(value as Crop)} options={crops.map(value => ({ value, label: t(value) }))} /><Field data-invalid={Boolean(error)}><FieldLabel htmlFor="quantity">{t('Quantity')} <span className="small-muted">(kg)</span></FieldLabel><Input id="quantity" type="number" min={1} max={1000000} step={1} required value={quantity} onChange={e => setQuantity(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? 'quantity-error' : undefined} />{error && <FieldError id="quantity-error">{error}</FieldError>}</Field><SelectField id="location" label={t('Location')} value={location} onChange={setLocation} options={locations.map(value => ({ value, label: `${value}, Gujarat` }))} /><SelectField id="selling-date" label={t('sellingDate')} value={date} onChange={setDate} options={['Today', 'Tomorrow', 'In 2 days'].map(value => ({ value, label: t(value) }))} /></FieldGroup><Button type="submit" size="lg" className="analyze-button">{t('analyze')}<ArrowRight data-icon="inline-end" /></Button></form>
}
export function FarmerHome() {
  const { t, lots } = useDemo()
  const { base } = useWorkspace()
  return <><PageHeading eyebrow={t('welcome')} title={t('whatSelling')} description={t('analysisIntro')} /><div className="farmer-home-grid"><section className="panel crop-panel"><span className="form-icon"><Sprout size={27} strokeWidth={1.5} /></span><CropForm /><p className="form-footnote"><ShieldCheck size={14} />{t('samplePrices')}</p></section><aside className="good-to-know"><span className="eyebrow"><Info size={14} />{t('goodToKnow')}</span><h2>{t('clarity')}</h2><p>{t('analysisNote')}</p><div className="know-item"><TrendingUp size={18} /><span>{t('Comparison')}</span></div><div className="know-item"><MapPin size={18} /><span>{t('suitableBuyers')}</span></div><div className="know-item"><CalendarDays size={18} /><span>{t('sellingWindow')}</span></div></aside></div><section className="recent-lots"><div className="section-heading"><h2>{t('activeLots')}</h2><LinkButton href={`${base}/lots`} variant="ghost" arrow>{t('My lots')}</LinkButton></div>{lots.slice(0, 2).map(lot => <div className="recent-lot" key={lot.id}><span className="lot-symbol"><Sprout size={20} /></span><div><strong>{t(lot.crop)}</strong><span className="small-muted">{lot.id} · {lot.location}</span></div><span>{lot.quantity.toLocaleString('en-IN')} kg</span><Badge variant="secondary">{t(lot.status)}</Badge><LinkButton href={`${base}/lots/${lot.id}`} variant="ghost"><ArrowUpRight /></LinkButton></div>)}</section></>
}
export function MarketPage({ tab = 'overview' }: { tab?: string }) {
  const { t, analysis } = useDemo()
  const { base } = useWorkspace()
  const router = useRouter()
  const markets = analyzeMarkets(analysis)
  const best = markets[0]
  const matches = matchingBuyers(analysis)
  const activeTab = ['overview', 'why', 'comparison', 'evidence', 'timing'].includes(tab) ? tab : 'overview'
  return <><PageHeading eyebrow={t('opportunity')} title={`${t(analysis.crop)}. ${t('decisionsNotData')}`} action={<LinkButton href={base} variant="outline">{t('editCrop')}</LinkButton>} /><div className="crop-context"><span><Sprout size={15} />{t(analysis.crop)}</span><span>{analysis.quantity.toLocaleString('en-IN')} kg</span><span><MapPin size={14} />{analysis.location}, Gujarat</span><span><CalendarDays size={14} />{t(analysis.date)}</span><Badge variant="outline">{t('sample')}</Badge></div><Tabs value={activeTab} onValueChange={value => router.replace(`${base}/market?tab=${value}`, { scroll: false })} className="market-tabs"><TabsList variant="line">{[['overview', 'Recommendation'], ['why', 'whyMarket'], ['comparison', 'Comparison'], ['evidence', 'Evidence'], ['timing', 'sellingWindow']].map(([value, label]) => <TabsTrigger key={value} value={value}>{t(label)}</TabsTrigger>)}</TabsList><TabsContent value="overview"><div className="recommendation-grid"><OpportunityCard market={best} base={base} input={analysis} /><section className="panel cost-panel"><span className="eyebrow">{t('breakdown')}</span><h2>{t('net')}</h2><dl className="cost-breakdown"><div><dt>{t('gross')}</dt><dd>{money(best.gross)}</dd></div><div><dt>{t('Transport')}</dt><dd>− {money(best.transport)}</dd></div><div><dt>{t('Handling')}</dt><dd>− {money(best.handling)}</dd></div><div className="cost-total"><dt>{t('net')}</dt><dd>{money(best.net)}</dd></div></dl><p className="small-muted">{t('notForecast')}</p></section></div><section className="next-step-strip"><div><UsersIcon /><span><strong>{matches.length} {t('compatible')}</strong><small>{t('roleBuyer')}</small></span></div><LinkButton href={`${base}/buyers`} arrow>{t('findBuyers')}</LinkButton></section><div className="section-heading mt-8"><h2>{t('Evidence')}</h2><LinkButton href={`${base}/market?tab=evidence`} variant="ghost" arrow>{t('readEvidence')}</LinkButton></div><EvidenceList compact /></TabsContent><TabsContent value="why"><div className="recommendation-grid"><div className="flex flex-col gap-6"><section className="panel"><span className="eyebrow">{best.name}</span><h2>{t('whyMarket')}</h2><p className="page-description">{t('whyDescription')}</p><div className="reason-list">{[['Price', `${money(best.price)} / kg`], ['Demand', t(best.demand)], ['Logistics', `${best.distance} km`], ['buyerAvailability', `${matches.length} ${t('compatible')}`]].map(([label, value]) => <div key={label}><CheckIcon /><span>{t(label)}</span><strong>{value}</strong></div>)}</div></section><Note>{t('scoreNote')}</Note></div><ScoreBreakdown /></div></TabsContent><TabsContent value="comparison"><div className="section-heading"><div><h2>{t('Comparison')}</h2><p className="page-description">{t('compareIntro')}</p></div></div><MarketTable markets={markets} /><p className="small-muted mt-4">{t('afterCosts')} · {t('notForecast')}</p><div className="mt-6"><LinkButton href={`${base}/buyers`} arrow>{t('findBuyers')}</LinkButton></div></TabsContent><TabsContent value="evidence"><PageHeading title={t('Evidence')} description={t('noLiveEvidence')} /><EvidenceList /></TabsContent><TabsContent value="timing"><SellingWindow /></TabsContent></Tabs></>
}
function UsersIcon() { return <Sprout size={26} strokeWidth={1.5} /> }
function CheckIcon() { return <ShieldCheck size={17} className="text-primary" /> }
export function SellingWindow() {
  const { t, analysis } = useDemo()
  const scenarios = sellingScenarios(analysis)
  return <><div className="section-heading"><div><h2>{t('timingTitle')}</h2><p className="page-description">{t('timingBody')}</p></div></div><div className="scenario-grid">{scenarios.map((scenario, index) => <article key={scenario.day} className={index === 1 ? 'scenario selected-scenario' : 'scenario'}><div className="section-heading"><h3>{t(scenario.day)}</h3>{index === 1 && <Badge variant="secondary">{t('recommended')}</Badge>}</div><dl className="cost-breakdown"><div><dt>{t('gross')}</dt><dd>{money(scenario.gross)}</dd></div><div><dt>{t('costs')}</dt><dd>− {money(scenario.costs)}</dd></div></dl><span className="small-muted">{t('net')}</span><p className="scenario-value">{money(scenario.net)}</p></article>)}</div><div className="timing-recommendation"><TrendingUp size={24} /><div><h3>{t('waitDay')}</h3><p>{t('additionalNet')}: <strong>{money(scenarios[1].net - scenarios[0].net)}</strong></p><p className="small-muted">{t('notForecast')}</p></div></div><details className="assumptions"><summary>{t('assumptions')}</summary><p>{t('assumptionBody')}</p></details></>
}
export function PublicMarkets() {
  const { t, analysis } = useDemo()
  const [input, setInput] = useState(analysis)
  return <><PublicHeader /><main className="public-markets container"><PageHeading eyebrow={t('samplePrices')} title={t('marketSnapshot')} description={t('compareIntro')} /><section className="panel"><CropForm compact onAnalyze={setInput} /></section><div className="section-heading mt-8"><h2>{t(input.crop)} · {input.quantity.toLocaleString('en-IN')} kg · {input.location}</h2><Badge variant="outline">{t('sample')}</Badge></div><MarketTable markets={analyzeMarkets(input)} /><div className="mt-6"><Note>{t('noLiveEvidence')}</Note></div><div className="mt-8"><LinkButton href="/demo/farmer/market" arrow>{t('exploreDemo')}</LinkButton></div></main><PublicFooter /></>
}
