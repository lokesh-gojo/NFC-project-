import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getWifiSettings, saveWifiSettings } from '@/services/dataService'
import { WifiSetting, WifiEncryption } from '@/types'
import { QRCodeSVG } from 'qrcode.react'
import {
  Wifi,
  Save,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'

export const WifiManagementPage: React.FC = () => {
  const { currentBusiness } = useAuth()
  const [wifi, setWifi] = useState<WifiSetting | null>(null)
  const [ssid, setSsid] = useState('CafeAroma_Guest_HighSpeed')
  const [password, setPassword] = useState('BrewFresh2025!')
  const [encryption, setEncryption] = useState<WifiEncryption>('WPA')
  const [isEnabled, setIsEnabled] = useState(true)
  const [instructions, setInstructions] = useState('Scan the QR code to auto-connect to high-speed guest Wi-Fi.')
  const [showPassword, setShowPassword] = useState(false)

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadWifi()
  }, [currentBusiness])

  async function loadWifi() {
    if (!currentBusiness) return
    const data = await getWifiSettings(currentBusiness.id)
    if (data) {
      setWifi(data)
      setSsid(data.ssid)
      setPassword(data.password || '')
      setEncryption(data.encryption)
      setIsEnabled(data.is_enabled)
      setInstructions(data.instructions || '')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBusiness || !ssid.trim()) return
    setSaving(true)
    try {
      const updated = await saveWifiSettings({
        business_id: currentBusiness.id,
        ssid,
        password,
        encryption,
        is_enabled: isEnabled,
        instructions
      })
      setWifi(updated)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (err) {
      console.error('Error saving Wi-Fi settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  // Standard Wi-Fi QR Code string format: WIFI:T:WPA;S:MySSID;P:MyPassword;;
  const wifiQrString = `WIFI:T:${encryption};S:${ssid};P:${password};;`

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
          <Wifi className="w-6 h-6 text-[#13C8F4]" /> Guest Wi-Fi Portal
        </h2>
        <p className="text-xs text-slate-500">
          Provide effortless Wi-Fi access with one-camera-tap auto-connection QR codes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Form: 7 columns */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Toggle Enable */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 text-sm block">
                  Enable Guest Wi-Fi Sharing
                </span>
                <span className="text-slate-500 text-xs">
                  Display Wi-Fi auto-connect details on your customer landing page.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#087BEE]"></div>
              </label>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Network Name (SSID) *
              </label>
              <input
                type="text"
                required
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="e.g. CafeAroma_Guest"
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Wi-Fi Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password or leave empty for open"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] pr-10 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Security Encryption</label>
              <select
                value={encryption}
                onChange={(e) => setEncryption(e.target.value as WifiEncryption)}
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] bg-white"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Most Common)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Connection Instructions</label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Scan the QR code to auto-connect or enter credentials manually."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white font-bold shadow hover:shadow-md transition-all"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Wi-Fi Details
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview Card: 5 columns */}
        <div className="md:col-span-5 space-y-4">
          <div className="printable-card bg-gradient-to-b from-slate-900 via-[#071321] to-[#0d2a4d] text-white p-6 rounded-3xl border border-slate-800 shadow-lg text-center space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">
                {currentBusiness?.name || 'Cafe Aroma'}
              </span>
              <h4 className="text-lg font-black tracking-tight text-white flex items-center justify-center gap-1.5">
                <Wifi className="w-4 h-4 text-cyan-400" /> Free Guest Wi-Fi
              </h4>
            </div>

            {/* Live Wi-Fi QR Code */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto">
              <QRCodeSVG
                value={wifiQrString}
                size={170}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-mono text-cyan-300 font-bold">SSID: {ssid}</p>
              {password && (
                <div className="flex items-center justify-center gap-2 text-slate-300 font-mono text-[11px]">
                  <span>Pass: {password}</span>
                  <button
                    onClick={handleCopyPassword}
                    className="hover:text-white"
                    title="Copy Password"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400">
              Scan with your smartphone camera to connect instantly without typing credentials.
            </p>

            <button
              onClick={handlePrint}
              className="no-print mt-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-2"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-300" /> Print Wi-Fi Table Sign
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

