import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getSmartLinks, saveSmartLink, deleteSmartLink } from '@/services/dataService'
import { SmartLink, SmartDestinationType, SmartLinkType } from '@/types'
import { QRCodeSVG } from 'qrcode.react'
import { getAppBaseUrl } from '@/lib/supabase'
import {
  QrCode,
  Radio,
  Plus,
  Download,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Sparkles,
  Info,
  X,
  Play
} from 'lucide-react'

export const QrNfcManagementPage: React.FC = () => {
  const { currentBusiness } = useAuth()
  const [links, setLinks] = useState<SmartLink[]>([])
  const [activeTab, setActiveTab] = useState<'qr' | 'nfc'>('qr')
  const [loading, setLoading] = useState(true)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [linkType, setLinkType] = useState<SmartLinkType>('qr')
  const [destination, setDestination] = useState<SmartDestinationType>('profile')
  const [tableNumber, setTableNumber] = useState('')

  // Selected link for preview & print
  const [selectedLink, setSelectedLink] = useState<SmartLink | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [nfcGuideOpen, setNfcGuideOpen] = useState(false)

  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadLinks()
  }, [currentBusiness])

  async function loadLinks() {
    if (!currentBusiness) return
    setLoading(true)
    try {
      const data = await getSmartLinks(currentBusiness.id)
      setLinks(data)
      if (data.length > 0 && !selectedLink) {
        setSelectedLink(data[0])
      }
    } catch (err) {
      console.error('Error loading smart links:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBusiness || !label.trim()) return

    const randomSuffix = Math.random().toString(36).substring(2, 7)
    const code = linkType === 'nfc' ? `nfc-${randomSuffix}` : `qr-${randomSuffix}`

    const newLink = await saveSmartLink({
      business_id: currentBusiness.id,
      label,
      type: linkType,
      destination_type: destination,
      table_number: tableNumber || undefined,
      code,
      is_active: true
    })

    setModalOpen(false)
    setLabel('')
    setTableNumber('')
    await loadLinks()
    setSelectedLink(newLink)
  }

  const handleDeleteLink = async (id: string) => {
    if (confirm('Delete this smart tracking link?')) {
      await deleteSmartLink(id)
      await loadLinks()
      if (selectedLink?.id === id) {
        setSelectedLink(null)
      }
    }
  }

  const getFullTargetUrl = (code: string) => {
    return `${getAppBaseUrl()}/go/${code}`
  }

  const handleCopyUrl = (code: string) => {
    navigator.clipboard.writeText(getFullTargetUrl(code))
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleDownloadSVG = () => {
    if (!selectedLink) return
    const svg = document.getElementById('qr-svg-preview')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nexora-${selectedLink.code}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  const qrLinks = links.filter((l) => l.type === 'qr')
  const nfcLinks = links.filter((l) => l.type === 'nfc')

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
            <QrCode className="w-6 h-6 text-[#087BEE]" /> QR Codes & NFC Tag Engine
          </h2>
          <p className="text-xs text-slate-500">
            Generate dynamic QR table stands, manage NFC tap discs, and track physical interactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setNfcGuideOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all border border-purple-200"
          >
            <Radio className="w-4 h-4" /> NFC Programming Guide
          </button>

          <button
            onClick={() => {
              setLinkType(activeTab)
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Create Smart Link
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'qr'
              ? 'bg-[#071321] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4 text-cyan-400" /> Dynamic QR Codes ({qrLinks.length})
        </button>

        <button
          onClick={() => setActiveTab('nfc')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'nfc'
              ? 'bg-[#071321] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4 text-purple-400" /> NFC Tap Tags ({nfcLinks.length})
        </button>
      </div>

      {/* Main Grid: List on Left, Live Preview & Print Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List: 7 columns */}
        <div className="lg:col-span-7 space-y-3">
          {(activeTab === 'qr' ? qrLinks : nfcLinks).map((link) => {
            const isSelected = selectedLink?.id === link.id
            return (
              <div
                key={link.id}
                onClick={() => setSelectedLink(link)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-blue-50/50 border-[#087BEE] shadow-sm'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      link.type === 'nfc'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-blue-100 text-[#087BEE]'
                    }`}
                  >
                    {link.type === 'nfc' ? (
                      <Radio className="w-5 h-5" />
                    ) : (
                      <QrCode className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{link.label}</h4>
                      {link.table_number && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {link.table_number}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Short Link: <span className="text-[#087BEE]">/go/{link.code}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-black text-[#071321]">
                      {link.scan_count}
                    </span>
                    <span className="text-[10px] text-slate-400 block">interactions</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteLink(link.id)
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}

          {(activeTab === 'qr' ? qrLinks : nfcLinks).length === 0 && (
            <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center space-y-2">
              <Info className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No {activeTab.toUpperCase()} links created yet</p>
              <p className="text-xs text-slate-500">
                Click "Create Smart Link" above to generate your first tracking link.
              </p>
            </div>
          )}
        </div>

        {/* Right Preview Card: 5 columns */}
        <div className="lg:col-span-5">
          {selectedLink ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#071321]">
                    {selectedLink.type === 'nfc' ? 'NFC Stand Preview' : 'Printable QR Table Tent'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {selectedLink.code}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyUrl(selectedLink.code)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                    title="Copy Destination URL"
                  >
                    {copiedCode === selectedLink.code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={handleDownloadSVG}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    title="Download SVG"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-xl bg-[#071321] text-white hover:bg-slate-800 text-xs font-semibold"
                    title="Print Table Tent"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Physical Mockup Tent Card */}
              <div
                ref={printRef}
                className="printable-card p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-[#071321] to-[#0d2a4d] text-white text-center shadow-lg border border-slate-800 space-y-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">
                    {currentBusiness?.name || 'Cafe Aroma'}
                  </span>
                  <h4 className="text-lg font-black tracking-tight text-white">
                    {selectedLink.label}
                  </h4>
                  {selectedLink.table_number && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-bold">
                      {selectedLink.table_number}
                    </span>
                  )}
                </div>

                {/* QR Visual */}
                <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto">
                  <QRCodeSVG
                    id="qr-svg-preview"
                    value={getFullTargetUrl(selectedLink.code)}
                    size={170}
                    level="Q"
                    includeMargin={false}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-cyan-300 flex items-center justify-center gap-1.5">
                    {selectedLink.type === 'nfc' ? (
                      <>
                        <Radio className="w-4 h-4 animate-pulse" /> TAP PHONE OR SCAN QR
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" /> SCAN WITH ANY CAMERA
                      </>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Access Menu · Google Reviews · Free Wi-Fi
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 text-[9px] text-slate-400 font-mono">
                  Powered by NEXORA TECHNOLOGIES
                </div>
              </div>

              {/* Quick Simulator Test Button */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-600 font-medium">Test customer redirect:</span>
                <a
                  href={getFullTargetUrl(selectedLink.code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#087BEE] text-white text-xs font-bold hover:bg-blue-600 transition-colors"
                >
                  <Play className="w-3 h-3 fill-white" /> Simulate Interaction
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
              Select a QR or NFC link on the left to preview and print.
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: CREATE SMART LINK                                       */}
      {/* ============================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#071321] mb-4">Create New Smart Link</h3>

            <form onSubmit={handleCreateLink} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLinkType('qr')}
                    className={`py-2 px-3 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      linkType === 'qr'
                        ? 'bg-[#087BEE] text-white border-[#087BEE]'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" /> QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setLinkType('nfc')}
                    className={`py-2 px-3 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      linkType === 'nfc'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" /> NFC Tag
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Label / Placement Name *</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Table 4 Acrylic Stand, Counter Tap Card"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Table / Zone Identifier</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. T-04, Patio-2, VIP"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Target</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value as SmartDestinationType)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] bg-white"
                >
                  <option value="profile">Full Business Profile (Recommended)</option>
                  <option value="menu">Direct Digital Menu</option>
                  <option value="review">Direct Google Review Destination</option>
                  <option value="wifi">Direct Guest Wi-Fi Portal</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-bold shadow hover:shadow-md"
                >
                  Generate Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: NFC PROGRAMMING GUIDE                                   */}
      {/* ============================================================== */}
      {nfcGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setNfcGuideOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#071321]">
                How to Program Your Physical NFC Tags
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Nexora NFC cards work with any NTAG213 / NTAG215 / NTAG216 tags or acrylic stands. No coding or mobile app installation is needed by your customers.
            </p>

            <ol className="space-y-3 text-xs text-slate-700 list-decimal list-inside bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <li>
                Download the free <strong>NFC Tools</strong> app from the iOS App Store or Google Play Store.
              </li>
              <li>
                In the app, select <strong>Write → Add a record → URL / URI</strong>.
              </li>
              <li>
                Paste your Nexora short link (e.g., <code className="bg-slate-200 px-1 rounded font-mono">https://nexora.in/go/nfc-counter</code>).
              </li>
              <li>
                Tap <strong>Write / 28 Bytes</strong> and hold your smartphone near the physical NFC card or stand.
              </li>
              <li>
                <strong>Done!</strong> Any customer tapping their iPhone or Android phone will instantly open your Nexora business page.
              </li>
            </ol>

            <button
              onClick={() => setNfcGuideOpen(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#071321] text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

