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
  Play,
  Layers,
  Palette,
  Eye,
  Smartphone,
  RotateCw,
  FileDown,
  Wifi,
  Star,
  Store,
  Scissors
} from 'lucide-react'

// Available Standee Format Templates
type StandeeFormat = 'tent' | 'counter' | 'puck' | 'card'

// Color Themes for QR & Standee
interface ThemeOption {
  id: string
  name: string
  primary: string
  bg: string
  text: string
  accent: string
  border: string
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Black',
    primary: '#071321',
    bg: '#071321',
    text: '#ffffff',
    accent: '#13C8F4',
    border: 'border-slate-800'
  },
  {
    id: 'electric-blue',
    name: 'Electric Sapphire',
    primary: '#087BEE',
    bg: '#0a2540',
    text: '#ffffff',
    accent: '#60a5fa',
    border: 'border-blue-900'
  },
  {
    id: 'emerald',
    name: 'Cyber Emerald',
    primary: '#059669',
    bg: '#064e3b',
    text: '#ffffff',
    accent: '#34d399',
    border: 'border-emerald-800'
  },
  {
    id: 'amethyst',
    name: 'Royal Amethyst',
    primary: '#7C3AED',
    bg: '#3b0764',
    text: '#ffffff',
    accent: '#c084fc',
    border: 'border-purple-900'
  },
  {
    id: 'amber',
    name: 'Sunset Copper',
    primary: '#EA580C',
    bg: '#431407',
    text: '#ffffff',
    accent: '#fb923c',
    border: 'border-orange-900'
  },
  {
    id: 'clean-white',
    name: 'Clean Studio White',
    primary: '#071321',
    bg: '#ffffff',
    text: '#071321',
    accent: '#087BEE',
    border: 'border-slate-300'
  }
]

