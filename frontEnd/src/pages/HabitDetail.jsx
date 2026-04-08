import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteHabitRecord,
  getHabitRecordById,
  updateHabitRecord,
} from '../api/habitApi'

export default function HabitDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
            waterIntakeMl: response.data.waterIntakeMl,
            activityMinutes: response.data.activityMinutes,
            mood: response.data.mood,
            notes: response.data.notes ?? '',
          })
        }
      } catch (requestError) {
        if (active) {
          setError(
            requestError.response?.data?.message || 'Unable to load this record.'
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
      await updateHabitRecord(id, form)
      navigate('/habits')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update record.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    try {
      setSaving(true)
      setError('')
      await deleteHabitRecord(id)
      navigate('/habits')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete record.')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="empty-card">
        <p>Loading record...</p>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="empty-card">
        <h2>Record unavailable</h2>
        <p>{error || 'This record does not exist.'}</p>
        <Link to="/habits" className="text-link">
          Back to list
        </Link>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <section className="page-section">
        <div className="section-header">
          <div>
            <p className="section-kicker">Record detail</p>
            <h1>Edit habit entry #{id}</h1>
          </div>
          <Link to="/habits" className="text-link">
            Back to list
          </Link>
        </div>

        <form className="record-form" onSubmit={handleSubmit}>
          <label>
            Date
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Water (ml)
            <input
              type="number"
              name="waterIntakeMl"
              min="0"
              value={form.waterIntakeMl}
              onChange={handleChange}
            />
          </label>
          <label>
            Activity (min)
            <input
              type="number"
              name="activityMinutes"
              min="0"
              value={form.activityMinutes}
              onChange={handleChange}
            />
          </label>
          <label>
            Mood
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
            Notes
            <textarea
              name="notes"
              rows="5"
              maxLength="500"
              value={form.notes}
              onChange={handleChange}
            />
          </label>

          <div className="button-row">
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
            <button
              type="button"
              className="secondary-button"
              disabled={saving}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </form>

        {error && <p className="feedback-error">{error}</p>}
      </section>
    </div>
  )
}
