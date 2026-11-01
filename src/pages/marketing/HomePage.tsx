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
  ExternalLink,
  Layers,
  Smartphone,
  ScanLine,
  TrendingUp,
  Percent,
  Check,
  Award,
  Play
} from 'lucide-react'

export const HomePage: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<
    'restaurant' | 'cafe' | 'hotel' | 'retail' | 'salon'
  >('cafe')

  // Hero interactive simulation toggle
  const [heroSimMode, setHeroSimMode] = useState<'nfc' | 'qr'>('nfc')
  const [isTapped, setIsTapped] = useState(false)

  // Interactive ROI Calculator State
  const [numTables, setNumTables] = useState<number>(20)
  const [guestsPerTable, setGuestsPerTable] = useState<number>(8)

  const monthlyGuests = numTables * guestsPerTable * 30
  const estimatedReviews = Math.round(monthlyGuests * 0.08)
  const printingCostSaved = numTables * 650 * 4 // ₹ savings per year on reprints

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

  const hardwareProducts = [
    {
      name: 'Frosted Acrylic Table Tent',
      material: 'Laser-Etched Optical Acrylic',
      tagType: 'Dual NTAG215 NFC + High-Density Vector QR',
      useCase: 'Dining Tables, Bar Counters, Cocktail Lounges',
      badge: 'Bestseller',
      accent: 'from-blue-600 to-cyan-500'
    },
    {
      name: 'Walnut / Matte Black NFC Puck',
      material: 'Solid Dark Walnut & Brass Coil',
      tagType: 'Embedded Anti-Metal High-Gain NTAG213',
      useCase: 'Cashier Counters, Reception Desks, Baristas',
      badge: 'Tap-to-Review',
      accent: 'from-amber-600 to-orange-500'
    },
    {
      name: 'Weatherproof Disc Stand',
      material: 'IP68 Sealed Industrial Polycarbonate',
      tagType: 'Direct UV Printed QR + Heavy-Duty NFC',
      useCase: 'Outdoor Patios, Rooftops, Beachside Cabanas',
      badge: 'All-Weather',
      accent: 'from-emerald-600 to-teal-500'
    },
    {
      name: 'Ultra-Thin Styling Mirror Sticker',
      material: '0.2mm Anti-Interference Metallic Vinyl',
      tagType: 'High-Frequency NTAG216 Chip',
      useCase: 'Salon Mirrors, Hotel Nightstands, Changing Rooms',
      badge: 'Minimalist',
      accent: 'from-purple-600 to-violet-500'
    }
  ]

  const features = [
    {
      icon: Radio,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      title: 'Smart NFC Tap-and-Go',
      desc: 'Customers simply hold their iPhone or Android phone near your stand. Opens your web profile in sub-0.4s without any mobile app download.'
    },
    {
      icon: QrCode,
      color: 'text-[#087BEE]',
      bg: 'bg-blue-100',
      title: 'Dynamic Vector QR Tracking',
      desc: 'Print high-res QR table tents. Track individual table velocity and redirect links dynamically from your dashboard without reprinting.'
    },
    {
      icon: UtensilsCrossed,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      title: 'Interactive Live Menu',
      desc: 'Vibrant food photography, real-time In-Stock / Sold-Out toggles, vegetarian/dietary indicators, and table order tray summary.'
    },
    {
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      title: 'Google Reviews Acceleration',
      desc: 'Skyrocket your Google Maps ranking with frictionless 1-tap review redirects. Fully compliant with Google’s anti-gating regulations.'
    },
    {
      icon: MessageSquareHeart,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
      title: 'Honest Private Feedback Hub',
      desc: 'Collect 1 to 5-star ratings and private recommendations accessible exclusively within your private merchant dashboard.'
    },
    {
      icon: Wifi,
      color: 'text-cyan-600',
      bg: 'bg-cyan-100',
      title: 'Guest Wi-Fi Auto-Connect',
      desc: 'Generate camera-scan Wi-Fi QR codes. Customers tap to join your network instantly without typing lengthy passwords.'
    }
  ]

  const testimonials = [
    {
      quote: 'Our Google Reviews surged by 340% within 45 days of placing Nexora NFC stands on our tables. Guests love tapping to join Wi-Fi and browse our cold brew notes.',
      author: 'Alex Rivera',
      role: 'Founder, Cafe Aroma',
      metric: '+340% Reviews Growth',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      quote: 'Eliminating printed paper menus saved us over ₹40,000 every quarter. Whenever a dish sells out or our chef tweaks pricing, it updates live in 5 seconds.',
      author: 'Mira Kapoor',
      role: 'General Manager, Saffron & Spice',
      metric: '₹1.6L/Year Saved',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
    },
    {
      quote: 'Placing the discreet NFC stickers on our spa vanity mirrors made rebooking and client feedback effortless. It elevates our brand from the first touch.',
      author: 'Sameer Sen',
      role: 'Director, Aura Wellness Spas',
      metric: '94% Client Rating',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    }
  ]

  const activeInd = industries.find((i) => i.id === selectedIndustry)!

  const handleSimulateTap = () => {
    setIsTapped(true)
    setTimeout(() => setIsTapped(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      {/* ============================================================== */}
      {/* HERO SECTION: MESH GRADIENT + INTERACTIVE 3D SIMULATOR         */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-36 overflow-hidden mesh-gradient-hero bg-grid-pattern">
        {/* Decorative radiant orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-tr from-[#087BEE]/20 via-[#13C8F4]/15 to-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Core Positioning & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-500/30 text-[#087BEE] text-xs font-bold uppercase tracking-wider shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13C8F4] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#087BEE]"></span>
                </span>
                <span>Next-Gen Smart Business OS</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-semibold">NFC + Dynamic QR</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-black text-[#071321] tracking-tight leading-[1.06]">
                ONE TAP. <br />
                <span className="bg-gradient-to-r from-[#087BEE] via-[#13C8F4] to-[#8B5CF6] bg-clip-text text-transparent">
                  SMARTER BUSINESS.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Empower your café, restaurant, hotel or salon with intelligent physical stands. Turn customer visits into <strong>digital orders, 5-star Google reviews, automated guest Wi-Fi</strong>, and live analytics with a single tap.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/auth/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Your Business Profile Free
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/b/cafe-aroma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white text-slate-800 font-bold text-sm border border-slate-300/80 hover:border-slate-400 shadow-sm hover:bg-slate-50 transition-all"
                >
                  <Zap className="w-4 h-4 text-[#087BEE]" />
                  Explore Live Demo Venue
                </Link>
              </div>

              {/* Live Metric Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>No Mobile App Needed</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Works with iOS & Android</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>PostgreSQL + RLS Isolation</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Phone & Acrylic Stand Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              {/* Interactive Mode Switcher Pill */}
              <div className="mb-4 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-md border border-slate-200 flex items-center gap-1.5 z-30">
                <button
                  onClick={() => setHeroSimMode('nfc')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    heroSimMode === 'nfc'
                      ? 'bg-[#071321] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-cyan-400" /> Simulate NFC Tap
                </button>
                <button
                  onClick={() => setHeroSimMode('qr')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    heroSimMode === 'qr'
                      ? 'bg-[#071321] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 text-[#087BEE]" /> Camera QR Scan
                </button>
              </div>

              {/* 3D Realistic Phone Showcase */}
              <div className="relative w-full max-w-[340px] sm:max-w-[370px]">
                {/* Simulated Floating Physical Stand in Background */}
                <div
                  onClick={handleSimulateTap}
                  className="cursor-pointer absolute -top-8 -right-6 z-10 bg-gradient-to-br from-slate-900 via-[#071321] to-[#122846] text-white p-4 rounded-3xl shadow-2xl border-2 border-cyan-500/30 w-44 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-cyan-300">
                      Smart Table Stand
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  </div>

                  <div className="relative p-2.5 bg-white/10 rounded-2xl border border-white/15 flex flex-col items-center text-center">
                    {/* Animated NFC Broadcast Wave Rings */}
                    <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                      <span className="absolute inset-0 rounded-full border border-cyan-400/40 animate-nfc-wave"></span>
                      <span className="absolute inset-0 rounded-full border border-blue-400/30 animate-nfc-wave-delayed"></span>
                      <Radio className="w-6 h-6 text-cyan-300 relative z-10" />
                    </div>
                    <span className="text-[10px] font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {heroSimMode === 'nfc' ? 'Click: Tap Phone Here' : 'Scan Live QR'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">T-04 Stand</span>
                  </div>
                </div>

                {/* Smartphone Device Frame */}
                <div className="bg-[#071321] p-3 rounded-[44px] shadow-2xl border-4 border-slate-800 relative overflow-hidden transition-transform duration-300 hover:shadow-cyan-500/10">
                  {/* Phone Speaker Notch */}
                  <div className="w-28 h-4 bg-slate-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-slate-950"></span>
                  </div>

                  {/* Screen Content */}
                  <div className="bg-[#F5F8FC] rounded-[34px] overflow-hidden text-slate-900 border border-slate-200/80 text-xs shadow-inner relative">
                    {/* Interactive Tap Notification Overlay */}
                    {isTapped && (
                      <div className="absolute inset-x-3 top-3 z-30 bg-[#071321]/95 text-white p-3 rounded-2xl shadow-xl border border-cyan-400/50 animate-in slide-in-from-top duration-300 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-cyan-500 text-[#071321] flex items-center justify-center flex-shrink-0 font-bold">
                          <Radio className="w-4 h-4 animate-pulse" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-cyan-300">NFC Tap Detected!</p>
                          <p className="text-[9px] text-slate-300 truncate">Connecting to Cafe Aroma Table 4...</p>
                        </div>
                      </div>
                    )}

                    {/* QR Scan Camera Reticle in QR Mode */}
                    {heroSimMode === 'qr' && (
                      <div className="absolute inset-x-4 top-16 z-20 bg-slate-950/80 backdrop-blur-xs p-4 rounded-2xl border border-blue-400/40 text-center text-white space-y-2 animate-in fade-in duration-200">
                        <div className="relative w-28 h-28 mx-auto border-2 border-dashed border-cyan-400 rounded-xl flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                          <QRCodeSVG value="https://nexora.in/b/cafe-aroma" size={80} />
                        </div>
                        <p className="text-[10px] font-bold text-cyan-300">Targeting Table 4 QR Stand</p>
                      </div>
                    )}

                    {/* Simulated Business Header */}
                    <div className="h-28 bg-slate-900 relative">
                      <img
                        src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80"
                        alt="Cafe Aroma"
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      <div className="absolute -bottom-5 left-4">
                        <img
                          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=150&q=80"
                          alt="Cafe Aroma Logo"
                          className="w-12 h-12 rounded-xl border-2 border-white shadow-md object-cover"
                        />
                      </div>
                    </div>

                    <div className="pt-7 px-4 pb-4 space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-extrabold text-sm text-[#071321] flex items-center gap-1">
                            Cafe Aroma
                            <Sparkles className="w-3 h-3 text-[#087BEE]" />
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Artisanal Coffee & Fresh Sourdough
                          </p>
                        </div>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                          Open Now
                        </span>
                      </div>

                      {/* Mockup Quick Buttons */}
                      <div className="space-y-1.5">
                        <Link
                          to="/b/cafe-aroma/menu"
                          target="_blank"
                          className="p-2.5 rounded-xl bg-gradient-to-r from-[#071321] via-[#0b2447] to-[#071321] text-white flex items-center justify-between font-bold text-[11px] shadow-sm hover:scale-[1.01] transition-transform"
                        >
                          <span className="flex items-center gap-1.5">
                            <UtensilsCrossed className="w-3.5 h-3.5 text-cyan-400" /> Digital Menu & Cart
                          </span>
                          <span className="text-[10px] text-cyan-300 font-mono">₹240+</span>
                        </Link>

                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-between font-bold text-[11px] shadow-xs">
                          <span className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Rate us on Google
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </div>

                        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-between font-bold text-[11px] shadow-xs">
                          <span className="flex items-center gap-1.5">
                            <Wifi className="w-3.5 h-3.5 text-[#13C8F4]" /> Fast Guest Wi-Fi
                          </span>
                          <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                            Auto-Connect
                          </span>
                        </div>
                      </div>

                      {/* Active Offer Strip */}
                      <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-[10px] flex items-center justify-between font-bold">
                        <span>🔥 BOGO FREE on Flat Whites</span>
                        <span className="bg-black/20 px-1.5 py-0.5 rounded text-[9px] font-mono">
                          AROMACOFFEE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats pill */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">+142% Repeat Visits</span>
                    <span className="text-[10px] text-slate-500 font-medium">Zero friction customer loop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* PHYSICAL HARDWARE SHOWCASE: TABLETENTS, PUCKS & STANDS         */}
      {/* ============================================================== */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
              Physical Touchpoints
            </span>
            <h2 className="text-3xl font-black text-[#071321] tracking-tight">
              Designed to Elevate Any Dining Room or Checkout Counter
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Nexora links with any standard NTAG213 / NTAG215 hardware or self-printed table tent paper.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hardwareProducts.map((prod, idx) => (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r ${prod.accent} text-white shadow-xs`}
                    >
                      {prod.badge}
                    </span>
                    <Radio className="w-4 h-4 text-slate-400 group-hover:text-[#087BEE] transition-colors" />
                  </div>

                  <h3 className="text-base font-bold text-[#071321] mb-1">{prod.name}</h3>
                  <p className="text-[11px] font-semibold text-[#087BEE] mb-3">{prod.material}</p>
                  
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                    <p>
                      <strong>Chip:</strong> {prod.tagType}
                    </p>
                    <p>
                      <strong>Best For:</strong> {prod.useCase}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-500">Auto-Encoded</span>
                  <Link
                    to="/dashboard/qr-nfc"
                    className="text-[#087BEE] font-bold hover:underline flex items-center gap-1"
                  >
                    Program in App <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE ROI & REVIEW GROWTH CALCULATOR                     */}
      {/* ============================================================== */}
      <section className="py-20 bg-gradient-to-b from-[#F5F8FC] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#071321] via-[#0c223c] to-[#071321] text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/20">
                Interactive ROI Calculator
              </span>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Calculate How Many Extra 5-Star Reviews & ₹ Saved Your Tables Will Generate
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                Drag the sliders to project the annual impact of replacing paper table cards with Nexora smart NFC stands.
              </p>

              {/* Slider 1: Number of Tables */}
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Tables in Your Venue:</span>
                  <span className="text-cyan-300 font-mono text-base">{numTables} Tables</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={numTables}
                  onChange={(e) => setNumTables(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Slider 2: Daily Guests per table */}
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Daily Guests Per Table:</span>
                  <span className="text-cyan-300 font-mono text-base">{guestsPerTable} Guests</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  step="1"
                  value={guestsPerTable}
                  onChange={(e) => setGuestsPerTable(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#087BEE]"
                />
              </div>
            </div>

            {/* Right Column: Calculated Results Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6 text-center lg:text-left">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Estimated New Google Reviews
                </span>
                <div className="text-4xl sm:text-5xl font-black text-cyan-300 tracking-tight mt-1">
                  +{estimatedReviews} <span className="text-lg font-bold text-white">/ month</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Based on realistic 8% tap-to-review conversion rates
                </p>
              </div>

              <div className="pt-4 border-t border-white/15">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Annual Menu Printing Cost Saved
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight mt-1">
                  ₹{printingCostSaved.toLocaleString('en-IN')} <span className="text-sm font-bold text-white">/ year</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Saved across seasonal reprints, price adjustments & specials
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/auth/register"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  Claim Your Free Setup <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
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
      {/* VERIFIED CUSTOMER CASE STUDIES & TESTIMONIALS                  */}
      {/* ============================================================== */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
              Proven Hospitality Impact
            </span>
            <h2 className="text-3xl font-black text-[#071321] tracking-tight">
              Trusted by Ambitious Venues Accelerating Growth
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Here is how dining rooms, cafés, and salons utilize Nexora NFC solutions every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                    {t.metric}
                  </span>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.author}</h4>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FINAL CALL TO ACTION                                           */}
      {/* ============================================================== */}
      <section className="py-20 bg-[#071321] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-extrabold text-sm shadow-xl hover:shadow-cyan-500/30 hover:scale-105 transition-all"
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
