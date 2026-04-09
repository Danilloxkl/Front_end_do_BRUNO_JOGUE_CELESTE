import { Link } from 'react-router-dom'

export default function HabitCard({ record }) {
  return (
    <article className="habit-card">
      <div className="habit-card-top">
        <span className="pill">{record.mood || 'normal'}</span>
        <span className="muted-inline">{record.date}</span>
      </div>

      <div className="habit-metrics">
        <div>
          <span className="metric-label">Água</span>
          <strong>{record.waterIntakeMl} ml</strong>
        </div>
        <div>
          <span className="metric-label">Atividade</span>
          <strong>{record.activityMinutes} min</strong>
        </div>
      </div>

      <p className="habit-notes">{record.notes || 'Sem observações para este dia.'}</p>

      <Link to={`/habits/${record.id}`} className="text-link">
        Abrir detalhes
      </Link>
    </article>
  )
}
