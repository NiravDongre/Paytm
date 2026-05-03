import { useState } from 'react'
import { editPassword } from '../api'
import { AppShell, Spinner, Toast } from '../components'
import { useToast } from '../hooks/useToast'

export default function EditProfile() {
  const { toast, showToast } = useToast()
  const [form, setForm] = useState({ Password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function set(key) {
    return (e) => {
      setForm(f => ({ ...f, [key]: e.target.value }))
      setErrors(p => ({ ...p, [key]: '' }))
      setDone(false)
    }
  }

  function validate() {
    const e = {}
    if (!form.Password)                e.Password = 'New password is required'
    else if (form.Password.length < 6) e.Password = 'At least 6 characters'
    if (form.confirm !== form.Password) e.confirm = 'Passwords do not match'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await editPassword({ Password: form.Password })
      setDone(true)
      setForm({ Password: '', confirm: '' })
      showToast('Password updated successfully', 'success')
    } catch (err) {
      showToast(err.message || 'Update failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <Toast toast={toast} />
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-display font-bold text-white">Edit Profile</h1>
          <p className="text-slate-400 text-sm font-body mt-0.5">Update your account password</p>
        </div>

        {/* Account info card */}
        <div className="fp-card p-5 flex items-center gap-4 animate-fade-up-d1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ink-700 to-ink-900 border border-ink-600/30 flex items-center justify-center shrink-0">
            <UserIcon className="w-7 h-7 text-ink-300" />
          </div>
          <div>
            <p className="text-slate-100 text-sm font-display font-semibold">Your Account</p>
            <p className="text-slate-500 text-xs font-mono mt-0.5 truncate max-w-xs">
              {localStorage.getItem('fp_user_id') || 'Logged in'}
            </p>
            <span className="inline-flex items-center gap-1 mt-1.5 bg-lime-400/10 text-lime-400 text-[10px] font-mono px-2 py-0.5 rounded-full">
              ● Active
            </span>
          </div>
        </div>

        {/* Password form */}
        <div className="fp-card p-6 animate-fade-up-d2">
          <h2 className="text-sm font-display font-semibold text-slate-300 uppercase tracking-wide mb-5">Change Password</h2>

          {done && (
            <div className="mb-4 flex items-center gap-2 bg-lime-400/10 border border-lime-400/20 rounded-xl px-4 py-3 text-lime-300 text-sm font-body">
              <CheckIcon className="w-4 h-4 shrink-0" />
              Password updated successfully
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="fp-label">New Password</label>
              <input
                type="password"
                className="fp-input"
                placeholder="Min. 6 characters"
                value={form.Password}
                onChange={set('Password')}
                autoComplete="new-password"
              />
              {errors.Password && <p className="fp-error">{errors.Password}</p>}
            </div>

            <div>
              <label className="fp-label">Confirm New Password</label>
              <input
                type="password"
                className="fp-input"
                placeholder="Repeat new password"
                value={form.confirm}
                onChange={set('confirm')}
                autoComplete="new-password"
              />
              {errors.confirm && <p className="fp-error">{errors.confirm}</p>}
            </div>

            <div className="pt-1">
              <button type="submit" className="fp-btn" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner className="w-4 h-4" /> Updating…
                  </span>
                ) : 'Update password'}
              </button>
            </div>
          </form>
        </div>

        {/* Danger zone */}
        <div className="fp-card p-5 border-red-900/30 animate-fade-up-d3">
          <h2 className="text-xs font-display font-semibold text-red-400/70 uppercase tracking-wide mb-3">Danger Zone</h2>
          <p className="text-slate-500 text-xs font-body mb-3">
            Signing out will clear your tokens from this device.
          </p>
          <a
            href="/signin"
            onClick={() => { localStorage.clear() }}
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-display font-medium transition-colors"
          >
            <LogoutIcon className="w-4 h-4" />
            Sign out of this device
          </a>
        </div>
      </div>
    </AppShell>
  )
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}
function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
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
