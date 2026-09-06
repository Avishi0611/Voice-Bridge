const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export async function analyzeGrievance(text, imageBase64 = null, language = 'English') {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 20000)
  let response
  try {
    response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, imageBase64, language }),
      signal: controller.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Analysis took too long. Please try again without a photo or use a smaller image.')
    throw new Error('Could not reach the complaint analysis service.')
  } finally {
    window.clearTimeout(timeout)
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    if (response.status === 429) throw new Error('Gemini is temporarily rate-limited. Please wait a moment and try again.')
    if (response.status === 503 || payload.code === 'MISSING_GEMINI_API_KEY') throw new Error('Gemini API key is missing. Add VITE_GEMINI_API_KEY to .env and restart the backend.')
    if (payload.code === 'GEMINI_INVALID_API_KEY') throw new Error(payload.error)
    throw new Error(payload.error || (API_KEY ? 'The backend could not analyze this complaint.' : 'Gemini API key is missing. Add VITE_GEMINI_API_KEY to .env.'))
  }

  return response.json()
}

export async function askAssistant(message, language = 'English', history = []) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 45000)
  let response
  try {
    response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, history }),
      signal: controller.signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('The AI assistant is taking longer than expected. Please try again.')
    throw new Error('Could not reach the AI assistant.')
  } finally {
    window.clearTimeout(timeout)
  }
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'The AI assistant is temporarily unavailable.')
  return payload.answer
}