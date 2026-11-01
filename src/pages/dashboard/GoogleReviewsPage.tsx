import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { updateBusiness } from '@/services/dataService'
import { isValidRedirectUrl } from '@/lib/security'
import {
  Star,
  ExternalLink,
  Save,
  CheckCircle2,
  Info,
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

export const GoogleReviewsPage: React.FC = () => {
  const { currentBusiness, refreshBusiness } = useAuth()
  const [reviewUrl, setReviewUrl] = useState(
    currentBusiness?.google_review_url || 'https://maps.app.goo.gl/cafe-aroma-demo'
  )
  const [isEnabled, setIsEnabled] = useState(currentBusiness?.is_google_review_enabled ?? true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBusiness) return
    setSaving(true)
    try {
      await updateBusiness(currentBusiness.id, {
        google_review_url: reviewUrl,
        is_google_review_enabled: isEnabled
      })
      await refreshBusiness()
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2500)
    } catch (err) {
      console.error('Error updating review settings:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Google Review Integration
        </h2>
        <p className="text-xs text-slate-500">
          Direct your satisfied dining and retail customers straight to your official Google Maps listing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Configuration Card: 2 columns */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            {/* Toggle Enable */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 text-sm block">
                  Enable Google Reviews Button
                </span>
                <span className="text-slate-500 text-xs">
                  Display the "Rate us on Google" button on customer-facing profiles.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087BEE]"></div>
              </label>
            </div>

            {/* Google Review URL Input */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 text-xs">
                Official Google Review Link *
              </label>
              <input
                type="url"
                required
                value={reviewUrl}
                onChange={(e) => setReviewUrl(e.target.value)}
                placeholder="https://g.page/r/.../review or https://maps.app.goo.gl/..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] font-mono text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Every customer who taps your NFC review stand or scans the review QR code will be routed directly to this address.
              </p>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-bold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Test Link in New Tab
              </a>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-bold shadow hover:shadow-md disabled:opacity-50 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Configuration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Info Card: 1 column */}
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl text-xs space-y-2 text-amber-900">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Anti-Gating Compliance</span>
            </div>
            <p className="leading-relaxed text-amber-800/90">
              Nexora strictly follows Google's <em>Maps User Contributed Content Policy</em>. We never filter customers or selectively direct positive reviews while suppressing negative ones.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl text-xs space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#087BEE]" /> Review Conversion Rate
            </h4>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-2xl font-black text-[#071321]">48.2%</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                of NFC counter taps result in a verified Google review navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

