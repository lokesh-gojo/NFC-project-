import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { useAuth } from '@/context/AuthContext'
import { Menu, X, ArrowRight, LayoutDashboard, Sparkles, ExternalLink } from 'lucide-react'

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

  const navLinks = [
    { label: 'Solutions', path: '/solutions' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Live Demo', path: '/b/cafe-aroma', external: true }
  ]

  return (
    <nav className="sticky top-0 z-40 bg-[#090D16]/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-black/40 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Light variant for dark theme */}
          <Link to="/" className="flex items-center">
            <Logo size="md" variant="light" />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
              link.external ? (
                <Link
                  key={link.path}
                  to={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/70 hover:shadow-cyan-500/20 shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  {link.label}
                  <ExternalLink className="w-3 h-3 text-cyan-400/70" />
                </Link>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-all ${
                    location.pathname === link.path
                      ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] font-bold'
                      : 'text-slate-300 hover:text-cyan-300'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Auth Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'super_admin' ? '/admin' : '/dashboard'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-[1.02] transition-all border border-cyan-400/30"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-200" />
                {user?.role === 'super_admin' ? 'Super Admin' : 'Go to Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-xs font-bold text-slate-300 hover:text-cyan-300 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-black text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all border border-cyan-400/30"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyan-500/20 bg-[#090D16] px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                location.pathname === link.path
                  ? 'text-cyan-400 bg-cyan-950/30'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-bold text-xs shadow-md"
              >
                <LayoutDashboard className="w-4 h-4 text-white" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-700 text-slate-200 font-bold text-xs hover:border-cyan-500"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-black text-xs shadow-md shadow-cyan-500/20"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
