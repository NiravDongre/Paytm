// ── Logo ────────────────────────────────────────────────
export function Logo({ size = 'md' }) {
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }
  return (
    <span className={`font-display font-bold tracking-tight ${sizes[size]}`}>
      <span className="text-ink-400">Flow</span>
      <span className="text-white">Pay</span>
    </span>
  )
}

// ── Spinner ──────────────────────────────────────────────
export function Spinner({ className = '' }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Toast ────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null
  const base = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-body font-medium shadow-2xl animate-fade-up flex items-center gap-2'
  const styles = {
    success: `${base} bg-lime-400/15 border border-lime-400/30 text-lime-300`,
    error:   `${base} bg-red-500/15 border border-red-500/30 text-red-300`,
    info:    `${base} bg-ink-500/20 border border-ink-400/30 text-ink-200`,
  }
  return <div className={styles[toast.type] || styles.info}>{toast.message}</div>
}

// ── Avatar ───────────────────────────────────────────────
export function Avatar({ name = '?', size = 'md' }) {
  const letter = name?.[0]?.toUpperCase() ?? '?'
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }
  const colors = ['bg-ink-600', 'bg-purple-700', 'bg-cyan-700', 'bg-rose-700', 'bg-teal-700']
  const color = colors[letter.charCodeAt(0) % colors.length]
  return (
    <div className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-display font-bold text-white shrink-0`}>
      {letter}
    </div>
  )
}

// ── Page shell (auth layout with noise texture) ──────────
export function AuthShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-ink-900/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-ink-800/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}

// ── Sidebar nav ──────────────────────────────────────────
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { loggout } from '../api'

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',    icon: HomeIcon },
  { to: '/send',         label: 'Send Money',   icon: SendIcon },
  { to: '/history',      label: 'History',      icon: HistoryIcon },
  { to: '/edit-profile', label: 'Profile',      icon: ProfileIcon },
]

export function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await loggout()
    logout()
    navigate('/signin')
  }

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-slate-900/50 border-r border-slate-800 min-h-screen">
      <div className="px-6 py-7 border-b border-slate-800">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-display font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-ink-500/15 text-ink-300 border border-ink-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-display font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150"
        >
          <LogoutIcon className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

// ── Mobile bottom bar ────────────────────────────────────
export function BottomBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 border-t border-slate-800 backdrop-blur-sm z-40">
      <div className="flex">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-display font-medium transition-colors ${
                isActive ? 'text-ink-400' : 'text-slate-500'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

// ── App shell (dashboard layout) ────────────────────────
export function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <BottomBar />
    </div>
  )
}

// ── Status badge ─────────────────────────────────────────
export function StatusBadge({ status }) {
  if (status === 'COMPLETED') return <span className="fp-badge-success">● {status}</span>
  if (status === 'PENDING')   return <span className="fp-badge-pending">● {status}</span>
  return <span className="fp-badge-failed">● {status}</span>
}

// ── Icons (inline SVG — no dep needed) ───────────────────
function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75v-5.25a.75.75 0 00-.75-.75h-6a.75.75 0 00-.75.75v5.25H3.75A.75.75 0 013 21V9.75z" />
    </svg>
  )
}
function SendIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  )
}
function HistoryIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
    </svg>
  )
}
function ProfileIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}
function LogoutIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  )
}
