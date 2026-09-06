import { motion, AnimatePresence } from 'framer-motion'
import { ImagePlus, MapPin, Mic, MicOff, Navigation, Sparkles, X, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReviewGrievance from '../components/ReviewGrievance'
import { analyzeGrievance } from '../services/geminiService'
import { useLanguage } from '../i18n/LanguageContext'

function NewComplaint() {
  const { t, speechLanguage, languageName } = useLanguage()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)
  const titleRecognitionRef = useRef(null)
  const locationRecognitionRef = useRef(null)

  const [form, setForm] = useState({ title: '', description: '', location: '' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [isTitleListening, setIsTitleListening] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isLocationListening, setIsLocationListening] = useState(false)
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => () => {
    recognitionRef.current?.stop()
    titleRecognitionRef.current?.stop()
    locationRecognitionRef.current?.stop()
  }, [])

  const startVoiceInput = (field) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return setError(t('voiceUnsupported'))

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = speechLanguage

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join(' ')
      setForm((current) => ({ ...current, [field]: transcript }))
    }

    recognition.onerror = () => {
      setError(t('microphoneError'))
      if (field === 'title') setIsTitleListening(false)
      else if (field === 'description') setIsListening(false)
      else setIsLocationListening(false)
    }

    recognition.onend = () => {
      if (field === 'title') setIsTitleListening(false)
      else if (field === 'description') setIsListening(false)
      else setIsLocationListening(false)
    }

    if (field === 'title') {
      titleRecognitionRef.current = recognition
      setError('')
      setIsTitleListening(true)
    } else if (field === 'description') {
      recognitionRef.current = recognition
      setError('')
      setIsListening(true)
    } else {
      locationRecognitionRef.current = recognition
      setError('')
      setIsLocationListening(true)
    }

    recognition.start()
  }

  const stopVoiceInput = (field) => {
    if (field === 'title') {
      titleRecognitionRef.current?.stop()
      setIsTitleListening(false)
    } else if (field === 'description') {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      locationRecognitionRef.current?.stop()
      setIsLocationListening(false)
    }
  }

  const getLocation = () => {
    if (!navigator.geolocation) return setError(t('geolocationUnsupported'))
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setForm((current) => ({ ...current, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)} (Indore Ward)` }))
        setError('')
      },
      () => setError(t('locationError'))
    )
  }

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setError(t('imageError'))
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImage(null)
    setPreview('')
  }

  const prepareImageForAnalysis = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const source = new Image()
      source.onload = () => {
        const maxDimension = 1280
        const scale = Math.min(1, maxDimension / Math.max(source.width, source.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(source.width * scale))
        canvas.height = Math.max(1, Math.round(source.height * scale))
        canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.72))
      }
      source.onerror = reject
      source.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.description.trim()) return setError(t('requiredError'))
    setIsAnalyzing(true)
    setError('')
    try {
      const imageBase64 = image ? await prepareImageForAnalysis(image) : null
      const result = await analyzeGrievance(
        `Indore Grievance Report - Issue: ${form.title}. Details: ${form.description}. Area/Location: ${form.location || 'Indore Municipal Area'}.`,
        imageBase64,
        languageName
      )
      setAnalysis(result)
    } catch (analysisError) {
      setError(analysisError.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (analysis) {
    return (
      <ReviewGrievance
        analysis={analysis}
        complaint={`${form.title}: ${form.description}`}
        image={image}
        onBack={() => setAnalysis(null)}
        onSubmitted={() => navigate('/history')}
      />
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-3xl"
    >
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-extrabold text-[#5227eb]">
            <Volume2 className="h-3.5 w-3.5" /> Indore Civic Voice
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            IMC 311 Integrated
          </span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          {t('tellAttention')}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {t('describeIssue')}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/80 bg-white/80 p-6 sm:p-9 shadow-xl shadow-slate-900/5 backdrop-blur-xl"
      >
        {/* Issue Title with Microphone Speech-To-Text */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="issue-title" className="text-sm font-bold text-slate-700">
              {t('issue')} <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-semibold text-slate-400">
              {isTitleListening ? '🎙️ Speaking...' : 'Speak or type'}
            </span>
          </div>
          <div className="relative">
            <input
              id="issue-title"
              name="title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder={t('issuePlaceholder')}
              className={`w-full rounded-2xl border bg-slate-50/50 py-3.5 pl-4 pr-14 text-sm font-medium text-slate-900 outline-none transition ${
                isTitleListening
                  ? 'border-red-400 ring-4 ring-red-100 bg-red-50/20'
                  : 'border-slate-200 focus:border-[#5227eb] focus:bg-white focus:ring-4 focus:ring-violet-100'
              }`}
              required
            />
            {/* Dedicated Microphone for "What's the issue?" */}
            <button
              type="button"
              onClick={() => {
                if (isTitleListening) stopVoiceInput('title')
                else startVoiceInput('title')
              }}
              aria-label={isTitleListening ? t('stopRecording') : t('recordTitle')}
              title={isTitleListening ? t('stopRecording') : 'Speak issue title'}
              className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl p-2.5 transition ${
                isTitleListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                  : 'bg-violet-50 text-[#5227eb] hover:bg-violet-100'
              }`}
            >
              {isTitleListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
          {isTitleListening && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-2 text-xs font-bold text-red-600"
            >
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              Listening to your voice ({speechLanguage}). Say your problem title...
            </motion.div>
          )}
        </div>

        {/* Description with Microphone */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="issue-description" className="text-sm font-bold text-slate-700">
              {t('tellMore')} <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-semibold text-slate-400">
              {isListening ? '🎙️ Recording...' : 'Live transcription'}
            </span>
          </div>
          <div className="relative">
            <textarea
              id="issue-description"
              name="description"
              rows="5"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder={t('descriptionPlaceholder')}
              className={`w-full rounded-2xl border bg-slate-50/50 p-4 pr-14 text-sm font-medium text-slate-900 outline-none transition ${
                isListening
                  ? 'border-red-400 ring-4 ring-red-100 bg-red-50/20'
                  : 'border-slate-200 focus:border-[#5227eb] focus:bg-white focus:ring-4 focus:ring-violet-100'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => {
                if (isListening) stopVoiceInput('description')
                else startVoiceInput('description')
              }}
              aria-label="Toggle voice recording for description"
              title={isListening ? t('stopRecording') : t('recordVoice')}
              className={`absolute bottom-3.5 right-3 flex items-center justify-center rounded-xl p-2.5 transition ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                  : 'bg-violet-50 text-[#5227eb] hover:bg-violet-100'
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          </div>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-2 text-xs font-bold text-red-600"
            >
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              Recording details in {languageName}. Speak freely...
            </motion.div>
          )}
        </div>

        {/* Location with Voice and GPS */}
        <div>
          <label htmlFor="issue-location" className="block text-sm font-bold text-slate-700 mb-2">
            {t('where')}
          </label>
          <div className="flex gap-2">
            <input
              id="issue-location"
              name="location"
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
              placeholder={t('locationPlaceholder')}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none focus:border-[#5227eb] focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
            <button
              type="button"
              onClick={getLocation}
              title={t('useLocation')}
              className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-[#5227eb] transition"
              aria-label="Get current location via GPS"
            >
              <Navigation className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (isLocationListening) stopVoiceInput('location')
                else startVoiceInput('location')
              }}
              title={isLocationListening ? t('stopRecording') : t('sayLocation')}
              className={`flex items-center justify-center rounded-2xl border px-3.5 py-3 transition ${
                isLocationListening
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-[#5227eb]'
              }`}
              aria-label="Record location with voice"
            >
              {isLocationListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Image Upload Evidence */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {t('addPhoto')}
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-dashed border-violet-300 bg-violet-50/50 px-5 py-3.5 text-sm font-bold text-[#5227eb] hover:bg-violet-100 transition"
            >
              <ImagePlus className="h-5 w-5" />
              {t('uploadImage')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
              aria-label="Upload complaint image"
            />
            {image && (
              <span className="text-xs font-semibold text-slate-500">
                {image.name} ({(image.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </div>

          <AnimatePresence>
            {preview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative mt-4 inline-block"
              >
                <img
                  src={preview}
                  alt="Complaint preview"
                  className="max-h-52 rounded-2xl border border-slate-200 shadow-md object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2.5 -right-2.5 rounded-full bg-red-600 p-1.5 text-white shadow-lg hover:bg-red-700"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-red-50 px-4 py-3.5 text-sm font-bold text-red-700 border border-red-200"
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isAnalyzing}
          whileHover={!isAnalyzing ? { scale: 1.01 } : undefined}
          whileTap={!isAnalyzing ? { scale: 0.99 } : undefined}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5227eb] px-6 py-4 font-extrabold text-white shadow-xl shadow-violet-300/40 hover:bg-violet-700 disabled:opacity-60 transition"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="h-5 w-5 animate-spin text-violet-200" />
              {t('analyzing')}
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 text-violet-200" />
              {t('submitComplaint')}
            </>
          )}
        </motion.button>
      </form>
    </motion.section>
  )
}

export default NewComplaint
