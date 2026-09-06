import { onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { auth, isFirebaseConfigured } from '../firebase'
import { isDemoSessionActive } from '../services/demoAuth'

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

    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-sm text-slate-600">
        Checking your session...
      </div>
    )
  }

  if (!isFirebaseConfigured) {
    return children
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute