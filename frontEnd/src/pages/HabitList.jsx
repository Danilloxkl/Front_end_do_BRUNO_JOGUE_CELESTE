import { useEffect, useState } from 'react'
import HabitCard from '../components/HabitCard'
import { createHabitRecord, getHabitRecords } from '../api/habitApi'

const initialForm = {
  date: new Date().toISOString().slice(0, 10),
  waterIntakeMl: 0,
  activityMinutes: 0,
  mood: 'normal',
  notes: '',
}

export default function HabitList() {
  const [records, setRecords] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRecords()
  }, [])

  async function loadRecords() {
    try {
      setLoading(true)
      setError('')
      const response = await getHabitRecords()
      setRecords(response.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Nao foi possivel carregar os registros.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]:
        name === 'waterIntakeMl' || name === 'activityMinutes'
          ? Number(value)
          : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      await createHabitRecord(form)
      setForm(initialForm)
      await loadRecords()
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Nao foi possivel salvar o registro.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-stack">
      <section className="page-section">
        <div className="section-header">
          <div>
            <p className="section-kicker">Check-in diário</p>
            <h1>Registros de hábitos</h1>
          </div>
        </div>

        <form className="record-form" onSubmit={handleSubmit}>
          <label>
            Data
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Agua (ml)
            <input
              type="number"
              name="waterIntakeMl"
              min="0"
              value={form.waterIntakeMl}
              onChange={handleChange}
            />
          </label>
          <label>
            Atividade (min)
            <input
              type="number"
              name="activityMinutes"
              min="0"
              value={form.activityMinutes}
              onChange={handleChange}
            />
          </label>
          <label>
            Humor
            <input
              type="text"
              name="mood"
              minLength="2"
              maxLength="30"
              value={form.mood}
              onChange={handleChange}
            />
          </label>
          <label className="full-span">
            Observações
            <textarea
              name="notes"
              rows="4"
              maxLength="500"
              value={form.notes}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? 'Salvando...' : 'Criar registro'}
          </button>
        </form>

        {error && <p className="feedback-error">{error}</p>}
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <p className="section-kicker">Histórico</p>
            <h2>Suas entradas salvas</h2>
          </div>
        </div>

        {loading ? (
          <div className="empty-card">
            <p>Carregando registros...</p>
          </div>
        ) : records.length > 0 ? (
          <div className="habit-grid">
            {records.map((record) => (
              <HabitCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <div className="empty-card">
            <h3>Nenhum registro encontrado</h3>
            <p>Suas entradas aparecerão aqui depois do primeiro salvamento.</p>
          </div>
        )}
      </section>
    </div>
  )
}
