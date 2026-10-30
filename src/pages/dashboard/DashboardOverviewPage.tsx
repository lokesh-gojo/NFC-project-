import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getAnalyticsSummary, getFeedback, getSmartLinks } from '@/services/dataService'
import { CustomerFeedback, SmartLink } from '@/types'
import {
  Users,
  QrCode,
  Radio,
  UtensilsCrossed,
  Star,
  MessageSquareHeart,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Plus,
  Wifi,
  Sparkles
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

export const DashboardOverviewPage: React.FC = () => {
  const { currentBusiness } = useAuth()
  const [summary, setSummary] = useState<any>(null)
  const [recentFeedback, setRecentFeedback] = useState<CustomerFeedback[]>([])
  const [smartLinks, setSmartLinks] = useState<SmartLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOverview() {
      if (!currentBusiness) return
      setLoading(true)
      try {
        const [sumData, fbData, linksData] = await Promise.all([
          getAnalyticsSummary(currentBusiness.id),
          getFeedback(currentBusiness.id),
          getSmartLinks(currentBusiness.id)
        ])
        setSummary(sumData)
        setRecentFeedback(fbData.slice(0, 3))
        setSmartLinks(linksData.slice(0, 4))
      } catch (err) {
        console.error('Error loading dashboard overview:', err)
      } finally {
        setLoading(false)
      }
    }
    loadOverview()
  }, [currentBusiness])

  const kpis = [
    {
      label: 'Unique Visitors',
      value: summary?.uniqueVisitors ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: 'Individual customer devices'
    },
    {
      label: 'QR Scans',
      value: summary?.qrScans ?? 0,
      icon: QrCode,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      sub: 'From stands & table tents'
    },
    {
      label: 'NFC Taps',
      value: summary?.nfcTaps ?? 0,
      icon: Radio,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      sub: 'Physical card & sticker taps'
    },
    {
      label: 'Menu Views',
      value: summary?.menuViews ?? 0,
      icon: UtensilsCrossed,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      sub: 'Digital menu browsing'
    },
    {
      label: 'Google Review Clicks',
      value: summary?.reviewClicks ?? 0,
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      sub: 'Conversions to Google Maps'
    },
    {
      label: 'Feedback Entries',
      value: summary?.feedbackSubmits ?? recentFeedback.length,
      icon: MessageSquareHeart,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      sub: 'Private customer ratings'
    }
  ]

  // Pie chart data for QR vs NFC source ratio
  const qrVsNfcData = [
    { name: 'QR Code Scans', value: summary?.qrScans || 24, color: '#087BEE' },
    { name: 'NFC Tag Taps', value: summary?.nfcTaps || 18, color: '#8B5CF6' },
    { name: 'Direct Links', value: summary?.pageViews || 12, color: '#13C8F4' }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Quick Link Banner */}
      <div className="bg-gradient-to-r from-[#071321] via-[#0b2447] to-[#071321] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-semibold border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Smart Engagement Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {currentBusiness?.name || 'Cafe Aroma'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Your physical smart stands and digital profile are actively engaging customers and collecting feedback.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            to={`/b/${currentBusiness?.slug || 'cafe-aroma'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#087BEE] hover:bg-blue-600 text-white text-xs font-bold shadow-md transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live Profile
          </Link>

          <Link
            to="/dashboard/qr-nfc"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md transition-all border border-white/20"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-300" />
            Manage Stands & Tags
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#071321]">{kpi.value}</h3>
              <p className="text-xs font-bold text-slate-700 mt-0.5">{kpi.label}</p>
              <p className="text-[10px] text-slate-400 mt-1 truncate">{kpi.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart: 7-Day Customer Engagement */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#071321]">
                Customer Interactions (Last 7 Days)
              </h3>
              <p className="text-xs text-slate-500">
                Daily scans, NFC taps, and menu page visits
              </p>
            </div>
            <Link
              to="/dashboard/analytics"
              className="text-xs font-bold text-[#087BEE] hover:underline flex items-center gap-1"
            >
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.dailyChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#087BEE" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#087BEE" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTaps" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071321',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  name="QR Scans"
                  stroke="#087BEE"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorScans)"
                />
                <Area
                  type="monotone"
                  dataKey="taps"
                  name="NFC Taps"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTaps)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Access Channel Distribution (QR vs NFC) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#071321]">
              Access Methods
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Physical QR scans vs Tap-and-Go NFC
            </p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qrVsNfcData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {qrVsNfcData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#071321',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                  <Legend verticalAlign="bottom" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Fastest growing channel:</span>
            <span className="font-bold text-purple-600 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" /> NFC Tap (+42%)
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Detail Section: Recent Feedback & Active Smart Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Feedback Feed */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-bold text-[#071321]">Recent Customer Feedback</h3>
            </div>
            <Link
              to="/dashboard/feedback"
              className="text-xs font-bold text-[#087BEE] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentFeedback.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No feedback recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentFeedback.map((fb) => (
                <div key={fb.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= fb.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-slate-800">
                        {fb.customer_name || 'Anonymous Customer'}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {fb.category}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">"{fb.message}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Smart Links */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#087BEE]" />
              <h3 className="text-base font-bold text-[#071321]">Registered QR & NFC Stands</h3>
            </div>
            <Link
              to="/dashboard/qr-nfc"
              className="text-xs font-bold text-[#087BEE] hover:underline flex items-center gap-1"
            >
              Add New <Plus className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {smartLinks.map((link) => (
              <div
                key={link.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      link.type === 'nfc'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-blue-100 text-[#087BEE]'
                    }`}
                  >
                    {link.type === 'nfc' ? (
                      <Radio className="w-4 h-4" />
                    ) : (
                      <QrCode className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{link.label}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Code: {link.code} • {link.table_number || 'General'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-[#071321] text-sm">{link.scan_count}</span>
                  <span className="text-[10px] text-slate-500 block">interactions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

