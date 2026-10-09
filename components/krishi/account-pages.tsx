'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Sprout, UsersRound, Store, ArrowRight, LockKeyhole, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FieldGroup, FieldSet, FieldLegend } from '@/components/ui/field'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useDemo } from './provider'
import { Logo, LanguageSwitcher, LinkButton, Note, SelectField, PageHeading, useWorkspace } from './shell'
import { crops, locations, type Crop, type Role } from '@/lib/market-service'

export function AccountPage({ page }: { page: string }) {
  const { t, role, setRole, analysis, setAnalysis } = useDemo()
  const router = useRouter()
  const [location, setLocation] = useState(analysis.location)
  const [crop, setCrop] = useState<Crop>(analysis.crop)
  const isRoles = page === 'roles'
  const isOnboarding = page === 'onboarding'
  function start(event: FormEvent) { event.preventDefault(); setAnalysis({ ...analysis, location, crop, quantity: role === 'fpo' ? 5000 : analysis.quantity }); router.push(`/demo/${role}`) }
  return <div className="account-page"><header className="account-header container"><Logo /><LanguageSwitcher /></header><main className="account-main">{!isRoles && !isOnboarding ? <section className="account-card"><span className="account-icon"><LockKeyhole size={27} strokeWidth={1.5} /></span><p className="eyebrow">KrishiIntel</p><h1>{t(page === 'signup' ? 'createAccount' : 'signIn')}</h1><p>{t('authBody')}</p><Note>{t('signInUnavailable')}</Note><LinkButton href="/roles" arrow>{t('exploreDemo')}</LinkButton><LinkButton href="/" variant="ghost"><ArrowLeft />{t('exitDemo')}</LinkButton></section> : isRoles ? <section className="role-section"><Badge variant="outline">{t('demo')}</Badge><h1>{t('roleTitle')}</h1><p>{t('roleBody')}</p><FieldSet><FieldLegend className="sr-only">{t('role')}</FieldLegend><div className="role-grid">{[{ value: 'farmer', title: 'Farmer', body: 'roleFarmer', icon: Sprout }, { value: 'fpo', title: 'FPO', body: 'roleFpo', icon: UsersRound }, { value: 'buyer', title: 'Buyer', body: 'roleBuyer', icon: Store }].map(({ value, title, body, icon: Icon }) => <label key={value} className={`role-choice ${role === value ? 'role-selected' : ''}`}><input type="radio" name="role" value={value} checked={role === value} onChange={() => setRole(value as Role)} /><span className="role-check">{role === value && <Check size={13} />}</span><Icon size={30} strokeWidth={1.4} /><strong>{t(title)}</strong><span>{t(body)}</span></label>)}</div></FieldSet><LinkButton href="/onboarding" arrow>{t('continue')}</LinkButton></section> : <section className="account-card"><span className="account-icon"><Sprout size={27} /></span><Badge variant="outline">{t(role === 'fpo' ? 'FPO' : role === 'buyer' ? 'Buyer' : 'Farmer')}</Badge><h1>{t('onboardingTitle')}</h1><p>{t('onboardingBody')}</p><form onSubmit={start}><FieldGroup><SelectField id="home-location" label={t('Location')} value={location} onChange={setLocation} options={locations.map(value => ({ value, label: `${value}, Gujarat` }))} /><SelectField id="home-crop" label={t('Crop')} value={crop} onChange={value => setCrop(value as Crop)} options={crops.map(value => ({ value, label: t(value) }))} /><Button type="submit" size="lg">{t('exploreDemo')}<ArrowRight data-icon="inline-end" /></Button></FieldGroup></form></section>}</main><p className="account-footnote">{t('demoNotice')}</p></div>
}
export function ProfilePage() {
  const { t, analysis, setAnalysis, reset } = useDemo()
  const { role } = useWorkspace()
  const [confirm, setConfirm] = useState(false)
  return <><PageHeading title={t('profileTitle')} description={t('profileBody')} /><section className="panel profile-panel"><div className="profile-heading"><span className="large-avatar">{role === 'fpo' ? 'FP' : role === 'buyer' ? 'BY' : 'RP'}</span><div><h2>{role === 'fpo' ? 'Anand Growers Collective' : role === 'buyer' ? 'Sample buyer' : 'Ramesh Patel'}</h2><Badge variant="outline">{t('demo')}</Badge></div></div><FieldGroup><SelectField id="profile-location" label={t('Location')} value={analysis.location} onChange={location => setAnalysis({ ...analysis, location })} options={locations.map(value => ({ value, label: `${value}, Gujarat` }))} /><div><p className="field-label mb-3">{t('Language')}</p><LanguageSwitcher /></div><div><p className="field-label">{t('role')}</p><p className="mt-2">{t(role === 'fpo' ? 'FPO' : role === 'buyer' ? 'Buyer' : 'Farmer')}</p><LinkButton href="/roles" variant="outline" className="mt-4">{t('switchRole')}</LinkButton></div></FieldGroup></section><section className="panel mt-6"><h2>{t('Settings')}</h2><p className="page-description">{t('demoNotice')}</p><Button variant="outline" className="mt-5" onClick={() => setConfirm(true)}>{t('resetDemo')}</Button></section><Dialog open={confirm} onOpenChange={setConfirm}><DialogContent><DialogHeader><DialogTitle>{t('resetDemo')}</DialogTitle><DialogDescription>{t('resetBody')}</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setConfirm(false)}>{t('cancel')}</Button><Button onClick={() => { reset(); setConfirm(false); toast.success(t('resetDone')) }}>{t('confirm')}</Button></DialogFooter></DialogContent></Dialog></>
}
