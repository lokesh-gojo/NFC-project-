import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Logo } from '@/components/common/Logo'
import { DemoBanner } from '@/components/common/DemoBanner'
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  Radio,
  Star,
  MessageSquareHeart,
  Wifi,
  Tag,
  BarChart3,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Store,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, currentBusiness, logout, isAdmin } = useAuth()

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Business Profile', path: '/dashboard/profile', icon: Store },
    { label: 'Digital Menu', path: '/dashboard/menu', icon: UtensilsCrossed },
    { label: 'QR & NFC Engine', path: '/dashboard/qr-nfc', icon: QrCode },
    { label: 'Google Reviews', path: '/dashboard/reviews', icon: Star },
    { label: 'Customer Feedback', path: '/dashboard/feedback', icon: MessageSquareHeart },
    { label: 'Guest Wi-Fi', path: '/dashboard/wifi', icon: Wifi },
    { label: 'Offers & Deals', path: '/dashboard/offers', icon: Tag },
    { label: 'Smart Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Team Access', path: '/dashboard/team', icon: Users },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings }
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isCurrent = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      <DemoBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#071321] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Logo header */}
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
            <Link to="/dashboard">
              <Logo variant="light" size="sm" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Business Card */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700 border border-slate-600 flex-shrink-0">
                <img
                  src={
                    currentBusiness?.logo_url ||
                    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={currentBusiness?.name || 'Business'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">
                  {currentBusiness?.name || 'Cafe Aroma'}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-cyan-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="capitalize">{currentBusiness?.category || 'Cafe'}</span>
                  <span className="text-slate-500">•</span>
                  <span className="uppercase text-purple-400 font-semibold">{currentBusiness?.subscription_plan || 'Pro'}</span>
                </div>
              </div>
            </div>

            {/* Quick Live Link */}
            <Link
              to={`/b/${currentBusiness?.slug || 'cafe-aroma'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-[#13C8F4] text-xs font-semibold transition-colors border border-blue-500/20"
            >
              <span className="truncate">nexora.in/b/{currentBusiness?.slug || 'cafe-aroma'}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1 flex-shrink-0" />
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = isCurrent(item.path)
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-[#087BEE] text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 text-white/70" />}
                </Link>
              )
            })}

            {isAdmin && (
              <div className="pt-3 mt-3 border-t border-slate-800">
                <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Admin System
                </span>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-3.5 py-2.5 mt-1 rounded-xl text-sm font-semibold text-purple-300 hover:bg-purple-900/30 transition-all border border-purple-500/20"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Super Admin Console</span>
                </Link>
              </div>
            )}
          </nav>

          {/* User profile footer */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.full_name || 'User'}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user?.full_name || 'Merchant Owner'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email || 'demo@nexora.app'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Dashboard Header Bar */}
          <header className="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#071321] tracking-tight">
                  {currentBusiness?.name || 'Cafe Aroma'}
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Smart Business Engagement Dashboard
                </p>
              </div>
            </div>

            {/* Topbar Right Actions */}
            <div className="flex items-center gap-3">
              {/* Onboarding Guide Pill if not marked complete */}
              {!currentBusiness?.onboarding_completed && (
                <Link
                  to="/dashboard/onboarding"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Complete Setup (6 Steps)
                </Link>
              )}

              {/* View Public Business URL button */}
              <Link
                to={`/b/${currentBusiness?.slug || 'cafe-aroma'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-300/80 shadow-xs"
              >
                <Store className="w-3.5 h-3.5 text-[#087BEE]" />
                <span className="hidden sm:inline">Preview Customer Page</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </Link>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

