import cors from 'cors'
import express from 'express'
import { config } from './config.js'
import { createApiRouter } from './routes/api.js'

const app = express()

app.use(cors({ origin: config.clientOrigin }))
app.use(express.json({ limit: '12mb' }))
app.use('/api', createApiRouter({ config }))

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found.' })
})

app.listen(config.port, () => {
  console.log(`VoiceBridge API listening at http://localhost:${config.port}`)
})
