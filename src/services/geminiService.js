const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export async function analyzeGrievance(text, imageBase64 = null) {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, imageBase64 }),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    if (response.status === 429) throw new Error('Gemini is temporarily rate-limited. Please wait a moment and try again.')
    if (response.status === 503 || payload.code === 'MISSING_GEMINI_API_KEY') throw new Error('Gemini API key is missing. Add VITE_GEMINI_API_KEY to .env and restart the backend.')
    throw new Error(payload.error || (API_KEY ? 'The backend could not analyze this complaint.' : 'Gemini API key is missing. Add VITE_GEMINI_API_KEY to .env.'))
  }

  return response.json()
}