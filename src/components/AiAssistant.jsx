import { Bot, Mic, Send, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { askAssistant } from '../services/geminiService'

function AiAssistant() {
  const { languageName, speechLanguage, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState([])
  const recognitionRef = useRef(null)

  useEffect(() => () => recognitionRef.current?.stop(), [])

  useEffect(() => {
    setMessages((current) => current.length
      ? current.map((message, index) => index === 0 && message.role === 'assistant' ? { ...message, text: t('aiGreeting') } : message)
      : [{ role: 'assistant', text: t('aiGreeting') }])
  }, [t])

  const sendMessage = async (message = input) => {
    const question = message.trim()
    if (!question || isLoading) return
    setInput('')
    setMessages((current) => [...current, { role: 'user', text: question }])
    setIsLoading(true)
    try {
      const answer = await askAssistant(question, languageName, messages.slice(-6))
      setMessages((current) => [...current, { role: 'assistant', text: answer }])
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', text: error.message }])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    if (isListening) return recognitionRef.current?.stop()
    const recognition = new SpeechRecognition()
    recognition.lang = speechLanguage
    recognition.interimResults = false
    recognition.onresult = (event) => setInput(event.results[0][0].transcript)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognitionRef.current = recognition
    setIsListening(true)
    recognition.start()
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      {open && <div className="mb-3 flex h-[min(620px,calc(100vh-120px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-violet-200 bg-white shadow-2xl shadow-violet-900/20">
        <div className="flex items-center justify-between bg-[#5227eb] px-5 py-4 text-white">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-white/15 p-2"><Bot className="h-5 w-5" /></div><div><p className="font-extrabold">VoiceBridge AI</p><p className="text-xs text-violet-100">{languageName} {t('aiSupport')}</p></div></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close AI assistant" className="rounded-full p-2 hover:bg-white/15"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
          <div className="flex flex-wrap gap-2"><button type="button" onClick={() => sendMessage('How do I submit a complaint?')} className="rounded-full border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700">{t('aiSubmit')}</button><button type="button" onClick={() => sendMessage('Which department should handle a road problem?')} className="rounded-full border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700">{t('aiDepartment')}</button></div>
          {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-[#5227eb] text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'}`}>{message.text}</div></div>)}
          {isLoading && <div className="flex items-center gap-2 text-sm text-slate-500"><Sparkles className="h-4 w-4 animate-pulse text-violet-600" />{t('aiThinking')}</div>}
        </div>
        <form onSubmit={(event) => { event.preventDefault(); sendMessage() }} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={t('aiPlaceholder')} aria-label={t('aiPlaceholder')} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none" />
          <button type="button" onClick={toggleVoice} aria-label="Speak to AI assistant" className={`rounded-xl p-2.5 ${isListening ? 'bg-red-100 text-red-600' : 'bg-violet-50 text-violet-700'}`}><Mic className="h-4 w-4" /></button>
          <button type="submit" disabled={!input.trim() || isLoading} aria-label="Send message" className="rounded-xl bg-[#5227eb] p-2.5 text-white disabled:opacity-40"><Send className="h-4 w-4" /></button>
        </form>
      </div>}
      <button type="button" onClick={() => setOpen(!open)} aria-label={t('aiHelp')} title={t('aiHelp')} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#5227eb] text-white shadow-xl shadow-violet-400/40 transition hover:-translate-y-1 hover:bg-violet-700"><Bot className="h-6 w-6" /></button>
    </div>
  )
}

export default AiAssistant
