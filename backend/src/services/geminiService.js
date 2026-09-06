const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent'

function parseJsonResponse(text) {
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')

  if (start === -1 || end === -1) {
    throw new Error(`Gemini returned an invalid JSON response: ${cleaned.slice(0, 240)}`)
  }

  const json = cleaned.slice(start, end + 1)
  try {
    return JSON.parse(json)
  } catch {
    try {
      return JSON.parse(json.replace(/,\s*([}\]])/g, '$1'))
    } catch {
      throw new Error(`Gemini returned an invalid JSON response: ${json.slice(0, 240)}`)
    }
  }
}

export async function analyzeGrievance({ text, imageBase64, language = 'English' }, apiKey) {
  if (!apiKey) {
    const error = new Error('VITE_GEMINI_API_KEY is not configured on the backend.')
    error.code = 'MISSING_GEMINI_API_KEY'
    throw error
  }

  const parts = [{
    text: `Return one complete JSON object only with exactly these keys: category, severity, department, structuredGrievance, language. Keep category, severity, and department concise. Write the 1-sentence structuredGrievance in ${language}. Set language to ${language}. Complaint: ${text}`,
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
    signal: AbortSignal.timeout(45000),
  })

  if (!response.ok) {
    const detail = await response.text()
    const invalidKey = detail.includes('API_KEY_INVALID') || detail.includes('API_KEY_SERVICE_BLOCKED')
    const error = new Error(invalidKey
      ? 'This API key cannot access Gemini. Create a Gemini-enabled key in Google AI Studio and update VITE_GEMINI_API_KEY in .env.'
      : response.status === 429
      ? 'Gemini rate limit reached. Please wait a moment and try again.'
      : `Gemini request failed (${response.status}). Check the API key and model access.`)
    error.code = invalidKey ? 'GEMINI_INVALID_API_KEY' : response.status === 429 ? 'GEMINI_RATE_LIMIT' : 'GEMINI_API_ERROR'
    error.status = response.status
    error.detail = detail.slice(0, 160)
    throw error
  }

  const payload = await response.json()
  const output = payload.candidates?.[0]?.content?.parts?.[0]?.text
  if (!output) throw new Error('Gemini returned an empty analysis.')

  return parseJsonResponse(output)
}

export async function answerAssistant({ message, language = 'English', history = [] }, apiKey) {
  if (!apiKey) {
    const error = new Error('The AI assistant is not configured.')
    error.code = 'MISSING_GEMINI_API_KEY'
    throw error
  }

  const conversation = history.map((item) => `${item.role}: ${item.text}`).join('\n')
  const prompt = `You are VoiceBridge AI. Answer the user in ${language} with one complete helpful answer of no more than 35 words. Help with civic reports, departments, complaint status, grievance writing, and this website. Do not invent policies or case status. Conversation:\n${conversation}\nUser: ${message}`
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    signal: AbortSignal.timeout(45000),
  })
  if (!response.ok) {
    const detail = await response.text()
    const error = new Error(detail.includes('API_KEY') ? 'The Gemini API key cannot access the AI assistant.' : 'The AI assistant is temporarily unavailable.')
    error.code = detail.includes('API_KEY') ? 'GEMINI_INVALID_API_KEY' : 'GEMINI_API_ERROR'
    throw error
  }
  const payload = await response.json()
  return payload.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'I could not prepare an answer. Please try again.'
}
