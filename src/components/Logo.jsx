import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Logo({ size = 'md', animated = true, subtitle = true, to = '/' }) {
  const isSm = size === 'sm'
  const isLg = size === 'lg'

  const iconSizes = isSm ? 'h-7 w-7 rounded-xl' : isLg ? 'h-11 w-11 rounded-2xl' : 'h-9 w-9 rounded-2xl'
  const textSizes = isSm ? 'text-lg' : isLg ? 'text-3xl' : 'text-2xl'

  const content = (
    <div className="flex items-center gap-2.5 group select-none">
      {/* Civic Emblem Mark */}
      <motion.div
        className={`relative flex items-center justify-center bg-gradient-to-br from-[#5227eb] via-[#6d3df5] to-[#3a18b0] text-white shadow-lg shadow-violet-500/25 shrink-0 ${iconSizes}`}
        whileHover={animated ? { scale: 1.05, rotate: 2 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Soundwave Bridge SVG */}
        <svg viewBox="0 0 32 32" fill="none" className="h-3/5 w-3/5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Bridge arch */}
          <path d="M4 22C10 14 22 14 28 22" stroke="white" strokeWidth="2.2" strokeOpacity="0.9" />
          {/* Soundwave bars over bridge */}
          <line x1="10" y1="18" x2="10" y2="13" stroke="#ffd166" strokeWidth="2.2" />
          <line x1="16" y1="18" x2="16" y2="9" stroke="white" strokeWidth="2.4" />
          <line x1="22" y1="18" x2="22" y2="13" stroke="#06d6a0" strokeWidth="2.2" />
          {/* Central citizen dot */}
          <circle cx="16" cy="6" r="1.5" fill="white" />
        </svg>

        {/* Ambient pulse ring */}
        {animated && (
          <motion.span
            className="absolute -inset-0.5 rounded-2xl bg-violet-400/30 -z-10"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>

      {/* Brand Typography */}
      <div className="flex flex-col min-w-0">
        <span className={`font-extrabold tracking-tight text-[#0f1115] leading-none ${textSizes}`}>
          Voice<span className="text-[#5227eb]">Bridge</span>
        </span>
        {subtitle && (
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mt-1 truncate">
            Civic Action Platform
          </span>
        )}
      </div>
    </div>
  )

  if (!to) return content
  return (
    <Link to={to} className="inline-block outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 rounded-xl">
      {content}
    </Link>
  )
}
