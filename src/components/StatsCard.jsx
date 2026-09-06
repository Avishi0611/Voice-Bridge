import { motion } from 'framer-motion'

function StatsCard({ label, value, trend, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'bg-violet-50 text-[#5227eb]',
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
    green: 'bg-green-50 text-green-600',
  }

  return (
    <motion.article whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }} className="glass-panel rounded-[24px] p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
      <p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-3 text-xs font-medium text-slate-400">{trend}</p>
    </motion.article>
  )
}

export default StatsCard
