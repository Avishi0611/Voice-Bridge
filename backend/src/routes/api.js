import { Router } from 'express'
import { analyzeGrievance } from '../services/geminiService.js'
import { createGrievance, getGrievances } from '../services/grievanceStore.js'
import { authenticateRegistration, createRegistration, getRegistrations } from '../services/registrationStore.js'

export function createApiRouter({ config }) {
  const router = Router()

  router.get('/health', (_request, response) => {
    response.json({ status: 'ok', service: 'voicebridge-api', timestamp: new Date().toISOString() })
  })

  router.post('/registrations', (request, response) => {
    const input = request.body || {}
    if (!['citizen', 'government'].includes(input.accountType)) {
      return response.status(400).json({ error: 'Choose a valid account type.' })
    }
    if (!input.name?.trim() || !input.email?.trim() || !input.password || input.password.length < 6) {
      return response.status(400).json({ error: 'Name, email, and a password of at least 6 characters are required.' })
    }
    if (input.accountType === 'citizen' && !/^\d{10}$/.test(input.mobile || '')) {
      return response.status(400).json({ error: 'A valid 10-digit mobile number is required.' })
    }
    if (input.accountType === 'government' && !input.department?.trim()) {
      return response.status(400).json({ error: 'Department is required for government registration.' })
    }

    try {
      return response.status(201).json(createRegistration(config.registrationDatabase, input))
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  })

  router.get('/registrations', (_request, response) => {
    try {
      return response.json(getRegistrations(config.registrationDatabase))
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  })

  router.post('/login', (request, response) => {
    const { email, password } = request.body || {}
    if (!email || !password) return response.status(400).json({ error: 'Email and password are required.' })
    const account = authenticateRegistration(config.registrationDatabase, email, password)
    if (!account) return response.status(401).json({ error: 'The email or password is incorrect.' })
    return response.json(account)
  })

  router.post('/analyze', async (request, response) => {
    const { text, imageBase64 = null } = request.body || {}
    if (!text?.trim()) return response.status(400).json({ error: 'Complaint text is required.' })

    try {
      const analysis = await analyzeGrievance({ text: text.trim(), imageBase64 }, config.geminiApiKey)
      return response.json(analysis)
    } catch (error) {
      const status = error.code === 'MISSING_GEMINI_API_KEY' ? 503 : error.code === 'GEMINI_RATE_LIMIT' ? 429 : 502
      return response.status(status).json({ error: error.message, code: error.code })
    }
  })

  router.get('/grievances', async (_request, response) => {
    try {
      return response.json(await getGrievances(config.dataFile))
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  })

  router.post('/grievances', async (request, response) => {
    const input = request.body || {}
    if (!input.name?.trim() || !/^\d{10}$/.test(input.phone || '')) {
      return response.status(400).json({ error: 'Name and a valid 10-digit phone number are required.' })
    }
    if (!input.structuredGrievance?.trim()) {
      return response.status(400).json({ error: 'A structured grievance is required.' })
    }

    try {
      return response.status(201).json(await createGrievance(config.dataFile, input))
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  })

  return router
}
