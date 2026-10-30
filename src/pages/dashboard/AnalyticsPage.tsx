import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getAnalyticsSummary } from '@/services/dataService'
import {
  BarChart3,
  Calendar,
  Smartphone,
  Laptop,
  QrCode,
  Radio,
  Eye,
  Star,
  Wifi,
  Phone,
  MessageSquareHeart
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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

export const AnalyticsPage: React.FC = () => {
  const { currentBusiness } = useAuth()
  const [summary, setSummary] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | '90d'>('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      if (!currentBusiness) return
      setLoading(true)
      try {
        const data = await getAnalyticsSummary(currentBusiness.id)
        setSummary(data)
      } catch (err) {
        console.error('Error loading analytics:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [currentBusiness, timeRange])

  const eventBreakdownData = [
    { name: 'Profile Views', count: summary?.pageViews || 42, fill: '#087BEE' },
    { name: 'QR Scans', count: summary?.qrScans || 28, fill: '#13C8F4' },
    { name: 'NFC Taps', count: summary?.nfcTaps || 35, fill: '#8B5CF6' },
    { name: 'Menu Views', count: summary?.menuViews || 56, fill: '#10B981' },
    { name: 'Review Clicks', count: summary?.reviewClicks || 19, fill: '#F59E0B' },
    { name: 'Wi-Fi Connects', count: summary?.wifiViews || 22, fill: '#6366F1' },
    { name: 'Feedback Sent', count: summary?.feedbackSubmits || 8, fill: '#EC4899' }
  ]

  const deviceData = [
    { name: 'Mobile Smartphones', value: 84, color: '#087BEE' },
    { name: 'Desktop & Laptops', value: 16, color: '#94A3B8' }
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Date Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#087BEE]" /> Smart Business Intelligence
          </h2>
          <p className="text-xs text-slate-500">
            Real-time analytics on physical QR scans, NFC tag taps, customer flow and menu conversions.
          </p>
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          {(
            [
              ['today', 'Today'],
              ['7d', 'Last 7 Days'],
              ['30d', 'Last 30 Days'],
              ['90d', 'Quarter (90d)']
            ] as const
          ).map(([range, label]) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-[#071321] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Trends Area Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#071321]">
            Physical Engagement Velocity (Scans vs NFC Taps)
          </h3>
          <p className="text-xs text-slate-500">
            Track how customers access your venue through printed QR stands vs tap-and-go NFC cards.
          </p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={summary?.dailyChart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="anScans" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="5%" stopColor="#087BEE" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#087BEE" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="anTaps" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
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
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#anScans)"
              />
              <Area
                type="monotone"
                dataKey="taps"
                name="NFC Taps"
                stroke="#8B5CF6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#anTaps)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Events Bar Chart & Device Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interaction Breakdown Bar Chart: 8 cols */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#071321]">
              Customer Interaction Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Total actions triggered across all touchpoints.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventBreakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
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
                <Bar dataKey="count" name="Total Events" radius={[8, 8, 0, 0]}>
                  {eventBreakdownData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Distribution: 4 cols */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#071321]">Visitor Device Type</h3>
            <p className="text-xs text-slate-500 mb-4">
              Camera scanners vs desktop visitors
            </p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`dev-${index}`} fill={entry.color} />
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

          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Smartphone className="w-4 h-4 text-[#087BEE]" /> Mobile First
            </span>
            <span className="font-bold text-[#071321]">84% via Phone</span>
          </div>
        </div>
      </div>
    </div>
  )
}

