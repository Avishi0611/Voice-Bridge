import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const backendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const config = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173',
  geminiApiKey: process.env.VITE_GEMINI_API_KEY,
  dataFile: path.join(backendDirectory, 'data', 'grievances.json'),
  registrationDatabase: path.join(backendDirectory, 'data', 'voicebridge.sqlite'),
}
