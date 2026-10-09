'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, ArrowUpRight, ArrowLeft, Sprout, Globe2, Menu, LayoutGrid, ChartNoAxesCombined, Package, Users, ArrowLeftRight, Bell, UserRound, FileText, LogOut, Info, Leaf } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia, EmptyContent } from '@/components/ui/empty'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Field, FieldLabel } from '@/components/ui/field'
import { useDemo } from './provider'
import { cn } from '@/lib/utils'
import type { Locale } from '@/lib/i18n'
import type { Role } from '@/lib/market-service'

export function useWorkspace() {
  const pathname = usePathname()
  const routeRole = pathname.split('/')[2]
  const role: Role = routeRole === 'fpo' || routeRole === 'buyer' ? routeRole : 'farmer'
  return { role, base: `/demo/${role}` }
}
export function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className={cn('brand', compact && 'brand-compact')} aria-label="KrishiIntel"><span className="brand-mark"><Sprout strokeWidth={1.8} /></span><span>Krishi<span className="brand-light">Intel</span><span className="brand-dot">.</span></span></Link>
}
export function LinkButton({ href, children, variant = 'default', arrow = false, className, onClick }: { href: string; children: ReactNode; variant?: 'default' | 'outline' | 'ghost' | 'secondary'; arrow?: boolean; className?: string; onClick?: () => void }) {
  return <Link href={href} onClick={onClick} className={cn(buttonVariants({ variant, size: 'lg' }), className)}>{children}{arrow && <ArrowRight data-icon="inline-end" />}</Link>
}
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useDemo()
  return <label className="language-switch"><Globe2 size={15} aria-hidden /><span className="sr-only">{t('Language')}</span><select aria-label={t('Language')} value={locale} onChange={e => setLocale(e.target.value as Locale)}><option value="en">English</option><option value="hi">हिन्दी</option><option value="gu">ગુજરાતી</option></select></label>
}
export function PublicHeader() {
  const { t } = useDemo()
  const [open, setOpen] = useState(false)
  const navigation = [['how', '/how-it-works'], ['Markets', '/markets'], ['farmers', '/for-farmers'], ['fpos', '/for-fpos']]
  return <header className="public-header"><div className="container header-inner"><Logo /><nav className="public-nav" aria-label="Main">{navigation.map(([key, href]) => <Link key={key} href={href}>{t(key)}</Link>)}</nav><div className="header-actions"><LanguageSwitcher /><Link href="/login" className="sign-in-link">{t('signIn')}</Link><LinkButton href="/roles" arrow>{t('getStarted')}</LinkButton><Button variant="ghost" size="icon" className="mobile-menu" aria-label={t('menu')} onClick={() => setOpen(true)}><Menu /></Button></div></div><Sheet open={open} onOpenChange={setOpen}><SheetContent><SheetHeader><SheetTitle>KrishiIntel</SheetTitle></SheetHeader><nav className="mobile-public-links">{navigation.map(([key, href]) => <Link key={key} href={href} onClick={() => setOpen(false)}>{t(key)}</Link>)}<Link href="/login" onClick={() => setOpen(false)}>{t('signIn')}</Link></nav></SheetContent></Sheet></header>
}
export function PublicFooter() {
  const { t } = useDemo()
  return <footer className="public-footer container"><div className="footer-main"><div><Logo /><p>{t('footerDesc')}</p></div><nav><Link href="/how-it-works">{t('how')}</Link><Link href="/markets">{t('Markets')}</Link><Link href="/about">{t('about')}</Link><Link href="/roles">{t('exploreDemo')}</Link></nav><LanguageSwitcher /></div><div className="footer-bottom"><span>{t('rights')}</span><span>{t('samplePrices')}</span></div></footer>
}
export function AppShell({ children }: { children: ReactNode }) {
  const { t, offline } = useDemo()
  const { role, base } = useWorkspace()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const nav = role === 'buyer' ? [ ['Home', '', LayoutGrid], ['Lots', '/lots', Package], ['Offers', '/offers', FileText], ['Transactions', '/transactions', ArrowLeftRight] ] as const : [ [role === 'fpo' ? 'Overview' : 'Home', '', LayoutGrid], ['Market', '/market', ChartNoAxesCombined], [role === 'fpo' ? 'Lots' : 'My lots', '/lots', Package], ['Buyers', '/buyers', Users], ...(role === 'fpo' ? [['Offers', '/offers', FileText] as const] : []), ['Transactions', '/transactions', ArrowLeftRight] ] as const
  const roleLabel = role === 'fpo' ? 'FPO' : role === 'buyer' ? 'Buyer' : 'Farmer'
  const sidebar = <><Logo /><div className="workspace-label">{t(roleLabel)}<Badge variant="outline">{t('demo')}</Badge></div><nav className="side-nav" aria-label={t('menu')}>{nav.map(([label, path, Icon]) => <Link key={label} href={`${base}${path}`} onClick={() => setOpen(false)} className={cn('side-link', (path ? pathname.startsWith(`${base}${path}`) : pathname === base) && 'is-active')}><Icon size={18} strokeWidth={1.7} />{t(label)}</Link>)}</nav><div className="sidebar-bottom"><Link className="side-link" href={`${base}/alerts`} onClick={() => setOpen(false)}><Bell size={18} />{t('Alerts')}</Link><Link className="side-link" href={`${base}/profile`} onClick={() => setOpen(false)}><UserRound size={18} />{t('Profile')}</Link><div className="sidebar-help"><Leaf size={19} /><p>{t('footerDesc')}</p><Link href="/roles">{t('switchRole')}<ArrowUpRight size={14} /></Link></div><Link className="side-link" href="/"><LogOut size={17} />{t('exitDemo')}</Link></div></>
  return <div className="app-shell"><a className="skip-link" href="#main-content">{t('continue')}</a><aside className="sidebar">{sidebar}</aside><div className="app-main"><header className="app-header"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="mobile-menu" aria-label={t('menu')} onClick={() => setOpen(true)}><Menu /></Button><span className="app-breadcrumb">{t(roleLabel)}<span>/</span>{t(nav.find(([, path]) => path && pathname.startsWith(base + path))?.[0] ?? 'Home')}</span></div><div className="flex items-center gap-4"><LanguageSwitcher /><Link href={`${base}/alerts`} className="header-icon" aria-label={t('Alerts')}><Bell size={18} /></Link><Link href={`${base}/profile`} className="profile-avatar" aria-label={t('Profile')}>{role === 'fpo' ? 'FP' : role === 'buyer' ? 'BY' : 'RP'}</Link></div></header><div className="demo-strip"><Info size={13} /><span>{t('demoNotice')}</span></div>{offline && <Note>{t('offline')}</Note>}<main id="main-content" className="workspace-content">{children}</main><nav className="bottom-nav" aria-label={t('menu')}>{nav.slice(0, 4).map(([label, path, Icon]) => <Link key={label} href={base + path} className={cn(pathname === base + path && 'is-active')}><Icon size={20} />{t(label)}</Link>)}</nav></div><Sheet open={open} onOpenChange={setOpen}><SheetContent side="left"><SheetHeader><SheetTitle className="sr-only">{t('menu')}</SheetTitle></SheetHeader><div className="mobile-sidebar">{sidebar}</div></SheetContent></Sheet></div>
}
export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action}</div>
}
export function StatusBadge({ status }: { status: string }) { const { t } = useDemo(); return <Badge variant={['Available', 'Accepted', 'Matched', 'Completed'].includes(status) ? 'secondary' : status === 'Rejected' ? 'destructive' : 'outline'}>{t(status)}</Badge> }
export function Note({ children }: { children: ReactNode }) { return <Alert><Info /><AlertDescription>{children}</AlertDescription></Alert> }
export function EmptyPanel({ title, description, href, action }: { title: string; description: string; href?: string; action?: string }) { return <Empty className="empty-panel"><EmptyHeader><EmptyMedia variant="icon"><Leaf /></EmptyMedia><EmptyTitle>{title}</EmptyTitle><EmptyDescription>{description}</EmptyDescription></EmptyHeader>{href && <EmptyContent><LinkButton href={href} arrow>{action}</LinkButton></EmptyContent>}</Empty> }
export function BackLink({ href, children }: { href: string; children: ReactNode }) { return <Link className="back-link" href={href}><ArrowLeft size={15} />{children}</Link> }
export function SelectField({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) { return <Field><FieldLabel htmlFor={id}>{label}</FieldLabel><select className="native-select" id={id} value={value} onChange={e => onChange(e.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field> }
