import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { Sparkles, Shield, Store, Globe, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const DemoBanner: React.FC = () => {
  const { isDemoMode, user, loginAsDemo, currentBusiness } = useAuth()

  if (!isDemoMode) return null

  return (
    <div className="bg-[#050811] text-white text-xs border-b border-cyan-500/25 py-2 px-4 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="font-bold text-cyan-400 tracking-wide">Live Demo Sandbox:</span>
          <span className="text-slate-300 hidden sm:inline">
            Active for <strong className="text-white">Cafe Aroma</strong> with simulated NFC tags, dynamic QR, and real-time analytics.
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-[11px] hidden md:inline">Quick switch:</span>
          <button
            onClick={() => loginAsDemo('business_owner')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              user?.role === 'business_owner'
                ? 'bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-xs'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Store className="w-3 h-3 text-cyan-300" /> Owner View
          </button>

          <button
            onClick={() => loginAsDemo('super_admin')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
              user?.role === 'super_admin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            <Shield className="w-3 h-3 text-purple-300" /> Super Admin
          </button>

          <Link
            to={`/b/${currentBusiness?.slug || 'cafe-aroma'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 flex items-center gap-1 transition-colors"
          >
            <Globe className="w-3 h-3 text-cyan-400" /> Customer Hub <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
