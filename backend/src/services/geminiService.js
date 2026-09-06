const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function parseJsonResponse(text) {
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')

  if (start === -1 || end === -1) {
    throw new Error('Gemini returned an invalid JSON response.')
  }

  return JSON.parse(cleaned.slice(start, end + 1))
}

export async function analyzeGrievance({ text, imageBase64 }, apiKey) {
  if (!apiKey) {
    const error = new Error('VITE_GEMINI_API_KEY is not configured on the backend.')
    error.code = 'MISSING_GEMINI_API_KEY'
    throw error
  }

  const parts = [{
    text: `Analyze this civic complaint and return STRICT JSON only with exactly these keys: category, severity, department, structuredGrievance, language. Category must be one of Water Supply, Road Infrastructure, Waste Management, Electricity, or Other. Severity must be Low, Medium, or High. structuredGrievance must be a formal 1-2 sentence rewrite. Complaint: ${text}`,
  }]

  if (imageBase64) {
    const [header, data] = imageBase64.split(',')
    const mimeType = header?.match(/data:(.*?);base64/)?.[1] || 'image/jpeg'
    parts.push({ inline_data: { mime_type: mimeType, data } })
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }] }),
  })

  if (!response.ok) {
    const detail = await response.text()
    const error = new Error(response.status === 429
      ? 'Gemini rate limit reached. Please wait a moment and try again.'
      : `Gemini request failed (${response.status}). Check the API key and model access.`)
    error.code = response.status === 429 ? 'GEMINI_RATE_LIMIT' : 'GEMINI_API_ERROR'
    error.status = response.status
    error.detail = detail.slice(0, 160)
    throw error
  }

  const payload = await response.json()
  const output = payload.candidates?.[0]?.content?.parts?.[0]?.text
  if (!output) throw new Error('Gemini returned an empty analysis.')

  return parseJsonResponse(output)
}
