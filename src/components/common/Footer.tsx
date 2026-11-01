import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { ShieldCheck, Zap, Heart, CheckCircle2, Sparkles } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05070B] text-white pt-16 pb-12 border-t border-cyan-500/20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Nexora Technologies is an end-to-end Smart Business Engagement & Management Platform.
              Powering physical customer tap-to-engage experiences with intelligent NFC tags and dynamic QR codes.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> 99.98% Platform Uptime
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> ISO / Supabase RLS Secure
              </span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-cyan-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Platform Features
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/solutions" className="hover:text-cyan-300 transition-colors">Digital Interactive Menu</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-300 transition-colors">Smart NFC Acrylic Stands</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-300 transition-colors">Dynamic QR Tracking</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-300 transition-colors">Google Reviews Acceleration</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-300 transition-colors">Guest Wi-Fi Auto-Connect</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-300 transition-colors">Private Customer Feedback</Link></li>
            </ul>
          </div>

          {/* Target Industries */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-cyan-400 mb-4">
              Industry Verticals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/solutions?industry=restaurant" className="hover:text-cyan-300 transition-colors">Restaurants & Bistros</Link></li>
              <li><Link to="/solutions?industry=cafe" className="hover:text-cyan-300 transition-colors">Cafés & Bakeries</Link></li>
              <li><Link to="/solutions?industry=hotel" className="hover:text-cyan-300 transition-colors">Hotels & Hospitality</Link></li>
              <li><Link to="/solutions?industry=retail" className="hover:text-cyan-300 transition-colors">Retail Showrooms</Link></li>
              <li><Link to="/solutions?industry=salon" className="hover:text-cyan-300 transition-colors">Salons & Wellness Spas</Link></li>
            </ul>
          </div>

          {/* Quick Demo & Links */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-cyan-400 mb-4">
              Live Sandbox
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li>
                <Link to="/b/cafe-aroma" target="_blank" className="text-cyan-400 font-bold hover:underline flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Cafe Aroma Live Hub
                </Link>
              </li>
              <li><Link to="/dashboard" className="hover:text-cyan-300 transition-colors">Merchant Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-cyan-300 transition-colors">Super Admin Portal</Link></li>
              <li><Link to="/pricing" className="hover:text-cyan-300 transition-colors">Subscription Plans</Link></li>
              <li><Link to="/auth/login" className="hover:text-cyan-300 transition-colors">Merchant Sign In</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NEXORA TECHNOLOGIES INC. ONE TAP. SMARTER BUSINESS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern enterprise
            </span>
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">Security Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
