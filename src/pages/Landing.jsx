import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  CheckCircle2,
  FileImage,
  FileText,
  Fingerprint,
  Globe2,
  MapPin,
  Mic,
  Mic2,
  Pause,
  Play,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Truck,
  Users,
  Volume2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { LanguageSelector, useLanguage } from '../i18n/LanguageContext'

const features = [
  {
    title: 'Voice & Dialect Grievance Engine',
    description: 'Speak freely in Malvi, Hindi, Marathi, Bhojpuri or 15+ Indian dialects with real-time phoneme transcription.',
    icon: Mic2,
    gradient: 'from-blue-500/10 to-indigo-500/10',
    border: 'border-blue-200/60',
  },
  {
    title: 'Gemini 3.6 Flash Neural Analysis',
    description: 'Instantly classifies Indore municipal department, extracts exact GPS wards, calculates severity, and writes official work orders.',
    icon: Sparkles,
    gradient: 'from-violet-500/10 to-purple-500/10',
    border: 'border-violet-200/60',
  },
  {
    title: 'Aadhaar UIDAI Citizen Trust',
    description: 'Citizen verified submissions prevent spam, safeguard privacy, and enable official government resolution certificates.',
    icon: Fingerprint,
    gradient: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-200/60',
  },
  {
    title: 'Indore Ward 1 to 85 Geotagging',
    description: 'GPS coordinates auto-map complaints to Rajwada, Palasia, Vijay Nagar, Sarafa, or 85 municipal zones for rapid dispatch.',
    icon: MapPin,
    gradient: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-200/60',
  },
  {
    title: 'Live IMC Field Telemetry',
    description: 'Track Indore Municipal Corporation (IMC) tippers, jetting machines, and repair crews in real-time from your portal.',
    icon: Truck,
    gradient: 'from-rose-500/10 to-pink-500/10',
    border: 'border-rose-200/60',
  },
  {
    title: 'Verified Resolution & Citizen Rating',
    description: 'Complaints cannot be marked resolved without geotagged photo proof and direct citizen confirmation and feedback.',
    icon: ShieldCheck,
    gradient: 'from-cyan-500/10 to-sky-500/10',
    border: 'border-cyan-200/60',
  },
]

const stepsData = [
  {
    id: 1,
    title: 'Aadhaar Identity',
    short: 'UIDAI Verify',
    icon: Fingerprint,
    tag: 'Step 1 • Citizen Auth',
    heading: 'Instant Aadhaar Biometric Verification',
    description:
      'Ensures every grievance is authenticated by an authentic resident of Indore. Eliminates fake bot spam while ensuring full privacy encryption.',
    badge: '12-Digit UIDAI Verified',
    previewType: 'aadhaar',
  },
  {
    id: 2,
    title: 'Voice & Dialects',
    short: 'Speak Issue',
    icon: Mic,
    tag: 'Step 2 • Voice Input',
    heading: 'Speak Naturally in Malvi, Hindi or English',
    description:
      'Tap the microphone and speak just like you would to a neighbor. Our dialect-aware speech engine supports Malvi, Nimadi, Bundeli, and 15+ Indian languages.',
    badge: 'Real-time Waveform Engine',
    previewType: 'voice',
  },
  {
    id: 3,
    title: 'Gemini AI Structuring',
    short: 'AI Classification',
    icon: Sparkles,
    tag: 'Step 3 • Neural Core',
    heading: 'Gemini 3.6 Flash Auto-Categorization',
    description:
      'Raw conversational speech is parsed into an official municipal work order: Department assigned, severity level scored, and actionable summary generated.',
    badge: 'Gemini 3.6 Flash Powered',
    previewType: 'gemini',
  },
  {
    id: 4,
    title: 'IMC Ward Routing',
    short: 'Auto Dispatch',
    icon: Building2,
    tag: 'Step 4 • Municipal Routing',
    heading: 'Automated Indore Ward Routing & SLA',
    description:
      'The complaint is immediately routed to the designated Ward Officer (e.g. Ward 44 - Rajwada). SLA countdown timer activates automatically.',
    badge: 'Indore 85 Wards Integrated',
    previewType: 'dispatch',
  },
  {
    id: 5,
    title: 'On-Ground Action',
    short: 'Field Crew',
    icon: Truck,
    tag: 'Step 5 • Field Ops',
    heading: 'IMC Rapid Response Crew Deployed',
    description:
      'Municipal workers, Swachhata tippers, or PWD road maintenance teams are dispatched with exact GPS coordinates and citizen photo evidence.',
    badge: 'GPS Monitored Dispatch',
    previewType: 'field',
  },
  {
    id: 6,
    title: 'Verified Resolution',
    short: 'Citizen Close',
    icon: CheckCircle2,
    tag: 'Step 6 • Public Closure',
    heading: 'Photo Proof & Citizen Sign-Off',
    description:
      'Work is only marked closed after an after-repair photo is uploaded and the citizen gives their rating. Indore keeps its 7x Swachh crown!',
    badge: 'Citizen Verified Closure',
    previewType: 'closure',
  },
]

