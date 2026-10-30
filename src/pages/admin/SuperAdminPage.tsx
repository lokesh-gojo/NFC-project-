import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getAllBusinesses, updateBusiness } from '@/services/dataService'
import { Business } from '@/types'
import { Logo } from '@/components/common/Logo'
import {
  ShieldCheck,
  Building2,
  Users,
  Activity,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react'

export const SuperAdminPage: React.FC = () => {
  const { user, isAdmin, loginAsDemo } = useAuth()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all')

  useEffect(() => {
    loadBusinesses()
  }, [])

  async function loadBusinesses() {
    setLoading(true)
    try {
      const data = await getAllBusinesses()
      setBusinesses(data)
    } catch (err) {
      console.error('Error loading businesses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (biz: Business, newStatus: Business['status']) => {
    await updateBusiness(biz.id, { status: newStatus })
    await loadBusinesses()
  }

  const filtered = businesses.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return b.name.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    }
    return true
  })

  const totalBusinesses = businesses.length
  const activeCount = businesses.filter((b) => b.status === 'active').length
  const pendingCount = businesses.filter((b) => b.status === 'pending').length
  const suspendedCount = businesses.filter((b) => b.status === 'suspended').length

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Restricted Admin Access</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            The Super Admin console requires elevated platform privileges. You are currently logged in as a regular merchant.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => loginAsDemo('super_admin')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Switch to Super Admin Demo Persona
            </button>
            <Link
              to="/dashboard"
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Back to Merchant Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-slate-900 pb-16">
      {/* Admin Top Navigation */}
      <header className="bg-[#071321] text-white border-b border-slate-800 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Logo variant="light" size="sm" />
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Super Admin Control
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-300" /> Merchant View
            </Link>
            <span className="text-slate-400 font-semibold">{user?.full_name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-in fade-in duration-300">
        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071321] tracking-tight">
            Platform Multi-Tenant Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global monitoring of registered venues, account approval queues, and NFC engagement metrics.
          </p>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="p-2.5 rounded-xl bg-blue-50 text-[#087BEE]">
                <Building2 className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tenants</span>
            </div>
            <h3 className="text-2xl font-black text-[#071321]">{totalBusinesses}</h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Total Businesses</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-emerald-600 font-bold">Active</span>
            </div>
            <h3 className="text-2xl font-black text-[#071321]">{activeCount}</h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Approved & Live</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <AlertOctagon className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-amber-600 font-bold">Queue</span>
            </div>
            <h3 className="text-2xl font-black text-[#071321]">{pendingCount}</h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">Pending Review</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <Activity className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold text-purple-600 font-bold">Live Interactions</span>
            </div>
            <h3 className="text-2xl font-black text-[#071321]">1,480+</h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">NFC Taps & QR Scans</p>
          </div>
        </div>

        {/* Filter and Directory Controls */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {(
              [
                ['all', 'All Businesses'],
                ['active', 'Active'],
                ['pending', 'Pending Approval'],
                ['suspended', 'Suspended']
              ] as const
            ).map(([status, label]) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex-shrink-0 ${
                  statusFilter === status
                    ? 'bg-[#071321] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, slug or category..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
            />
          </div>
        </div>

        {/* Businesses Directory Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4 pl-6">Business Details</th>
                  <th className="p-4">Industry Category</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Public URL</th>
                  <th className="p-4 pr-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((biz) => (
                  <tr key={biz.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            biz.logo_url ||
                            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=100&q=80'
                          }
                          alt={biz.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{biz.name}</p>
                          <p className="text-[11px] text-slate-400">{biz.city || 'India'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 capitalize">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {biz.category}
                      </span>
                    </td>

                    <td className="p-4 uppercase font-bold text-purple-700">
                      {biz.subscription_plan}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          biz.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : biz.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            biz.status === 'active'
                              ? 'bg-emerald-600'
                              : biz.status === 'pending'
                              ? 'bg-amber-600'
                              : 'bg-rose-600'
                          }`}
                        />
                        {biz.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/b/${biz.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 font-mono text-[#087BEE] hover:underline"
                      >
                        /b/{biz.slug}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>

                    <td className="p-4 pr-6 text-right space-x-2">
                      {biz.status !== 'active' && (
                        <button
                          onClick={() => handleToggleStatus(biz, 'active')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {biz.status === 'active' && (
                        <button
                          onClick={() => handleToggleStatus(biz, 'suspended')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

