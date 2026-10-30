import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { updateBusiness } from '@/services/dataService'
import { BusinessCategory, OpeningHours, DayHours } from '@/types'
import {
  Store,
  Save,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Globe,
  Share2,
  MessageCircle
} from 'lucide-react'

export const ProfileSettingsPage: React.FC = () => {
  const { currentBusiness, refreshBusiness } = useAuth()

  const [name, setName] = useState(currentBusiness?.name || 'Cafe Aroma')
  const [tagline, setTagline] = useState(currentBusiness?.tagline || '')
  const [description, setDescription] = useState(currentBusiness?.description || '')
  const [category, setCategory] = useState<BusinessCategory>(currentBusiness?.category || 'cafe')
  const [logoUrl, setLogoUrl] = useState(currentBusiness?.logo_url || '')
  const [coverUrl, setCoverUrl] = useState(currentBusiness?.cover_url || '')

  const [phone, setPhone] = useState(currentBusiness?.phone || '')
  const [whatsapp, setWhatsapp] = useState(currentBusiness?.whatsapp || '')
  const [email, setEmail] = useState(currentBusiness?.email || '')
  const [website, setWebsite] = useState(currentBusiness?.website || '')
  const [address, setAddress] = useState(currentBusiness?.address || '')
  const [city, setCity] = useState(currentBusiness?.city || '')
  const [mapsUrl, setMapsUrl] = useState(currentBusiness?.google_maps_url || '')

  const [instagram, setInstagram] = useState(currentBusiness?.social_links?.instagram || '')
  const [facebook, setFacebook] = useState(currentBusiness?.social_links?.facebook || '')
  const [twitter, setTwitter] = useState(currentBusiness?.social_links?.twitter || '')

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBusiness) return
    setSaving(true)
    try {
      await updateBusiness(currentBusiness.id, {
        name,
        tagline,
        description,
        category,
        logo_url: logoUrl,
        cover_url: coverUrl,
        phone,
        whatsapp,
        email,
        website,
        address,
        city,
        google_maps_url: mapsUrl,
        social_links: {
          instagram,
          facebook,
          twitter
        }
      })
      await refreshBusiness()
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (err) {
      console.error('Error saving profile:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-[#087BEE]" /> Business Profile & Branding
          </h2>
          <p className="text-xs text-slate-500">
            Customize information displayed to customers when they tap your NFC cards or scan QR codes.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-[#071321] border-b pb-3">Identity & Photos</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Business Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] bg-white capitalize"
              >
                <option value="cafe">Café & Coffee Shop</option>
                <option value="restaurant">Restaurant & Fine Dining</option>
                <option value="hotel">Hotel & Hospitality</option>
                <option value="retail">Retail Store & Boutique</option>
                <option value="salon">Salon & Spa</option>
                <option value="services">Services</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

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
            <label className="block font-bold text-slate-700 mb-1.5">About / Bio</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Logo Image URL</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Cover Image URL</label>
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>
          </div>
        </div>

        {/* Contact & Map */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-[#071321] border-b pb-3">Contact & Location</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Google Maps Link</label>
            <input
              type="text"
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#071321] border-b pb-3">Social Media Profiles</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Twitter / X URL</label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Changes Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Business Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
