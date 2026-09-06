import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Eye,
  FileText,
  Fingerprint,
  ListChecks,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  UserCheck,
  Volume2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import QuickActionCard from '../components/QuickActionCard'
import { useLanguage } from '../i18n/LanguageContext'
import { getGrievances, getGrievanceStats } from '../services/grievanceStore'

const fallbackComplaints = [
  {
    id: 'grv-1001',
    referenceId: 'VB-2026-1001',
    category: 'Solid Waste Management',
    severity: 'High',
    department: 'Swachh Indore / Waste Mgmt',
    ward: 'Ward 44 - Rajwada',
    location: 'Rajwada Chowk, Indore',
    structuredGrievance: 'Overflowing public waste disposal bin near Rajwada market causing pedestrian blockage.',
    status: 'In Progress',
    submittedAt: '2026-09-06T06:30:00.000Z',
    timeline: [
      { stage: 'Submitted', status: 'Under Review', timestamp: '2026-09-06T06:30:00.000Z', note: 'Grievance logged via Malvi voice input & verified with Aadhaar UIDAI.' },
      { stage: 'Assigned', status: 'Under Review', timestamp: '2026-09-06T07:15:00.000Z', note: 'Assigned to Ward 44 Sanitation Inspector Mr. Mukesh Solanki.' },
      { stage: 'In Progress', status: 'In Progress', timestamp: '2026-09-06T08:00:00.000Z', note: 'IMC Swachhata Tipper Van #28 dispatched to Rajwada site.' },
    ],
  },
  {
    id: 'grv-1002',
    referenceId: 'VB-2026-1002',
    category: 'Road Maintenance',
    severity: 'Medium',
    department: 'Public Works Department (PWD)',
    ward: 'Ward 54 - Vijay Nagar',
    location: 'AB Road near Scheme 54, Vijay Nagar',
    structuredGrievance: 'Deep pothole on main service road causing traffic slowdown and safety hazard.',
    status: 'Resolved',
    submittedAt: '2026-09-05T09:15:00.000Z',
    timeline: [
      { stage: 'Submitted', status: 'Under Review', timestamp: '2026-09-05T09:15:00.000Z', note: 'Submitted with photo geotag evidence.' },
      { stage: 'Assigned', status: 'In Progress', timestamp: '2026-09-05T10:45:00.000Z', note: 'PWD Quick Repair Crew #07 notified.' },
      { stage: 'Resolved', status: 'Resolved', timestamp: '2026-09-05T16:20:00.000Z', note: 'Pothole filled with cold mix asphalt. Verified by Ward Engineer.' },
    ],
  },
  {
    id: 'grv-1003',
    referenceId: 'VB-2026-1003',
    category: 'Street Lighting',
    severity: 'Low',
    department: 'Electrical Cell',
    ward: 'Ward 22 - Palasia',
    location: 'Old Palasia Main Road, Indore',
    structuredGrievance: 'Three consecutive LED streetlights non-operational causing dark stretch near walking track.',
    status: 'Resolved',
    submittedAt: '2026-09-04T18:40:00.000Z',
    timeline: [
      { stage: 'Submitted', status: 'Under Review', timestamp: '2026-09-04T18:40:00.000Z', note: 'Logged via VoiceBridge Web Portal.' },
      { stage: 'In Progress', status: 'In Progress', timestamp: '2026-09-05T11:00:00.000Z', note: 'Electrical technician dispatched.' },
      { stage: 'Resolved', status: 'Resolved', timestamp: '2026-09-05T14:30:00.000Z', note: 'Replaced LED drivers. All lights operational.' },
    ],
  },
  {
    id: 'grv-1004',
    referenceId: 'VB-2026-1004',
    category: 'Water Supply',
    severity: 'High',
    department: 'Narmada Water Works',
    ward: 'Ward 31 - Chhappan Dukan',
    location: '56 Dukan Food Street, Indore',
    structuredGrievance: 'Pipeline valve leakage causing clean drinking water wastage and low pressure.',
    status: 'Under Review',
    submittedAt: '2026-09-06T09:10:00.000Z',
    timeline: [
      { stage: 'Submitted', status: 'Under Review', timestamp: '2026-09-06T09:10:00.000Z', note: 'Priority alert flagged by Gemini AI due to clean water loss.' },
    ],
  },
]