export const QrNfcManagementPage: React.FC = () => {
  const { currentBusiness } = useAuth()
  const [links, setLinks] = useState<SmartLink[]>([])
  const [activeTab, setActiveTab] = useState<'qr' | 'nfc'>('qr')
  const [loading, setLoading] = useState(true)

  // Modal State for New Link
  const [modalOpen, setModalOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [linkType, setLinkType] = useState<SmartLinkType>('qr')
  const [destination, setDestination] = useState<SmartDestinationType>('profile')
  const [tableNumber, setTableNumber] = useState('')

  // Selected link for preview & print
  const [selectedLink, setSelectedLink] = useState<SmartLink | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [nfcGuideOpen, setNfcGuideOpen] = useState(false)

  // Standee Designer Customizer State
  const [standeeFormat, setStandeeFormat] = useState<StandeeFormat>('tent')
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(THEME_OPTIONS[0])
  const [customHeadline, setCustomHeadline] = useState('')
  const [customSubtext, setCustomSubtext] = useState('')
  const [showCenterIcon, setShowCenterIcon] = useState<'nfc' | 'qr' | 'store' | 'star' | 'wifi' | 'none'>('nfc')
  const [isSimulatingTap, setIsSimulatingTap] = useState(false)

  // 3D Tilt Card state
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 })
  const [isHovered3D, setIsHovered3D] = useState(false)

  // Web NFC writing state
  const [nfcSupported, setNfcSupported] = useState(false)
  const [nfcWriting, setNfcWriting] = useState(false)
  const [nfcWriteStatus, setNfcWriteStatus] = useState<string | null>(null)

  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadLinks()
    // Check if Web NFC is supported in the browser
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setNfcSupported(true)
    }
  }, [currentBusiness])

  async function loadLinks() {
    if (!currentBusiness) return
    setLoading(true)
    try {
      const data = await getSmartLinks(currentBusiness.id)
      setLinks(data)
      if (data.length > 0 && !selectedLink) {
        setSelectedLink(data[0])
        setCustomHeadline(data[0].type === 'nfc' ? 'TAP PHONE HERE' : 'SCAN TO VIEW MENU')
        setCustomSubtext('Instant Digital Menu • Google Reviews • Free Wi-Fi')
      }
    } catch (err) {
      console.error('Error loading smart links:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectLink = (link: SmartLink) => {
    setSelectedLink(link)
    setStandeeFormat(link.type === 'nfc' ? 'card' : 'tent')
    setShowCenterIcon(link.type === 'nfc' ? 'nfc' : 'qr')
    setCustomHeadline(link.type === 'nfc' ? 'TAP PHONE HERE' : 'SCAN TO VIEW MENU')
    setCustomSubtext('Instant Digital Menu • Google Reviews • Free Wi-Fi')
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
    handleSelectLink(newLink)
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
    a.download = `nexora-${selectedLink.code}-${standeeFormat}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  // Handle 3D Mouse Movement on NFC Card
  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -14
    const rotateY = ((x - centerX) / centerX) * 14
    setCardRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave3D = () => {
    setIsHovered3D(false)
    setCardRotation({ x: 0, y: 0 })
  }

  // Live Web NFC Write using Browser NDEFReader API (when supported on Android Chrome)
  const handleWriteNfcTag = async () => {
    if (!selectedLink) return
    if (!('NDEFReader' in window)) {
      setNfcGuideOpen(true)
      return
    }

    try {
      setNfcWriting(true)
      setNfcWriteStatus('Ready: Hold physical NFC card/tag against back of phone...')
      // @ts-ignore - Web NFC API
      const ndef = new window.NDEFReader()
      await ndef.write({
        records: [
          {
            recordType: 'url',
            data: getFullTargetUrl(selectedLink.code)
          }
        ]
      })
      setNfcWriteStatus('Success! Tag successfully programmed with Nexora URL.')
      setTimeout(() => {
        setNfcWriting(false)
        setNfcWriteStatus(null)
      }, 4000)
    } catch (err: any) {
      console.error('NFC write error:', err)
      setNfcWriteStatus(`Write failed: ${err.message || 'Permission denied or tag locked.'}`)
      setTimeout(() => {
        setNfcWriting(false)
      }, 4000)
    }
  }

  // Simulate customer tap
  const handleSimulateTap = () => {
    setIsSimulatingTap(true)
    setTimeout(() => {
      setIsSimulatingTap(false)
      if (selectedLink) {
        window.open(getFullTargetUrl(selectedLink.code), '_blank')
      }
    }, 1100)
  }

  const qrLinks = links.filter((l) => l.type === 'qr')
  const nfcLinks = links.filter((l) => l.type === 'nfc')

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
            <QrCode className="w-6 h-6 text-[#087BEE]" /> QR Codes & NFC Tag Studio
          </h2>
          <p className="text-xs text-slate-500">
            Generate customized physical table tents, design 3D NFC cards, and track customer engagement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setNfcGuideOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-all border border-purple-200"
          >
            <Radio className="w-4 h-4 text-purple-600" /> NFC Programming Guide
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
          onClick={() => {
            setActiveTab('qr')
            const firstQr = qrLinks[0]
            if (firstQr) handleSelectLink(firstQr)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'qr'
              ? 'bg-[#071321] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4 text-cyan-400" /> Dynamic QR Codes ({qrLinks.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('nfc')
            const firstNfc = nfcLinks[0]
            if (firstNfc) handleSelectLink(firstNfc)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'nfc'
              ? 'bg-[#071321] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4 text-purple-400" /> NFC Tap Discs & Cards ({nfcLinks.length})
        </button>
      </div>

      {/* Main Grid: List on Left (5 cols), Studio Designer & Live Preview on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List: 5 columns */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>REGISTERED TOUCHPOINTS</span>
            <span>INTERACTIONS</span>
          </div>

          {(activeTab === 'qr' ? qrLinks : nfcLinks).map((link) => {
            const isSelected = selectedLink?.id === link.id
            return (
              <div
                key={link.id}
                onClick={() => handleSelectLink(link)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-blue-50/70 border-[#087BEE] shadow-sm ring-2 ring-blue-500/20'
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
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {link.table_number}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Target: <span className="text-[#087BEE]">/go/{link.code}</span>
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

          {/* Quick Hardware Standee Specs helper card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-[#071321] text-white space-y-2 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-cyan-300" /> Recommended Hardware Specs
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              For NFC cards or pucks, use standard <strong>NTAG213 or NTAG215</strong> chips (144–504 bytes). Any modern smartphone can read them through acrylic stands, wood, and plastic without power or battery!
            </p>
          </div>
        </div>

        {/* Right Studio Designer & Live Preview: 7 columns */}
        <div className="lg:col-span-7 space-y-5">
          {selectedLink ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
              {/* Studio Header & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-[#071321] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#087BEE]" />
                    Design Studio & Physical Mockup
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live customization for <span className="font-bold text-slate-800">{selectedLink.label}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(selectedLink.code)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Copy Target URL"
                  >
                    {copiedCode === selectedLink.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadSVG}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Download SVG"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>SVG</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-2 px-3 rounded-xl bg-[#071321] text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    title="Print Table Tent"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Stand</span>
                  </button>
                </div>
              </div>

              {/* Design Controls Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                {/* Format Selector */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1 mb-2">
                    <Layers className="w-3.5 h-3.5 text-[#087BEE]" /> Select Hardware Mockup Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'tent', label: 'Foldable Tent (A6)' },
                      { id: 'counter', label: 'Counter Display (A5)' },
                      { id: 'puck', label: 'Round Table Puck' },
                      { id: 'card', label: 'Luxury NFC Card' }
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => setStandeeFormat(fmt.id as StandeeFormat)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          standeeFormat === fmt.id
                            ? 'bg-[#071321] text-white border-[#071321] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Palette Selector */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1 mb-2">
                    <Palette className="w-3.5 h-3.5 text-purple-600" /> Color Theme
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {THEME_OPTIONS.map((theme) => {
                      const isSelected = selectedTheme.id === theme.id
                      return (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            isSelected
                              ? 'border-[#087BEE] ring-2 ring-blue-500/20 bg-white text-slate-900 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                            style={{ backgroundColor: theme.primary }}
                          />
                          <span className="text-[11px] font-semibold">{theme.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Text & Center Icon Customization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Callout Headline
                    </label>
                    <input
                      type="text"
                      value={customHeadline}
                      onChange={(e) => setCustomHeadline(e.target.value)}
                      placeholder="e.g. TAP PHONE OR SCAN MENU"
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Center Emblem / Icon
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[
                        { id: 'nfc', icon: Radio, title: 'NFC Wave' },
                        { id: 'qr', icon: QrCode, title: 'QR Code' },
                        { id: 'store', icon: Store, title: 'Store' },
                        { id: 'star', icon: Star, title: '5-Star' },
                        { id: 'wifi', icon: Wifi, title: 'Wi-Fi' }
                      ].map((item) => {
                        const Icon = item.icon
                        const isSelected = showCenterIcon === item.id
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setShowCenterIcon(item.id as any)}
                            className={`p-2 rounded-xl border transition-all ${
                              isSelected
                                ? 'bg-[#087BEE] text-white border-[#087BEE]'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={item.title}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================================================== */}
              {/* LIVE PHYSICAL MOCKUP CONTAINER                                 */}
              {/* ============================================================== */}
              <div className="bg-slate-100/70 p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden min-h-[380px]">
                {/* 3D NFC Card Mockup */}
                {standeeFormat === 'card' && (
                  <div
                    className="perspective-card w-full max-w-[340px] cursor-grab active:cursor-grabbing select-none"
                    onMouseMove={handleMouseMove3D}
                    onMouseEnter={() => setIsHovered3D(true)}
                    onMouseLeave={handleMouseLeave3D}
                  >
                    <div
                      style={{
                        transform: `rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg)`,
                        transition: isHovered3D ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                        backgroundColor: selectedTheme.bg,
                        color: selectedTheme.text
                      }}
                      className="relative p-6 rounded-2xl shadow-2xl border border-white/15 aspect-[1.58/1] flex flex-col justify-between overflow-hidden card-3d-inner"
                    >
                      {/* Holographic specular sheen */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                        style={{
                          background: `radial-gradient(circle at ${50 + cardRotation.y * 2}% ${
                            50 + cardRotation.x * -2
                          }%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`
                        }}
                      />

                      {/* Top Bar of Card */}
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-5 rounded bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 border border-amber-500/30 flex items-center justify-center shadow-xs">
                            <div className="w-4 h-3 border-y border-amber-600/40" />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-200">
                            NEXORA SMART TAG
                          </span>
                        </div>

                        {/* Contactless symbol */}
                        <div className="relative">
                          <Radio
                            className={`w-5 h-5 text-cyan-400 ${
                              isSimulatingTap ? 'animate-ping' : 'animate-pulse'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Middle of Card: Business Name & Code */}
                      <div className="relative z-10 space-y-1">
                        <h4 className="text-xl font-black tracking-tight uppercase truncate gold-foil">
                          {currentBusiness?.name || 'Cafe Aroma'}
                        </h4>
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-mono tracking-wider opacity-80">
                            {selectedLink.label}
                          </p>
                          {selectedLink.table_number && (
                            <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-bold">
                              {selectedLink.table_number}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom of Card: Card ID & Tap Action */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10 relative z-10 text-[10px] font-mono">
                        <span className="opacity-60">ID: {selectedLink.code}</span>
                        <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Radio className="w-3 h-3" /> Tap to open
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Round Table Puck / Coaster Mockup (80mm) */}
                {standeeFormat === 'puck' && (
                  <div
                    ref={printRef}
                    className="printable-card w-64 h-64 rounded-full p-4 flex flex-col items-center justify-center text-center shadow-2xl relative border-4"
                    style={{
                      backgroundColor: selectedTheme.bg,
                      color: selectedTheme.text,
                      borderColor: selectedTheme.accent
                    }}
                  >
                    {/* Outer concentric rim */}
                    <div className="absolute inset-2 rounded-full border border-dashed border-white/30 pointer-events-none" />

                    <div className="space-y-0.5 relative z-10 mb-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-cyan-300 truncate max-w-[180px]">
                        {currentBusiness?.name || 'Cafe Aroma'}
                      </p>
                      {selectedLink.table_number && (
                        <span className="inline-block px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-bold">
                          {selectedLink.table_number}
                        </span>
                      )}
                    </div>

                    {/* QR Code */}
                    <div className="p-2.5 bg-white rounded-2xl shadow-md inline-block relative z-10">
                      <QRCodeSVG
                        id="qr-svg-preview"
                        value={getFullTargetUrl(selectedLink.code)}
                        size={110}
                        level="Q"
                        includeMargin={false}
                        fgColor={selectedTheme.primary}
                      />
                    </div>

                    <div className="mt-2 space-y-0.5 relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 text-cyan-300">
                        <Radio className="w-3 h-3 animate-pulse" /> TAP OR SCAN
                      </p>
                      <p className="text-[8px] opacity-70">Tabletop Smart Touchpoint</p>
                    </div>
                  </div>
                )}

                {/* Foldable Tent Card (A6) or Countertop (A5) */}
                {(standeeFormat === 'tent' || standeeFormat === 'counter') && (
                  <div
                    ref={printRef}
                    style={{
                      backgroundColor: selectedTheme.bg,
                      color: selectedTheme.text
                    }}
                    className={`printable-card w-full ${
                      standeeFormat === 'counter' ? 'max-w-md' : 'max-w-sm'
                    } p-6 rounded-3xl text-center shadow-2xl border ${selectedTheme.border} space-y-4 relative`}
                  >
                    {/* Fold Guidelines for Printable Tent */}
                    {standeeFormat === 'tent' && (
                      <div className="no-print absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[9px] font-bold flex items-center gap-1">
                        <Scissors className="w-3 h-3" /> Foldable Table Tent (A6)
                      </div>
                    )}

                    <div className="space-y-1">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: selectedTheme.accent }}
                      >
                        {currentBusiness?.name || 'Cafe Aroma'}
                      </span>
                      <h4 className="text-xl font-black tracking-tight">
                        {customHeadline || selectedLink.label}
                      </h4>
                      {selectedLink.table_number && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-bold tracking-wide">
                          TABLE {selectedLink.table_number}
                        </span>
                      )}
                    </div>

                    {/* QR Code with optional center emblem */}
                    <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto relative group">
                      <QRCodeSVG
                        id="qr-svg-preview"
                        value={getFullTargetUrl(selectedLink.code)}
                        size={standeeFormat === 'counter' ? 180 : 155}
                        level="Q"
                        includeMargin={false}
                        fgColor={selectedTheme.primary}
                        imageSettings={
                          showCenterIcon === 'none'
                            ? undefined
                            : {
                                src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23087BEE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>',
                                height: 26,
                                width: 26,
                                excavate: true
                              }
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <p
                        className="text-xs font-black tracking-wide flex items-center justify-center gap-1.5 uppercase"
                        style={{ color: selectedTheme.accent }}
                      >
                        {selectedLink.type === 'nfc' ? (
                          <>
                            <Radio className="w-4 h-4 animate-pulse" /> TAP WITH PHONE OR SCAN
                          </>
                        ) : (
                          <>
                            <QrCode className="w-4 h-4" /> POINT ANY PHONE CAMERA
                          </>
                        )}
                      </p>
                      <p className="text-[10px] opacity-75">
                        {customSubtext || 'Access Menu • Google Reviews • Free Guest Wi-Fi'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 text-[9px] opacity-50 font-mono flex items-center justify-between">
                      <span>SHORT LINK: /go/{selectedLink.code}</span>
                      <span>NEXORA TECHNOLOGIES</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Interactive Simulation & Hardware Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#087BEE] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      Customer Experience Tester
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Simulate a customer scanning this QR or tapping their smartphone.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Web NFC Write Button (if supported or triggers guide) */}
                  {selectedLink.type === 'nfc' && (
                    <button
                      onClick={handleWriteNfcTag}
                      disabled={nfcWriting}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      {nfcWriting ? 'Hold Tag Near Phone...' : 'Program NFC Tag'}
                    </button>
                  )}

                  <button
                    onClick={handleSimulateTap}
                    disabled={isSimulatingTap}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#087BEE] hover:bg-blue-600 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    {isSimulatingTap ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Simulate Tap / Scan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* NFC Writing Status Toast Alert */}
              {nfcWriteStatus && (
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
                  <span>{nfcWriteStatus}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-400 space-y-2">
              <Eye className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-600">No Touchpoint Selected</p>
              <p>Select a dynamic QR or NFC tracking link on the left to customize and print.</p>
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
