import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api'
import { useAuth } from '../context/AuthContext'
import { Logo, AuthShell, Spinner, Toast } from '../components'
import { useToast } from '../hooks/useToast'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast, showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ UserName: '', Email: '', Password: '', confirm: '' })
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!form.UserName.trim())          e.UserName = 'Username is required'
    else if (form.UserName.length < 3)  e.UserName = 'At least 3 characters'
    if (!form.Email.trim())             e.Email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.Email)) e.Email = 'Invalid email'
    if (!form.Password)                 e.Password = 'Password is required'
    else if (form.Password.length < 6)  e.Password = 'At least 6 characters'
    if (form.confirm !== form.Password) e.confirm = 'Passwords do not match'
    return e
  }

  function set(key) {
    return (e) => {
      setForm(f => ({ ...f, [key]: e.target.value }))
      setErrors(prev => ({ ...prev, [key]: '' }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await signup({ UserName: form.UserName, Email: form.Email, Password: form.Password })
      login()
      navigate('/dashboard')
    } catch (err) {
      showToast(err.message || 'Signup failed', 'error')
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
          <p className="mt-2 text-slate-400 text-sm font-body">Create your wallet account</p>
        </div>

        <div className="fp-card p-7 animate-fade-up-d1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="fp-label">Username</label>
              <input
                className="fp-input"
                placeholder="nirav_d"
                value={form.UserName}
                onChange={set('UserName')}
                autoComplete="username"
              />
              {errors.UserName && <p className="fp-error">{errors.UserName}</p>}
            </div>

            <div>
              <label className="fp-label">Email</label>
              <input
                type="email"
                className="fp-input"
                placeholder="you@example.com"
                value={form.Email}
                onChange={set('Email')}
                autoComplete="email"
              />
              {errors.Email && <p className="fp-error">{errors.Email}</p>}
            </div>

            <div>
              <label className="fp-label">Password</label>
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
              <label className="fp-label">Confirm Password</label>
              <input
                type="password"
                className="fp-input"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={set('confirm')}
                autoComplete="new-password"
              />
              {errors.confirm && <p className="fp-error">{errors.confirm}</p>}
            </div>

            <button type="submit" className="fp-btn mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" /> Creating account…
                </span>
              ) : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-slate-500 text-sm font-body animate-fade-up-d2">
          Already have an account?{' '}
          <Link to="/signin" className="text-ink-400 hover:text-ink-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
