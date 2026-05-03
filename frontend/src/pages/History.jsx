import { useState, useEffect } from 'react'
import { getHistory } from '../api'
import { AppShell, StatusBadge, Spinner, Toast } from '../components'
import { useToast } from '../hooks/useToast'

export default function History() {
  const { toast, showToast } = useToast()
  const [txns, setTxns]       = useState([])
  const [total, setTotal]     = useState(0)
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 10

  async function load(p) {
    setLoading(true)
    try {
      const data = await getHistory(p, limit)
      setTxns(data.data || [])
      setTotal(data.total || 0)
    } catch (err) {
      showToast(err.message || 'Failed to load history', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(page) }, [page])

  const totalPages = Math.ceil(total / limit)

  return (
    <AppShell>
      <Toast toast={toast} />
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        <div className="animate-fade-up flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">History</h1>
            <p className="text-slate-400 text-sm font-body mt-0.5">{total} transactions total</p>
          </div>
          <span className="text-slate-500 text-xs font-mono">Page {page}/{totalPages || 1}</span>
        </div>

        <div className="fp-card animate-fade-up-d1 overflow-hidden">
          {loading ? (
            <div className="divide-y divide-slate-800">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="fp-skeleton w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="fp-skeleton h-3 w-40" />
                    <div className="fp-skeleton h-2.5 w-24" />
                  </div>
                  <div className="space-y-2 items-end flex flex-col">
                    <div className="fp-skeleton h-3 w-16" />
                    <div className="fp-skeleton h-2.5 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : txns.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-3">
                <EmptyIcon className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm font-body">No transactions on this page</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {txns.map((t, i) => <TxnRow key={t._id} txn={t} i={i} />)}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 animate-fade-up-d2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 fp-btn-ghost text-sm disabled:opacity-30 w-auto"
            >
              ← Prev
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => Math.abs(p - page) <= 2)
                .map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-mono font-medium transition-colors ${
                      p === page
                        ? 'bg-ink-500 text-white'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="px-4 py-2 fp-btn-ghost text-sm disabled:opacity-30 w-auto"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function TxnRow({ txn, i }) {
  const amount = Number(txn.amount)
  const date = new Date(txn.createdAt)

  return (
    <div
      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/25 transition-colors animate-fade-up"
      style={{ animationDelay: `${i * 0.05}s` }}
    >
      <div className="w-10 h-10 rounded-full bg-ink-900/60 border border-ink-700/30 flex items-center justify-center shrink-0">
        <TxIcon className="w-4 h-4 text-ink-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-200 text-sm font-body font-medium truncate">
          Transfer
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <p className="text-slate-500 text-xs font-mono">
            {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {' '}
            {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <p className="text-slate-600 text-[10px] font-mono mt-0.5 truncate">
          key: {txn.idempotencykey}
        </p>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <p className="text-slate-100 text-sm font-mono font-semibold">
          ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <StatusBadge status={txn.Status} />
      </div>
    </div>
  )
}

function TxIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  )
}

function EmptyIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-3-3v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
