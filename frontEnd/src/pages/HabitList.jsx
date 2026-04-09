import { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import HabitCard from '../components/HabitCard'
import { createHabitRecord, getHabitRecords } from '../api/habitApi'
import {
  getHabitDateBounds,
  validateHabitForm,
} from '../utils/habitValidation'

const initialForm = {
  date: getHabitDateBounds().maxDateString,
  waterIntakeMl: '',
  activityMinutes: '',
  mood: 'normal',
  notes: '',
}

export default function HabitList() {
  const toast = useRef(null)
  const { minDateString, maxDateString } = getHabitDateBounds()
  const [records, setRecords] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    loadRecords()
  }, [])

  useEffect(() => {
    const flashToast = sessionStorage.getItem('habitToast')

    if (!flashToast) {
      return
    }

    sessionStorage.removeItem('habitToast')

    try {
      toast.current?.show(JSON.parse(flashToast))
    } catch {
      sessionStorage.removeItem('habitToast')
    }
  }, [])

  async function loadRecords() {
    try {
      setLoading(true)
      setError('')
      const response = await getHabitRecords()
      setRecords(response.data)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Nao foi possível carregar os registros.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFieldErrors((current) => ({ ...current, [name]: '' }))
    setForm((current) => ({
      ...current,
      [name]:
        name === 'waterIntakeMl' || name === 'activityMinutes'
          ? value === ''
            ? ''
            : Number(value)
          : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const { data, errors } = await validateHabitForm(form)

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setError('Corrija os campos destacados antes de salvar.')
      toast.current?.show({
        severity: 'error',
        summary: 'Formulário inválido',
        detail: Object.values(errors)[0],
      })
      return
    }

    try {
      setSaving(true)
      setError('')
      setFieldErrors({})
      await createHabitRecord(data)
      setForm(initialForm)
      await loadRecords()
      toast.current?.show({
        severity: 'success',
        summary: 'Registro criado',
        detail: 'O hábito foi salvo com sucesso.',
      })
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || 'Não foi possível salvar o registro.'
      setError(message)
      toast.current?.show({
        severity: 'error',
        summary: 'Erro ao salvar',
        detail: message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-stack">
      <Toast ref={toast} position="top-right" />
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
              min={minDateString}
              max={maxDateString}
              required
            />
            {fieldErrors.date && <small className="feedback-error">{fieldErrors.date}</small>}
          </label>
          <label>
            Agua (ml)
            <input
              type="number"
              name="waterIntakeMl"
              min="1"
              value={form.waterIntakeMl}
              onChange={handleChange}
              required
            />
            {fieldErrors.waterIntakeMl && (
              <small className="feedback-error">{fieldErrors.waterIntakeMl}</small>
            )}
          </label>
          <label>
            Atividade (min)
            <input
              type="number"
              name="activityMinutes"
              min="1"
              value={form.activityMinutes}
              onChange={handleChange}
              required
            />
            {fieldErrors.activityMinutes && (
              <small className="feedback-error">{fieldErrors.activityMinutes}</small>
            )}
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
              required
            />
            {fieldErrors.mood && <small className="feedback-error">{fieldErrors.mood}</small>}
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
            {fieldErrors.notes && <small className="feedback-error">{fieldErrors.notes}</small>}
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
            <p>Suas entradas aparecerão aqui depois do primeiro registro.</p>
          </div>
        )}
      </section>
    </div>
  )
}
