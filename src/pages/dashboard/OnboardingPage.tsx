import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { updateBusiness, saveWifiSettings } from '@/services/dataService'
import { Business, BusinessCategory, WifiSetting } from '@/types'
import confetti from 'canvas-confetti'
import {
  CheckCircle2,
  Store,
  Image as ImageIcon,
  Phone,
  Star,
  Wifi,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ShieldCheck
} from 'lucide-react'

export const OnboardingPage: React.FC = () => {
  const { currentBusiness, refreshBusiness } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Form states
  const [name, setName] = useState(currentBusiness?.name || 'Cafe Aroma')
  const [tagline, setTagline] = useState(currentBusiness?.tagline || 'Artisanal Coffee & Freshly Baked Delights')
  const [category, setCategory] = useState<BusinessCategory>(currentBusiness?.category || 'cafe')
  const [currency, setCurrency] = useState(currentBusiness?.currency || 'INR')
  const [description, setDescription] = useState(currentBusiness?.description || '')

  const [logoUrl, setLogoUrl] = useState(
    currentBusiness?.logo_url ||
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80'
  )
  const [coverUrl, setCoverUrl] = useState(
    currentBusiness?.cover_url ||
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80'
  )

  const [phone, setPhone] = useState(currentBusiness?.phone || '+91 98765 43210')
  const [whatsapp, setWhatsapp] = useState(currentBusiness?.whatsapp || '+919876543210')
  const [address, setAddress] = useState(currentBusiness?.address || '42, Silicon Boulevard')
  const [city, setCity] = useState(currentBusiness?.city || 'Bengaluru, Karnataka')
  const [googleMapsUrl, setGoogleMapsUrl] = useState(
    currentBusiness?.google_maps_url || 'https://maps.google.com/?q=Cafe+Aroma+Bengaluru'
  )

  const [googleReviewUrl, setGoogleReviewUrl] = useState(
    currentBusiness?.google_review_url || 'https://g.page/r/demo-cafe-aroma/review'
  )

  const [wifiSsid, setWifiSsid] = useState('CafeAroma_Guest_HighSpeed')
  const [wifiPassword, setWifiPassword] = useState('BrewFresh2025!')
  const [wifiEncryption, setWifiEncryption] = useState<WifiSetting['encryption']>('WPA')

  const steps = [
    { num: 1, title: 'Business Info', icon: Store },
    { num: 2, title: 'Branding & Photos', icon: ImageIcon },
    { num: 3, title: 'Contact & Map', icon: Phone },
    { num: 4, title: 'Google Reviews', icon: Star },
    { num: 5, title: 'Guest Wi-Fi', icon: Wifi },
    { num: 6, title: 'Launch Profile', icon: Sparkles }
  ]

  const handleNext = async () => {
    if (!currentBusiness) return
    setLoading(true)
    try {
      if (step === 1) {
        await updateBusiness(currentBusiness.id, {
          name,
          tagline,
          category,
          currency,
          description
        })
      } else if (step === 2) {
        await updateBusiness(currentBusiness.id, {
          logo_url: logoUrl,
          cover_url: coverUrl
        })
      } else if (step === 3) {
        await updateBusiness(currentBusiness.id, {
          phone,
          whatsapp,
          address,
          city,
          google_maps_url: googleMapsUrl
        })
      } else if (step === 4) {
        await updateBusiness(currentBusiness.id, {
          google_review_url: googleReviewUrl,
          is_google_review_enabled: true
        })
      } else if (step === 5) {
        await saveWifiSettings({
          business_id: currentBusiness.id,
          ssid: wifiSsid,
          password: wifiPassword,
          encryption: wifiEncryption,
          is_enabled: true
        })
      } else if (step === 6) {
        await updateBusiness(currentBusiness.id, {
          onboarding_completed: true,
          is_published: true
        })
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        await refreshBusiness()
        setTimeout(() => {
          navigate('/dashboard')
        }, 1200)
        return
      }

      await refreshBusiness()
      setStep((prev) => Math.min(prev + 1, 6))
    } catch (err) {
      console.error('Error saving onboarding step:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8 animate-in fade-in duration-300">
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#087BEE] border border-blue-200 uppercase tracking-wider">
          Quick Setup Wizard
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#071321] tracking-tight">
          Configure Your Smart Business Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Complete these 6 simple steps to start receiving NFC taps, QR scans and customer feedback.
        </p>
      </div>

      {/* Progress Steps Indicators */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-6 gap-2">
          {steps.map((s) => {
            const Icon = s.icon
            const isCompleted = step > s.num
            const isCurrent = step === s.num
            return (
              <div
                key={s.num}
                onClick={() => isCompleted && setStep(s.num)}
                className={`flex flex-col items-center text-center p-2 rounded-2xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-50 text-[#087BEE] font-bold'
                    : isCompleted
                    ? 'text-emerald-600 hover:bg-slate-50'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 text-xs font-bold transition-transform ${
                    isCurrent
                      ? 'bg-[#087BEE] text-white shadow-md shadow-blue-500/30 scale-105'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="text-[10px] hidden sm:block truncate w-full">{s.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#071321] border-b pb-3">
              Step 1: Core Business Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Business Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Industry Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] bg-white capitalize"
                >
                  <option value="cafe">Café & Coffee Shop</option>
                  <option value="restaurant">Restaurant & Fine Dining</option>
                  <option value="hotel">Hotel & Hospitality</option>
                  <option value="retail">Retail Store & Boutique</option>
                  <option value="salon">Salon & Wellness Spa</option>
                  <option value="services">Professional Services</option>
                  <option value="other">Other Business</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Artisanal Coffee & Freshly Baked Delights"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Menu Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] bg-white"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1.5">Short Bio / About</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your atmosphere, cuisine or specialty offerings..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#071321] border-b pb-3">
              Step 2: Branding & Imagery
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Logo Preview & Input */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-700">Logo Image URL</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 mt-2">
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Cover Preview & Input */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-700">Cover Banner URL</label>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
                <div className="h-24 w-full rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 mt-2">
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#071321] border-b pb-3">
              Step 3: Location & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">City & State</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1.5">Google Maps Link</label>
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#071321] border-b pb-3">
              Step 4: Official Google Reviews Link
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              When customers tap the Google Review button on your NFC cards or QR stands, they will be directly taken to this URL on Google Maps. Nexora adheres to Google's anti-gating policies.
            </p>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1.5">Google Review URL *</label>
              <input
                type="text"
                value={googleReviewUrl}
                onChange={(e) => setGoogleReviewUrl(e.target.value)}
                placeholder="https://g.page/r/YOUR_ID/review or https://maps.app.goo.gl/..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-3">
              <Star className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Where do I find my link?</p>
                <p className="mt-0.5 text-slate-600">
                  Search your business on Google Maps → Click "Ask for reviews" → Copy the short review link.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-[#071321] border-b pb-3">
              Step 5: Guest Wi-Fi Network Setup
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Wi-Fi Network Name (SSID) *</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Wi-Fi Password</label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-slate-700 mb-1.5">Security Encryption</label>
              <select
                value={wifiEncryption}
                onChange={(e) => setWifiEncryption(e.target.value as WifiSetting['encryption'])}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] bg-white"
              >
                <option value="WPA">WPA/WPA2/WPA3 (Standard)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">Open / No Password</option>
              </select>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="text-center py-6 space-y-5 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#087BEE] to-[#13C8F4] flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#071321]">You're Ready to Launch!</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Your smart business profile is configured. You can now download print-ready QR table tents and program your NFC cards.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block text-xs text-slate-700">
              <span className="font-semibold text-slate-500 block mb-1">Your Live Public URL</span>
              <span className="font-mono font-bold text-[#087BEE] text-sm">
                nexora.in/b/{currentBusiness?.slug || 'cafe-aroma'}
              </span>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={handleNext}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? (
              'Saving...'
            ) : step === 6 ? (
              <>
                Launch Profile <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Next Step <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

