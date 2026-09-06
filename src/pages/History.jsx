import { ClipboardList, Clock3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getGrievances } from '../services/grievanceStore'

function History() {
  const [grievances, setGrievances] = useState([])

  useEffect(() => {
    getGrievances().then(setGrievances)
  }, [])

  const severityStyle = { High: 'bg-red-100 text-red-700', Medium: 'bg-amber-100 text-amber-700', Low: 'bg-emerald-100 text-emerald-700' }

  return (
    <section>
      <div className="mb-8"><p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Your activity</p><h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Submitted grievances</h1><p className="mt-3 text-slate-600">Keep track of what you have raised and where it stands.</p></div>
      {grievances.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><ClipboardList className="mx-auto h-10 w-10 text-slate-400" /><h2 className="mt-4 text-xl font-bold text-slate-800">No grievances yet</h2><p className="mt-2 text-slate-500">Your first submission will appear here.</p></div> : <div className="space-y-4">{grievances.map((item) => <article key={item.referenceId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.referenceId}</p><h2 className="mt-2 text-lg font-bold text-slate-900">{item.category}</h2></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${severityStyle[item.severity] || severityStyle.Medium}`}>{item.severity} priority</span></div><p className="mt-3 text-sm leading-6 text-slate-600">{item.structuredGrievance}</p><div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500"><span>{item.department}</span><span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{new Date(item.submittedAt).toLocaleDateString()}</span><span className="text-teal-700">{item.status}</span></div></article>)}</div>}
    </section>
  )
}

export default History
