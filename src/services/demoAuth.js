export const DEMO_ACCOUNT = {
  email: 'demo@voicebridge.gov',
  password: 'VoiceBridge@2026',
  name: 'Demo Citizen',
}

const DEMO_SESSION_KEY = 'voicebridge-demo-session'

export function isDemoSessionActive() {
  return localStorage.getItem(DEMO_SESSION_KEY) === 'active'
}

export function startDemoSession() {
  localStorage.setItem(DEMO_SESSION_KEY, 'active')
}

export function endDemoSession() {
  localStorage.removeItem(DEMO_SESSION_KEY)
}