const formatStatus = (status, t) => {
  if (status === 'Resolved') return t('statusResolved')
  if (status === 'In Progress') return t('statusInProgress')
  if (status === 'Under Review') return t('statusUnderReview')
  if (status === 'Pending') return t('statusPending')
  return status
}

const statusStyles = {
  Resolved: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'In Progress': { bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500 animate-pulse' },
  'Under Review': { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500 animate-ping' },
  Pending: { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
}

function Dashboard() {
  const { t } = useLanguage()
  const [complaints, setComplaints] = useState(fallbackComplaints)
  const [selectedComplaint, setSelectedComplaint] = useState(fallbackComplaints[0])
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [stats, setStats] = useState({
    total: 5,
    resolved: 2,
    inProgress: 2,
    pending: 1,
    resolutionRate: 80,
  })

  // Load complaints and stats from backend
  const loadData = async () => {
    setIsSyncing(true)
    try {
      const [items, liveStats] = await Promise.all([getGrievances(), getGrievanceStats()])
      if (Array.isArray(items) && items.length > 0) {
        setComplaints(items)
        setSelectedComplaint(items[0])
      }
      if (liveStats && typeof liveStats.total === 'number') {
        setStats(liveStats)
      }
    } catch {
      // Keep fallbacks
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const currentDate = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  // Filter complaints
  const filteredComplaints = complaints.filter((item) => {
    const matchesFilter =
      activeFilter === 'ALL'
        ? true
        : activeFilter === 'PENDING'
        ? item.status === 'Under Review' || item.status === 'Pending'
        : item.status.toUpperCase().replace(/\s+/g, '_') === activeFilter
    const matchesSearch =
      searchQuery === '' ||
      item.referenceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ward?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.structuredGrievance?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const lifecycleStages = [
    { id: 1, label: t('dashLifecycleStage1'), icon: Fingerprint, desc: t('dashLifecycleStage1Desc') },
    { id: 2, label: t('dashLifecycleStage2'), icon: Sparkles, desc: t('dashLifecycleStage2Desc') },
    { id: 3, label: t('dashLifecycleStage3'), icon: Building2, desc: t('dashLifecycleStage3Desc') },
    { id: 4, label: t('dashLifecycleStage4'), icon: Truck, desc: t('dashLifecycleStage4Desc') },
    { id: 5, label: t('dashLifecycleStage5'), icon: CheckCircle2, desc: t('dashLifecycleStage5Desc') },
  ]

  const departmentPerformance = [
    { name: t('deptWaste'), rate: 94, sla: '< 8 hrs', color: 'bg-emerald-500' },
    { name: t('deptWater'), rate: 91, sla: '< 12 hrs', color: 'bg-sky-500' },
    { name: t('deptElectric'), rate: 96, sla: '< 6 hrs', color: 'bg-amber-500' },
    { name: t('deptPwd'), rate: 87, sla: '< 24 hrs', color: 'bg-indigo-500' },
  ]

  // Pie chart data
  const statusData = [
    { name: t('statusResolved'), value: stats.resolved || 2, color: '#10b981' },
    { name: t('statusInProgress'), value: stats.inProgress || 2, color: '#0284c7' },
    { name: t('statusUnderReview'), value: stats.pending || 1, color: '#f59e0b' },
  ]

  // Determine active step index in lifecycle for selectedComplaint
  const getLifecycleStageIndex = (complaint) => {
    if (!complaint) return 1
    if (complaint.status === 'Resolved') return 5
    if (complaint.status === 'In Progress') return 4
    if (complaint.timeline && complaint.timeline.length >= 2) return 3
    return 2
  }

  const currentStageIndex = getLifecycleStageIndex(selectedComplaint)

  return (
    <section className="space-y-8 pb-10">
      {/* Top Welcome Banner & Telemetry Hub */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] border border-white/90 bg-gradient-to-br from-white via-violet-50/50 to-indigo-50/30 p-6 sm:p-8 shadow-2xl shadow-violet-900/5 backdrop-blur-xl"
      >
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-[#5227eb]">
                <Sparkles className="h-3.5 w-3.5" />
                {t('dashTag')}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('dashLiveConnected')}
              </span>
            </div>

            <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-[#0f1115]">
              {t('dashWelcomeBackName')} <span aria-hidden="true">👋</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 font-medium">
              {t('dashWelcomeSubtitle')}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-700 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                <Fingerprint className="h-3.5 w-3.5 text-emerald-600" />
                {t('dashAadhaarMasked')}
              </span>
              <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                <CalendarDays className="h-3.5 w-3.5 text-[#5227eb]" />
                {currentDate}
              </span>
              <span className="flex items-center gap-1.5 text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
                <MapPin className="h-3.5 w-3.5 text-violet-600" />
                {t('dashWardCentral')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 px-4 py-3 text-xs font-extrabold text-slate-700 shadow-sm hover:border-violet-300 hover:text-[#5227eb] transition"
              title={t('dashSyncButton')}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-[#5227eb]' : ''}`} />
              <span>{isSyncing ? t('dashSyncing') : t('dashSyncButton')}</span>
            </button>

            <Link
              to="/complaints/new"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5227eb] to-[#7c4dff] px-6 py-3 text-sm font-extrabold text-white shadow-xl shadow-violet-500/30 hover:-translate-y-0.5 hover:shadow-violet-500/50 transition"
            >
              <Plus className="h-4 w-4" />
              <span>{t('dashNewVoiceBtn')}</span>
            </Link>
          </div>
        </div>

        {/* Ambient Decorative Lighting */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl -z-0" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl -z-0" />
      </motion.div>

      {/* Visual Stat Cards Grid (Replaces plain basic cards) */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">{t('dashOverviewTitle')}</h2>
            <p className="text-xs text-slate-500 font-medium">{t('dashOverviewSubtitle')}</p>
          </div>
          <span className="text-xs font-extrabold text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-200">
            {stats.resolutionRate || 80}% {t('dashResolutionEfficiency')}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: t('dashTotalLabel'),
              value: String(stats.total || complaints.length),
              sub: t('dashTotalSub'),
              filterKey: 'ALL',
              icon: FileText,
              color: 'from-blue-500 to-indigo-600',
              borderColor: 'hover:border-blue-300',
              bgLight: 'bg-blue-50/70',
              textColor: 'text-blue-600',
            },
            {
              label: t('dashPendingLabel'),
              value: String(stats.pending || 1),
              sub: t('dashPendingSub'),
              filterKey: 'PENDING',
              icon: Clock3,
              color: 'from-amber-500 to-orange-500',
              borderColor: 'hover:border-amber-300',
              bgLight: 'bg-amber-50/70',
              textColor: 'text-amber-600',
            },
            {
              label: t('dashInProgressLabel'),
              value: String(stats.inProgress || 2),
              sub: t('dashInProgressSub'),
              filterKey: 'IN_PROGRESS',
              icon: Activity,
              color: 'from-sky-500 to-cyan-500',
              borderColor: 'hover:border-sky-300',
              bgLight: 'bg-sky-50/70',
              textColor: 'text-sky-600',
            },
            {
              label: t('dashResolvedLabel'),
              value: String(stats.resolved || 2),
              sub: t('dashResolvedSub'),
              filterKey: 'RESOLVED',
              icon: CheckCircle2,
              color: 'from-emerald-500 to-teal-500',
              borderColor: 'hover:border-emerald-300',
              bgLight: 'bg-emerald-50/70',
              textColor: 'text-emerald-600',
            },
          ].map((item) => {
            const ItemIcon = item.icon
            const isFilterSelected = activeFilter === item.filterKey
            return (
              <button
                key={item.filterKey}
                type="button"
                onClick={() => setActiveFilter(item.filterKey)}
                className={`text-left group relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 ${
                  isFilterSelected
                    ? 'border-2 border-[#5227eb] shadow-xl shadow-violet-500/10 scale-[1.02]'
                    : `border-slate-200/90 ${item.borderColor} hover:-translate-y-1 hover:shadow-md`
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    {item.label}
                  </span>
                  <div className={`rounded-2xl p-2.5 ${item.bgLight} ${item.textColor}`}>
                    <ItemIcon className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-3 text-3xl font-black text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 line-clamp-1">{item.sub}</p>

                <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-[#5227eb] transition">
                  <span>{t('dashClickToFilter')}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Interactive Live Complaint Lifecycle Tracker */}
      <article className="overflow-hidden rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-slate-900/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-xl font-black text-slate-900">{t('dashLifecycleTracker')}</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {t('dashLifecycleSubtitle')}
            </p>
          </div>

          {/* Selector for active complaint to inspect */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">{t('dashInspectingLabel')}</span>
            <select
              value={selectedComplaint?.referenceId || ''}
              onChange={(e) => {
                const found = complaints.find((c) => c.referenceId === e.target.value)
                if (found) setSelectedComplaint(found)
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-800 outline-none focus:border-violet-500 cursor-pointer"
            >
              {complaints.map((c) => (
                <option key={c.referenceId} value={c.referenceId}>
                  {c.referenceId} • {c.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Complaint Overview Strip */}
        {selectedComplaint && (
          <div className="mt-5 rounded-2xl bg-gradient-to-r from-violet-50/70 via-slate-50 to-sky-50/70 p-4 border border-violet-100">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-extrabold text-[#5227eb] mr-2">{selectedComplaint.referenceId}</span>
                <span className="font-extrabold text-slate-900">{selectedComplaint.category}</span>
                <span className="text-slate-400 mx-2">•</span>
                <span className="text-slate-600 font-medium">{selectedComplaint.ward || 'Indore Municipal Ward'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 font-extrabold ${statusStyles[selectedComplaint.status]?.bg || statusStyles['Under Review'].bg}`}>
                  <span className={`h-2 w-2 rounded-full ${statusStyles[selectedComplaint.status]?.dot || statusStyles['Under Review'].dot}`} />
                  {formatStatus(selectedComplaint.status, t)}
                </span>
                <span className="font-bold text-slate-500">
                  {new Date(selectedComplaint.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-700 font-medium">
              "{selectedComplaint.structuredGrievance}"
            </p>
          </div>
        )}

        {/* 5-Stage Stepper Bar */}
        <div className="mt-8 relative">
          <div className="hidden lg:block absolute top-6 left-12 right-12 h-1 bg-slate-100 -z-0">
            <div
              className="h-full bg-gradient-to-r from-[#5227eb] via-[#7c4dff] to-emerald-500 transition-all duration-700"
              style={{ width: `${((currentStageIndex - 1) / (lifecycleStages.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {lifecycleStages.map((stage) => {
              const StageIcon = stage.icon
              const isCompleted = stage.id <= currentStageIndex
              const isCurrent = stage.id === currentStageIndex

              return (
                <div
                  key={stage.id}
                  className={`relative flex flex-col items-center text-center p-4 rounded-2xl transition border ${
                    isCurrent
                      ? 'bg-white border-2 border-[#5227eb] shadow-lg shadow-violet-500/10'
                      : isCompleted
                      ? 'bg-slate-50 border-emerald-200'
                      : 'bg-white border-slate-100 opacity-60'
                  }`}
                >
                  <div
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black text-sm mb-2 transition shadow-sm ${
                      isCompleted
                        ? 'bg-gradient-to-tr from-[#5227eb] to-[#7c4dff] text-white shadow-violet-400/40'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <StageIcon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {t('dashStagePrefix')}{stage.id}
                  </span>
                  <p className="text-xs font-black text-slate-900 mt-0.5">{stage.label}</p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{stage.desc}</p>

                  {isCompleted && (
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-black text-emerald-600">
                      {t('dashActiveLogged')}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Audit Log Timeline Items */}
        {selectedComplaint?.timeline && selectedComplaint.timeline.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              {t('dashAuditTrail')}
            </span>
            <div className="mt-3 space-y-2">
              {selectedComplaint.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-xs border border-slate-100">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-[#5227eb] shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-800">{event.stage}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(event.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-slate-600">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Dual Analytics Grid: Status Donut + Indore Ward Response Velocity */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        {/* Status Distribution */}
        <article className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">{t('dashStatusRatioTitle')}</h2>
              <p className="text-xs text-slate-500 font-medium">{t('dashStatusRatioSubtitle')}</p>
            </div>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-extrabold text-[#5227eb]">
              {t('dashTotalLabel')}: {stats.total}
            </span>
          </div>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Indore Department Resolution Velocity */}
        <article className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">{t('dashDeptVelocityTitle')}</h2>
              <p className="text-xs text-slate-500 font-medium">{t('dashDeptVelocitySubtitle')}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
              {t('dashSwachhStandard')}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {departmentPerformance.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-800">{dept.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400">SLA: {dept.sla}</span>
                    <span className="font-black text-slate-900">{dept.rate}%</span>
                  </div>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${dept.color} rounded-full transition-all duration-700`} style={{ width: `${dept.rate}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-100 flex items-center justify-between">
            <span className="font-medium">{t('dashFastestWardToday')}: <strong className="text-slate-900">Ward 44 (Rajwada)</strong></span>
            <Link to="/insights" className="font-extrabold text-[#5227eb] hover:underline flex items-center gap-1">
              {t('dashExploreWardPulse')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </article>
      </div>

      {/* Recent Complaints Interactive Table */}
      <article className="rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">{t('dashRegisteredRecords')}</h2>
            <p className="text-xs text-slate-500 font-medium">{t('dashTableHelper')}</p>
          </div>

          {/* Search and Quick Filter Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('dashSearchPlaceholder')}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-500 outline-none w-44 sm:w-56"
              />
            </div>

            {[
              { key: 'ALL', label: t('dashFilterAll') },
              { key: 'PENDING', label: t('dashFilterPending') },
              { key: 'IN_PROGRESS', label: t('dashFilterInProgress') },
              { key: 'RESOLVED', label: t('dashFilterResolved') },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFilter(key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition ${
                  activeFilter === key
                    ? 'bg-[#5227eb] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-black border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">{t('dashColReference')}</th>
                <th className="px-6 py-3.5">{t('dashColCategorySummary')}</th>
                <th className="px-6 py-3.5">{t('dashColWardLocation')}</th>
                <th className="px-6 py-3.5">{t('dashColSeverity')}</th>
                <th className="px-6 py-3.5">{t('dashColStatus')}</th>
                <th className="px-6 py-3.5">{t('dashColSubmitted')}</th>
                <th className="px-6 py-3.5 text-right">{t('dashColAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xs text-slate-500 font-medium">
                    {t('dashNoMatchingFilter')}
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => {
                  const isSelected = selectedComplaint?.referenceId === complaint.referenceId
                  const style = statusStyles[complaint.status] || statusStyles['Under Review']

                  return (
                    <tr
                      key={complaint.referenceId}
                      onClick={() => setSelectedComplaint(complaint)}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-violet-50/60 font-semibold' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="px-6 py-4 font-black text-slate-900">
                        {complaint.referenceId}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="font-extrabold text-slate-900">{complaint.category}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{complaint.structuredGrievance}</p>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {complaint.ward || 'Indore'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                            complaint.severity === 'High'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : complaint.severity === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {complaint.severity || 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold ${style.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                          {formatStatus(complaint.status, t)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(complaint.submittedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedComplaint(complaint)
                          }}
                          className="inline-flex items-center gap-1 text-xs font-extrabold text-[#5227eb] hover:underline"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{t('dashTrackAction')}</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </article>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="mb-4 text-xl font-black text-slate-900">{t('dashQuickActionsTitle')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: t('dashActionVoiceGrievance'),
              description: t('dashActionVoiceDesc'),
              icon: Plus,
              to: '/complaints/new',
              tone: 'blue',
            },
            {
              title: t('dashActionHistory'),
              description: t('dashActionHistoryDesc'),
              icon: ListChecks,
              to: '/history',
              tone: 'sky',
            },
            {
              title: t('dashActionPulse'),
              description: t('dashActionPulseDesc'),
              icon: BarChart3,
              to: '/insights',
              tone: 'green',
            },
            {
              title: t('dashActionProfile'),
              description: t('dashActionProfileDesc'),
              icon: Settings,
              to: '/profile',
              tone: 'slate',
            },
          ].map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Dashboard

