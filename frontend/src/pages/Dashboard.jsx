import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBalance, getHistory } from '../api'
import { AppShell, StatusBadge, Spinner, Toast, Avatar } from '../components'
import { useToast } from '../hooks/useToast'

function BalanceCard({ balance, loading }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-ink-700 via-ink-800 to-slate-900 p-6 border border-ink-600/30 animate-fade-up">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-ink-500/10 rounded-full blur-3xl pointer-events-none" />
      <p className="text-ink-200 text-xs font-display font-medium uppercase tracking-widest mb-3">Total Balance</p>
      {loading ? (
        <div className="fp-skeleton h-10 w-48 mb-1" />
      ) : (
        <p className="text-4xl font-display font-bold text-white mb-1">
          ₹{balance !== null ? Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
        </p>
      )}
      <p className="text-ink-300/60 text-xs font-mono">FlowPay Wallet</p>
      <div className="mt-5 flex gap-3">
        <Link
          to="/send"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-display font-semibold px-4 py-2 rounded-xl transition-all duration-150"
        >
          <SendArrow className="w-4 h-4" />
          Send Money
        </Link>
        <Link
          to="/history"
          className="flex items-center gap-2 bg-transparent hover:bg-white/5 border border-white/10 text-ink-200 text-sm font-display font-medium px-4 py-2 rounded-xl transition-all duration-150"
        >
          History
        </Link>
      </div>
    </div>
  )
}

function QuickStat({ label, value, sub, delay }) {
  return (
    <div className={`fp-card px-5 py-4 animate-fade-up-d${delay}`}>
      <p className="text-slate-500 text-xs font-display uppercase tracking-wide mb-1">{label}</p>
      <p className="text-xl font-display font-semibold text-slate-100">{value}</p>
      {sub && <p className="text-slate-500 text-xs font-mono mt-0.5">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { toast, showToast } = useToast()
  const [balance, setBalance] = useState(null)
  const [balLoading, setBalLoading] = useState(true)
  const [txns, setTxns] = useState([])
  const [txLoading, setTxLoading] = useState(true)
  const userId = localStorage.getItem('fp_user_id') || ''

  useEffect(() => {
    getBalance()
      .then(d => setBalance(d.Balance))
      .catch(e => showToast(e.message, 'error'))
      .finally(() => setBalLoading(false))

    getHistory(1, 5)
      .then(d => setTxns(d.data || []))
      .catch(() => {})
      .finally(() => setTxLoading(false))
  }, [])

  const sent     = txns.filter(t => String(t.fromAccount) !== userId).length  // rough
  const received = txns.filter(t => String(t.toAccount)   !== userId).length

  return (
    <AppShell>
      <Toast toast={toast} />
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm font-body mt-0.5">Welcome back 👋</p>
        </div>

        <BalanceCard balance={balance} loading={balLoading} />

        <div className="grid grid-cols-2 gap-3">
          <QuickStat label="Recent transfers" value={txns.length} sub="last 5" delay={1} />
          <QuickStat label="Total received" value={txns.filter(t => t.Status === 'COMPLETED').length} sub="completed" delay={2} />
        </div>

        {/* Recent transactions */}
        <div className="animate-fade-up-d3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-display font-semibold text-slate-300 uppercase tracking-wide">Recent Activity</h2>
            <Link to="/history" className="text-xs text-ink-400 hover:text-ink-300 font-display transition-colors">View all →</Link>
          </div>

          <div className="fp-card divide-y divide-slate-800">
            {txLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4">
                  <div className="fp-skeleton w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="fp-skeleton h-3 w-32" />
                    <div className="fp-skeleton h-2.5 w-20" />
                  </div>
                  <div className="fp-skeleton h-3 w-16" />
                </div>
              ))
            ) : txns.length === 0 ? (
              <div className="px-5 py-10 text-center text-slate-500 text-sm font-body">
                No transactions yet.{' '}
                <Link to="/send" className="text-ink-400 underline">Send your first payment</Link>
              </div>
            ) : (
              txns.map(t => (
                <TxnRow key={t._id} txn={t} />
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

function TxnRow({ txn }) {
  const amount = Number(txn.amount)
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-800/30 transition-colors">
      <div className="w-9 h-9 rounded-full bg-ink-900 border border-ink-700/40 flex items-center justify-center shrink-0">
        <ArrowIcon className="w-4 h-4 text-ink-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-200 text-sm font-body truncate font-medium">Transfer</p>
        <p className="text-slate-500 text-xs font-mono truncate">{new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-slate-200 text-sm font-mono font-semibold">₹{amount.toLocaleString('en-IN')}</p>
        <StatusBadge status={txn.Status} />
      </div>
    </div>
  )
}

function SendArrow({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  )
}

function ArrowIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
    </svg>
  )
}
