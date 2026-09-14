import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Fingerprint,
  Globe2,
  MapPin,
  Mic,
  Mic2,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Truck,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { LanguageSelector, useLanguage } from '../i18n/LanguageContext'

function getFeatures(t) {
  return [
    {
      title: t('feat1Title'),
      description: t('feat1Desc'),
      icon: Mic2,
      border: 'border-blue-200/70',
    },
    {
      title: t('feat2Title'),
      description: t('feat2Desc'),
      icon: Sparkles,
      border: 'border-violet-200/70',
    },
    {
      title: t('feat3Title'),
      description: t('feat3Desc'),
      icon: Fingerprint,
      border: 'border-emerald-200/70',
    },
    {
      title: t('feat4Title'),
      description: t('feat4Desc'),
      icon: MapPin,
      border: 'border-amber-200/70',
    },
    {
      title: t('feat5Title'),
      description: t('feat5Desc'),
      icon: Truck,
      border: 'border-rose-200/70',
    },
    {
      title: t('feat6Title'),
      description: t('feat6Desc'),
      icon: ShieldCheck,
      border: 'border-cyan-200/70',
    },
  ]
}

function getStepsData(t) {
  return [
    {
      id: 1,
      title: t('step1Title'),
      icon: Fingerprint,
      tag: t('step1Tag'),
      heading: t('step1Heading'),
      description: t('step1Desc'),
      badge: t('step1Badge'),
      previewType: 'aadhaar',
    },
    {
      id: 2,
      title: t('step2Title'),
      icon: Mic,
      tag: t('step2Tag'),
      heading: t('step2Heading'),
      description: t('step2Desc'),
      badge: t('step2Badge'),
      previewType: 'voice',
    },
    {
      id: 3,
      title: t('step3Title'),
      icon: Sparkles,
      tag: t('step3Tag'),
      heading: t('step3Heading'),
      description: t('step3Desc'),
      badge: t('step3Badge'),
      previewType: 'gemini',
    },
    {
      id: 4,
      title: t('step4Title'),
      icon: Building2,
      tag: t('step4Tag'),
      heading: t('step4Heading'),
      description: t('step4Desc'),
      badge: t('step4Badge'),
      previewType: 'dispatch',
    },
    {
      id: 5,
      title: t('step5Title'),
      icon: Truck,
      tag: t('step5Tag'),
      heading: t('step5Heading'),
      description: t('step5Desc'),
      badge: t('step5Badge'),
      previewType: 'field',
    },
    {
      id: 6,
      title: t('step6Title'),
      icon: CheckCircle2,
      tag: t('step6Tag'),
      heading: t('step6Heading'),
      description: t('step6Desc'),
      badge: t('step6Badge'),
      previewType: 'closure',
    },
  ]
}

