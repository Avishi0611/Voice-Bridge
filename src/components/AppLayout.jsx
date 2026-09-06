import {
  BarChart3,
  Bell,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { auth, isFirebaseConfigured } from '../firebase'
import { endDemoSession } from '../services/demoAuth'
import { LanguageSelector, useLanguage } from '../i18n/LanguageContext'
import AiAssistant from './AiAssistant'
import Logo from './Logo'

const links = [
  { label: 'citizenDashboard', path: '/portal', icon: LayoutDashboard },
  { label: 'newComplaint', path: '/complaints/new', icon: FilePlus2 },
  { label: 'communityInsights', path: '/insights', icon: BarChart3 },
  { label: 'submittedGrievances', path: '/history', icon: ClipboardList },
  { label: 'settings', path: '/settings', icon: Settings },
]

function AppLayout() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const stored = localStorage.getItem('voicebridge-notifications')
      if (stored) {
        const notifs = JSON.parse(stored)
        setUnreadCount(notifs.filter((n) => !n.read).length)
      }
    } catch {}
  }, [])

  const handleLogout = async () => {
    if (isFirebaseConfigured && auth) await auth.signOut()
    endDemoSession()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f2f3f5] text-[#0f1115]">
      {/* Mobile Top Header */}
      <header className="sticky top-3 z-30 mx-3 rounded-2xl border border-white/80 bg-white/75 shadow-lg shadow-slate-900/5 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-5 py-3.5">
          <Logo size="sm" to="/portal" subtitle={false} />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            className="rounded-full p-2 text-slate-700 hover:bg-violet-50"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Desktop & Mobile Sidebar */}
      <aside
        className={`${
          isOpen ? 'block' : 'hidden'
        } fixed inset-y-3 left-3 z-40 w-72 rounded-3xl border border-white/80 bg-white/75 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:block`}
      >
        <Logo size="md" to="/portal" subtitle={true} />

        <div className="mt-5 space-y-2 border-b border-slate-200/70 pb-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t('civicWorkspace')}
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Connected" />
          </div>
          <LanguageSelector className="w-full" />
        </div>

        <nav className="mt-6 space-y-1.5" aria-label="Workspace navigation">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? 'bg-[#5227eb] text-white shadow-lg shadow-violet-300/40'
                    : 'text-slate-600 hover:bg-violet-50 hover:text-[#5227eb]'
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {t(link.label)}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-6 left-6 right-6 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-[#d9251c] transition"
          >
            <LogOut className="h-4 w-4" />
            {t('signOut')}
          </button>
          <p className="mt-3 text-[11px] font-medium leading-4 text-slate-400">
            VoiceBridge • Indore Municipal Corporation Portal
          </p>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="min-h-screen lg:ml-[19.5rem]">
        <div className="mx-auto flex max-w-7xl justify-end items-center gap-3 px-5 pt-5 sm:px-8 lg:px-12">
          {/* Notifications Link with Badge */}
          <NavLink
            to="/notifications"
            aria-label={t('notifications')}
            title={t('notifications')}
            className={({ isActive }) =>
              `relative rounded-2xl p-2.5 transition ${
                isActive
                  ? 'bg-violet-100 text-[#5227eb]'
                  : 'bg-white/80 text-slate-600 shadow-sm hover:text-[#5227eb] hover:bg-white'
              }`
            }
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
                {unreadCount}
              </span>
            )}
          </NavLink>

          {/* Profile Link */}
          <NavLink
            to="/profile"
            aria-label={t('profile')}
            title={t('profile')}
            className={({ isActive }) =>
              `rounded-2xl p-2.5 transition ${
                isActive
                  ? 'bg-violet-100 text-[#5227eb]'
                  : 'bg-white/80 text-slate-600 shadow-sm hover:text-[#5227eb] hover:bg-white'
              }`
            }
          >
            <UserRound className="h-5 w-5" />
          </NavLink>
        </div>

        <div className="page-enter mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-12 lg:py-8">
          <Outlet />
        </div>
      </main>

      <AiAssistant />
    </div>
  )
}

export default AppLayout
