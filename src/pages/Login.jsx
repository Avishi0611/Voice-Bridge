import { LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { DEMO_ACCOUNT, startDemoSession } from '../services/demoAuth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

function Login() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.email === DEMO_ACCOUNT.email && form.password === DEMO_ACCOUNT.password) {
      startDemoSession()
      navigate('/dashboard', { replace: true })
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Unable to log in.')
      if (remember) localStorage.setItem('voicebridge-remember', 'true')
      startDemoSession()
      navigate('/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError.message.includes('Failed to fetch') ? 'Backend is not running.' : loginError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="hidden rounded-2xl bg-blue-600 p-10 text-white lg:block">
        <p className="text-sm font-bold uppercase tracking-wider text-blue-100">VoiceBridge</p>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight">{t('hero')}</h1>
        <p className="mt-5 leading-7 text-blue-100">{t('heroDescription')}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><LockKeyhole className="h-5 w-5" /></div>
        <p className="mt-7 text-sm font-bold uppercase tracking-wider text-blue-600">{t('welcomeBack')}</p>
        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">{t('loginTitle')}</h2>
        <p className="mt-3 text-sm text-slate-500">{t('loginDescription')}</p>
        <button type="button" onClick={() => setForm({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })} className="mt-5 w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-left text-sm text-blue-800 hover:bg-blue-100"><span className="font-bold">{t('demoAccount')}</span><span className="mt-1 block text-xs">{DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password}</span></button>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block text-sm font-bold text-slate-700">{t('emailAddress')}<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
          <label className="block text-sm font-bold text-slate-700">{t('password')}<input type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
          <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />{t('rememberMe')}</label>
          {error && <p role="alert" className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60">{isSubmitting ? t('signingIn') : t('login')}</button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">{t('newToVoiceBridge')} <Link to="/register" className="font-bold text-blue-600">{t('registerNowLink')}</Link></p>
      </div>
    </section>
  )
}

export default Login
