import { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteHabitRecord,
  getHabitRecordById,
  updateHabitRecord,
} from '../api/habitApi'
import {
  getHabitDateBounds,
  validateHabitForm,
} from '../utils/habitValidation'

export default function HabitDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useRef(null)
  const { minDateString, maxDateString } = getHabitDateBounds()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    let active = true

    async function loadRecord() {
      try {
        setLoading(true)
        setError('')
        const response = await getHabitRecordById(id)

        if (active) {
          setForm({
            date: response.data.date,
            waterIntakeMl: response.data.waterIntakeMl ?? '',
            activityMinutes: response.data.activityMinutes ?? '',
            mood: response.data.mood,
            notes: response.data.notes ?? '',
          })
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.data?.message || 'Não foi possivel carregar este registro.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadRecord()

    return () => {
      active = false
    }
  }, [id])

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
        summary: 'Formulário invalido',
        detail: Object.values(errors)[0],
      })
      return
    }

    try {
      setSaving(true)
      setError('')
      setFieldErrors({})
      await updateHabitRecord(id, data)
      sessionStorage.setItem(
        'habitToast',
        JSON.stringify({
          severity: 'success',
          summary: 'Registro atualizado',
          detail: 'As alterações foram salvas com sucesso.',
        })
      )
      navigate('/habits')
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || 'Não foi possível atualizar o registro.'
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

  async function handleDelete() {
    const confirmed = window.confirm('Tem certeza de que deseja excluir este registro?')

    if (!confirmed) {
      toast.current?.show({
        severity: 'info',
        summary: 'Exclusão cancelada',
        detail: 'O registro foi mantido.',
      })
      return
    }

    try {
      setSaving(true)
      setError('')
      await deleteHabitRecord(id)
      sessionStorage.setItem(
        'habitToast',
        JSON.stringify({
          severity: 'success',
          summary: 'Registro excluído',
          detail: 'O registro foi removido com sucesso.',
        })
      )
      navigate('/habits')
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || 'Nao foi possível excluir o registro.'
      setError(message)
      toast.current?.show({
        severity: 'error',
        summary: 'Erro ao excluir',
        detail: message,
      })
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="empty-card">
        <p>Carregando registro...</p>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="empty-card">
        <h2>Registro indisponível</h2>
        <p>{error || 'Este registro nao existe.'}</p>
        <Link to="/habits" className="text-link">
          Voltar para a lista
        </Link>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <Toast ref={toast} position="top-right" />
      <section className="page-section">
        <div className="section-header">
          <div>
            <p className="section-kicker">Detalhe do registro</p>
            <h1>Editar hábito #{id}</h1>
          </div>
          <Link to="/habits" className="text-link">
            Voltar para a lista
          </Link>
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
            Água (ml)
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
              rows="5"
              maxLength="500"
              value={form.notes}
              onChange={handleChange}
            />
            {fieldErrors.notes && <small className="feedback-error">{fieldErrors.notes}</small>}
          </label>

          <div className="button-row">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
            <button
              type="button"
              className="secondary-button"
              disabled={saving}
              onClick={handleDelete}
            >
              Excluir
            </button>
          </div>
        </form>

        {error && <p className="feedback-error">{error}</p>}
      </section>
    </div>
  )
}
