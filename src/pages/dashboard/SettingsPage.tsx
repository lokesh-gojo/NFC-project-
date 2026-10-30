import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { updateBusiness } from '@/services/dataService'
import {
  Settings,
  Link2,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CreditCard
} from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const { currentBusiness, refreshBusiness } = useAuth()
  const [slug, setSlug] = useState(currentBusiness?.slug || 'cafe-aroma')
  const [currency, setCurrency] = useState(currentBusiness?.currency || 'INR')
  const [currencySymbol, setCurrencySymbol] = useState(currentBusiness?.currency_symbol || '₹')
  const [isPublished, setIsPublished] = useState(currentBusiness?.is_published ?? true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBusiness || !slug.trim()) return

    const sanitizedSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    setSaving(true)
    try {
      await updateBusiness(currentBusiness.id, {
        slug: sanitizedSlug,
        currency,
        currency_symbol: currencySymbol,
        is_published: isPublished
      })
      await refreshBusiness()
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (err) {
      console.error('Error saving settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleResetDemoData = () => {
    if (confirm('Reset demo state to initial Cafe Aroma seed? All mock edits will be restored.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#087BEE]" /> Platform & Domain Settings
        </h2>
        <p className="text-xs text-slate-500">
          Configure unique URL slugs, currencies and platform subscriptions.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* URL Slug Configuration */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#071321] border-b pb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#087BEE]" /> Public Business URL
          </h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Custom Business Slug *
            </label>
            <div className="flex items-center">
              <span className="p-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-500 font-mono text-xs">
                nexora.in/b/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="cafe-aroma"
                className="w-full p-3 rounded-r-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              This slug is embedded into all physical QR stands and programmed NFC tags.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Currency Code</label>
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value)
                  setCurrencySymbol(e.target.value === 'INR' ? '₹' : e.target.value === 'USD' ? '$' : '€')
                }}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] bg-white"
              >
                <option value="INR">INR (Indian Rupee)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Currency Symbol</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>
          </div>
        </div>

        {/* Visibility & Subscription */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#071321] border-b pb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-600" /> Subscription & Publication
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-800 text-sm block">
                Profile Public Visibility
              </span>
              <span className="text-slate-500 text-xs">
                Allow customers to access your business landing page via QR, NFC, or URL.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087BEE]"></div>
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/60 flex items-center justify-between">
            <div>
              <span className="font-bold text-purple-900 block text-xs">Current SaaS Tier</span>
              <span className="text-xs text-purple-700 font-semibold uppercase">
                {currentBusiness?.subscription_plan || 'Growth'} Plan (Active)
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-600 text-white shadow-xs">
              Unlimited Scans & Taps
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-bold shadow hover:shadow-md transition-all"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Settings Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Settings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-rose-50/40 p-6 rounded-3xl border border-rose-200 space-y-3">
          <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Demo State Controls
          </h4>
          <p className="text-xs text-slate-600">
            Reset all local browser modifications to default Cafe Aroma seed data.
          </p>
          <button
            type="button"
            onClick={handleResetDemoData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Local Demo State
          </button>
        </div>
      </form>
    </div>
  )
}

