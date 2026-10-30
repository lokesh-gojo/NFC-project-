import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { DemoBanner } from '@/components/common/DemoBanner'
import { QRCodeSVG } from 'qrcode.react'
import {
  Radio,
  QrCode,
  UtensilsCrossed,
  Star,
  MessageSquareHeart,
  Wifi,
  BarChart3,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Zap,
  Coffee,
  Building,
  ShoppingBag,
  Scissors,
  ExternalLink
} from 'lucide-react'

export const HomePage: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<
    'restaurant' | 'cafe' | 'hotel' | 'retail' | 'salon'
  >('cafe')

  const industries = [
    {
      id: 'cafe' as const,
      name: 'Cafés & Bakeries',
      icon: Coffee,
      headline: 'Flawless ordering & instant 5-star Google review taps',
      desc: 'Tabletop NFC wooden pucks & QR menus turn morning coffee rushes into lasting brand loyalty.'
    },
    {
      id: 'restaurant' as const,
      name: 'Restaurants & Bistros',
      icon: UtensilsCrossed,
      headline: 'Interactive menus with live allergens & dietary filters',
      desc: 'Eliminate costly reprints. Update chef specials, dynamic pricing and wine pairings on the fly.'
    },
    {
      id: 'hotel' as const,
      name: 'Hotels & Resorts',
      icon: Building,
      headline: 'Frictionless guest room Wi-Fi and concierge directory',
      desc: 'Nightstand NFC cards allow one-tap guest Wi-Fi access, room service menus and spa bookings.'
    },
    {
      id: 'retail' as const,
      name: 'Retail & Boutiques',
      icon: ShoppingBag,
      headline: 'Connect physical product displays with digital stories',
      desc: 'Smart product tags present customer sizing charts, stock availability and loyalty signups.'
    },
    {
      id: 'salon' as const,
      name: 'Salons & Wellness',
      icon: Scissors,
      headline: 'Tap-to-book styling appointments & authentic reviews',
      desc: 'Mirror stands collect private client feedback and direct satisfied clients to Google Maps.'
    }
  ]

  const features = [
    {
      icon: Radio,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      title: 'Smart NFC Tag Tap-and-Go',
      desc: 'Program physical NFC cards and acrylic stands with standard NDEF URLs. Customers tap their iPhone or Android phone without downloading any app.'
    },
    {
      icon: QrCode,
      color: 'text-[#087BEE]',
      bg: 'bg-blue-100',
      title: 'Dynamic QR Code Tracking',
      desc: 'Download high-res vector SVG or PNG QR table tents. Track individual table performance and update destinations without re-printing.'
    },
    {
      icon: UtensilsCrossed,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      title: 'Interactive Digital Menu',
      desc: 'Crisp food photography, instant vegetarian/allergen tags, item availability toggles, and table cart summaries.'
    },
    {
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      title: 'Google Reviews Acceleration',
      desc: 'Direct customer traffic straight to your official Google Maps review dialogue with compliant anti-gating principles.'
    },
    {
      icon: MessageSquareHeart,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
      title: 'Honest Private Feedback',
      desc: 'Collect 1 to 5-star ratings and private recommendations accessible exclusively within your management dashboard.'
    },
    {
      icon: Wifi,
      color: 'text-cyan-600',
      bg: 'bg-cyan-100',
      title: 'Guest Wi-Fi Auto-Connect',
      desc: 'Generate camera-scan Wi-Fi QR codes. Customers tap to join secure Wi-Fi without needing to type long passwords.'
    }
  ]

  const activeInd = industries.find((i) => i.id === selectedIndustry)!

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      {/* ============================================================== */}
      {/* HERO SECTION                                                   */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#F5F8FC] via-white to-[#F5F8FC]">
        {/* Subtle background glow decorative orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#087BEE]/15 to-[#13C8F4]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#087BEE] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#087BEE]" />
                Next-Gen Physical-to-Digital Engagement
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-[#071321] tracking-tight leading-[1.08]">
                ONE TAP. <br />
                <span className="bg-gradient-to-r from-[#087BEE] via-[#13C8F4] to-[#8B5CF6] bg-clip-text text-transparent">
                  SMARTER BUSINESS.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Smart NFC + QR solutions for modern cafés, restaurants, hotels, and retail stores.
                Delight patrons with instant digital menus, 5-star Google review links, guest Wi-Fi, and honest feedback from a single physical card.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/auth/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Your Business Profile Free
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/b/cafe-aroma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-slate-800 font-bold text-sm border border-slate-300 hover:border-slate-400 shadow-xs hover:bg-slate-50 transition-all"
                >
                  <Zap className="w-4 h-4 text-[#087BEE]" />
                  Try Live Customer Demo
                </Link>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No App Download Required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Compatible with iOS & Android
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Forever Starter Plan
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Phone + NFC Stand Mockup */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="relative w-full max-w-[340px] sm:max-w-[360px]">
                {/* Floating NFC Physical Stand Badge */}
                <div className="absolute -top-6 -left-6 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-3 animate-bounce [animation-duration:4s]">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Physical NFC Stand
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      Tap phone anywhere
                    </span>
                  </div>
                </div>

                {/* Smartphone Device Frame */}
                <div className="bg-[#071321] p-3 rounded-[42px] shadow-2xl border-4 border-slate-800 relative overflow-hidden">
                  {/* Phone Speaker Notch */}
                  <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950"></span>
                  </div>

                  {/* Screen Content */}
                  <div className="bg-[#F5F8FC] rounded-[32px] overflow-hidden text-slate-900 border border-slate-300/40 text-xs shadow-inner">
                    {/* Simulated Cover */}
                    <div className="h-28 bg-slate-900 relative">
                      <img
                        src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                        alt="Cafe"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute -bottom-5 left-4">
                        <img
                          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80"
                          alt="Logo"
                          className="w-12 h-12 rounded-xl border-2 border-white shadow-md object-cover"
                        />
                      </div>
                    </div>

                    <div className="pt-7 px-4 pb-4 space-y-2.5">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#071321]">Cafe Aroma</h4>
                        <p className="text-[10px] text-slate-500">Artisanal Coffee & Fresh Viennoiserie</p>
                      </div>

                      {/* Mockup buttons */}
                      <div className="space-y-1.5">
                        <div className="p-2.5 rounded-xl bg-[#071321] text-white flex items-center justify-between font-bold text-[11px] shadow-sm">
                          <span className="flex items-center gap-1.5">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-cyan-400" /> Digital Menu
                          </span>
                          <span className="text-[10px] text-cyan-300 font-mono">₹240+</span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-between font-bold text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Google Review
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-between font-bold text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <Wifi className="w-3.5 h-3.5 text-[#13C8F4]" /> Guest Wi-Fi
                          </span>
                          <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1 rounded">
                            Auto-Connect
                          </span>
                        </div>
                      </div>

                      {/* Live QR visual */}
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="text-[10px]">
                          <p className="font-bold text-slate-800">Table 4 Stand</p>
                          <p className="text-slate-400 font-mono">nexora.in/go/cafe-t01</p>
                        </div>
                        <QRCodeSVG value="https://nexora.in/b/cafe-aroma" size={40} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats pill */}
                <div className="absolute -bottom-4 -right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">+142%</span>
                    <span className="text-[10px] text-slate-500 font-medium">Customer Engagement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* INDUSTRY SWITCHER SECTION                                      */}
      {/* ============================================================== */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 uppercase tracking-wider">
              Tailored Across Verticals
            </span>
            <h2 className="text-3xl font-black text-[#071321] tracking-tight">
              Engineered for Every Hospitality & Retail Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your business vertical to discover how Nexora elevates your customer touchpoints.
            </p>
          </div>

          {/* Industry Horizontal Buttons */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {industries.map((ind) => {
              const Icon = ind.icon
              const isSelected = selectedIndustry === ind.id
              return (
                <button
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#071321] text-white shadow-lg shadow-navy-950/20 scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{ind.name}</span>
                </button>
              )
            })}
          </div>

          {/* Dynamic Industry Card */}
          <div className="bg-gradient-to-r from-slate-900 via-[#071321] to-[#0a1f38] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
            <div className="space-y-4 max-w-xl">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/15">
                {activeInd.name} Solution
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                {activeInd.headline}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {activeInd.desc}
              </p>
              <div className="pt-2">
                <Link
                  to="/solutions"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:underline"
                >
                  Explore Detailed Industry Blueprint <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-3 w-full md:w-auto">
              <p className="text-xs font-bold text-cyan-300">Live Case Study</p>
              <h4 className="text-lg font-black text-white">Cafe Aroma Showcase</h4>
              <p className="text-[11px] text-slate-300 max-w-xs">
                Explore an authentic dining deployment featuring real specialty coffees and review tracking.
              </p>
              <Link
                to="/b/cafe-aroma"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white text-xs font-bold shadow hover:scale-105 transition-transform"
              >
                Launch Experience <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6 CORE FEATURES MATRIX                                         */}
      {/* ============================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#087BEE] border border-blue-200 uppercase tracking-wider">
            All-In-One Platform
          </span>
          <h2 className="text-3xl font-black text-[#071321] tracking-tight">
            Six Modular Superpowers in One Unified Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            No fragmented tools. Manage your physical stands, online menus, Google reviews, and guest Wi-Fi from a single hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#071321] mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* CTA SECTION                                                    */}
      {/* ============================================================== */}
      <section className="py-16 bg-[#071321] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
            Zero Software Cost to Launch
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to upgrade your tables to <br />
            <span className="bg-gradient-to-r from-cyan-400 via-[#087BEE] to-purple-400 bg-clip-text text-transparent">
              Smart Tap-and-Engage Stands?
            </span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Join forward-thinking restaurants, cafés, and salons driving more Google reviews and direct customer loyalty with Nexora Technologies.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
            >
              Compare SaaS Plans
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

