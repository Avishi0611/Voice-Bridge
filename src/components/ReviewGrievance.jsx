import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { saveGrievance } from '../services/grievanceStore'
import { useLanguage } from '../i18n/LanguageContext'

function ReviewGrievance({ analysis, complaint, image, onSubmitted, onBack }) {
  const { t } = useLanguage()
  const [form, setForm] = useState({ ...analysis, name: '', phone: '' })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(null)

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !/^\d{10}$/.test(form.phone)) {
      setError(t('namePhoneError'))
      return
    }

    const submission = await saveGrievance({ ...form, complaint, imageName: image?.name || null })
    setSaved(submission)
    onSubmitted(submission)
  }

  if (saved) {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
        <h2 className="mt-4 text-2xl font-bold text-emerald-950">{t('grievanceSubmitted')}</h2>
        <p className="mt-2 text-emerald-800">Reference ID: <strong>{saved.referenceId}</strong></p>
        <button type="button" onClick={() => onSubmitted(saved)} className="mt-6 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">{t('viewHistory')}</button>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">{t('reviewStep')}</p><h1 className="mt-2 text-3xl font-black text-slate-950">{t('reviewGrievance')}</h1></div>
        <button type="button" onClick={onBack} className="text-sm font-semibold text-slate-500 hover:text-slate-900">{t('editComplaint')}</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {['category', 'severity', 'department'].map((field) => (
          <label key={field} className="block text-sm font-bold capitalize text-slate-700">{field}
            <input name={field} value={form[field] || ''} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100" />
          </label>
        ))}
        <label className="block text-sm font-bold text-slate-700">{t('formalGrievance')}
          <textarea name="structuredGrievance" value={form.structuredGrievance || ''} onChange={updateField} rows="4" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold text-slate-700">{t('yourName')}<input name="name" value={form.name} onChange={updateField} required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal" /></label>
          <label className="block text-sm font-bold text-slate-700">{t('phoneNumber')}<input name="phone" value={form.phone} onChange={updateField} inputMode="numeric" maxLength="10" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal" /></label>
        </div>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 font-bold text-white hover:bg-teal-800"><Send className="h-4 w-4" /> {t('confirmSubmit')}</button>
      </form>
    </section>
  )
}

export default ReviewGrievance