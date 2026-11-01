import React, { useState } from 'react'
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
  ArrowRight,
  ChevronDown,
  X,
  CreditCard,
  Lock,
  Headphones
} from 'lucide-react'

export const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

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
        '7-Day Analytics History',
        'Standard SVG & Print-Ready Table Tents'
      ],
      buttonText: 'Get Started Free',
      buttonLink: '/auth/register'
    },
    {
      name: 'Growth Pro',
      price: isAnnual ? '₹799' : '₹999',
      period: isAnnual ? 'per month (billed annually)' : 'per month',
      desc: 'Ideal for busy restaurants, hotels, and retail stores scaling customer touchpoints.',
      badge: 'Most Popular',
      highlight: true,
      features: [
        'Everything in Starter',
        'Unlimited QR Codes & NFC Links',
        'Table-Specific Tracking & Cart Summary',
        'Custom Brand Colors & Standee Studio Designer',
        'Complete 90-Day Analytics & CSV Export',
        'Team Access Management (Up to 5 staff)',
        'Promotional Offers & Discount Banners',
        'Priority WhatsApp & Email Support'
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
        'Staff Training & On-Site Setup Assistance',
        'Centralized Menu Sync across 50+ Venues'
      ],
      buttonText: 'Contact Enterprise Sales',
      buttonLink: '/auth/register'
    }
  ]

  const featureMatrix = [
    {
      category: 'Digital Profile & Menu Management',
      items: [
        { name: 'Branded Digital Business Hub', starter: true, pro: true, enterprise: true },
        { name: 'Categorized Digital Menu with Photos', starter: true, pro: true, enterprise: true },
        { name: 'Dietary Pills (Veg, Chef’s Picks, Allergens)', starter: true, pro: true, enterprise: true },
        { name: 'Customer Dish Selection & Table Cart', starter: false, pro: true, enterprise: true },
        { name: 'Real-Time Dish Availability Toggles', starter: true, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Smart Links & Physical Touchpoints',
      items: [
        { name: 'Dynamic Smart Redirects (/go/:code)', starter: 'Up to 3', pro: 'Unlimited', enterprise: 'Unlimited' },
        { name: 'Table-Specific Identifier Tracking', starter: false, pro: true, enterprise: true },
        { name: 'Custom Standee & QR Studio Designer', starter: 'Basic', pro: 'All Formats', enterprise: 'Custom Laser Etch' },
        { name: 'Web NFC Tag Browser Programmer', starter: true, pro: true, enterprise: true },
        { name: 'High-Resolution Vector SVG & Print Tents', starter: true, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Reputation & Customer Engagement',
      items: [
        { name: 'Direct Google Reviews Redirection', starter: true, pro: true, enterprise: true },
        { name: 'Google Anti-Gating Policy Compliance', starter: true, pro: true, enterprise: true },
        { name: 'Private Customer Feedback Form', starter: true, pro: true, enterprise: true },
        { name: 'Guest Wi-Fi Auto-Pairing QR Code', starter: true, pro: true, enterprise: true },
        { name: 'Promotional Offers & Happy Hour Banners', starter: false, pro: true, enterprise: true }
      ]
    },
    {
      category: 'Analytics, Security & Multi-Tenant',
      items: [
        { name: 'Visitor & Interaction Analytics', starter: '7 Days', pro: '90 Days', enterprise: 'Unlimited' },
        { name: 'QR vs NFC Access Channel Breakdown', starter: true, pro: true, enterprise: true },
        { name: 'PostgreSQL Row Level Security (RLS)', starter: true, pro: true, enterprise: true },
        { name: 'Custom Subdomain / Domain Binding', starter: false, pro: false, enterprise: true },
        { name: 'Customer Support SLA', starter: 'Community', pro: 'Priority WhatsApp', enterprise: '24/7 Dedicated' }
      ]
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
      q: 'What physical hardware do I need to get started?',
      a: 'You can print standard table tent paper stands from your office printer using our built-in print studio, or purchase affordable NTAG213 / NTAG215 NFC tags or acrylic table stands from any online retailer.'
    },
    {
      q: 'How does the free tier work?',
      a: 'The Starter plan is completely free forever. You can create your business profile, add your menu, configure guest Wi-Fi, and generate up to 3 tracking links without ever entering a credit card.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-black bg-blue-50 text-[#087BEE] border border-blue-200 uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#087BEE]" /> Simple, Transparent Plans
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#071321] tracking-tight">
            Predictable Pricing for Smarter Businesses
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Start for free with zero credit card required. Upgrade when you need unlimited touchpoints and custom branding.
          </p>

          {/* Billing Switcher */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${!isAnnual ? 'text-[#071321]' : 'text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                isAnnual ? 'bg-[#087BEE]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${isAnnual ? 'text-[#071321]' : 'text-slate-400'} flex items-center gap-1.5`}>
              Annual Billing
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                Save 20%
              </span>
            </span>
          </div>
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

        {/* Detailed Feature Comparison Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-[#071321] tracking-tight">
              Compare Platform Capabilities
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Detailed breakdown of features across our tier plans.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-bold">Feature Category</th>
                  <th className="py-3 px-4 font-bold text-center">Starter</th>
                  <th className="py-3 px-4 font-bold text-center text-[#087BEE]">Growth Pro</th>
                  <th className="py-3 px-4 font-bold text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {featureMatrix.map((section, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <tr className="bg-slate-50/80">
                      <td colSpan={4} className="py-2.5 px-4 font-black text-[#071321] text-xs">
                        {section.category}
                      </td>
                    </tr>
                    {section.items.map((item, iIdx) => (
                      <tr key={iIdx} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-700">{item.name}</td>
                        <td className="py-3 px-4 text-center">
                          {typeof item.starter === 'boolean' ? (
                            item.starter ? (
                              <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-slate-300 mx-auto" />
                            )
                          ) : (
                            <span className="font-semibold text-slate-600">{item.starter}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center bg-blue-50/20">
                          {typeof item.pro === 'boolean' ? (
                            item.pro ? (
                              <Check className="w-4 h-4 text-[#087BEE] mx-auto font-bold" />
                            ) : (
                              <X className="w-4 h-4 text-slate-300 mx-auto" />
                            )
                          ) : (
                            <span className="font-bold text-[#087BEE]">{item.pro}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof item.enterprise === 'boolean' ? (
                            item.enterprise ? (
                              <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-slate-300 mx-auto" />
                            )
                          ) : (
                            <span className="font-semibold text-slate-800">{item.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#071321]">Google Maps Compliant</h4>
              <p className="text-[11px] text-slate-500">100% adherence to Google's anti-gating policies.</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#087BEE] flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#071321]">PostgreSQL RLS Security</h4>
              <p className="text-[11px] text-slate-500">Full tenant data isolation on Supabase cloud.</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#071321]">Priority Merchant Setup</h4>
              <p className="text-[11px] text-slate-500">Fast assistance with NFC encoding & standee design.</p>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-[#071321]">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500">Everything you need to know about Nexora smart stands.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#087BEE] flex-shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-[#087BEE]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
