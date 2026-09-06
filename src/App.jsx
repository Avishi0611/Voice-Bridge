import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import PublicLayout from './components/PublicLayout'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Insights from './pages/Insights'
import Landing from './pages/Landing'
import Login from './pages/Login'
import NewComplaint from './pages/NewComplaint'
import Portal from './pages/Portal'
import Registration from './pages/Registration'
import Signup from './pages/Signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<Registration />} />
        </Route>
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/portal" element={<Portal />} />
          <Route path="/complaints/new" element={<NewComplaint />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
