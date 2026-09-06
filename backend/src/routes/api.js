import { Router } from 'express'
import { analyzeGrievance, answerAssistant } from '../services/geminiService.js'
import {
  createGrievance,
  findGrievance,
  getGrievances,
  getGrievanceStats,
  updateGrievanceStatus,
} from '../services/grievanceStore.js'
import { authenticateRegistration, createRegistration, getRegistrations } from '../services/registrationStore.js'

export function createApiRouter({ config }) {
  const router = Router()

  // Health check with system telemetry
  router.get('/health', (_request, response) => {
    response.json({
      status: 'ok',
      service: 'voicebridge-api',
      geminiConfigured: Boolean(config.geminiApiKey),
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    })
  })

  // System status check
  router.get('/system', (_request, response) => {
    response.json({
      status: 'healthy',
      nodeVersion: process.version,
      memory: process.memoryUsage(),
      platform: process.platform,
      activePort: config.port,
      timestamp: new Date().toISOString(),
    })
  })

  // Aggregated grievance analytics
  router.get('/stats', async (_request, response) => {
    try {
      const stats = await getGrievanceStats(config.dataFile)
      return response.json(stats)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  })

  // User Registrations
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

  // Authentication
  router.post('/login', (request, response) => {
    const { email, password } = request.body || {}
    if (!email || !password) return response.status(400).json({ error: 'Email and password are required.' })
    const account = authenticateRegistration(config.registrationDatabase, email, password)
    if (!account) return response.status(401).json({ error: 'The email or password is incorrect.' })
    return response.json(account)
  })

  // Gemini Grievance Analysis
  router.post('/analyze', async (request, response) => {
    const { text, imageBase64 = null, language = 'English' } = request.body || {}
    if (!text?.trim()) return response.status(400).json({ error: 'Complaint text is required.' })

    try {
      const analysis = await analyzeGrievance({ text: text.trim(), imageBase64, language }, config.geminiApiKey)
      return response.json(analysis)
    } catch (error) {
      const status =
        error.code === 'MISSING_GEMINI_API_KEY'
          ? 503
          : error.code === 'GEMINI_INVALID_API_KEY'
          ? 502
          : error.code === 'GEMINI_RATE_LIMIT'
          ? 429
          : 502
      return response.status(status).json({ error: error.message, code: error.code })
    }
  })

  // Gemini AI Assistant Chat
  router.post('/chat', async (request, response) => {
    const { message, language = 'English', history = [] } = request.body || {}
    if (!message?.trim()) return response.status(400).json({ error: 'A message is required.' })
    try {
      return response.json({
        answer: await answerAssistant(
          { message: message.trim(), language, history: Array.isArray(history) ? history.slice(-6) : [] },
          config.geminiApiKey
        ),
      })
    } catch (error) {
      const status =
        error.code === 'MISSING_GEMINI_API_KEY'
          ? 503
          : error.code === 'GEMINI_INVALID_API_KEY'
          ? 502
          : 502
      return response.status(status).json({ error: error.message, code: error.code })
    }
  })

  // Grievance Queries & Filtering
  router.get('/grievances', async (request, response) => {
    try {
      const { category, status, search } = request.query || {}
      let data = await getGrievances(config.dataFile)

      if (category) {
        data = data.filter((g) => g.category?.toLowerCase() === category.toLowerCase())
      }
      if (status) {
        data = data.filter((g) => g.status?.toLowerCase() === status.toLowerCase())
      }
      if (search) {
        const query = search.toLowerCase()
        data = data.filter(
          (g) =>
            g.referenceId?.toLowerCase().includes(query) ||
            g.category?.toLowerCase().includes(query) ||
            g.structuredGrievance?.toLowerCase().includes(query) ||
            g.complaint?.toLowerCase().includes(query)
        )
      }

      return response.json(data)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  })

  // Get specific grievance by ID or Reference
  router.get('/grievances/:id', async (request, response) => {
    try {
      const found = await findGrievance(config.dataFile, request.params.id)
      if (!found) return response.status(404).json({ error: 'Grievance not found.' })
      return response.json(found)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  })

  // Submit New Grievance
  router.post('/grievances', async (request, response) => {
    const input = request.body || {}
    if (!input.name?.trim() || !/^\d{10}$/.test(input.phone || '')) {
      return response.status(400).json({ error: 'Name and a valid 10-digit phone number are required.' })
    }
    if (!input.structuredGrievance?.trim()) {
      return response.status(400).json({ error: 'A structured grievance is required.' })
    }

    try {
      const created = await createGrievance(config.dataFile, input)
      return response.status(201).json(created)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  })

  // Update Grievance Status (Municipal Officer action)
  router.patch('/grievances/:id/status', async (request, response) => {
    const { status, note } = request.body || {}
    const validStatuses = ['Under Review', 'Assigned', 'In Progress', 'Resolved']
    if (!status || !validStatuses.includes(status)) {
      return response.status(400).json({ error: `Valid status must be one of: ${validStatuses.join(', ')}` })
    }

    try {
      const updated = await updateGrievanceStatus(config.dataFile, request.params.id, status, note)
      return response.json(updated)
    } catch (error) {
      return response.status(404).json({ error: error.message })
    }
  })

  return router
}
