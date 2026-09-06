import { ImagePlus, MapPin, Mic, MicOff, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReviewGrievance from '../components/ReviewGrievance'
import { analyzeGrievance } from '../services/geminiService'

function NewComplaint() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)
  const [form, setForm] = useState({ title: '', description: '', location: '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => () => recognitionRef.current?.stop(), [])

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return setError('Voice recording is not supported in this browser. You can type your complaint instead.')
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-IN'
    recognition.onresult = (event) => setForm((current) => ({ ...current, description: Array.from(event.results).map((result) => result[0].transcript).join(' ') }))
    recognition.onerror = () => { setError('Microphone access was not available. Check your browser permission.'); setIsListening(false) }
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    setError('')
    setIsListening(true)
    recognition.start()
  }

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.description.trim()) return setError('Add a title and description before submitting.')
    setIsAnalyzing(true)
    setError('')
    try {
      const imageBase64 = image ? await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(image) }) : null
      setAnalysis(await analyzeGrievance(`${form.title}: ${form.description}. Location: ${form.location}`, imageBase64))
    } catch (analysisError) {
      setError(analysisError.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (analysis) return <ReviewGrievance analysis={analysis} complaint={`${form.title}: ${form.description}`} image={image} onBack={() => setAnalysis(null)} onSubmitted={() => navigate('/history')} />

  return <section className="mx-auto max-w-3xl"><div className="mb-8"><p className="text-sm font-bold uppercase tracking-wider text-blue-600">New complaint</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">Tell us what needs attention</h1><p className="mt-3 text-slate-600">Share enough detail for the right department to understand and respond.</p></div><form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><label className="block text-sm font-bold text-slate-700">Complaint Title<input name="title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="For example: Broken streetlight near clinic" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label><label className="block text-sm font-bold text-slate-700">Complaint Description<div className="relative mt-2"><textarea name="description" rows="7" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe what happened, where, and how it affects people..." className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-14 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /><button type="button" onClick={() => { if (isListening) recognitionRef.current?.stop(); else startListening(); setIsListening(!isListening) }} aria-label="Toggle voice recording" className={`absolute bottom-3 right-3 rounded-lg p-2 ${isListening ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}</button></div></label><label className="block text-sm font-bold text-slate-700">Location<input name="location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Area, street, ward, or landmark" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /></label><div><p className="text-sm font-bold text-slate-700">Image evidence <span className="font-normal text-slate-400">(optional)</span></p><input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" /><button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:border-blue-400 hover:text-blue-700"><ImagePlus className="h-4 w-4" /> Upload image</button>{preview && <div className="relative mt-4 inline-block"><img src={preview} alt="Complaint evidence preview" className="h-28 w-28 rounded-xl object-cover" /><button type="button" onClick={() => { URL.revokeObjectURL(preview); setPreview(''); setImage(null) }} className="absolute -right-2 -top-2 rounded-full bg-slate-900 p-1.5 text-white"><X className="h-3 w-3" /></button></div>}</div>{error && <p role="alert" className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}<button type="submit" disabled={isAnalyzing} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3.5 font-bold text-white hover:bg-blue-700 disabled:opacity-60"><Sparkles className="h-4 w-4" />{isAnalyzing ? 'Preparing review...' : 'Submit complaint'}</button><p className="flex items-center gap-2 text-xs text-slate-500"><MapPin className="h-3.5 w-3.5" /> Location helps route your report to the right service team.</p></form></section>
}

export default NewComplaint