const demoSamples = [
  {
    label: 'Malvi / Hindi Voice',
    text: 'राजवाड़ा चौक के पास कचरा पेटी भर गई है और सारा कचरा सड़क पर बिखर गया है, तुरंत गाड़ी भेजो।',
    dept: 'Swachh Indore / Solid Waste',
    ward: 'Ward 44 (Rajwada)',
    urgency: 'High (Hygiene Alert)',
    time: '2 mins ago',
  },
  {
    label: 'English / Hinglish',
    text: 'Deep pothole on Vijay Nagar service road near Scheme 54. Two-wheelers are skidding in the dark.',
    dept: 'Public Works Department (PWD)',
    ward: 'Ward 54 (Vijay Nagar)',
    urgency: 'Medium (Traffic Safety)',
    time: '8 mins ago',
  },
  {
    label: 'Water Works / Narmada',
    text: '56 दुकान के पीछे पीने के पानी की मुख्य पाइपलाइन फूट गई है, बहुत पानी बह रहा है।',
    dept: 'Narmada Jal Praday Vibhag',
    ward: 'Ward 31 (Chhappan Dukan)',
    urgency: 'High (Resource Loss)',
    time: '14 mins ago',
  },
]

function Landing() {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [activeSampleIndex, setActiveSampleIndex] = useState(0)

  // Step auto-rotation
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stepsData.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const currentStep = stepsData[activeStep]

  return (
    <div className="min-h-screen overflow-hidden bg-[#f4f5f8] text-[#0f1115] selection:bg-violet-500 selection:text-white">
      {/* Live Municipal Dispatch Ticker */}
      <div className="bg-[#0f1115] text-xs font-semibold text-slate-300 py-2 border-b border-slate-800 overflow-hidden">
        <div className="flex items-center gap-6 animate-pulse whitespace-nowrap px-4">
          <span className="flex items-center gap-1.5 font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE IMC PULSE:
          </span>
          <span>🟢 Ward 44 (Rajwada): Swachhata tipper dispatched (8:00 AM)</span>
          <span className="text-slate-600">•</span>
          <span>🟢 Ward 54 (Vijay Nagar): Service road pothole repaired & sealed</span>
          <span className="text-slate-600">•</span>
          <span>🟢 Ward 22 (Palasia): 3 streetlights restored to 70W LED</span>
          <span className="text-slate-600">•</span>
          <span>🟢 Ward 31 (Chhappan Dukan): Narmada water valve inspected</span>
          <span className="text-slate-600">•</span>
          <span>⚡ Swachh Indore 7-Time Champion • 100% Ward Coverage</span>
        </div>
      </div>

      {/* Top Floating Glass Header */}
      <header className="sticky top-3 z-40 mx-3 rounded-2xl border border-white/80 bg-white/85 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:mx-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <Logo size="md" to="/" subtitle={true} />

          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
            <a href="#features" className="hover:text-[#5227eb] transition">
              {t('navFeatures')}
            </a>
            <a href="#how-it-works" className="hover:text-[#5227eb] transition flex items-center gap-1.5">
              <span>{t('navHow')}</span>
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-extrabold text-[#5227eb]">Interactive</span>
            </a>
            <a href="#simulator" className="hover:text-[#5227eb] transition">
              AI Simulator
            </a>
            <Link to="/insights" className="hover:text-[#5227eb] transition">
              {t('navInsights')}
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <LanguageSelector />
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-violet-50 hover:text-[#5227eb] transition"
            >
              {t('login')}
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-[#5227eb] to-[#7c4dff] px-5 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-violet-400/30 hover:-translate-y-0.5 hover:shadow-violet-400/50 transition"
            >
              {t('getStarted')}
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-4 py-1.5 text-xs font-bold text-[#5227eb] shadow-sm">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>India's Cleanest City • Swachh Survekshan #1</span>
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.04] tracking-[-0.035em] text-[#0f1115]">
              Speak your issue.{' '}
              <span className="bg-gradient-to-r from-[#5227eb] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">
                Watch Indore resolve it.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-8 text-slate-600 font-medium">
              Empowering 3.5M Indore citizens to speak in Hindi, Malvi, or their native dialect. Gemini AI listens, categorizes, and dispatches directly to the Indore Municipal Corporation (IMC) Ward Engineer.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/complaints/new"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5227eb] to-[#6835f0] px-7 py-4 font-extrabold text-white shadow-xl shadow-violet-500/30 hover:-translate-y-0.5 hover:shadow-violet-500/50 transition"
              >
                <span>Report Grievance by Voice</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 font-bold text-slate-700 hover:border-violet-300 hover:text-[#5227eb] shadow-sm transition"
              >
                Explore 6-Step Flow
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-6 text-xs text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>UIDAI Aadhaar Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[#5227eb]" />
                <span>15+ Indian Dialects</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-600" />
                <span>85 IMC Wards Active</span>
              </div>
            </div>
          </motion.div>

          {/* Interactive Hero Widget Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-[32px] border border-white/90 bg-white/80 p-6 sm:p-8 shadow-2xl shadow-violet-900/10 backdrop-blur-2xl">
              {/* Header inside widget */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-violet-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    LIVE AI COMPLAINT SYNTHESIZER
                  </span>
                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    Voice to Municipal Dispatch
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  IMC Online
                </span>
              </div>

              {/* Simulated Voice Waveform */}
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Mic className="h-4 w-4 text-rose-400 animate-pulse" />
                    <span>Listening in Malvi / Hindi...</span>
                  </div>
                  <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-extrabold text-rose-300">
                    REC 00:04
                  </span>
                </div>

                {/* Animated Waveform Equalizer */}
                <div className="flex items-center justify-between gap-1 h-12 px-2 py-1 bg-white/5 rounded-xl border border-white/10">
                  {[20, 45, 80, 60, 95, 40, 75, 90, 55, 30, 85, 65, 40, 90, 70, 35, 60, 95, 50, 25].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 rounded-full bg-gradient-to-t from-violet-400 via-pink-400 to-amber-300"
                      animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.3}%`] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
                    />
                  ))}
                </div>

                <p className="mt-3 text-xs text-slate-300 italic">
                  "राजवाड़ा चौक के पास कचरा पेटी भर गई है, तुरंत गाड़ी भेजो..."
                </p>
              </div>

              {/* AI Real-time Classification Output */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Auto Department</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-800">Swachhata / Waste Mgmt</p>
                  <p className="text-[11px] font-medium text-emerald-600 mt-0.5">Assigned to Ward 44 Officer</p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolution SLA</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-800">&lt; 12 Hours Target</p>
                  <p className="text-[11px] font-medium text-violet-600 mt-0.5">Tipper Van #28 Route Enqueued</p>
                </div>
              </div>

              {/* Indore Municipal Stamp */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-violet-50/80 px-4 py-2.5 border border-violet-200/60 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#5227eb]">
                  <Building2 className="h-4 w-4" />
                  <span>Indore Municipal Corporation (IMC) Gateway</span>
                </div>
                <span className="font-extrabold text-slate-700">Ref: VB-2026-1001</span>
              </div>
            </div>

            {/* Ambient Lighting Orbs */}
            <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl -z-10" />
            <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-pink-500/15 blur-3xl -z-10" />
          </motion.div>
        </section>

        {/* Stats Strip */}
        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: '7x', title: 'Swachh Survekshan', sub: 'Cleanest Indian City Record' },
              { num: '85', title: 'Indore Wards', sub: '100% Ward Engineer Coverage' },
              { num: '17+', title: 'Dialects & Languages', sub: 'Malvi, Hindi, Marathi & more' },
              { num: '2.4 hrs', title: 'Average Resolution', sub: 'High-priority grievance action' },
            ].map((stat) => (
              <div
                key={stat.title}
                className="group relative overflow-hidden rounded-3xl border border-white/90 bg-white/70 p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-200"
              >
                <p className="text-4xl font-black text-[#5227eb] tracking-tight">{stat.num}</p>
                <p className="mt-2 text-base font-extrabold text-slate-900">{stat.title}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive 6-Step Visual Engine (Replacing media_1788688902644.png plain boxes) */}
        <section id="how-it-works" className="border-y border-slate-200/80 bg-white/70 py-20 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#5227eb]">
                  <Sparkles className="h-3.5 w-3.5" />
                  INTERACTIVE LIFECYCLE ENGINE
                </span>
                <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#0f1115]">
                  From citizen voice to resolved issue.
                </h2>
                <p className="mt-3 max-w-2xl text-base text-slate-600">
                  Click any stage below to explore how VoiceBridge automates the journey between citizen speech and on-ground municipal action.
                </p>
              </div>

              {/* Autoplay Toggle Control */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-violet-300 hover:text-[#5227eb] transition"
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5 text-amber-500" />
                      <span>Pause Auto-cycle</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Auto-play Flow</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 6 Step Selector Track */}
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {stepsData.map((step, index) => {
                const isActive = activeStep === index
                const StepIcon = step.icon
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      setActiveStep(index)
                      setIsAutoPlaying(false)
                    }}
                    className={`relative flex flex-col items-center rounded-3xl p-5 text-center transition-all duration-300 ${
                      isActive
                        ? 'bg-white shadow-xl shadow-violet-900/10 border-2 border-[#5227eb] scale-[1.03] -translate-y-1'
                        : 'bg-white/60 border border-slate-200/80 hover:bg-white hover:border-violet-200 text-slate-600'
                    }`}
                  >
                    {/* Top Step Number Badge */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black transition ${
                        isActive
                          ? 'bg-gradient-to-tr from-[#5227eb] to-[#7c4dff] text-white shadow-md shadow-violet-400/50'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </div>

                    <span className="mt-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      Step 0{index + 1}
                    </span>
                    <h3 className={`mt-1 text-xs font-extrabold leading-tight ${isActive ? 'text-[#0f1115]' : 'text-slate-700'}`}>
                      {step.title}
                    </h3>

                    {/* Active Bottom Glow Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeStepIndicator"
                        className="absolute -bottom-1 h-1.5 w-12 rounded-full bg-[#5227eb]"
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Active Step Deep Visual Stage */}
            <div className="mt-8 overflow-hidden rounded-[36px] border border-white/90 bg-white p-6 sm:p-10 shadow-2xl shadow-slate-900/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]"
                >
                  {/* Left Explanation Column */}
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3.5 py-1 text-xs font-extrabold text-[#5227eb] border border-violet-200">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{currentStep.tag}</span>
                    </div>

                    <h3 className="mt-4 text-2xl sm:text-4xl font-black tracking-tight text-[#0f1115]">
                      {currentStep.heading}
                    </h3>

                    <p className="mt-4 text-base leading-7 text-slate-600">
                      {currentStep.description}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <span className="rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-extrabold text-slate-700 border border-slate-200">
                        {currentStep.badge}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveStep((activeStep + 1) % stepsData.length)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5227eb] hover:underline"
                      >
                        Next Step ({((activeStep + 1) % stepsData.length) + 1}/6) <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Visual Simulation Canvas */}
                  <div className="relative rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-violet-50/40 p-6 shadow-inner">
                    {/* Visual Card based on previewType */}
                    {currentStep.previewType === 'aadhaar' && (
                      <div className="rounded-2xl border border-white bg-white p-5 shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
                              <Fingerprint className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-slate-900">UIDAI Citizen Token</p>
                              <p className="text-[10px] text-slate-500">Aadhaar Paperless e-KYC</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800">
                            AUTHENTICATED
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-slate-50">
                            <span className="text-slate-500">Citizen Name:</span>
                            <span className="font-bold text-slate-800">Verified Indore Resident</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-50">
                            <span className="text-slate-500">Masked UID:</span>
                            <span className="font-mono font-bold text-slate-800">XXXX-XXXX-8921</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-500">Jurisdiction:</span>
                            <span className="font-bold text-[#5227eb]">IMC Zone 03 (Rajwada)</span>
                          </div>
                        </div>
                        <div className="rounded-xl bg-emerald-50 p-2.5 text-center text-[11px] font-bold text-emerald-700">
                          ✓ Verified Citizen Identity Active
                        </div>
                      </div>
                    )}

                    {currentStep.previewType === 'voice' && (
                      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
                            <span className="text-xs font-bold text-red-400">Live Voice Transcription</span>
                          </div>
                          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                            Dialect: Malvi (मालवी)
                          </span>
                        </div>
                        <div className="flex items-center gap-1 h-14 bg-white/5 rounded-xl px-3 border border-white/10">
                          {[30, 60, 90, 45, 80, 100, 75, 40, 65, 85, 95, 55, 70, 90, 50, 40, 80].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 bg-gradient-to-t from-violet-500 to-pink-400 rounded-full"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-200 bg-white/10 p-3 rounded-xl border border-white/5 italic">
                          "हमारे मोहल्ले में कचरा गाड़ी दो दिन से नहीं आई है... (Ward #44)"
                        </p>
                      </div>
                    )}

                    {currentStep.previewType === 'gemini' && (
                      <div className="rounded-2xl border border-violet-200 bg-white p-5 shadow-lg space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2 text-[#5227eb]">
                            <Sparkles className="h-5 w-5" />
                            <span className="text-xs font-black">Gemini 3.6 Flash Extraction</span>
                          </div>
                          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-black text-violet-800">
                            Confidence 99.4%
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="rounded-xl bg-violet-50 p-2.5">
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
                            <span className="font-extrabold text-violet-900">Solid Waste Management</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                              <span className="text-slate-500 block text-[10px] uppercase font-bold">Urgency</span>
                              <span className="font-extrabold text-rose-600">High (Hygiene)</span>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-2 border border-slate-100">
                              <span className="text-slate-500 block text-[10px] uppercase font-bold">Ward Mapping</span>
                              <span className="font-extrabold text-slate-800">Ward 44 (Rajwada)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep.previewType === 'dispatch' && (
                      <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-lg space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2 text-amber-600">
                            <Building2 className="h-5 w-5" />
                            <span className="text-xs font-black">IMC Officer Work Order</span>
                          </div>
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black text-amber-800">
                            SLA: 12 HOURS
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800">Assigned Ward Engineer: Er. Mukesh Solanki</p>
                        <p className="text-xs text-slate-600">Zone 03 Sanitation Office, Rajwada Central Hub</p>
                        <div className="rounded-xl bg-amber-50 p-2.5 text-center text-xs font-bold text-amber-800">
                          Automated SMS Notification Sent to Field Unit
                        </div>
                      </div>
                    )}

                    {currentStep.previewType === 'field' && (
                      <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-lg space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2 text-sky-600">
                            <Truck className="h-5 w-5" />
                            <span className="text-xs font-black">Field Crew Live Telemetry</span>
                          </div>
                          <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-black text-sky-800">
                            EN ROUTE
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Vehicle Unit:</span>
                            <span className="font-bold text-slate-800">IMC Swachhata Tipper #28</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">GPS Target:</span>
                            <span className="font-mono font-bold text-slate-800">22.7196° N, 75.8577° E</span>
                          </div>
                        </div>
                        <div className="rounded-xl bg-sky-50 p-2.5 text-center text-xs font-bold text-sky-800">
                          Photo Geotag Verification Initiated
                        </div>
                      </div>
                    )}

                    {currentStep.previewType === 'closure' && (
                      <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-lg space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-xs font-black">Citizen Closure & Certificate</span>
                          </div>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800">
                            RESOLVED
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 py-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="h-6 w-6 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-center text-xs font-bold text-slate-700">
                          5/5 Star Rating Registered by Citizen
                        </p>
                        <div className="rounded-xl bg-emerald-50 p-2.5 text-center text-xs font-black text-emerald-800">
                          Official Resolution Certificate Issued #VB-2026-1001
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Live Interactive Voice Grievance Simulator */}
        <section id="simulator" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="rounded-[36px] border border-white/90 bg-gradient-to-br from-white via-violet-50/30 to-indigo-50/20 p-8 sm:p-12 shadow-2xl shadow-slate-900/10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#5227eb]">
                <Mic2 className="h-4 w-4" />
                HANDS-ON SIMULATION
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#0f1115]">
                Test Voice Intelligence Live
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                Select a sample citizen voice grievance from Indore to observe how Gemini 3.6 Flash processes, structures, and routes it in real-time.
              </p>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
              {/* Sample Selector Buttons */}
              <div className="space-y-3">
                {demoSamples.map((sample, index) => {
                  const isSelected = activeSampleIndex === index
                  return (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => setActiveSampleIndex(index)}
                      className={`w-full text-left rounded-2xl p-4 transition border ${
                        isSelected
                          ? 'border-[#5227eb] bg-white shadow-lg shadow-violet-500/10'
                          : 'border-slate-200/80 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black uppercase text-[#5227eb]">{sample.label}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{sample.time}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 line-clamp-2">{sample.text}</p>
                    </button>
                  )
                })}
              </div>

              {/* Live Simulated AI Inspection Card */}
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#5227eb]" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Gemini 3.6 Flash Municipal Extraction
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                    Live Validated
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Raw Input</span>
                  <p className="mt-1 text-sm font-semibold text-slate-800 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{demoSamples[activeSampleIndex].text}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="rounded-xl border border-slate-100 bg-violet-50/60 p-3">
                    <span className="text-[10px] uppercase font-bold text-violet-700">Assigned Department</span>
                    <p className="mt-1 font-extrabold text-slate-900">{demoSamples[activeSampleIndex].dept}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-amber-50/60 p-3">
                    <span className="text-[10px] uppercase font-bold text-amber-700">Indore Ward</span>
                    <p className="mt-1 font-extrabold text-slate-900">{demoSamples[activeSampleIndex].ward}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-rose-600">Urgency: {demoSamples[activeSampleIndex].urgency}</span>
                  <Link
                    to="/complaints/new"
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#5227eb] hover:underline"
                  >
                    Submit Real Grievance <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#5227eb]">
              EVERYTHING IN ONE PLACE
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#0f1115]">
              Civic participation made effortless.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Designed for everyday citizens, local neighborhoods, and Indore municipal teams.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const FeatureIcon = feature.icon
              return (
                <motion.article
                  key={feature.title}
                  whileHover={{ y: -6 }}
                  className={`rounded-3xl border ${feature.border} bg-white/80 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition`}
                >
                  <div className="inline-flex rounded-2xl bg-violet-50 p-3.5 text-[#5227eb]">
                    <FeatureIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-[#0f1115]">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                </motion.article>
              )
            })}
          </div>
        </section>

        {/* Civic CTA Section */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#0f1115] via-[#161922] to-[#251b3d] px-8 py-16 text-white shadow-2xl shadow-slate-900/25 sm:px-14">
            <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-violet-300">
                  Swachh Indore Digital Cell
                </span>
                <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">
                  Your neighborhood starts with your voice.
                </h2>
                <p className="mt-3 max-w-xl text-sm sm:text-base leading-6 text-slate-300">
                  Report a grievance, verify with your Aadhaar, and help Indore stay the cleanest, smartest city in India.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-black text-[#5227eb] shadow-xl hover:bg-violet-50 transition"
                >
                  Create Account <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/complaints/new"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-4 font-bold text-white hover:bg-white/10 transition"
                >
                  Report Without Login
                </Link>
              </div>
            </div>
            <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#5227eb]/30 blur-3xl" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-200/70 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo size="sm" to="/" subtitle={false} />
          <p className="text-xs">
            VoiceBridge • Powered by Gemini AI • Indore Municipal Corporation (IMC) Civic Gateway
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing

