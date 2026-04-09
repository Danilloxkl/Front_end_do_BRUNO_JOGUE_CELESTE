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
      setError(requestError.response?.data?.message || 'Falha na autenticação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-card">
        <div>
          <p className="section-kicker">Autenticação</p>
          <h1>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h1>
          <p className="hero-copy">
            Entre com sua conta para acessar e registrar seus hábitos diários.
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
            Senha
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
              ? 'Aguarde...'
              : mode === 'login'
                ? 'Entrar'
                : 'Cadastrar e entrar'}
          </button>
        </form>

        <button
          type="button"
          className="text-link"
          onClick={() => setMode((current) => (current === 'login' ? 'register' : 'login'))}
        >
          {mode === 'login'
            ? 'Não tem conta? Cadastre-se aqui.'
            : 'Já tem cadastro? Voltar para o login.'}
        </button>

        {error && <p className="feedback-error">{error}</p>}
      </section>
    </div>
  )
}
