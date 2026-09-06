import cors from 'cors'
import express from 'express'
import { config } from './config.js'
import { createApiRouter } from './routes/api.js'

const app = express()

const allowedOrigins = new Set([config.clientOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'].filter(Boolean))

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true)
    } else {
      callback(null, true)
    }
  },
  credentials: true,
}))
app.use(express.json({ limit: '12mb' }))
app.use('/api', createApiRouter({ config }))

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found.' })
})

app.listen(config.port, () => {
  console.log(`VoiceBridge API listening at http://localhost:${config.port}`)
})
