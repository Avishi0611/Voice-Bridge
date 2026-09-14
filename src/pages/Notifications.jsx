import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  Bell,
  Check,
  CheckCheck,
  Clock,
  Droplets,
  FileText,
  Filter,
  Megaphone,
  Sparkles,
  Trash2,
  Truck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'grievance',
    title: 'Grievance VB-2026-6797 Status Updated',
    message: 'Your complaint regarding water shortage in Palasia has been assigned to IMC Water Works Engineer (Zone 9).',
    time: '15 minutes ago',
    read: false,
    icon: Droplets,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    link: '/history',
  },
  {
    id: 'notif-2',
    category: 'ward',
    title: 'Swachh Indore: Night Waste Collection Drive',
    message: 'Special night sanitation squad deployed across Rajwada, Sarafa, and Chhappan Dukan area. Door-to-door pickup starts 10:30 PM.',
    time: '1 hour ago',
    read: false,
    icon: Truck,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    link: '/insights',
  },
  {
    id: 'notif-3',
    category: 'municipal',
    title: 'BRTS Corridor Maintenance - Vijay Nagar',
    message: 'Indore Municipal Corporation asphalt patchwork underway near Scheme 54. Expect minor traffic diversions tonight.',
    time: '3 hours ago',
    read: true,
    icon: Megaphone,
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    id: 'notif-4',
    category: 'grievance',
    title: 'Grievance VB-2026-1690 Resolved ✓',
    message: 'Road maintenance complaint on AB Road has been verified and closed by PWD Junior Engineer.',
    time: 'Yesterday',
    read: true,
    icon: CheckCheck,
    color: 'bg-violet-50 text-[#5227eb] border-violet-200',
    link: '/history',
  },
  {
    id: 'notif-5',
    category: 'ward',
    title: 'Ward 45 Storm Drain Cleaning Scheduled',
    message: 'Bhawarkua sub-drainage desilting will take place tomorrow from 8:00 AM to 1:00 PM. Please avoid parking over drain grates.',
    time: '2 days ago',
    read: true,
    icon: AlertCircle,
    color: 'bg-slate-50 text-slate-600 border-slate-200',
  },
]

const STORAGE_KEY = 'voicebridge-notifications'

const ICONS_BY_CATEGORY = {
  grievance: FileText,
  ward: Truck,
  municipal: Megaphone,
}

function restoreNotifications(value) {
  if (!Array.isArray(value)) return INITIAL_NOTIFICATIONS
  return value.map((item) => ({
    ...item,
    icon: ICONS_BY_CATEGORY[item.category] || Bell,
    color: item.color || 'bg-slate-50 text-slate-600 border-slate-200',
  }))
}

export default function Notifications() {
  const { t } = useLanguage()

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return restoreNotifications(JSON.parse(saved))
    } catch {}
    return INITIAL_NOTIFICATIONS
  })

  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    if (window.confirm('Clear all notifications?')) {
      setNotifications([])
    }
  }

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read
    if (filter === 'grievances') return n.category === 'grievance'
    if (filter === 'ward') return n.category === 'ward'
    if (filter === 'municipal') return n.category === 'municipal'
    return true
  })

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-3xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-[#5227eb] shadow-md shadow-violet-200/50">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5227eb]">
              Civic Notification Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f1115]">
              {t('notifications')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-[#5227eb] hover:text-[#5227eb] transition"
            >
              <CheckCheck className="h-3.5 w-3.5" /> {t('markAllRead')}
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:text-red-600 hover:border-red-200 transition"
              title="Clear all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/70 bg-white/70 p-1.5 shadow-sm backdrop-blur-md">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'grievances', label: 'My Grievances' },
          { id: 'ward', label: 'Ward Alerts' },
          { id: 'municipal', label: 'IMC Notices' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              filter === tab.id
                ? 'bg-[#5227eb] text-white shadow-md shadow-violet-300/40'
                : 'text-slate-600 hover:bg-violet-50 hover:text-[#5227eb]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center text-slate-500"
            >
              <Bell className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="font-bold text-slate-700">No notifications in this category.</p>
              <p className="text-xs text-slate-400 mt-1">
                New municipal updates and grievance status alerts will appear here.
              </p>
            </motion.div>
          ) : (
            filtered.map((item) => {
              const Icon = typeof item.icon === 'function' ? item.icon : ICONS_BY_CATEGORY[item.category] || Bell
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative flex items-start gap-4 rounded-3xl border p-5 shadow-sm transition ${
                    !item.read
                      ? 'border-violet-200 bg-white shadow-md shadow-violet-100/50'
                      : 'border-slate-200/80 bg-white/70 hover:bg-white'
                  }`}
                >
                  {/* Category Icon */}
                  <div className={`shrink-0 rounded-2xl p-3 border ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-extrabold truncate ${
                          !item.read ? 'text-[#0f1115]' : 'text-slate-700'
                        }`}
                      >
                        {item.title}
                      </h3>
                      {!item.read && (
                        <span className="h-2 w-2 rounded-full bg-[#5227eb] shrink-0" />
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {item.message}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-[11px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.time}
                      </span>
                      {item.link && (
                        <Link
                          to={item.link}
                          className="font-bold text-[#5227eb] hover:underline"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute right-4 top-4 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => toggleRead(item.id)}
                      title={item.read ? 'Mark as unread' : 'Mark as read'}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-violet-50 hover:text-[#5227eb]"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNotification(item.id)}
                      title="Delete notification"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.article>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
