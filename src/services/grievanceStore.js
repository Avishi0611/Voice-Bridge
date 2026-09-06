import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { auth, db } from '../firebase'

const STORAGE_KEY = 'voicebridge-grievances'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

function getLocalGrievances() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveLocalGrievance(grievance) {
  const grievances = getLocalGrievances()
  const saved = {
    ...grievance,
    referenceId: `VB-2026-${String(Date.now()).slice(-4)}`,
    status: 'Under Review',
    submittedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([saved, ...grievances]))
  return saved
}

export async function getGrievances() {
  if (db && auth?.currentUser) {
    try {
      const grievancesQuery = query(collection(db, 'grievances'), where('userId', '==', auth.currentUser.uid), orderBy('submittedAt', 'desc'))
      const snapshot = await getDocs(grievancesQuery)
      return snapshot.docs.map((document) => ({ id: document.id, ...document.data(), submittedAt: document.data().submittedAt?.toDate?.()?.toISOString() || new Date().toISOString() }))
    } catch {
      // Fall through to the backend store if Firestore rules or indexes are not ready.
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/grievances`)
    if (!response.ok) throw new Error('Backend unavailable')
    return response.json()
  } catch {
    return getLocalGrievances()
  }
}

export async function saveGrievance(grievance) {
  if (db && auth?.currentUser) {
    try {
      const saved = { ...grievance, userId: auth.currentUser.uid, referenceId: `VB-2026-${String(Date.now()).slice(-4)}`, status: 'Under Review' }
      const document = await addDoc(collection(db, 'grievances'), { ...saved, submittedAt: serverTimestamp() })
      return { ...saved, id: document.id, submittedAt: new Date().toISOString() }
    } catch {
      // Fall through to the backend store if Firestore rules or connectivity are not ready.
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/grievances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grievance),
    })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      throw new Error(payload.error || 'Backend could not save the grievance.')
    }
    return response.json()
  } catch (error) {
    if (error.message.includes('Backend could not')) throw error
    return saveLocalGrievance(grievance)
  }
}