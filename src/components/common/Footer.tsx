import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { ShieldCheck, Zap, Heart, CheckCircle2 } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#071321] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Nexora Technologies is an end-to-end Smart Business Engagement & Management Platform.
              Powering physical customer tap-to-engage experiences with intelligent NFC tags and dynamic QR codes.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> 99.98% Platform Uptime
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> ISO/RLS Compliant
              </span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-slate-200 mb-4">Features</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/solutions" className="hover:text-cyan-400 transition-colors">Digital Interactive Menu</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-400 transition-colors">Smart NFC Acrylic Stands</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-400 transition-colors">Dynamic QR Tracking</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-400 transition-colors">Google Reviews Acceleration</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-400 transition-colors">Guest Wi-Fi Auto-Connect</Link></li>
              <li><Link to="/solutions" className="hover:text-cyan-400 transition-colors">Private Customer Feedback</Link></li>
            </ul>
          </div>

          {/* Target Industries */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-slate-200 mb-4">Industries</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/solutions?industry=restaurant" className="hover:text-cyan-400 transition-colors">Restaurants & Bistros</Link></li>
              <li><Link to="/solutions?industry=cafe" className="hover:text-cyan-400 transition-colors">Cafés & Bakeries</Link></li>
              <li><Link to="/solutions?industry=hotel" className="hover:text-cyan-400 transition-colors">Hotels & Hospitality</Link></li>
              <li><Link to="/solutions?industry=retail" className="hover:text-cyan-400 transition-colors">Retail Showrooms</Link></li>
              <li><Link to="/solutions?industry=salon" className="hover:text-cyan-400 transition-colors">Salons & Wellness Spas</Link></li>
            </ul>
          </div>

          {/* Quick Demo & Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-slate-200 mb-4">Live Sandbox</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/b/cafe-aroma" target="_blank" className="text-cyan-400 font-medium hover:underline flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Cafe Aroma Profile
                </Link>
              </li>
              <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Merchant Dashboard</Link></li>
              <li><Link to="/admin" className="hover:text-cyan-400 transition-colors">Super Admin Portal</Link></li>
              <li><Link to="/pricing" className="hover:text-cyan-400 transition-colors">Subscription Plans</Link></li>
              <li><Link to="/auth/login" className="hover:text-cyan-400 transition-colors">Merchant Sign In</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NEXORA TECHNOLOGIES INC. ONE TAP. SMARTER BUSINESS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for modern enterprise
            </span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Overview</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

