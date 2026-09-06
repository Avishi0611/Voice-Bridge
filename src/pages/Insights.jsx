import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Filter,
  MapPin,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'
import { useState } from 'react'

const indoreHotspots = [
  {
    area: 'Rajwada & Sarafa Bazaar',
    category: 'Heritage Waste & Night Sanitation',
    ward: 'Ward 24 - Central Zone',
    requests: 64,
    severity: 'High',
    resolved: 58,
    note: 'IMC night cleaning squads deployed',
    color: 'bg-rose-50 text-rose-600 border-rose-200',
    badge: 'Night Shift Active',
  },
  {
    area: 'Vijay Nagar & Scheme 54',
    category: 'BRTS Corridor & Pothole Repair',
    ward: 'Ward 38 - East Zone',
    requests: 48,
    severity: 'Medium',
    resolved: 44,
    note: 'Asphalt patchwork in progress on Ring Road',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    badge: 'Road Dept',
  },
  {
    area: 'Palasia & 56 Dukan (Chhappan)',
    category: 'Food Street Waste Segregation & Plastic Ban',
    ward: 'Ward 34 - Palasia Zone',
    requests: 39,
    severity: 'Medium',
    resolved: 37,
    note: '100% zero-waste food street compliance',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    badge: 'Clean Food Hub',
  },
  {
    area: 'Bhawarkua & Student Hub',
    category: 'Drainage & Narmada Phase-3 Water',
    ward: 'Ward 45 - South Zone',
    requests: 52,
    severity: 'High',
    resolved: 46,
    note: 'Sub-line pipeline replacement scheduled',
    color: 'bg-rose-50 text-rose-600 border-rose-200',
    badge: 'Water Works',
  },
  {
    area: 'Annapurna & Sudama Nagar',
    category: 'Green Waste & Public Park Maintenance',
    ward: 'Ward 58 - West Zone',
    requests: 26,
    severity: 'Low',
    resolved: 25,
    note: 'IMC composting units operating normally',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    badge: 'Horticulture',
  },
  {
    area: 'Rau & Silicon City',
    category: 'Streetlight LED & Stray Animal Control',
    ward: 'Ward 84 - Bypass Zone',
    requests: 33,
    severity: 'Medium',
    resolved: 29,
    note: 'Smart LED retrofitting underway',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    badge: 'Electrical Cell',
  },
]

const weeklyWards = [
  { area: 'Rajwada', count: 64, pct: 90, color: '#5227eb' },
  { area: 'Bhawarkua', count: 52, pct: 75, color: '#6d3df5' },
  { area: 'Vijay Nagar', count: 48, pct: 68, color: '#7c4dff' },
  { area: 'Palasia', count: 39, pct: 55, color: '#8e65ff' },
  { area: 'Rau / Bypass', count: 33, pct: 46, color: '#a382ff' },
  { area: 'Annapurna', count: 26, pct: 36, color: '#b9a0ff' },
]

