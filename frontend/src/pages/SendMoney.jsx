import { useState, useEffect, useRef } from 'react'
import { bulkUsers, transfer } from '../api'
import { AppShell, Avatar, Spinner, Toast } from '../components'
import { useToast } from '../hooks/useToast'

export default function SendMoney() {
  const { toast, showToast } = useToast()
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [sending, setSending] = useState(false)
  const [amountErr, setAmountErr] = useState('')
  const debounceRef = useRef(null)

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!query.trim()) { setUsers([]); return }
    setSearchLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await bulkUsers(query)
        setUsers(data.user || [])
      } catch {
        setUsers([])
      } finally {
        setSearchLoading(false)
      }
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  function selectUser(u) {
    setSelected(u)
    setQuery('')
    setUsers([])
    setAmount('')
    setAmountErr('')
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!selected) { showToast('Select a recipient first', 'error'); return }
    const num = Number(amount)
    if (!amount || isNaN(num) || num <= 0) { setAmountErr('Enter a valid amount'); return }
    setSending(true)
    try {
      await transfer({ to: selected._id, amount: num })
      showToast(`₹${num.toLocaleString('en-IN')} sent to ${selected.UserName || 'user'}!`, 'success')
      setSelected(null)
      setAmount('')
    } catch (err) {
      showToast(err.message || 'Transfer failed', 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <AppShell>
      <Toast toast={toast} />
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-display font-bold text-white">Send Money</h1>
          <p className="text-slate-400 text-sm font-body mt-0.5">Search a user and transfer instantly</p>
        </div>

        {/* Search */}
        <div className="animate-fade-up-d1 relative">
          <label className="fp-label">Find recipient</label>
          <div className="relative">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              className="fp-input pl-10"
              placeholder="Search by username…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {searchLoading && <Spinner className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
          </div>

          {/* Dropdown results */}
          {users.length > 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 fp-card shadow-2xl overflow-hidden">
              {users.map(u => (
                <button
                  key={u._id}
                  onClick={() => selectUser(u)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-800/60 transition-colors text-left"
                >
                  <Avatar name={u.UserName || u._id} size="sm" />
                  <div>
                    <p className="text-sm font-body font-medium text-slate-200">{u.UserName}</p>
                    <p className="text-xs font-mono text-slate-500 truncate">{u._id}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {query.trim() && !searchLoading && users.length === 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 fp-card px-4 py-3 text-sm text-slate-500 font-body">
              No users found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Selected recipient + amount form */}
        {selected && (
          <div className="animate-fade-up fp-card p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={selected.UserName || selected._id} size="md" />
                <div>
                  <p className="text-sm font-display font-semibold text-slate-100">
                    {selected.UserName}
                  </p>
                  <p className="text-xs font-mono text-slate-500 truncate max-w-[180px]">{selected._id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="Remove"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="fp-label">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">₹</span>
                  <input
                    type="number"
                    className="fp-input pl-8"
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setAmountErr('') }}
                  />
                </div>
                {amountErr && <p className="fp-error">{amountErr}</p>}
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 flex-wrap">
                {[100, 500, 1000, 2000].map(v => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => { setAmount(String(v)); setAmountErr('') }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg border border-slate-700 transition-colors"
                  >
                    ₹{v}
                  </button>
                ))}
              </div>

              <button type="submit" className="fp-btn" disabled={sending}>
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner className="w-4 h-4" /> Sending…
                  </span>
                ) : `Send ₹${Number(amount || 0).toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>
        )}

        {/* Empty state */}
        {!selected && !query && (
          <div className="animate-fade-up-d2 fp-card px-6 py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-ink-900/50 border border-ink-700/30 flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-6 h-6 text-ink-400" />
            </div>
            <p className="text-slate-400 text-sm font-body">Search for a username above to get started</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}
function XIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
