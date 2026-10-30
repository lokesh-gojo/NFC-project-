import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSmartLinkByCode, getBusinessBySlug, trackEvent } from '@/services/dataService'
import { Zap, Radio, QrCode, AlertCircle, ArrowRight } from 'lucide-react'

export const SmartLinkRedirectPage: React.FC = () => {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [statusText, setStatusText] = useState('Resolving Nexora Smart Link...')

  useEffect(() => {
    async function resolveAndRedirect() {
      if (!code) {
        setError('Missing smart link identifier.')
        return
      }

      try {
        const link = await getSmartLinkByCode(code)

        if (!link || !link.is_active) {
          setError(`The smart link "${code}" is invalid or has been deactivated by the business.`)
          return
        }

        // Determine event type: qr_scan vs nfc_tap
        const eventType = link.type === 'nfc' ? 'nfc_tap' : 'qr_scan'
        setStatusText(
          link.type === 'nfc'
            ? 'NFC Tap Verified! Connecting to business...'
            : 'QR Scan Verified! Loading profile...'
        )

        // Track the physical interaction event
        await trackEvent({
          business_id: link.business_id,
          event_type: eventType,
          smart_link_id: link.id,
          meta: {
            table_number: link.table_number,
            label: link.label
          }
        })

        // Find the business slug
        let targetSlug = 'cafe-aroma'
        const biz = await getBusinessBySlug('cafe-aroma')
        if (biz && biz.id === link.business_id) {
          targetSlug = biz.slug
        }

        // Delay slightly for smooth transition feel
        setTimeout(() => {
          if (link.destination_type === 'menu') {
            navigate(`/b/${targetSlug}/menu`, { replace: true })
          } else {
            navigate(`/b/${targetSlug}`, { replace: true })
          }
        }, 600)
      } catch (err: any) {
        console.error('Failed to resolve smart link:', err)
        setError('Failed to resolve link. Please try again.')
      }
    }

    resolveAndRedirect()
  }, [code, navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Smart Link Unavailable</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => navigate('/b/cafe-aroma')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087BEE] text-white text-xs font-bold shadow hover:bg-blue-600 transition-colors"
          >
            Visit Cafe Aroma Demo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#071321] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-sm">
        {/* Animated pulse halo */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping"></span>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#087BEE] to-[#13C8F4] flex items-center justify-center shadow-lg shadow-cyan-500/30">
            {code?.startsWith('nfc') ? (
              <Radio className="w-8 h-8 text-white animate-pulse" />
            ) : (
              <QrCode className="w-8 h-8 text-white animate-pulse" />
            )}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
            NEXORA SMART ROUTER
          </span>
          <h2 className="text-xl font-extrabold text-white mt-1 tracking-tight">
            {statusText}
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-mono">ID: {code}</p>
        </div>

        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-[#087BEE] to-[#13C8F4] w-2/3 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

