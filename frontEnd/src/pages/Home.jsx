import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getHabitRecords, getSummary } from '../api/habitApi'
import HabitCard from '../components/HabitCard'

export default function Home() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [recentRecords, setRecentRecords] = useState([])
  const [loading, setLoading] = useState(Boolean(user))

  useEffect(() => {
    if (!user) {
      setSummary(null)
      setRecentRecords([])
      setLoading(false)
      return
    }

    let active = true

    async function loadDashboard() {
      try {
        setLoading(true)
        const [summaryResponse, recordsResponse] = await Promise.all([
          getSummary(),
          getHabitRecords(),
        ])

        if (!active) {
          return
        }

        setSummary(summaryResponse.data)
        setRecentRecords(recordsResponse.data.slice(0, 3))
      } catch {
        if (active) {
          setSummary(null)
          setRecentRecords([])
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      active = false
    }
  }, [user])

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">HabitRecorderr</p>
          <h1>Registre suas atividades :DDDD</h1>
          <p className="hero-copy">
            This frontend is now aligned with your Express API, so the app can
            authenticate users and read real habit records instead of leftover
            product data.
          </p>
        </div>

        <div className="hero-actions">
          {user ? (
            <>
              <Link to="/habits" className="primary-link">
                Abrir meus registros
              </Link>
              <span className="muted-inline">
                Logado como: <strong>{user.email}</strong>
              </span>
            </>
          ) : (
            <>
              <Link to="/login" className="primary-link">
                Logue para continuar
              </Link>
            </>
          )}
        </div>
      </section>

      {user && (
        <section className="dashboard-grid">
          <article className="stat-card">
            <span className="stat-label">Meus registros</span>
            <strong>{loading ? '...' : summary?.user?.totalRecords ?? 0}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Méd. de água</span>
            <strong>
              {loading
                ? '...'
                : `${summary?.user?.averageWaterIntakeMl ?? 0} ml`}
            </strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Atividade Méd.</span>
            <strong>
              {loading
                ? '...'
                : `${summary?.user?.averageActivityMinutes ?? 0} min`}
            </strong>
          </article>
          <article className="stat-card">
            <span className="stat-label">Tracked users</span>
            <strong>{loading ? '...' : summary?.general?.totalTrackedUsers ?? 0}</strong>
          </article>
        </section>
      )}

      {user && (
        <section className="page-section">
          <div className="section-header">
            <div>
              <p className="section-kicker">Atividade recente</p>
              <h2>Últimas entradas</h2>
            </div>
            <Link to="/habits" className="text-link">
              Ver todas
            </Link>
          </div>

          {recentRecords.length > 0 ? (
            <div className="habit-grid">
              {recentRecords.map((record) => (
                <HabitCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <div className="empty-card">
              <h3>Nenhum registro</h3>
              <p>Create your first daily check-in from the habits page.</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
