import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '@/components/common/Navbar'
import { Footer } from '@/components/common/Footer'
import { DemoBanner } from '@/components/common/DemoBanner'
import {
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react'

export const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '₹0',
      period: 'forever free',
      desc: 'Perfect for local cafés and single-location businesses getting started with QR menus.',
      badge: null,
      highlight: false,
      features: [
        '1 Digital Business Profile',
        'Up to 3 Active Smart Links (QR / NFC)',
        'Digital Menu (Unlimited items & categories)',
        'Honest Customer Feedback collection',
        'Direct Google Reviews redirection',
        'Standard Wi-Fi QR Code display',
        '7-Day Analytics History'
      ],
      buttonText: 'Get Started Free',
      buttonLink: '/auth/register'
    },
    {
      name: 'Growth Pro',
      price: '₹999',
      period: 'per month',
      desc: 'Ideal for busy restaurants, hotels, and retail stores scaling customer touchpoints.',
      badge: 'Most Popular',
      highlight: true,
      features: [
        'Everything in Starter',
        'Unlimited QR Codes & NFC Links',
        'Table-Specific Tracking & Cart Summary',
        'Custom Brand Colors & Themes',
        'Complete 90-Day Analytics & CSV Export',
        'Team Access Management (Up to 5 staff)',
        'Promotional Offers & Discount Banners',
        'Priority Support via WhatsApp'
      ],
      buttonText: 'Start 14-Day Free Trial',
      buttonLink: '/auth/register'
    },
    {
      name: 'Enterprise Elite',
      price: 'Custom',
      period: 'contact sales',
      desc: 'Tailored architecture for restaurant franchises, hotel chains and multi-branch retail.',
      badge: 'Franchise Ready',
      highlight: false,
      features: [
        'Multi-Branch Consolidated Dashboard',
        'Custom Domain Binding (e.g. menu.yourbrand.com)',
        'Pre-Programmed Physical Acrylic Stands & NFC Tags',
        'Dedicated Technical Account Manager',
        'Custom API Integrations & Webhooks',
        '99.99% Uptime SLA Agreement',
        'Staff Training & On-Site Setup Assistance'
      ],
      buttonText: 'Contact Enterprise Sales',
      buttonLink: '/auth/register'
    }
  ]

  const faqs = [
    {
      q: 'Do customers need to install any mobile app to view the menu or tap NFC?',
      a: 'No app download is needed whatsoever! Any modern iPhone or Android phone natively reads NFC tags and camera QR codes, instantly opening your fast-loading Nexora web profile.'
    },
    {
      q: 'Can I change my menu or Wi-Fi password without reprinting my QR codes or NFC cards?',
      a: 'Yes, absolutely! Nexora uses dynamic smart redirect links (/go/:code). Whenever you update prices, Wi-Fi credentials or Google review links in your dashboard, they take effect immediately.'
    },
    {
      q: 'Does Nexora comply with Google’s review policies?',
      a: 'Yes. Nexora is 100% compliant with Google Maps Anti-Gating rules. We provide genuine review link redirection and never hide or selectively filter negative ratings.'
    },
    {
      q: 'What physical hardware do I need?',
      a: 'You can print standard table tent paper stands from your office printer, or purchase affordable NTAG213 / NTAG215 NFC tags or acrylic table stands from any online retailer.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-[#087BEE] border border-blue-200 uppercase tracking-wider">
            Simple, Transparent Plans
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#071321] tracking-tight">
            Predictable Pricing for Smarter Businesses
          </h1>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Start for free without entering credit card details. Scale as your venue welcomes more customers.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between relative transition-all ${
                plan.highlight
                  ? 'bg-gradient-to-b from-[#071321] via-[#0b2447] to-[#071321] text-white shadow-2xl scale-105 border-2 border-[#087BEE]'
                  : 'bg-white text-slate-900 border border-slate-200/80 shadow-md'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white shadow-md">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className={`text-xl font-black ${plan.highlight ? 'text-white' : 'text-[#071321]'}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mt-1.5 leading-relaxed ${plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>
                  {plan.desc}
                </p>

                <div className="my-6">
                  <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                  <span className={`text-xs font-medium ml-2 ${plan.highlight ? 'text-cyan-300' : 'text-slate-500'}`}>
                    {plan.period}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-200/30 text-xs">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-cyan-400' : 'text-[#087BEE]'}`} />
                      <span className={plan.highlight ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Link
                  to={plan.buttonLink}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white shadow-lg hover:shadow-cyan-500/25 hover:scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  {plan.buttonText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-6 pt-12">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-[#071321]">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Everything you need to know about Nexora smart stands.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#087BEE]" />
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

