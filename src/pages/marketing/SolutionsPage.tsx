import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { DemoBanner } from '@/components/common/DemoBanner'
import {
  UtensilsCrossed,
  Coffee,
  Building,
  ShoppingBag,
  Scissors,
  CheckCircle2,
  ArrowRight,
  Zap,
  Star,
  Wifi,
  Radio,
  QrCode,
  Smartphone,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  BarChart3
} from 'lucide-react'

export const SolutionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'restaurant' | 'cafe' | 'hotel' | 'retail' | 'salon'>('restaurant')

  const industries = [
    {
      id: 'restaurant',
      icon: UtensilsCrossed,
      title: 'Restaurants, Diners & Fine Dining',
      badge: 'High-Volume Dining',
      stat: '+420% Reviews',
      statLabel: 'Average Google Reviews growth in first 60 days',
      summary: 'Replace bulky laminated menus with ultra-fast digital experiences, dietary allergen filters, real-time kitchen availability, and seamless Google review prompts.',
      hardware: 'Matte Black Acrylic Table Tents & Walnut NFC Pucks',
      benefits: [
        'Instant menu adjustments for daily specials, 86’d dishes, and fluctuating market prices',
        'Distinct Vegetarian, Vegan, Gluten-Free, and Halal dietary allergen indicators',
        'Table-specific QR table tent stands & NFC discs for exact table cart management',
        'Private customer feedback collection to prevent negative Google reviews before departure'
      ],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cafe',
      icon: Coffee,
      title: 'Cafés, Coffee Bars & Bakeries',
      badge: 'Rapid Morning Turnaround',
      stat: '1-Second Tap',
      statLabel: 'Instant contactless customer engagement at the pickup bar',
      summary: 'Turn takeaway and dine-in coffee enthusiasts into regular 5-star Google reviewers with single-tap acrylic counter pucks and automated Wi-Fi pairing.',
      hardware: '80mm Countertop Pucks & Window Decal Stickers',
      benefits: [
        'Showcase artisanal pour-over notes, bean origins, and fresh pastry inventory',
        'Tap-to-connect guest Wi-Fi for remote workers and students with zero password typing',
        'Collect private customer feedback on roast profiles, milk alternatives, and cafe ambience',
        'Broadcast morning coffee BOGO coupons and seasonal drink promo banners'
      ],
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'hotel',
      icon: Building,
      title: 'Hotels, Resorts & Guest Houses',
      badge: 'Hospitality Concierge',
      stat: '₹0 Paper Waste',
      statLabel: 'Eliminate printed in-room guest service binders entirely',
      summary: 'Replace dusty guestroom paper binders with modern bedside NFC cards for instant Wi-Fi pairing, in-room dining menus, and concierge recommendations.',
      hardware: 'Bedside Acrylic NFC Cards & Poolside Weatherproof Discs',
      benefits: [
        'Instant guestroom Wi-Fi auto-connect via native camera scan or NFC tap',
        'Digital in-room dining menus with direct dialing to room service or WhatsApp',
        'Curated concierge guides, spa booking schedules, and local area navigation maps',
        'Confidential guest incident reporting enabling staff resolution prior to checkout'
      ],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'retail',
      icon: ShoppingBag,
      title: 'Retail Stores, Showrooms & Boutiques',
      badge: 'Phygital Shopping',
      stat: '3.4x Repeat Visits',
      statLabel: 'Increased customer brand retention with digital touchpoints',
      summary: 'Add smart NFC tags and QR labels to product mannequins, apparel racks, and checkout counters to bridge the physical-to-digital gap.',
      hardware: 'Miniature NFC Mirror Badges & Checkout Standees',
      benefits: [
        'Share detailed garment material origin stories and ethical sustainability credentials',
        'Direct shoppers to customer styling lookbooks and coordinating wardrobe accessories',
        'One-tap Google Maps review cards placed strategically at the cash counter',
        'Drive instant newsletter signups, seasonal sales alerts, and VIP loyalty club registrations'
      ],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'salon',
      icon: Scissors,
      title: 'Hair Salons, Spas & Wellness Studios',
      badge: 'Client Retention & Reviews',
      stat: '5-Star Boost',
      statLabel: 'Capture reviews at peak client satisfaction right after styling',
      summary: 'Place discreet mirror NFC stickers and station stands where clients relax during styling sessions and pampering treatments.',
      hardware: 'Ultra-Thin Mirror NFC Badges & Reception Standees',
      benefits: [
        'Display stylist portfolios, treatment menus, and seasonal beauty packages',
        'Encourage genuine 5-star Google reviews right after fresh cuts or spa treatments',
        'Private confidential feedback forms for service hygiene and staff ratings',
        'One-touch WhatsApp appointment re-booking and product aftercare tips'
      ],
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
    }
  ]

  const activeIndustry = industries.find((i) => i.id === activeTab) || industries[0]

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col font-sans selection:bg-cyan-500 selection:text-[#090D16]">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-black bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Vertical Solutions
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tailored Smart NFC & QR Architecture For Modern Businesses
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            From busy downtown cafés to luxury boutique hotels, Nexora bridges physical customer touchpoints with modern digital experiences.
          </p>
        </div>

        {/* Interactive Industry Tab Switcher */}
        <div className="bg-[#0E1626]/90 p-3 rounded-3xl border border-cyan-500/20 shadow-xl">
          <div className="flex items-center justify-between overflow-x-auto gap-2 pb-1 sm:pb-0">
            {industries.map((ind) => {
              const Icon = ind.icon
              const isSelected = activeTab === ind.id
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveTab(ind.id as any)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex-1 justify-center ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-lg shadow-cyan-500/25'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{ind.title.split(',')[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Featured Active Industry Spotlight */}
        <div className="bg-[#0E1626]/90 rounded-3xl border border-cyan-500/25 shadow-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden animate-in fade-in duration-300">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-500/30">
                <activeIndustry.icon className="w-3.5 h-3.5 text-cyan-400" />
                {activeIndustry.badge}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#090D16] text-slate-300 text-xs font-semibold border border-slate-800">
                Hardware: {activeIndustry.hardware}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {activeIndustry.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {activeIndustry.summary}
            </p>

            {/* Impact Metric Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-cyan-950/40 border border-cyan-500/30 flex items-center gap-4">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                {activeIndustry.stat}
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {activeIndustry.statLabel}
              </div>
            </div>

            {/* Benefit Checklist */}
            <div className="space-y-3">
              {activeIndustry.benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs font-black shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all border border-cyan-400/30"
              >
                Launch Your Business Profile <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/b/cafe-aroma"
                target="_blank"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#090D16] hover:bg-[#131E34] text-slate-200 text-xs font-bold border border-cyan-500/20 transition-colors"
              >
                <Zap className="w-4 h-4 text-cyan-400" /> Test Live Customer Flow
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30 h-[380px] lg:h-[440px] relative group">
              <img
                src={activeIndustry.image}
                alt={activeIndustry.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                  REAL-WORLD DEPLOYMENT
                </span>
                <h4 className="text-lg font-black text-white">{activeIndustry.title}</h4>
                <p className="text-xs text-slate-400">Integrated with Nexora Smart NFC & QR platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Customer Journey Timeline */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              The 4-Second Seamless Customer Journey
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Zero friction. No apps to download. Works natively on all modern smartphones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: Radio,
                title: 'Physical Touchpoint',
                desc: 'Customer taps their iPhone / Android against the NFC card or scans the QR code with their camera.',
                badge: '1 Second'
              },
              {
                step: '02',
                icon: Smartphone,
                title: 'Instant Web Portal',
                desc: 'Your branded digital hub opens immediately in their default browser with zero login friction.',
                badge: 'Instant Load'
              },
              {
                step: '03',
                icon: Star,
                title: 'Engagement & Reviews',
                desc: 'They browse digital menu items, connect to guest Wi-Fi, or leave an authentic 5-star Google review.',
                badge: 'Unfiltered'
              },
              {
                step: '04',
                icon: BarChart3,
                title: 'Merchant Analytics',
                desc: 'Live scan interactions, table-specific data, and private guest feedback stream into your dashboard.',
                badge: 'Real-Time'
              }
            ].map((step, idx) => {
              const Icon = step.icon
              return (
                <div
                  key={idx}
                  className="bg-[#0E1626]/80 p-6 rounded-3xl border border-cyan-500/20 hover:border-cyan-400/40 shadow-xs hover:shadow-cyan-500/10 transition-all relative space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-800">{step.step}</span>
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>

                  <h4 className="text-base font-black text-white">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-[#0E1626] via-[#121E36] to-[#090D16] rounded-3xl p-8 sm:p-12 text-white text-center shadow-2xl border border-cyan-500/30 space-y-4">
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
            Ready to upgrade your physical location?
          </span>
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Get Your Business Set Up with Smart NFC & QR Today
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Start free with our complete software suite. Create your menu, generate dynamic QR codes, and connect your physical NFC tags in minutes.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs font-black shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all border border-cyan-400/30"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
