import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Business, CustomerFeedback, WifiSetting, Offer } from '@/types'
import {
  getBusinessBySlug,
  getWifiSettings,
  getOffers,
  submitFeedback,
  trackEvent,
  getOrCreateSessionId
} from '@/services/dataService'
import { QRCodeSVG } from 'qrcode.react'
import {
  UtensilsCrossed,
  Star,
  MessageSquareHeart,
  Wifi,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  Share2,
  AlertCircle,
  AlertTriangle,
  X,
  Send,
  ShieldCheck,
  Tag,
  Globe,
  Navigation
} from 'lucide-react'
import confetti from 'canvas-confetti'

export const BusinessProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [business, setBusiness] = useState<Business | null>(null)
  const [wifi, setWifi] = useState<WifiSetting | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [wifiModalOpen, setWifiModalOpen] = useState(false)
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const [hoursModalOpen, setHoursModalOpen] = useState(false)
  const [copiedWifi, setCopiedWifi] = useState(false)
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null)

  // Feedback form state
  const [rating, setRating] = useState(5)
  const [fbCategory, setFbCategory] = useState<CustomerFeedback['category']>('food')
  const [fbMessage, setFbMessage] = useState('')
  const [fbName, setFbName] = useState('')
  const [fbEmail, setFbEmail] = useState('')
  const [fbSubmitted, setFbSubmitted] = useState(false)
  const [fbSubmitting, setFbSubmitting] = useState(false)
  const [fbError, setFbError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!slug) return
      setLoading(true)
      try {
        const biz = await getBusinessBySlug(slug)
        setBusiness(biz)
        if (biz) {
          // Track page view
          await trackEvent({
            business_id: biz.id,
            event_type: 'page_view'
          })

          const [wifiData, offersData] = await Promise.all([
            getWifiSettings(biz.id),
            getOffers(biz.id)
          ])
          setWifi(wifiData)
          setOffers(offersData.filter((o) => o.is_active))
        }
      } catch (err) {
        console.error('Error loading business profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug])

  const handleGoogleReviewClick = async () => {
    if (!business) return
    await trackEvent({
      business_id: business.id,
      event_type: 'review_click'
    })
    const url = business.google_review_url || 'https://google.com'
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleOpenWifi = async () => {
    if (business) {
      await trackEvent({
        business_id: business.id,
        event_type: 'wifi_view'
      })
    }
    setWifiModalOpen(true)
  }

  const handleCopyWifiPassword = () => {
    if (wifi?.password) {
      navigator.clipboard.writeText(wifi.password)
      setCopiedWifi(true)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(30)
      }
      setTimeout(() => setCopiedWifi(false), 2000)
    }
  }

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCoupon(code)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30)
    }
    setTimeout(() => setCopiedCoupon(null), 2000)
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!business || !fbMessage.trim()) return

    setFbSubmitting(true)
    setFbError(null)
    try {
      await submitFeedback({
        business_id: business.id,
        rating,
        category: fbCategory,
        message: fbMessage,
        customer_name: fbName || undefined,
        customer_email: fbEmail || undefined,
        session_id: getOrCreateSessionId()
      })

      await trackEvent({
        business_id: business.id,
        event_type: 'feedback_submit',
        meta: { rating, category: fbCategory }
      })

      setFbSubmitted(true)
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.65 } })
    } catch (err: any) {
      console.error('Failed to submit feedback:', err)
      setFbError(err.message || 'Unable to submit feedback. Please try again.')
    } finally {
      setFbSubmitting(false)
    }
  }

  const resetFeedbackForm = () => {
    setRating(5)
    setFbCategory('food')
    setFbMessage('')
    setFbName('')
    setFbEmail('')
    setFbSubmitted(false)
    setFbError(null)
    setFeedbackModalOpen(false)
  }

  const ratingEmotionMap = {
    5: { text: 'Outstanding! 🤩', color: 'text-amber-500' },
    4: { text: 'Very Good! 😊', color: 'text-emerald-500' },
    3: { text: 'It was okay 😐', color: 'text-blue-500' },
    2: { text: 'Needs Improvement 😕', color: 'text-orange-500' },
    1: { text: 'Disappointed 😞', color: 'text-rose-500' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#087BEE] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-600">Connecting to smart profile...</p>
        </div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Business Profile Not Found</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            The link you accessed does not correspond to an active business profile. Please verify the URL or contact the owner.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087BEE] text-white text-xs font-bold shadow hover:bg-blue-600"
          >
            Go to Nexora Technologies
          </Link>
        </div>
      </div>
    )
  }

  // Construct Wi-Fi QR Code string: WIFI:T:WPA;S:MySSID;P:MyPassword;;
  const wifiString = wifi
    ? `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password || ''};;`
    : ''

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-slate-900 flex justify-center pb-24 sm:pb-16 selection:bg-[#087BEE] selection:text-white">
      {/* Container constrained to mobile-friendly max width for pristine card experience */}
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative border-x border-slate-200/80 flex flex-col">
        {/* Cover Image & Branding Header */}
        <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
          <img
            src={
              business.cover_url ||
              'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80'
            }
            alt={business.name}
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>

          {/* Top Quick Actions Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-black/50 backdrop-blur-md uppercase tracking-wider border border-white/20">
              {business.category}
            </span>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: business.name,
                    text: business.tagline || 'Check out our digital business profile',
                    url: window.location.href
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Business link copied to clipboard!')
                }
              }}
              className="p-2.5 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 transition-all border border-white/20 active:scale-95"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Business Logo Overlap with verified glow */}
          <div className="absolute -bottom-8 left-6 z-10">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white relative">
              <img
                src={
                  business.logo_url ||
                  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=80'
                }
                alt={business.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Business Title, Tagline & Status Header */}
        <div className="pt-11 px-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#071321] tracking-tight flex items-center gap-1.5">
                {business.name}
                <Sparkles className="w-4 h-4 text-[#087BEE]" />
              </h1>
              {business.tagline && (
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{business.tagline}</p>
              )}
            </div>

            {/* Live Open / Closed interactive pill */}
            <button
              onClick={() => setHoursModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors cursor-pointer"
              title="View full opening hours"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Open Now</span>
            </button>
          </div>

          {business.description && (
            <p className="text-xs text-slate-600 mt-3 leading-relaxed border-l-2 border-[#087BEE] pl-3 py-0.5">
              {business.description}
            </p>
          )}

          {/* Quick Contact & Map Badges */}
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                onClick={() =>
                  trackEvent({ business_id: business.id, event_type: 'contact_click', meta: { channel: 'call' } })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-[#087BEE]" /> Call
              </a>
            )}
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent({ business_id: business.id, event_type: 'contact_click', meta: { channel: 'whatsapp' } })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-colors border border-emerald-200 active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
              </a>
            )}
            {business.google_maps_url && (
              <a
                href={business.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent({ business_id: business.id, event_type: 'contact_click', meta: { channel: 'directions' } })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#087BEE] font-bold transition-colors border border-blue-200 active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" /> Directions
              </a>
            )}
          </div>
        </div>

        {/* ACTIVE OFFERS BANNER */}
        {offers.length > 0 && (
          <div className="mx-6 mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1 text-[11px]">
                <Tag className="w-3.5 h-3.5" /> Special Offer
              </span>
              <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-extrabold">
                {offers[0].discount_tag || 'PROMO'}
              </span>
            </div>
            <h4 className="text-sm font-extrabold leading-tight">{offers[0].title}</h4>
            {offers[0].description && (
              <p className="text-xs text-white/95 mt-1 line-clamp-2">{offers[0].description}</p>
            )}
            {offers[0].coupon_code && (
              <div className="mt-2.5 flex items-center justify-between bg-black/25 rounded-xl px-3 py-1.5 backdrop-blur-xs">
                <span className="font-mono text-xs font-bold tracking-wider">
                  Code: {offers[0].coupon_code}
                </span>
                <button
                  onClick={() => handleCopyCoupon(offers[0].coupon_code!)}
                  className="text-xs font-bold flex items-center gap-1 text-white hover:text-amber-200"
                >
                  {copiedCoupon === offers[0].coupon_code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* PRIMARY ACTION CARDS */}
        <div className="px-6 space-y-3 flex-1">
          {/* 1. Digital Menu Button */}
          <Link
            to={`/b/${business.slug}/menu`}
            onClick={() =>
              trackEvent({ business_id: business.id, event_type: 'menu_view' })
            }
            className="group block p-4 rounded-2xl bg-gradient-to-r from-[#071321] via-[#0b2447] to-[#071321] text-white shadow-xl shadow-navy-950/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border border-blue-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#087BEE] to-[#13C8F4] flex items-center justify-center shadow-md">
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                    Explore Digital Menu
                  </h3>
                  <p className="text-xs text-slate-300">
                    Live prices, food photos & order cart
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. Rate on Google Button */}
          {business.is_google_review_enabled && (
            <button
              onClick={handleGoogleReviewClick}
              className="w-full group p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all duration-200 text-left active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#087BEE] transition-colors flex items-center gap-1.5">
                      Rate us on Google
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </h3>
                    <p className="text-xs text-slate-500">
                      Share your experience on our official Google Maps page
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}

          {/* 3. Honest Feedback */}
          <button
            onClick={() => setFeedbackModalOpen(true)}
            className="w-full group p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 shadow-xs hover:shadow-md transition-all duration-200 text-left active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <MessageSquareHeart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    Give Honest Feedback
                  </h3>
                  <p className="text-xs text-slate-500">
                    Send private suggestions directly to the management
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 4. Guest Wi-Fi */}
          {wifi?.is_enabled && (
            <button
              onClick={handleOpenWifi}
              className="w-full group p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all duration-200 text-left active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-[#13C8F4]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      Connect to Guest Wi-Fi
                    </h3>
                    <p className="text-xs text-slate-500">
                      Scan QR code or view credentials to auto-connect
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}

          {/* Location & Opening Hours Card */}
          <div
            onClick={() => setHoursModalOpen(true)}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 space-y-2.5 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#087BEE] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-900">Address:</span>{' '}
                {business.address || 'Silicon Boulevard'}, {business.city || 'Bengaluru'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-bold text-slate-800">Hours Today: 08:00 AM – 10:00 PM</span>
              </div>
              <span className="text-[#087BEE] font-bold text-[11px] hover:underline flex items-center gap-0.5">
                Full Week <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Footer Brand Credit */}
        <div className="p-6 text-center border-t border-slate-100 mt-6 bg-slate-50/50">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-[#087BEE] transition-colors"
          >
            <span>Powered by</span>
            <span className="font-bold text-[#071321]">NEXORA TECHNOLOGIES</span>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded font-bold">
              Smart NFC
            </span>
          </Link>
          <p className="text-[10px] text-slate-400 mt-1">ONE TAP. SMARTER BUSINESS.</p>
        </div>

        {/* ============================================================== */}
        {/* FLOATING QUICK BAR FOR MOBILE                                  */}
        {/* ============================================================== */}
        <div className="fixed bottom-3 inset-x-4 max-w-md mx-auto z-40 sm:hidden">
          <div className="bg-[#071321]/95 backdrop-blur-md text-white rounded-2xl p-2 shadow-2xl border border-slate-800 flex items-center justify-around text-xs">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex flex-col items-center gap-0.5 p-1.5 hover:text-cyan-300"
              >
                <Phone className="w-4 h-4" />
                <span className="text-[10px] font-bold">Call</span>
              </a>
            )}
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-0.5 p-1.5 hover:text-emerald-400 text-emerald-400"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold">WhatsApp</span>
              </a>
            )}
            {business.google_maps_url && (
              <a
                href={business.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-0.5 p-1.5 hover:text-cyan-300"
              >
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold">Map</span>
              </a>
            )}
            <Link
              to={`/b/${business.slug}/menu`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-extrabold text-[11px] shadow-sm ml-1"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" /> Menu
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MODAL: WEEKLY SCHEDULE                                         */}
        {/* ============================================================== */}
        {hoursModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100">
              <button
                onClick={() => setHoursModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#087BEE] flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#071321]">Weekly Operating Hours</h3>
                <p className="text-xs text-slate-500">Service times for {business.name}</p>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {(
                  [
                    ['Monday', '08:00 AM – 10:00 PM'],
                    ['Tuesday', '08:00 AM – 10:00 PM'],
                    ['Wednesday', '08:00 AM – 10:00 PM'],
                    ['Thursday', '08:00 AM – 10:00 PM'],
                    ['Friday', '08:00 AM – 11:00 PM'],
                    ['Saturday', '08:00 AM – 11:00 PM'],
                    ['Sunday', '09:00 AM – 09:00 PM']
                  ] as const
                ).map(([day, hours], i) => (
                  <div key={day} className="py-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{day}</span>
                    <span className="font-mono text-slate-600">{hours}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setHoursModalOpen(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#071321] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Schedule
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: GUEST WI-FI CONNECT                                     */}
        {/* ============================================================== */}
        {wifiModalOpen && wifi && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setWifiModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-[#087BEE] flex items-center justify-center mx-auto">
                  <Wifi className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#071321]">Connect to Guest Wi-Fi</h3>
                <p className="text-xs text-slate-500">
                  Point your phone camera at the QR code below to connect automatically.
                </p>
              </div>

              {/* QR Code Container */}
              <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
                <div className="bg-white p-3 rounded-xl shadow-xs">
                  <QRCodeSVG
                    value={wifiString}
                    size={180}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <span className="text-[11px] text-slate-500 font-semibold mt-2">
                  Works natively on iOS & Android camera
                </span>
              </div>

              {/* Manual Credentials */}
              <div className="mt-4 space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Network (SSID):</span>
                  <span className="font-bold text-slate-800">{wifi.ssid}</span>
                </div>
                {wifi.password && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/80">
                    <span className="text-slate-500 font-medium">Password:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-800">{wifi.password}</span>
                      <button
                        onClick={handleCopyWifiPassword}
                        className="text-[#087BEE] hover:text-blue-700 font-semibold flex items-center gap-1 ml-1"
                      >
                        {copiedWifi ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setWifiModalOpen(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#071321] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: HONEST CUSTOMER FEEDBACK WITH EMOJI RATING             */}
        {/* ============================================================== */}
        {feedbackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <button
                onClick={resetFeedbackForm}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              {fbSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Thank You for Your Voice!</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your feedback has been privately delivered to the leadership of{' '}
                    <strong>{business.name}</strong>.
                  </p>
                  <button
                    onClick={resetFeedbackForm}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#087BEE] text-white text-xs font-bold shadow hover:bg-blue-600 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                      <MessageSquareHeart className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#071321]">Honest Customer Feedback</h3>
                    <p className="text-xs text-slate-500">
                      Your response goes directly to the business owner to improve quality.
                    </p>
                  </div>

                  {/* Rating 1 to 5 Stars with Emotion */}
                  <div className="text-center">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      How was your overall experience?
                    </label>
                    <div className="flex justify-center gap-2 mb-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setRating(star)
                            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                              navigator.vibrate(20)
                            }
                          }}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200 fill-slate-100'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className={`text-xs font-black ${ratingEmotionMap[rating as keyof typeof ratingEmotionMap].color}`}>
                      {ratingEmotionMap[rating as keyof typeof ratingEmotionMap].text}
                    </p>
                  </div>

                  {/* Feedback Topic Chips */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Feedback Topic
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          ['food', '🍲 Food'],
                          ['service', '👨‍🍳 Service'],
                          ['cleanliness', '🧼 Hygiene'],
                          ['pricing', '🏷️ Value'],
                          ['ambience', '🎵 Ambience'],
                          ['other', '💡 Other']
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFbCategory(key)}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                            fbCategory === key
                              ? 'bg-[#087BEE] text-white border-[#087BEE] shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Comments & Suggestions *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={fbMessage}
                      onChange={(e) => setFbMessage(e.target.value)}
                      placeholder="Tell us what you loved or how we can improve..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] resize-none"
                    ></textarea>
                  </div>

                  {/* Name & Email (Optional) */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Your Name (optional)
                      </label>
                      <input
                        type="text"
                        value={fbName}
                        onChange={(e) => setFbName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={fbEmail}
                        onChange={(e) => setFbEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                      />
                    </div>
                  </div>

                  {fbError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{fbError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={fbSubmitting || !fbMessage.trim()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {fbSubmitting ? (
                      'Submitting...'
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Send Confidential Feedback
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
