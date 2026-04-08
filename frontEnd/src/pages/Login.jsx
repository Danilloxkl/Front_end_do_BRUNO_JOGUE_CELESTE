import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const initialForm = {
  email: '',
  password: '',
}

export default function Login() {
  const { user, login, register } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/habits" replace />
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      if (mode === 'register') {
        await register(form.email, form.password)
      } else {
        await login(form.email, form.password)
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-card">
        <div>
          <p className="section-kicker">Authentication</p>
          <h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
          <p className="hero-copy">
            This screen calls your Express backend directly instead of using demo
            local data.
          </p>
        </div>

        <form className="record-form" onSubmit={handleSubmit}>
          <label className="full-span">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label className="full-span">
            Password
            <input
              type="password"
              name="password"
              minLength="6"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Login'
                : 'Register and login'}
          </button>
        </form>

        <button
          type="button"
          className="text-link"
          onClick={() => setMode((current) => (current === 'login' ? 'register' : 'login'))}
        >
          {mode === 'login'
            ? 'Need an account? Register here.'
            : 'Already registered? Go back to login.'}
        </button>

        {error && <p className="feedback-error">{error}</p>}
      </section>
    </div>
  )
}
