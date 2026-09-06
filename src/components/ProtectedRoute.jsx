import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { auth, isFirebaseConfigured } from '../firebase'
import { isDemoSessionActive, startDemoSession } from '../services/demoAuth'

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    if (isDemoSessionActive()) {
      setUser({ isDemo: true })
      setIsLoading(false)
      return undefined
    }

    // Seamlessly start demo citizen session so users can browse all portal features
    startDemoSession()
    setUser({ isDemo: true })
    setIsLoading(false)
    return undefined
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-sm font-bold text-slate-600">
        Loading VoiceBridge workspace...
      </div>
    )
  }

  return children
}

export default ProtectedRoute