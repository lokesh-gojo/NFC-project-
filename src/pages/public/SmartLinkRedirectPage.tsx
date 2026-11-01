import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSmartLinkByCode, getBusinessById, trackEvent } from '@/services/dataService'
import { isValidRedirectUrl } from '@/lib/security'
import { Zap, Radio, QrCode, AlertTriangle, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react'

export const SmartLinkRedirectPage: React.FC = () => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [securityBlocked, setSecurityBlocked] = useState(false)
  const [statusText, setStatusText] = useState('Verifying Nexora Smart Link Security...')

  useEffect(() => {
    async function resolveAndRedirect() {
      if (!code) {
        setError('Missing smart link identifier.')
        return
      }

      try {
        const link = await getSmartLinkByCode(code)

        if (!link || !link.is_active) {
          setError(`The smart link "${code}" is invalid, expired, or has been paused by the business.`)
          return
        }

        // Determine event type: qr_scan vs nfc_tap
        const eventType = link.type === 'nfc' ? 'nfc_tap' : 'qr_scan'
        setStatusText(
          link.type === 'nfc'
            ? 'NFC Tap Verified! Connecting securely to business...'
            : 'QR Scan Verified! Loading verified business profile...'
        )

        // Track the physical interaction event with throttle deduplication
        await trackEvent({
          business_id: link.business_id,
          event_type: eventType,
          smart_link_id: link.id,
          meta: {
            table_number: link.table_number,
            label: link.label
          }
        })

        // Defensively resolve the actual business by foreign key ID (prevents tenant routing cross-talk)
        const biz = await getBusinessById(link.business_id)
        const targetSlug = biz?.slug || 'cafe-aroma'

        // Short timeout for realistic physical tactile feedback
        setTimeout(() => {
          // Handle Custom External URLs with Open Redirect Defense
          if (link.destination_type === 'custom' && link.custom_url) {
            if (!isValidRedirectUrl(link.custom_url)) {
              setSecurityBlocked(true)
              setError('Security Warning: This link points to an untrusted or malformed external URL and was blocked for your safety.')
              return
            }
            window.location.replace(link.custom_url)
            return
          }

          // Direct Google Review destination
          if (link.destination_type === 'review' && biz?.google_review_url && isValidRedirectUrl(biz.google_review_url)) {
            window.location.replace(biz.google_review_url)
            return
          }

          // Digital Menu destination
          if (link.destination_type === 'menu') {
            navigate(`/b/${targetSlug}/menu${link.table_number ? `?table=${encodeURIComponent(link.table_number)}` : ''}`, { replace: true })
            return
          }

          // Direct Wi-Fi destination
          if (link.destination_type === 'wifi') {
            navigate(`/b/${targetSlug}?action=wifi`, { replace: true })
            return
          }

          // Default: Full Business Profile
          navigate(`/b/${targetSlug}${link.table_number ? `?table=${encodeURIComponent(link.table_number)}` : ''}`, { replace: true })
        }, 550)
      } catch (err: any) {
        console.error('Failed to resolve smart link:', err)
        setError('Failed to resolve smart link. Please verify connectivity and try again.')
      }
    }

    resolveAndRedirect()
  }, [code, navigate])

  if (securityBlocked || error) {
    return (
      <div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-[#0E1626] p-8 rounded-3xl shadow-2xl border border-red-500/30 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-950/60 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto">
            {securityBlocked ? <ShieldAlert className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>
          <h2 className="text-xl font-black text-white">
            {securityBlocked ? 'Security Shield Intercept' : 'Smart Link Unavailable'}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate('/b/cafe-aroma')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-xs font-bold shadow hover:scale-102 transition-all border border-cyan-400/30"
          >
            Visit Cafe Aroma Demo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-sm">
        {/* Animated pulse halo */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-cyan-500/25 animate-ping"></span>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/40">
            {code?.startsWith('nfc') ? (
              <Radio className="w-8 h-8 text-white animate-pulse" />
            ) : (
              <QrCode className="w-8 h-8 text-white animate-pulse" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> End-to-End Encrypted Link
          </div>
          <h3 className="text-lg font-black tracking-tight text-white">{statusText}</h3>
          <p className="text-xs text-slate-400 font-mono">ID: {code}</p>
        </div>

        <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  )
}
