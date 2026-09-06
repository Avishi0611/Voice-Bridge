import { motion } from 'framer-motion'
import { Activity, BarChart3, Bell, CalendarDays, CheckCircle2, Clock3, FileText, ListChecks, MapPin, Plus, Settings, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import QuickActionCard from '../components/QuickActionCard'
import StatsCard from '../components/StatsCard'
import { getGrievances } from '../services/grievanceStore'

const sampleComplaints = [
  { referenceId: 'VB-2026-1001', category: 'Water Supply', severity: 'High', status: 'Under Review', submittedAt: '2026-09-12T10:00:00.000Z' },
  { referenceId: 'VB-2026-1002', category: 'Road Damage', severity: 'Medium', status: 'In Progress', submittedAt: '2026-09-10T10:00:00.000Z' },
  { referenceId: 'VB-2026-1003', category: 'Street Light', severity: 'Low', status: 'Resolved', submittedAt: '2026-09-08T10:00:00.000Z' },
]

const statusData = [
  { name: 'Resolved', value: 40, color: '#22C55E' },
  { name: 'In Progress', value: 35, color: '#0EA5E9' },
  { name: 'Pending', value: 25, color: '#F59E0B' },
]

const updates = [
  { title: 'Water pipeline maintenance in Zone A', time: 'Today, 9:30 AM' },
  { title: 'Road repair work started in Sector 5', time: 'Yesterday, 4:15 PM' },
  { title: 'New grievance center launched', time: '12 Sept 2026, 11:00 AM' },
]

const futureFeatures = ['Real-time complaint tracking', 'Live government updates', 'Geo-based hotspot alerts', 'AI-assisted issue categorization']

const statusStyles = {
  Resolved: 'bg-green-50 text-green-700',
  'In Progress': 'bg-orange-50 text-orange-700',
  'Under Review': 'bg-red-50 text-red-700',
}

function Dashboard() {
  const [complaints, setComplaints] = useState(sampleComplaints)

  useEffect(() => {
    getGrievances().then((items) => {
      if (items.length) setComplaints(items.slice(0, 5))
    })
  }, [])

  const currentDate = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())

  return (
    <section className="space-y-10">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="soft-grid overflow-hidden rounded-[30px] border border-violet-200/70 bg-gradient-to-br from-white via-violet-50 to-sky-50 p-6 shadow-2xl shadow-violet-200/30 sm:p-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="text-sm font-semibold text-[#5227eb]">Citizen dashboard</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0f1115] sm:text-4xl">Welcome Back <span aria-hidden="true">👋</span></h1><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">Track, manage, and monitor your civic complaints from one place.</p><div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-500"><span className="font-semibold text-slate-800">Demo Citizen</span><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#5227eb]" />{currentDate}</span></div></div><div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5227eb] text-xl font-extrabold text-white shadow-lg shadow-violet-300">DC</div><Link to="/complaints/new" className="inline-flex items-center gap-2 rounded-full bg-[#5227eb] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-300/40 hover:-translate-y-0.5 hover:bg-violet-700"><Plus className="h-4 w-4" />Submit New Complaint</Link></div></div>
      </motion.div>

      <div><div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-extrabold text-slate-900">Your complaint overview</h2><p className="mt-1 text-sm text-slate-500">A snapshot of your civic participation.</p></div></div><motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
        { label: 'Total Complaints', value: '24', trend: '+3 this month', icon: FileText, tone: 'blue' },
        { label: 'Pending', value: '8', trend: 'Awaiting review', icon: Clock3, tone: 'amber' },
        { label: 'In Progress', value: '10', trend: 'Being addressed', icon: Activity, tone: 'sky' },
        { label: 'Resolved', value: '6', trend: '+2 this month', icon: CheckCircle2, tone: 'green' },
      ].map((stat) => <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}><StatsCard {...stat} /></motion.div>)}</motion.div></div>

      <div><h2 className="mb-4 text-xl font-extrabold text-slate-900">Quick actions</h2><motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
        { title: 'New Complaint', description: 'Report a civic issue in your area.', icon: Plus, to: '/complaints/new', tone: 'blue' },
        { title: 'My Complaints', description: 'View your reports and their status.', icon: ListChecks, to: '/history', tone: 'sky' },
        { title: 'Community Insights', description: 'Explore trends across neighborhoods.', icon: BarChart3, to: '/insights', tone: 'green' },
        { title: 'Profile Settings', description: 'Manage your account details.', icon: Settings, to: '/register', tone: 'slate' },
      ].map((action) => <motion.div key={action.title} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}><QuickActionCard {...action} /></motion.div>)}</motion.div></div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div><h2 className="text-xl font-extrabold text-slate-900">Complaint status overview</h2><p className="mt-1 text-sm text-slate-500">How your submitted reports are moving.</p></div><div className="mt-5 h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={64} outerRadius={92} paddingAngle={3}>{statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => `${value}%`} /><Legend verticalAlign="bottom" height={30} iconType="circle" /></PieChart></ResponsiveContainer></div></article><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="text-xl font-extrabold text-slate-900">Community updates</h2><p className="mt-1 text-sm text-slate-500">Important notices from your area.</p></div><Bell className="h-5 w-5 text-blue-600" /></div><div className="mt-5 divide-y divide-slate-100">{updates.map((update) => <div key={update.title} className="flex gap-3 py-4 first:pt-0"><div className="mt-1 rounded-full bg-blue-50 p-2 text-blue-600"><Bell className="h-4 w-4" /></div><div><p className="text-sm font-bold text-slate-800">{update.title}</p><p className="mt-1 text-xs text-slate-500">{update.time}</p></div></div>)}</div></article></div>

      <article className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-5"><div><h2 className="text-xl font-extrabold text-slate-900">Recent complaints</h2><p className="mt-1 text-sm text-slate-500">Your latest grievance activity.</p></div><Link to="/history" className="text-sm font-bold text-blue-600 hover:text-blue-700">View all complaints</Link></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-3 font-bold">Reference ID</th><th className="px-6 py-3 font-bold">Category</th><th className="px-6 py-3 font-bold">Severity</th><th className="px-6 py-3 font-bold">Status</th><th className="px-6 py-3 font-bold">Date</th><th className="px-6 py-3 font-bold">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{complaints.map((complaint, index) => <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.06 }} key={complaint.referenceId}><td className="px-6 py-4 font-bold text-slate-800">{complaint.referenceId}</td><td className="px-6 py-4 text-slate-600">{complaint.category}</td><td className="px-6 py-4"><span className={`font-semibold ${complaint.severity === 'High' ? 'text-red-600' : complaint.severity === 'Medium' ? 'text-orange-600' : 'text-green-600'}`}>{complaint.severity}</span></td><td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[complaint.status] || statusStyles['Under Review']}`}>{complaint.status}</span></td><td className="px-6 py-4 text-slate-600">{new Date(complaint.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td><td className="px-6 py-4"><Link to="/history" className="font-bold text-blue-600 hover:text-blue-700">View</Link></td></motion.tr>)}</tbody></table></div></article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Sparkles className="h-5 w-5" /></div><div><h2 className="text-xl font-extrabold text-slate-900">Future enhancements</h2><p className="mt-1 text-sm text-slate-500">More ways VoiceBridge will keep you informed.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{futureFeatures.map((feature) => <div key={feature} className="flex items-center gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />{feature}</div>)}</div></article>
    </section>
  )
}

export default Dashboard
