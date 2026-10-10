'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  TrendingUp,
  Store,
  Users,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Award,
  Bell,
  Search,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur border-b border-emerald-800/50 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
              K
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white">KrishiIntel</span>
              <span className="block text-xs text-emerald-300">Agricultural Market Intelligence</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-emerald-100">
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
              How it works
            </a>
            <a href="#who-its-for" className="hover:text-amber-400 transition-colors">
              Who it's for
            </a>
            <a href="#features" className="hover:text-amber-400 transition-colors">
              Features
            </a>
            <a href="#trust" className="hover:text-amber-400 transition-colors">
              Trust & Transparency
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/role"
              className="text-sm font-medium text-emerald-200 hover:text-white px-4 py-2 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/role"
              className="text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Agricultural Market Decisions • Gujarat & Beyond
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Smart decisions for <br />
              <span className="text-amber-400">better agricultural selling.</span>
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl font-normal leading-relaxed">
              Know where, when, and to whom to sell your crop. Compare markets, find verified buyers, calculate true net realization after transport, and track your harvest from field to buyer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-stone-200 text-sm">
              <div className="flex items-center gap-2.5 bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Compare APMC & Regional Mandis</span>
              </div>
              <div className="flex items-center gap-2.5 bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Find Compatible Buyers & Requirements</span>
              </div>
              <div className="flex items-center gap-2.5 bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Transparent Net Realization Math</span>
              </div>
              <div className="flex items-center gap-2.5 bg-emerald-900/60 p-2.5 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>Real-Time Shipment Fleet Tracking</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/auth/role"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-base px-7 py-3.5 rounded-lg shadow-xl hover:shadow-2xl transition-all text-center"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/auth/role"
                className="inline-flex items-center justify-center gap-2 bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold text-base px-7 py-3.5 rounded-lg border border-emerald-600 transition-all text-center"
              >
                Login to Platform
              </Link>
            </div>
          </div>

          {/* Hero Right Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-emerald-700/40 max-w-md lg:max-w-none">
              <Image
                src="/images/ramesh-patel.jpg"
                alt="Indian Farmer inspecting tomato crop lot"
                width={600}
                height={500}
                className="w-full h-[420px] object-cover object-center"
                priority
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-5 text-white">
                <div className="flex items-center justify-between text-xs text-amber-300 font-semibold mb-1">
                  <span>ANAND, GUJARAT</span>
                  <span>TODAY'S HIGHEST NET</span>
                </div>
                <div className="font-bold text-lg text-white">Ramesh Patel's Tomato Lot (500 kg)</div>
                <div className="text-emerald-300 text-sm mt-0.5">
                  Best opportunity: <strong className="text-white">Ahmedabad APMC (₹13,850 Estimated Net)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How KrishiIntel Works */}
      <section id="how-it-works" className="py-20 bg-stone-100 text-stone-900 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-emerald-800 uppercase mb-2">Simple 5-Step Process</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-stone-900">How KrishiIntel Works</p>
            <p className="text-stone-600 mt-3 text-base">
              From your harvest in the field to the right buyer at the best mandi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Add your crop', desc: 'Enter crop type, quantity, moisture level, and farm location.' },
              { step: '02', title: 'Analyze markets', desc: 'Compare live APMC prices across nearby wholesale yards.' },
              { step: '03', title: 'Compare buyers', desc: 'Match requirements with verified wholesalers & processors.' },
              { step: '04', title: 'Calculate realization', desc: 'Deduct freight, handling, and cess to see true net in-hand.' },
              { step: '05', title: 'Sell and track', desc: 'Dispatch shipment with live driver vehicle location tracking.' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="text-3xl font-black text-amber-500 mb-3">{item.step}</div>
                <h3 className="font-bold text-lg text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is KrishiIntel For? */}
      <section id="who-its-for" className="py-20 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-2">Tailored Workspaces</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">Who is KrishiIntel For?</p>
            <p className="text-emerald-100 mt-3 text-base">
              Purpose-built experiences engineered for distinct agricultural roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Farmer Card */}
            <div className="bg-emerald-950/80 rounded-2xl p-8 border border-emerald-700/50 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Farmer</h3>
                <p className="text-amber-400 font-medium text-sm mb-4">Sell smarter. Maximise your net return.</p>
                <p className="text-stone-300 text-sm leading-relaxed mb-6">
                  Simple mobile-first dashboard answering: What do I have? Where should I sell? Who will buy? How much will I actually earn?
                </p>
                <ul className="space-y-2.5 text-xs text-emerald-100 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Real-time APMC price comparison</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Calculated net in-hand earnings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Kisan Bahi printable realization vouchers</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/auth/role"
                className="w-full text-center bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 px-4 rounded-lg transition-colors text-sm"
              >
                Continue as Farmer
              </Link>
            </div>

            {/* FPO Manager Card */}
            <div className="bg-emerald-950/80 rounded-2xl p-8 border border-emerald-700/50 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">FPO Manager</h3>
                <p className="text-emerald-300 font-medium text-sm mb-4">Aggregate produce. Coordinate bulk sales.</p>
                <p className="text-stone-300 text-sm leading-relaxed mb-6">
                  Operational workspace to manage member farmers, procure harvest lots, pool volumes for freight savings, and match institutional buyers.
                </p>
                <ul className="space-y-2.5 text-xs text-emerald-100 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Member farmer produce aggregation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Procurement & batch lot pooling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Shared WhatsApp realization ledger export</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/auth/role"
                className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm"
              >
                Continue as FPO Manager
              </Link>
            </div>

            {/* Admin Card */}
            <div className="bg-emerald-950/80 rounded-2xl p-8 border border-emerald-700/50 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-stone-700/40 text-stone-200 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Administrator</h3>
                <p className="text-stone-300 font-medium text-sm mb-4">Control platform operations & audit activity.</p>
                <p className="text-stone-300 text-sm leading-relaxed mb-6">
                  Full control console monitoring platform transaction metrics, active logistics, user status activation/suspensions, and system health.
                </p>
                <ul className="space-y-2.5 text-xs text-emerald-100 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>System-wide user & FPO oversight</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Live fleet tracking & audit logging</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    <span>Platform health & database metrics</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/auth/role"
                className="w-full text-center bg-stone-800 hover:bg-stone-700 text-white font-bold py-3 px-4 rounded-lg border border-stone-600 transition-colors text-sm"
              >
                Continue as Administrator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section id="trust" className="py-16 bg-amber-50 text-amber-950 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-200/70 border border-amber-300 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-800" />
            Decision Support & Transparency Guarantee
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">
            Rooted in reality. Transparent math. No false guarantees.
          </h2>
          <p className="text-amber-900/90 text-sm sm:text-base leading-relaxed">
            KrishiIntel provides decision support based on available market information, historical APMC price observations, freight distance scaling, and verified buyer requirements. Prices and recommendations are indicative metrics designed to help you make better selling decisions and are not financial guarantees.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-stone-900 text-white text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to make a better selling decision?</h2>
          <p className="text-stone-300 text-base">
            Select your role to access your personalized agricultural market intelligence workspace.
          </p>
          <div className="pt-4">
            <Link
              href="/auth/role"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-lg px-8 py-4 rounded-xl shadow-xl transition-all"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 text-xs py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
              K
            </div>
            <span className="font-semibold text-stone-200">KrishiIntel Platform</span>
          </div>
          <div>© 2026 KrishiIntel. Built for Indian farmers & agricultural co-operatives.</div>
          <div className="flex gap-4">
            <Link href="/auth/role" className="hover:text-amber-400">
              Role Login
            </Link>
            <a href="#trust" className="hover:text-amber-400">
              Disclaimer
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
