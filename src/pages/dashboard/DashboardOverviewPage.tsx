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
  Sparkles,
  Printer,
  Tag,
  Clock,
  ShieldCheck,
  Activity,
  ChevronRight
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
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
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

  // Multiplier for demo periods
  const multiplier = timeRange === '90d' ? 6.5 : timeRange === '30d' ? 3.2 : 1.0

  const kpis = [
    {
      label: 'Unique Visitors',
      value: Math.round((summary?.uniqueVisitors || 42) * multiplier),
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      change: '+24%',
      sub: 'Individual customer devices'
    },
    {
      label: 'QR Scans',
      value: Math.round((summary?.qrScans || 38) * multiplier),
      icon: QrCode,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      change: '+18%',
      sub: 'From stands & table tents'
    },
    {
      label: 'NFC Taps',
      value: Math.round((summary?.nfcTaps || 27) * multiplier),
      icon: Radio,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      change: '+42%',
      sub: 'Physical card & sticker taps'
    },
    {
      label: 'Menu Views',
      value: Math.round((summary?.menuViews || 65) * multiplier),
      icon: UtensilsCrossed,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      change: '+31%',
      sub: 'Digital dishes viewed'
    },
    {
      label: 'Google Review Clicks',
      value: Math.round((summary?.reviewClicks || 19) * multiplier),
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      change: '+55%',
      sub: 'Directed to Google Maps'
    },
    {
      label: 'Feedback Entries',
      value: summary?.feedbackSubmits ?? recentFeedback.length,
      icon: MessageSquareHeart,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      change: '100% private',
      sub: 'Customer sentiments'
    }
  ]

  // Dynamic Chart Data based on time range
  const chartData = (summary?.dailyChart || []).map((item: any) => ({
    ...item,
    scans: Math.round(item.scans * multiplier),
    taps: Math.round(item.taps * multiplier)
  }))

  // Pie chart data for QR vs NFC source ratio
  const qrVsNfcData = [
    { name: 'QR Code Scans', value: Math.round((summary?.qrScans || 38) * multiplier), color: '#087BEE' },
    { name: 'NFC Tag Taps', value: Math.round((summary?.nfcTaps || 27) * multiplier), color: '#8B5CF6' },
    { name: 'Direct Links', value: Math.round((summary?.pageViews || 15) * multiplier), color: '#13C8F4' }
  ]

  // Recent physical activity pulse feed
  const liveInteractions = [
    {
      id: '1',
      type: 'nfc',
      title: 'Table 4 Acrylic Stand Tapped',
      time: '3 minutes ago',
      device: 'iPhone 15 Pro • iOS 18'
    },
    {
      id: '2',
      type: 'review',
      title: 'Customer opened Google Reviews',
      time: '18 minutes ago',
      device: 'Samsung Galaxy S24'
    },
    {
      id: '3',
      type: 'qr',
      title: 'Patio Bar QR Code Scanned',
      time: '42 minutes ago',
      device: 'Google Pixel 9'
    },
    {
      id: '4',
      type: 'menu',
      title: 'Digital Menu Item Added to Cart',
      time: '1 hour ago',
      device: 'OnePlus 12'
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Quick Link Banner with Mesh Glow */}
      <div className="bg-gradient-to-r from-[#071321] via-[#0b2447] to-[#071321] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#087BEE]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-semibold border border-blue-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Smart Engagement Network Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {currentBusiness?.name || 'Cafe Aroma'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Your physical smart stands, digital menu, and Google review boosters are running in real time.
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
            Standee & Tag Studio
          </Link>
        </div>
      </div>

      {/* Quick Actions Shortcuts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/dashboard/qr-nfc"
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-[#087BEE] hover:shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#087BEE] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Print Table Tents</span>
            <span className="text-[10px] text-slate-400">PDF & SVG templates</span>
          </div>
        </Link>

        <Link
          to="/dashboard/menu"
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-500 hover:shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Update Menu</span>
            <span className="text-[10px] text-slate-400">Manage dishes & prices</span>
          </div>
        </Link>

        <Link
          to="/dashboard/offers"
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-500 hover:shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Broadcast Offer</span>
            <span className="text-[10px] text-slate-400">Happy hour & promo banner</span>
          </div>
        </Link>

        <Link
          to="/dashboard/feedback"
          className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-500 hover:shadow-sm transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Customer Feedback</span>
            <span className="text-[10px] text-slate-400">Review private ratings</span>
          </div>
        </Link>
      </div>

      {/* KPI Cards Grid with Interactive Period Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#087BEE]" /> Performance Metrics
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeRange === '90d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              90 Days
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <TrendingUp className="w-3 h-3" /> {kpi.change}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-[#071321]">{kpi.value}</h3>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{kpi.label}</p>
                <p className="text-[10px] text-slate-400 mt-1 truncate">{kpi.sub}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart: Customer Engagement Over Time */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-[#071321] flex items-center gap-2">
                Customer Interactions Timeline
              </h3>
              <p className="text-xs text-slate-500">
                Daily dynamic QR scans, physical NFC taps, and menu page views
              </p>
            </div>
            <Link
              to="/dashboard/analytics"
              className="text-xs font-bold text-[#087BEE] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Full Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#087BEE" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#087BEE" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTaps" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
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
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  name="QR Scans"
                  stroke="#087BEE"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorScans)"
                />
                <Area
                  type="monotone"
                  dataKey="taps"
                  name="NFC Taps"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTaps)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#087BEE]" /> QR Scans
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> NFC Tap & Go
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Updated in real-time</span>
          </div>
        </div>

        {/* Access Channel Distribution (QR vs NFC) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-[#071321]">
              Access Channels
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Camera QR scans vs Tap-and-Go NFC cards
            </p>

            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qrVsNfcData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
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

      {/* Two-Column Detail Section: Live Interaction Pulse & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Touchpoint Activity Stream (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-base font-black text-[#071321]">Live Activity Pulse</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Real-Time
            </span>
          </div>

          <div className="space-y-3">
            {liveInteractions.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3 hover:bg-slate-100/80 transition-colors text-xs"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    act.type === 'nfc'
                      ? 'bg-purple-100 text-purple-600'
                      : act.type === 'review'
                      ? 'bg-amber-100 text-amber-600'
                      : act.type === 'menu'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-blue-100 text-[#087BEE]'
                  }`}
                >
                  {act.type === 'nfc' ? (
                    <Radio className="w-4 h-4" />
                  ) : act.type === 'review' ? (
                    <Star className="w-4 h-4" />
                  ) : act.type === 'menu' ? (
                    <UtensilsCrossed className="w-4 h-4" />
                  ) : (
                    <QrCode className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 truncate">{act.title}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" /> {act.time} • {act.device}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Have new tables or checkout stations?</span>
            <Link
              to="/dashboard/qr-nfc"
              className="text-[#087BEE] font-bold hover:underline flex items-center gap-0.5"
            >
              Add Stand <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Customer Feedback & Sentiment (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareHeart className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-black text-[#071321]">Recent Private Customer Feedback</h3>
            </div>
            <Link
              to="/dashboard/feedback"
              className="text-xs font-bold text-[#087BEE] hover:underline flex items-center gap-1"
            >
              View All ({recentFeedback.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentFeedback.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No private feedback entries yet. Customer ratings collected from your business page will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {recentFeedback.map((fb) => (
                <div key={fb.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
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
                        {fb.customer_name || 'Anonymous Guest'}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {fb.category || 'General'}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic">"{fb.message}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
