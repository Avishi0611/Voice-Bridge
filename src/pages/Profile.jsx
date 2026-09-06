import { motion, AnimatePresence } from 'framer-motion'
import {
  Award,
  CheckCircle2,
  Copy,
  Edit3,
  Fingerprint,
  IdCard,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

const INDORE_WARDS = [
  'Ward 34 - Palasia & 56 Dukan',
  'Ward 24 - Rajwada & Sarafa',
  'Ward 38 - Vijay Nagar & Scheme 54',
  'Ward 45 - Bhawarkua & Bhanwarkuan',
  'Ward 58 - Annapurna & Sudama Nagar',
  'Ward 84 - Rau & Silicon City',
  'Ward 12 - Malharganj & Bada Ganpati',
  'Ward 67 - Bengali Square & Kanadia',
]

const STORAGE_KEY = 'voicebridge-citizen-profile'

export default function Profile() {
  const { t } = useLanguage()

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      name: 'Hariom Tavar',
      phone: '9753560707',
      email: 'hariom.indore@voicebridge.in',
      ward: 'Ward 34 - Palasia & 56 Dukan',
      address: 'Near Old Palasia, Indore, MP 452001',
      aadhaar: '5482 9104 3829',
      isAadhaarVerified: true,
      memberSince: 'January 2026',
      civicScore: 185,
      resolvedCount: 6,
    }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [aadhaarInput, setAadhaarInput] = useState(profile.aadhaar || '')
  const [otpStep, setOtpStep] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [otpError, setOtpError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const handleSave = (e) => {
    e.preventDefault()
    setProfile(formData)
    setIsEditing(false)
    setSaveSuccess('Profile details updated successfully!')
    setTimeout(() => setSaveSuccess(''), 3000)
  }

  const handleSendOtp = () => {
    const raw = aadhaarInput.replace(/\s+/g, '')
    if (raw.length !== 12 || !/^\d+$/.test(raw)) {
      setOtpError('Please enter a valid 12-digit Aadhaar number.')
      return
    }
    setOtpError('')
    setOtpStep(true)
  }

  const handleVerifyOtp = () => {
    if (otpValue.trim() === '123456' || otpValue.trim().length === 6) {
      setProfile((prev) => ({
        ...prev,
        aadhaar: aadhaarInput,
        isAadhaarVerified: true,
      }))
      setOtpStep(false)
      setOtpValue('')
      setSaveSuccess('Aadhaar verified successfully with UIDAI!')
      setTimeout(() => setSaveSuccess(''), 3500)
    } else {
      setOtpError('Invalid OTP. Use demo OTP: 123456')
    }
  }

  const handleUnlinkAadhaar = () => {
    if (window.confirm('Are you sure you want to unlink your Aadhaar from VoiceBridge?')) {
      setProfile((prev) => ({
        ...prev,
        isAadhaarVerified: false,
        aadhaar: '',
      }))
      setAadhaarInput('')
    }
  }

  const maskAadhaar = (num) => {
    const cleaned = (num || '').replace(/\s+/g, '')
    if (cleaned.length < 12) return cleaned
    return `XXXX XXXX ${cleaned.slice(8)}`
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-4xl space-y-8"
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-extrabold text-[#5227eb]">
              Citizen Credentials
            </span>
            {profile.isAadhaarVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800 border border-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> UIDAI Verified
              </span>
            )}
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#0f1115]">
            Citizen Profile & Identity
          </h1>
          <p className="text-slate-600 text-sm">
            Manage your verified digital civic identity and Indore municipal ward details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData(profile)
            setIsEditing(!isEditing)
          }}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:border-[#5227eb] hover:text-[#5227eb] transition"
        >
          <Edit3 className="h-4 w-4" />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800 border border-emerald-200 flex items-center gap-2"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          {saveSuccess}
        </motion.div>
      )}

      {/* Profile & Aadhaar Card Display */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* User Card */}
        <div className="rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#5227eb] to-violet-400 text-2xl font-black text-white shadow-xl shadow-violet-300/50">
              {profile.name.charAt(0)}
              {profile.isAadhaarVerified && (
                <span
                  title="UIDAI Verified"
                  className="absolute -bottom-1 -right-1 rounded-full bg-emerald-500 p-1.5 text-white ring-4 ring-white"
                >
                  <ShieldCheck className="h-4 w-4" />
                </span>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#0f1115]">{profile.name}</h2>
              <p className="text-sm font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-[#5227eb]" /> {profile.ward}
              </p>
              <span className="inline-block mt-2 rounded-lg bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-[#5227eb]">
                Civic Score: {profile.civicScore} pts • {profile.resolvedCount} Resolved Grievances
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            {!isEditing ? (
              <dl className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <dt className="text-xs font-bold uppercase text-slate-400">Phone Number</dt>
                  <dd className="mt-1 font-semibold text-slate-800 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" /> +91 {profile.phone}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase text-slate-400">Email Address</dt>
                  <dd className="mt-1 font-semibold text-slate-800 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" /> {profile.email}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-bold uppercase text-slate-400">Indore Municipal Ward</dt>
                  <dd className="mt-1 font-semibold text-slate-800">{profile.ward}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-bold uppercase text-slate-400">Residential Address</dt>
                  <dd className="mt-1 font-semibold text-slate-800">{profile.address}</dd>
                </div>
              </dl>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#5227eb]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">Mobile (10 digits)</label>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#5227eb]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#5227eb]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Indore Ward Zone</label>
                  <select
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#5227eb] bg-white font-medium"
                  >
                    {INDORE_WARDS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700">Full Address</label>
                  <input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#5227eb]"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#5227eb] py-3 text-sm font-bold text-white shadow-lg shadow-violet-300/40 hover:bg-violet-700"
                >
                  <Save className="h-4 w-4" /> Save Profile Changes
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Digital Aadhaar Card Preview & Verification */}
        <div className="space-y-6">
          {profile.isAadhaarVerified ? (
            /* Digital Aadhaar Card UI */
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ffffff] via-[#fffbf2] to-[#fff3e0] p-6 shadow-2xl shadow-amber-900/10 border border-amber-200/80"
            >
              {/* Top Bar with National Emblem simulation */}
              <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d9251c] text-white font-black text-xs">
                    IND
                  </span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#d9251c]">
                      Government of India • भारत सरकार
                    </p>
                    <p className="text-[9px] font-bold text-slate-500">
                      Unique Identification Authority of India (UIDAI)
                    </p>
                  </div>
                </div>
                <Fingerprint className="h-7 w-7 text-amber-600" />
              </div>

              {/* Card Body */}
              <div className="mt-4 flex gap-4 items-center">
                <div className="flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-amber-100 border border-amber-300 text-amber-800 font-extrabold text-xs">
                  <User className="h-7 w-7" />
                  <span className="text-[8px] uppercase font-bold mt-1">Photo</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-900">{profile.name}</p>
                  <p className="text-[11px] font-bold text-slate-600">
                    Gender / लिंग: <span className="font-normal text-slate-800">Male / पुरूष</span>
                  </p>
                  <p className="text-[11px] font-bold text-slate-600">
                    Area: <span className="font-normal text-slate-800">Indore, Madhya Pradesh</span>
                  </p>
                  <p className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                    ✓ Verified via UIDAI e-KYC
                  </p>
                </div>
              </div>

              {/* Masked Aadhaar Number */}
              <div className="mt-5 rounded-2xl bg-amber-500/10 p-3 text-center border border-amber-300/50">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-900">
                  Aadhaar Number / आधार संख्या
                </p>
                <p className="mt-1 font-mono text-xl font-black tracking-widest text-[#0f1115]">
                  {maskAadhaar(profile.aadhaar)}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 flex items-center justify-between pt-2 text-[10px] text-slate-500">
                <span>मेरा आधार, मेरी पहचान</span>
                <button
                  type="button"
                  onClick={handleUnlinkAadhaar}
                  className="text-red-600 font-bold hover:underline"
                >
                  Unlink Aadhaar
                </button>
              </div>

              {/* Holographic Watermark */}
              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />
            </motion.div>
          ) : (
            /* Aadhaar Link / Verification Box */
            <div className="rounded-3xl border border-violet-200 bg-violet-50/50 p-6 sm:p-7 shadow-lg shadow-violet-200/20">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#5227eb] p-3 text-white">
                  <Fingerprint className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0f1115]">Link Your Aadhaar</h3>
                  <p className="text-xs text-slate-600">
                    Verify with your 12-digit Aadhaar to receive instant updates on IMC complaints.
                  </p>
                </div>
              </div>

              {!otpStep ? (
                <div className="mt-5 space-y-3">
                  <label className="block text-xs font-bold text-slate-700">
                    12-Digit Aadhaar Number
                  </label>
                  <input
                    value={aadhaarInput}
                    onChange={(e) => setAadhaarInput(e.target.value)}
                    placeholder="Enter 12 digit Aadhaar number"
                    maxLength={14}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono font-bold text-slate-900 outline-none focus:border-[#5227eb] focus:ring-4 focus:ring-violet-100"
                  />
                  {otpError && <p className="text-xs font-bold text-red-600">{otpError}</p>}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full rounded-xl bg-[#5227eb] py-3 text-sm font-bold text-white shadow-md hover:bg-violet-700 transition"
                  >
                    Send Verification OTP
                  </button>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  <div className="rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800 border border-amber-200">
                    OTP sent to Aadhaar-linked mobile. (Demo OTP: <strong>123456</strong>)
                  </div>
                  <input
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="Enter 6-digit OTP (123456)"
                    maxLength={6}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center font-mono text-lg font-extrabold tracking-widest text-slate-900 outline-none focus:border-[#5227eb]"
                  />
                  {otpError && <p className="text-xs font-bold text-red-600">{otpError}</p>}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="w-1/3 rounded-xl border border-slate-300 py-3 text-xs font-bold text-slate-600 hover:bg-white"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="w-2/3 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700"
                    >
                      Verify & Link Aadhaar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Civic Badges */}
          <div className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4">
              Indore Civic Badges Earned
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-2xl bg-amber-50 p-3 border border-amber-200">
                <Award className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-amber-950">Swachhata Citizen</p>
                  <p className="text-[10px] text-amber-700">Top Indore Contributor</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-2xl bg-violet-50 p-3 border border-violet-200">
                <Sparkles className="h-5 w-5 text-[#5227eb]" />
                <div>
                  <p className="text-xs font-bold text-[#0f1115]">Voice Pioneer</p>
                  <p className="text-[10px] text-slate-500">Multilingual Reporter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
