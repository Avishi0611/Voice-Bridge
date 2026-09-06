import { Outlet } from 'react-router-dom'

function PublicLayout() {
  return <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8"><Outlet /></main>
}

export default PublicLayout