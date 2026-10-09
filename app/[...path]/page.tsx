import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Workspace } from '@/components/krishi/workspace'
import { AccountPage } from '@/components/krishi/account-pages'
import { PublicInfo } from '@/components/krishi/landing'
import { PublicMarkets } from '@/components/krishi/market-pages'

type Props = { params: Promise<{ path: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params
  const segment = path.at(-1) ?? ''
  const title = segment.replaceAll('-', ' ').replace(/\b\w/g, character => character.toUpperCase())
  return { title: `${title} — KrishiIntel`, ...(path[0] === 'demo' ? { robots: { index: false, follow: false } } : {}) }
}
export default async function Page({ params, searchParams }: Props) {
  const { path } = await params
  const query = await searchParams
  if (path.length === 1) {
    if (['login', 'signup', 'roles', 'onboarding'].includes(path[0])) return <AccountPage page={path[0]} />
    if (['how-it-works', 'for-farmers', 'for-fpos', 'about'].includes(path[0])) return <PublicInfo page={path[0]} />
    if (path[0] === 'markets') return <PublicMarkets />
  }
  const sections = ['market', 'buyers', 'lots', 'offers', 'transactions', 'alerts', 'profile', 'settings']
  if (path[0] === 'demo' && ['farmer', 'fpo', 'buyer'].includes(path[1]) && path.length <= 4 && (!path[2] || sections.includes(path[2])) && (!path[3] || ['buyers', 'lots', 'offers', 'transactions'].includes(path[2]))) {
    return <Workspace path={path} tab={typeof query.tab === 'string' ? query.tab : undefined} />
  }
  notFound()
}
