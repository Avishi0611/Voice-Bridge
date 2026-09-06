import { Building2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { startDemoSession } from '../services/demoAuth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

function Registration() {
  const navigate = useNavigate()
  const [accountType, setAccountType] = useState('citizen')
  const [form, setForm] = useState({ name: '', mobile: '', department: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, accountType }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Unable to save registration.')
      startDemoSession()
      navigate('/dashboard', { replace: true })
    } catch (registrationError) {
      setError(registrationError.message.includes('Failed to fetch') ? 'Backend is not running. Start it with npm run server:dev.' : registrationError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-8 text-center"><Link to="/" className="text-2xl font-extrabold text-blue-700">VoiceBridge</Link><p className="mt-6 text-sm font-bold uppercase tracking-wider text-blue-600">Registration</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">Join the civic network</h1><p className="mt-3 text-slate-600">Create an account to report issues and follow public service progress.</p></div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => setAccountType('citizen')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-bold ${accountType === 'citizen' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}><UserRound className="h-4 w-4" /> Citizen</button><button type="button" onClick={() => setAccountType('government')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-bold ${accountType === 'government' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}><Building2 className="h-4 w-4" /> Government</button></div>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">{accountType === 'citizen' ? 'Full Name' : 'Officer Name'}<input name="name" value={form.name} onChange={handleChange} required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
          {accountType === 'citizen' ? <label className="text-sm font-bold text-slate-700">Mobile Number<input name="mobile" value={form.mobile} onChange={handleChange} inputMode="numeric" maxLength="10" required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label> : <label className="text-sm font-bold text-slate-700">Department<input name="department" value={form.department} onChange={handleChange} required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>}
          <label className="text-sm font-bold text-slate-700 sm:col-span-2">Email<input name="email" type="email" value={form.email} onChange={handleChange} required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
          <label className="text-sm font-bold text-slate-700 sm:col-span-2">Password<input name="password" type="password" minLength="6" value={form.password} onChange={handleChange} required className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label>
          {error && <p role="alert" className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:col-span-2">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-60 sm:col-span-2">{isSubmitting ? 'Saving registration...' : `Register as ${accountType === 'citizen' ? 'citizen' : 'official'}`}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">Already registered? <Link to="/login" className="font-bold text-blue-600">Log in</Link></p>
      </div>
    </section>
  )
}

export default Registration
