function PageIntro({ eyebrow, title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-3 max-w-2xl text-slate-600">{description}</p>
    </div>
  )
}

export default PageIntro
