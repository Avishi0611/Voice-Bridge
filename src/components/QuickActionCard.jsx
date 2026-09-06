import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function QuickActionCard({ title, description, icon: Icon, to, tone = 'blue' }) {
  const tones = {
    blue: 'bg-violet-50 text-[#5227eb]',
    sky: 'bg-sky-50 text-sky-600',
    green: 'bg-green-50 text-green-600',
    slate: 'bg-slate-100 text-slate-600',
  }

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Link to={to} className="glass-panel group block h-full rounded-[24px] p-5 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-200/30">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-5 w-5" /></div>
        <h3 className="mt-6 font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        <ArrowRight className="mt-5 h-4 w-4 text-blue-600 transition group-hover:translate-x-1" />
      </Link>
    </motion.div>
  )
}

export default QuickActionCard
