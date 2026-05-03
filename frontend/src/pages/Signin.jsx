import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signin } from '../api'
import { useAuth } from '../context/AuthContext'
import { Logo, AuthShell, Spinner, Toast } from '../components'
import { useToast } from '../hooks/useToast'

export default function Signin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast, showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ UserName: '', Password: '' })
  const [errors, setErrors] = useState({})

  function set(key) {
    return (e) => {
      setForm(f => ({ ...f, [key]: e.target.value }))
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.UserName.trim()) errs.UserName = 'Username is required'
    if (!form.Password)        errs.Password = 'Password is required'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await signin({ UserName: form.UserName, Password: form.Password })
      login()
      navigate('/dashboard')
    } catch (err) {
      showToast(err.message || 'Sign in failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <Toast toast={toast} />
      <div className="animate-fade-up">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="mt-2 text-slate-400 text-sm font-body">Sign in to your wallet</p>
        </div>

        <div className="fp-card p-7 animate-fade-up-d1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="fp-label">Username</label>
              <input
                className="fp-input"
                placeholder="your_username"
                value={form.UserName}
                onChange={set('UserName')}
                autoComplete="username"
              />
              {errors.UserName && <p className="fp-error">{errors.UserName}</p>}
            </div>

            <div>
              <label className="fp-label">Password</label>
              <input
                type="password"
                className="fp-input"
                placeholder="••••••••"
                value={form.Password}
                onChange={set('Password')}
                autoComplete="current-password"
              />
              {errors.Password && <p className="fp-error">{errors.Password}</p>}
            </div>

            <button type="submit" className="fp-btn mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" /> Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-slate-500 text-sm font-body animate-fade-up-d2">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-ink-400 hover:text-ink-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