function getDemoSamples(t) {
  return [
    {
      label: 'Malvi / Hindi Voice',
      text: 'राजवाड़ा चौक के पास कचरा पेटी भर गई है और सारा कचरा सड़क पर बिखर गया है, तुरंत गाड़ी भेजो।',
      dept: t('synthWasteMgmt'),
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
}

function Landing() {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [activeSampleIndex, setActiveSampleIndex] = useState(0)

  const stepsData = getStepsData(t)
  const features = getFeatures(t)
  const demoSamples = getDemoSamples(t)

  // Step auto-rotation
  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stepsData.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [isAutoPlaying, stepsData.length])

  const currentStep = stepsData[activeStep] || stepsData[0]

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f4f5f8] text-[#0f1115] selection:bg-violet-500 selection:text-white">
      {/* Live Municipal Dispatch Ticker */}
      <div className="bg-[#0f1115] text-xs font-semibold text-slate-300 py-2.5 border-b border-slate-800 overflow-hidden">
        <div className="flex items-center gap-6 whitespace-nowrap px-4">
          <span className="flex items-center gap-1.5 font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            {t('liveImcPulse')}:
          </span>
          <span>🟢 {t('tickerRajwada')}</span>
          <span className="text-slate-600">•</span>
          <span>🟢 {t('tickerVijayNagar')}</span>
          <span className="text-slate-600">•</span>
          <span>🟢 {t('tickerPalasia')}</span>
          <span className="text-slate-600">•</span>
          <span>🟢 {t('tickerChhappan')}</span>
          <span className="text-slate-600">•</span>
          <span>⚡ {t('tickerSwachhRecord')}</span>
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
            <a href="#how-it-works" className="hover:text-[#5227eb] transition">
              {t('navHow')}
            </a>
            <a href="#simulator" className="hover:text-[#5227eb] transition">
              {t('navSimulator')}
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
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-4 py-1.5 text-xs font-bold text-[#5227eb] shadow-sm">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>{t('heroCleanestCity')}</span>
            </div>

            <h1 className="mt-6 max-w-2xl text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.04] tracking-[-0.035em] text-[#0f1115]">
              {t('heroTitle1')}{' '}
              <span className="bg-gradient-to-r from-[#5227eb] via-[#7928ca] to-[#ff0080] bg-clip-text text-transparent">
                {t('heroTitle2')}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg leading-8 text-slate-600 font-medium">
              {t('heroDescLong')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/complaints/new"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5227eb] to-[#6835f0] px-7 py-4 font-extrabold text-white shadow-xl shadow-violet-500/30 hover:-translate-y-0.5 hover:shadow-violet-500/50 transition"
              >
                <span>{t('reportByVoice')}</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 font-bold text-slate-700 hover:border-violet-300 hover:text-[#5227eb] shadow-sm transition"
              >
                {t('exploreFlow')}
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-6 text-xs text-slate-500 font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>{t('uidaiVerifiedBadge')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-[#5227eb]" />
                <span>{t('dialectsBadge')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-600" />
                <span>{t('wardsActiveBadge')}</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Live Synthesizer Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-[32px] border border-white/90 bg-white/80 p-6 sm:p-8 shadow-2xl shadow-violet-900/10 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-violet-600">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t('synthTag')}
                  </span>
                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    {t('synthTitle')}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  {t('synthOnline')}
                </span>
              </div>

              {/* Simulated Voice Waveform */}
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 text-white shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Mic className="h-4 w-4 text-rose-400 animate-pulse" />
                    <span>{t('synthListening')}</span>
                  </div>
                  <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-[10px] font-extrabold text-rose-300">
                    REC 00:04
                  </span>
                </div>

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
                  {t('synthSampleQuote')}
                </p>
              </div>

              {/* AI Real-time Classification Output */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('synthAutoDept')}</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-800">{t('synthWasteMgmt')}</p>
                  <p className="text-[11px] font-medium text-emerald-600 mt-0.5">{t('synthAssignedWard')}</p>
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t('synthSlaTitle')}</p>
                  <p className="mt-1 text-sm font-extrabold text-slate-800">{t('synthSlaTarget')}</p>
                  <p className="text-[11px] font-medium text-violet-600 mt-0.5">{t('synthTipperEnqueued')}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-violet-50/80 px-4 py-2.5 border border-violet-200/60 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#5227eb]">
                  <Building2 className="h-4 w-4" />
                  <span>{t('synthGateway')}</span>
                </div>
                <span className="font-extrabold text-slate-700">{t('refIdLabel')}: VB-2026-1001</span>
              </div>
            </div>

            <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl -z-10" />
            <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-pink-500/15 blur-3xl -z-10" />
          </motion.div>
        </section>

        {/* Stats Strip */}
        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: '7x', title: t('statSwachhChampion'), sub: t('statSwachhSub') },
              { num: '85', title: t('statWardsTitle'), sub: t('statWardsSub') },
              { num: '17+', title: t('statDialectsTitle'), sub: t('statDialectsSub') },
              { num: '2.4 hrs', title: t('statAvgResolutionTitle'), sub: t('statAvgResolutionSub') },
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

        {/* 6-Step Visual Engine (Multilingual) */}
        <section id="how-it-works" className="scroll-mt-28 border-y border-slate-200/80 bg-white/70 py-20 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#5227eb]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('howLifecycleEngine')}
                </span>
                <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#0f1115]">
                  {t('howHeading')}
                </h2>
                <p className="mt-3 max-w-2xl text-base text-slate-600">
                  {t('howDescription')}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-violet-300 hover:text-[#5227eb] transition"
                >
                  {isAutoPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5 text-amber-500" />
                      <span>{t('pauseAutoCycle')}</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{t('playAutoCycle')}</span>
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
                      {t('stepWord')} 0{index + 1}
                    </span>
                    <h3 className={`mt-1 text-xs font-extrabold leading-tight ${isActive ? 'text-[#0f1115]' : 'text-slate-700'}`}>
                      {step.title}
                    </h3>

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
                  transition={{ duration: 0.3 }}
                  className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]"
                >
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
                        {t('nextStepLabel')} ({((activeStep + 1) % stepsData.length) + 1}/6) <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-50 to-violet-50/40 p-6 shadow-inner">
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
                            <span className="text-slate-500">Citizen:</span>
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
                            <span className="font-extrabold text-violet-900">{t('synthWasteMgmt')}</span>
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
        <section id="simulator" className="scroll-mt-28 mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="rounded-[36px] border border-white/90 bg-gradient-to-br from-white via-violet-50/30 to-indigo-50/20 p-8 sm:p-12 shadow-2xl shadow-slate-900/10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#5227eb]">
                <Mic2 className="h-4 w-4" />
                {t('simTag')}
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-[#0f1115]">
                {t('simTitle')}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600">
                {t('simDesc')}
              </p>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
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

              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#5227eb]" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                      {t('simExtractionTitle')}
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                    {t('simValidated')}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">{t('simRawInput')}</span>
                  <p className="mt-1 text-sm font-semibold text-slate-800 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{demoSamples[activeSampleIndex].text}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="rounded-xl border border-slate-100 bg-violet-50/60 p-3">
                    <span className="text-[10px] uppercase font-bold text-violet-700">{t('simAssignedDept')}</span>
                    <p className="mt-1 font-extrabold text-slate-900">{demoSamples[activeSampleIndex].dept}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-amber-50/60 p-3">
                    <span className="text-[10px] uppercase font-bold text-amber-700">{t('simIndoreWard')}</span>
                    <p className="mt-1 font-extrabold text-slate-900">{demoSamples[activeSampleIndex].ward}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-rose-600">{t('simUrgency')}: {demoSamples[activeSampleIndex].urgency}</span>
                  <Link
                    to="/complaints/new"
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-[#5227eb] hover:underline"
                  >
                    {t('simSubmitReal')} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="scroll-mt-28 mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#5227eb]">
              {t('featEverything')}
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-[#0f1115]">
              {t('featMainHeading')}
            </h2>
            <p className="mt-4 text-base text-slate-600">
              {t('featMainDesc')}
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
                  {t('ctaSwachhCell')}
                </span>
                <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">
                  {t('ctaNeighborhood')}
                </h2>
                <p className="mt-3 max-w-xl text-sm sm:text-base leading-6 text-slate-300">
                  {t('ctaRegisterDesc')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-black text-[#5227eb] shadow-xl hover:bg-violet-50 transition"
                >
                  {t('ctaCreateAccount')} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/complaints/new"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-4 font-bold text-white hover:bg-white/10 transition"
                >
                  {t('ctaReportWithoutLogin')}
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
            {t('footerBrandNotice')}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing

