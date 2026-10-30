import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getFeedback, markFeedbackReviewed } from '@/services/dataService'
import { CustomerFeedback } from '@/types'
import {
  MessageSquareHeart,
  Star,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Filter,
  User,
  Mail,
  Phone,
  Check
} from 'lucide-react'

export const FeedbackManagementPage: React.FC = () => {
  const { currentBusiness } = useAuth()
  const [feedbackList, setFeedbackList] = useState<CustomerFeedback[]>([])
  const [loading, setLoading] = useState(true)
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadFeedback()
  }, [currentBusiness])

  async function loadFeedback() {
    if (!currentBusiness) return
    setLoading(true)
    try {
      const data = await getFeedback(currentBusiness.id)
      setFeedbackList(data)
    } catch (err) {
      console.error('Error loading feedback:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleReviewed = async (id: string, currentStatus: boolean) => {
    await markFeedbackReviewed(id, !currentStatus)
    await loadFeedback()
  }

  // Export to CSV
  const handleExportCSV = () => {
    if (feedbackList.length === 0) return
    const headers = ['Date', 'Rating', 'Category', 'Customer Name', 'Email', 'Message', 'Reviewed']
    const rows = feedbackList.map((f) => [
      new Date(f.created_at).toLocaleDateString(),
      f.rating,
      f.category,
      `"${(f.customer_name || 'Anonymous').replace(/"/g, '""')}"`,
      `"${(f.customer_email || '').replace(/"/g, '""')}"`,
      `"${f.message.replace(/"/g, '""')}"`,
      f.is_reviewed ? 'Yes' : 'No'
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `nexora-feedback-${currentBusiness?.slug || 'export'}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const filtered = useMemo(() => {
    return feedbackList.filter((fb) => {
      if (ratingFilter !== 'all' && fb.rating !== ratingFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchMsg = fb.message.toLowerCase().includes(q)
        const matchName = fb.customer_name?.toLowerCase().includes(q)
        return matchMsg || matchName
      }
      return true
    })
  }, [feedbackList, ratingFilter, search])

  const averageRating = useMemo(() => {
    if (feedbackList.length === 0) return 0
    const sum = feedbackList.reduce((acc, curr) => acc + curr.rating, 0)
    return (sum / feedbackList.length).toFixed(1)
  }, [feedbackList])

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
            <MessageSquareHeart className="w-6 h-6 text-purple-600" /> Customer Feedback Hub
          </h2>
          <p className="text-xs text-slate-500">
            Private, honest customer feedback submitted directly from your NFC stands and menu.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={feedbackList.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-300 disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#071321]">{averageRating} / 5.0</span>
            <p className="text-xs font-bold text-slate-500">Average Satisfaction Score</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#071321]">{feedbackList.length}</span>
            <p className="text-xs font-bold text-slate-500">Total Feedback Submissions</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#071321]">
              {feedbackList.filter((f) => f.is_reviewed).length}
            </span>
            <p className="text-xs font-bold text-slate-500">Addressed by Management</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Star Rating Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setRatingFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              ratingFilter === 'all'
                ? 'bg-[#071321] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Ratings
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              onClick={() => setRatingFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                ratingFilter === s
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{s}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search feedback comments..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
          />
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border transition-all ${
              item.is_reviewed
                ? 'bg-white border-slate-200/80'
                : 'bg-amber-50/20 border-amber-200/70 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= item.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {item.customer_name || 'Anonymous Guest'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400 text-[11px]">
                  {new Date(item.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <button
                  onClick={() => handleToggleReviewed(item.id, item.is_reviewed)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    item.is_reviewed
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  {item.is_reviewed ? 'Reviewed' : 'Mark as Reviewed'}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
              "{item.message}"
            </p>

            {(item.customer_email || item.customer_phone) && (
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                {item.customer_email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" /> {item.customer_email}
                  </span>
                )}
                {item.customer_phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" /> {item.customer_phone}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
            No feedback found matching the current filter.
          </div>
        )}
      </div>
    </div>
  )
}

