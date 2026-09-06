import { BarChart3, ClipboardList, FilePlus2, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { auth, isFirebaseConfigured } from '../firebase'
import { endDemoSession } from '../services/demoAuth'

const links = [
  { label: 'Citizen Dashboard', path: '/portal', icon: LayoutDashboard },
  { label: 'New Complaint', path: '/complaints/new', icon: FilePlus2 },
  { label: 'My Complaints', path: '/history', icon: ClipboardList },
  { label: 'Community Insights', path: '/insights', icon: BarChart3 },
  { label: 'Government Dashboard', path: '/dashboard', icon: LayoutDashboard },
]

function AppLayout() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (isFirebaseConfigured && auth) await auth.signOut()
    endDemoSession()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5] text-[#0f1115]">
      <header className="sticky top-3 z-30 mx-3 rounded-2xl border border-white/80 bg-white/75 shadow-lg shadow-slate-900/5 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <NavLink to="/portal" className="text-xl font-extrabold tracking-tight text-[#5227eb]">VoiceBridge</NavLink>
          <button type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation" className="rounded-full p-2 text-slate-700 hover:bg-violet-50">{isOpen ? <X /> : <Menu />}</button>
        </div>
      </header>
      <aside className={`${isOpen ? 'block' : 'hidden'} fixed inset-y-3 left-3 z-40 w-72 rounded-3xl border border-white/80 bg-white/72 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:block`}>
        <NavLink to="/portal" onClick={() => setIsOpen(false)} className="text-2xl font-extrabold tracking-tight text-[#5227eb]">VoiceBridge</NavLink>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Civic workspace</p>
        <nav className="mt-10 space-y-1" aria-label="Workspace navigation">
          {links.map((link) => (
            <NavLink key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-[#5227eb] text-white shadow-lg shadow-violet-300/40' : 'text-slate-600 hover:bg-violet-50 hover:text-[#5227eb]'}`}>
              <link.icon className="h-4 w-4" />{link.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 right-6 border-t border-slate-200 pt-5">
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-[#d9251c]"><LogOut className="h-4 w-4" />Sign out</button>
          <p className="mt-4 text-xs leading-5 text-slate-400">VoiceBridge civic engagement platform</p>
        </div>
      </aside>
      {isOpen && <button type="button" aria-label="Close navigation" onClick={() => setIsOpen(false)} className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden" />}
      <main className="min-h-screen lg:ml-[19.5rem]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-10"><Outlet /></div>
      </main>
    </div>
  )
}

export default AppLayout
