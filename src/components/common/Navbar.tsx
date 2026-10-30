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
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" />
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
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#087BEE] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#087BEE]" />
                  {link.label}
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </Link>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#087BEE]'
                      : 'text-slate-600 hover:text-[#087BEE]'
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#071321] to-[#0d2a4d] text-white font-medium text-sm shadow-md hover:shadow-lg hover:from-[#0a1b2e] hover:to-[#113763] transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-[#13C8F4]" />
                {user?.role === 'super_admin' ? 'Super Admin' : 'Go to Dashboard'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-sm font-semibold text-slate-700 hover:text-[#087BEE] px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:text-[#087BEE] hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#071321] text-white font-medium text-sm"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-semibold text-sm shadow-md"
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

