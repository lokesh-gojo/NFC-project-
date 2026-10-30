import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getOffers, saveOffer, deleteOffer } from '@/services/dataService'
import { Offer } from '@/types'
import {
  Tag,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  X,
  CheckCircle2,
  Percent,
  Clock
} from 'lucide-react'

export const OffersManagementPage: React.FC = () => {
  const { currentBusiness } = useAuth()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [discountTag, setDiscountTag] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split('T')[0])
  const [validUntil, setValidUntil] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    loadOffers()
  }, [currentBusiness])

  async function loadOffers() {
    if (!currentBusiness) return
    setLoading(true)
    try {
      const data = await getOffers(currentBusiness.id)
      setOffers(data)
    } catch (err) {
      console.error('Error loading offers:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (offer?: Offer) => {
    if (offer) {
      setEditingOffer(offer)
      setTitle(offer.title)
      setDesc(offer.description || '')
      setDiscountTag(offer.discount_tag || '')
      setCouponCode(offer.coupon_code || '')
      setValidFrom(offer.valid_from)
      setValidUntil(offer.valid_until || '')
      setIsActive(offer.is_active)
    } else {
      setEditingOffer(null)
      setTitle('')
      setDesc('')
      setDiscountTag('20% OFF')
      setCouponCode('SPECIAL20')
      setValidFrom(new Date().toISOString().split('T')[0])
      setValidUntil('')
      setIsActive(true)
    }
    setModalOpen(true)
  }

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBusiness || !title.trim()) return

    await saveOffer({
      id: editingOffer?.id,
      business_id: currentBusiness.id,
      title,
      description: desc,
      discount_tag: discountTag,
      coupon_code: couponCode,
      valid_from: validFrom,
      valid_until: validUntil || undefined,
      is_active: isActive
    })

    setModalOpen(false)
    await loadOffers()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this promotion?')) {
      await deleteOffer(id)
      await loadOffers()
    }
  }

  const handleToggleActive = async (offer: Offer) => {
    if (!currentBusiness) return
    await saveOffer({
      ...offer,
      is_active: !offer.is_active
    })
    await loadOffers()
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-500" /> Promotional Offers & Deals
          </h2>
          <p className="text-xs text-slate-500">
            Publish special happy hour discounts and seasonal banners to your public NFC landing page.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => {
          const isExpired = offer.valid_until && new Date(offer.valid_until) < new Date()
          return (
            <div
              key={offer.id}
              className={`p-5 rounded-2xl border transition-all bg-white ${
                !offer.is_active || isExpired
                  ? 'opacity-60 border-slate-200'
                  : 'border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
                  {offer.discount_tag || 'OFFER'}
                </span>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => handleToggleActive(offer)}
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      offer.is_active && !isExpired
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isExpired ? 'Expired' : offer.is_active ? 'Active on Page' : 'Disabled'}
                  </button>
                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h4 className="text-base font-bold text-slate-900 leading-snug">{offer.title}</h4>
              {offer.description && (
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{offer.description}</p>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {offer.coupon_code && (
                  <span className="font-mono bg-slate-100 px-2 py-1 rounded font-bold text-slate-700">
                    CODE: {offer.coupon_code}
                  </span>
                )}
                <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3" />
                  {offer.valid_until ? `Until ${offer.valid_until}` : 'Ongoing'}
                </span>
              </div>
            </div>
          )
        })}

        {offers.length === 0 && (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
            No active promotional offers created. Click "Create New Offer" to boost sales.
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: CREATE / EDIT OFFER                                     */}
      {/* ============================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#071321] mb-3">
              {editingOffer ? 'Edit Promotion' : 'Create Promotion'}
            </h3>

            <form onSubmit={handleSaveOffer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Happy Hour: Buy 1 Get 1 on Artisan Lattes"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Tag</label>
                  <input
                    type="text"
                    value={discountTag}
                    onChange={(e) => setDiscountTag(e.target.value)}
                    placeholder="BOGO FREE / 20% OFF"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. COFFEE20"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Terms, valid hours or applicable products..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valid From</label>
                  <input
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expires On</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-[#087BEE] focus:ring-[#087BEE] w-4 h-4"
                  />
                  <span className="font-semibold text-slate-700">Display as Active on Landing Page</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#087BEE] text-white font-bold shadow hover:bg-blue-600"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