function Insights() {
  const [selectedWard, setSelectedWard] = useState('All')

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Header with Indore Civic Badge */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1 text-xs font-extrabold text-[#5227eb]">
              <Trophy className="h-3.5 w-3.5 text-amber-500" /> India's Cleanest City • Swachh Survekshan #1
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              Live IMC Grid
            </span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f1115]">
            Indore Community Pulse
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Real-time grievance analytics across Indore Municipal Corporation (IMC) zones and wards.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <MapPin className="h-4 w-4 text-[#5227eb]" />
          <span className="text-xs sm:text-sm font-bold text-slate-800">Indore, MP (Zone 1 - 19)</span>
        </div>
      </div>

      {/* Main Grid: Chart & Most Active Area */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Visible, Interactive Bar Chart */}
        <article className="rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Issue Distribution by Ward
              </p>
              <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#0f1115]">
                Requests by Indore Area
              </h2>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-[#5227eb]">
              <BarChart3 className="h-4 w-4" /> This Month: 262 Reports
            </span>
          </div>

          {/* Fully Visible CSS/SVG Bars */}
          <div className="mt-8 space-y-4">
            {weeklyWards.map((item, index) => (
              <div key={item.area} className="group">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-[10px] font-extrabold text-slate-600 group-hover:bg-[#5227eb] group-hover:text-white transition">
                      {index + 1}
                    </span>
                    {item.area}
                  </span>
                  <span className="text-slate-500">
                    <strong className="text-[#0f1115]">{item.count}</strong> grievances
                  </span>
                </div>
                {/* Visual Bar Track */}
                <div className="h-4 w-full rounded-full bg-slate-100 p-0.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#5227eb] to-[#7c4dff] shadow-sm relative group-hover:from-violet-600 group-hover:to-pink-500 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Summary Footer */}
          <div className="mt-8 grid grid-cols-4 gap-2 border-t border-slate-100 pt-5 text-center text-xs">
            <div className="rounded-xl bg-slate-50 p-2.5">
              <span className="block text-slate-400 font-semibold">Week 1</span>
              <span className="text-sm font-extrabold text-slate-800">58</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5">
              <span className="block text-slate-400 font-semibold">Week 2</span>
              <span className="text-sm font-extrabold text-slate-800">72</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2.5">
              <span className="block text-slate-400 font-semibold">Week 3</span>
              <span className="text-sm font-extrabold text-slate-800">64</span>
            </div>
            <div className="rounded-xl bg-violet-50 p-2.5 border border-violet-200">
              <span className="block text-[#5227eb] font-bold">Week 4</span>
              <span className="text-sm font-extrabold text-[#5227eb]">68</span>
            </div>
          </div>
        </article>

        {/* Most Active Area Card (Indore Specific) */}
        <article className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#0f1115] to-[#1c1f26] p-6 sm:p-8 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-violet-300">
                Most Active Ward
              </span>
              <TrendingUp className="h-6 w-6 text-violet-400" />
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-wider text-slate-400">
              Indore Ward 24 • Central Zone
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold">Rajwada & Sarafa</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              64 requests logged this period. High demand around night waste collection and tourist traffic management during food market hours.
            </p>

            <div className="mt-6 rounded-2xl bg-white/5 p-4 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Resolution Rate</span>
                <span className="font-bold text-emerald-400">90.6% resolved</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[90.6%] rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex items-end justify-between border-t border-white/10 pt-6">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-violet-300">+18%</span>
              <span className="block text-xs font-semibold text-slate-400">citizen participation</span>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              IMC On Duty
            </span>
          </div>

          {/* Decorative blur backdrop */}
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#5227eb]/25 blur-3xl" />
        </article>
      </div>

      {/* Ward Grievance Cards across Indore */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            Indore Priority Zones & Municipal Attention
          </h2>
          <span className="text-xs font-bold text-slate-500">6 Major IMC Zones</span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {indoreHotspots.map((hotspot) => (
            <motion.article
              key={hotspot.area}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className={`rounded-2xl p-2.5 ${hotspot.color}`}>
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                    {hotspot.badge}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    hotspot.severity === 'High'
                      ? 'bg-rose-50 text-rose-600'
                      : hotspot.severity === 'Medium'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {hotspot.severity}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-[#0f1115]">{hotspot.area}</h3>
              <p className="mt-1 text-xs font-bold text-[#5227eb]">{hotspot.category}</p>
              <p className="mt-1 text-xs text-slate-400">{hotspot.ward}</p>

              <div className="mt-5 rounded-2xl bg-slate-50/80 p-3.5 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-black text-[#0f1115]">{hotspot.requests}</p>
                    <p className="text-[11px] font-semibold text-slate-500">Total logged</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-emerald-600">{hotspot.resolved}</p>
                    <p className="text-[11px] font-semibold text-slate-500">Action taken</p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] font-medium text-slate-600 border-t border-slate-200/60 pt-2">
                  ℹ️ {hotspot.note}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Insights
