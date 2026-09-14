export const DEMO_ACCOUNT = {
  email: 'demo@voicebridge.gov',
  password: 'VoiceBridge@2026',
  name: 'Avishi Jain',
}

export const DEMO_PROFILE = {
  name: 'Avishi Jain',
  phone: '0000000000',
  email: 'avishi.jain@voicebridge.in',
  ward: 'Ward 34 - Palasia & 56 Dukan',
  address: 'Indore, Madhya Pradesh 452001',
  aadhaar: '',
  isAadhaarVerified: false,
  memberSince: 'September 2026',
  civicScore: 0,
  resolvedCount: 0,
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