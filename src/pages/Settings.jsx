import { motion } from 'framer-motion'
import {
  Accessibility,
  Bell,
  CheckCircle2,
  Database,
  Download,
  Eye,
  Globe,
  Lock,
  MapPin,
  MessageSquare,
  Moon,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  Shield,
  Smartphone,
  Sun,
  Volume2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const SETTINGS_KEY = 'voicebridge-user-settings'

const INDORE_WARDS = [
  'Ward 34 - Palasia & 56 Dukan',
  'Ward 24 - Rajwada & Sarafa',
  'Ward 38 - Vijay Nagar & Scheme 54',
  'Ward 45 - Bhawarkua & Bhanwarkuan',
  'Ward 58 - Annapurna & Sudama Nagar',
  'Ward 84 - Rau & Silicon City',
  'Ward 12 - Malharganj & Bada Ganpati',
]

export default function Settings() {
  const { language, setLanguage, languages, t } = useLanguage()

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      smsAlerts: true,
      whatsappAlerts: true,
      municipalNotices: true,
      emailDigest: false,
      voiceFeedback: true,
      autoGps: true,
      defaultWard: 'Ward 34 - Palasia & 56 Dukan',
      highContrast: false,
      largeText: false,
      anonymousReporting: false,
    }
  })

  const [savedBanner, setSavedBanner] = useState('')

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSavedBanner('Preferences successfully saved!')
    setTimeout(() => setSavedBanner(''), 3000)
  }

  const exportGrievances = () => {
    try {
      const stored = localStorage.getItem('voicebridge-grievances') || '[]'
      const blob = new Blob([stored], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `voicebridge-indore-grievances-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Could not export data at this time.')
    }
  }

  const resetAllData = () => {
    if (window.confirm('Reset all offline preferences and demo session data?')) {
      localStorage.removeItem(SETTINGS_KEY)
      localStorage.removeItem('voicebridge-notifications')
      window.location.reload()
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-3xl space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-[#5227eb] shadow-md shadow-violet-200/50">
          <SettingsIcon className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5227eb]">
            Citizen Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1115]">
            {t('settings')} & Controls
          </h1>
        </div>
      </div>

      {savedBanner && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800 border border-emerald-200 flex items-center gap-2"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          {savedBanner}
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Language & Speech */}
        <div className="rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[#5227eb] mb-4">
            <Globe className="h-5 w-5" />
            <h2 className="text-base font-extrabold text-[#0f1115]">
              Language & Regional Dialect
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Portal Language / भाषा
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-[#5227eb] focus:ring-4 focus:ring-violet-50"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports standard languages and regional dialects like Malvi (Indore), Bhojpuri, and Marwari.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-800">Voice Assistant Speech Output</p>
                <p className="text-xs text-slate-500">Read AI grievance solutions aloud</p>
              </div>
              <button
                type="button"
                onClick={() => toggle('voiceFeedback')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  settings.voiceFeedback ? 'bg-[#5227eb]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ml-0.5 ${
                    settings.voiceFeedback ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Notification Channels */}
        <div className="rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[#5227eb] mb-4">
            <Bell className="h-5 w-5" />
            <h2 className="text-base font-extrabold text-[#0f1115]">
              Alert & Notification Channels
            </h2>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-bold text-slate-800">SMS Grievance Updates</p>
                  <p className="text-xs text-slate-500">Receive SMS when IMC takes action</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('smsAlerts')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  settings.smsAlerts ? 'bg-[#5227eb]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ml-0.5 ${
                    settings.smsAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="font-bold text-slate-800">WhatsApp Notification Alerts</p>
                  <p className="text-xs text-slate-500">Direct updates from Indore Municipal Bot</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('whatsappAlerts')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  settings.whatsappAlerts ? 'bg-[#5227eb]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ml-0.5 ${
                    settings.whatsappAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-bold text-slate-800">Indore Ward Broadcasts</p>
                  <p className="text-xs text-slate-500">Sanitation, water pipeline, and road works alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggle('municipalNotices')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  settings.municipalNotices ? 'bg-[#5227eb]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ml-0.5 ${
                    settings.municipalNotices ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Location & Ward Defaults */}
        <div className="rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[#5227eb] mb-4">
            <MapPin className="h-5 w-5" />
            <h2 className="text-base font-extrabold text-[#0f1115]">
              Indore Location & Ward Settings
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Default Municipal Ward
              </label>
              <select
                value={settings.defaultWard}
                onChange={(e) => setSettings({ ...settings, defaultWard: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#5227eb]"
              >
                {INDORE_WARDS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Auto-Detect GPS for Complaints</p>
                <p className="text-xs text-slate-500">Attach precise coordinates automatically</p>
              </div>
              <button
                type="button"
                onClick={() => toggle('autoGps')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  settings.autoGps ? 'bg-[#5227eb]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ml-0.5 ${
                    settings.autoGps ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 4. Accessibility & Display */}
        <div className="rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[#5227eb] mb-4">
            <Accessibility className="h-5 w-5" />
            <h2 className="text-base font-extrabold text-[#0f1115]">
              Accessibility & Senior Citizen Mode
            </h2>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-bold text-slate-800">High Contrast Mode</p>
                <p className="text-xs text-slate-500">Enhanced text sharpness for elderly citizens</p>
              </div>
              <button
                type="button"
                onClick={() => toggle('highContrast')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  settings.highContrast ? 'bg-[#5227eb]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ml-0.5 ${
                    settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-bold text-slate-800">Larger Text Display</p>
                <p className="text-xs text-slate-500">Increase reading font size</p>
              </div>
              <button
                type="button"
                onClick={() => toggle('largeText')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  settings.largeText ? 'bg-[#5227eb]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform mt-0.5 ml-0.5 ${
                    settings.largeText ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 5. Data Export & Reset */}
        <div className="rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[#5227eb] mb-4">
            <Database className="h-5 w-5" />
            <h2 className="text-base font-extrabold text-[#0f1115]">
              Data Privacy & Local Backup
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={exportGrievances}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 shadow-sm hover:border-[#5227eb] hover:text-[#5227eb] transition"
            >
              <Download className="h-4 w-4" /> Export Grievance History (JSON)
            </button>
            <button
              type="button"
              onClick={resetAllData}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/50 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-100 transition"
            >
              <RefreshCw className="h-4 w-4" /> Reset Offline Cache
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5227eb] py-4 text-sm font-extrabold text-white shadow-xl shadow-violet-300/40 hover:bg-violet-700 transition"
        >
          <Save className="h-4 w-4" /> Save All Preferences
        </button>
      </form>
    </motion.section>
  )
}
