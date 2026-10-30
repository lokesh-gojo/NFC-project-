import React from 'react'
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
  QrCode
} from 'lucide-react'

export const SolutionsPage: React.FC = () => {
  const industries = [
    {
      id: 'restaurant',
      icon: UtensilsCrossed,
      title: 'Restaurants, Diners & Fine Dining',
      badge: 'High-Volume Engagement',
      summary: 'Replace cumbersome laminated menus with high-resolution digital experiences, live kitchen availability and one-tap Google review prompts.',
      benefits: [
        'Instant menu adjustments for daily specials and fluctuating 86’d items',
        'Clear vegetarian, vegan, gluten-free, and allergen warning labels',
        'Direct table-specific QR table tent stands & NFC discs',
        'Customer ordering cart for seamless table server interaction'
      ],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'cafe',
      icon: Coffee,
      title: 'Cafés, Coffee Bars & Bakeries',
      badge: 'Rapid Morning Turnaround',
      summary: 'Turn takeaway and dine-in coffee enthusiasts into regular Google reviewers with single-tap acrylic counter pucks.',
      benefits: [
        'Showcase artisanal pour-over notes and single-origin coffee origins',
        'Tap-to-connect guest Wi-Fi for remote workers and students',
        'Collect private customer feedback on coffee quality and ambience',
        'Happy hour and morning coffee BOGO promo coupons'
      ],
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'hotel',
      icon: Building,
      title: 'Hotels, Resorts & Guest Houses',
      badge: 'Hospitality Concierge',
      summary: 'Replace dusty guestroom paper binders with modern bedside NFC cards for instant Wi-Fi pairing and room dining.',
      benefits: [
        'Instant room Wi-Fi auto-connect via native camera scan or NFC tap',
        'Digital in-room dining menus with direct dialing options',
        'Concierge recommendations, spa schedules and city map links',
        'Private guest incident reporting before departure'
      ],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'retail',
      icon: ShoppingBag,
      title: 'Retail Stores, Showrooms & Boutiques',
      badge: 'Physical-to-Digital Storytelling',
      summary: 'Add smart NFC tags and QR labels to product mannequins, apparel racks and checkout counters.',
      benefits: [
        'Share detailed garment material stories and sustainability credentials',
        'Direct shoppers to customer styling lookbooks and related accessories',
        'One-tap Google Maps review cards placed at the cash counter',
        'Drive newsletter signups and VIP loyalty club memberships'
      ],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'salon',
      icon: Scissors,
      title: 'Hair Salons, Spas & Wellness Studios',
      badge: 'Client Retention & Reviews',
      summary: 'Place discreet mirror NFC stickers and station stands where clients relax during styling sessions.',
      benefits: [
        'Display stylist portfolios, treatment menus and seasonal packages',
        'Encourage genuine 5-star Google reviews right after fresh cuts or spa days',
        'Private confidential feedback forms for service hygiene and staff ratings',
        'One-touch WhatsApp appointment re-booking link'
      ],
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-[#087BEE] border border-blue-200 uppercase tracking-wider">
            Industry Solutions
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#071321] tracking-tight">
            Smart NFC & QR Architecture For Modern Commerce
          </h1>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Discover how Nexora Technologies delivers seamless customer journeys tailored to the unique operational workflows of your business.
          </p>
        </div>

        {/* Industry Cards List */}
        <div className="space-y-12">
          {industries.map((ind, idx) => {
            const Icon = ind.icon
            const isReversed = idx % 2 === 1
            return (
              <div
                key={ind.id}
                className={`bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 flex flex-col ${
                  isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } gap-8 items-center`}
              >
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <Icon className="w-3.5 h-3.5 text-[#087BEE]" />
                    {ind.badge}
                  </div>

                  <h3 className="text-2xl font-black text-[#071321] leading-tight">
                    {ind.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {ind.summary}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {ind.benefits.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <Link
                      to="/auth/register"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white text-xs font-bold shadow hover:shadow-md transition-all"
                    >
                      Get Started <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      to="/b/cafe-aroma"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#087BEE]" /> View Live Demo
                    </Link>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-72 lg:h-96">
                  <img
                    src={ind.image}
                    alt={ind.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <Footer />
    </div>
  )
}

