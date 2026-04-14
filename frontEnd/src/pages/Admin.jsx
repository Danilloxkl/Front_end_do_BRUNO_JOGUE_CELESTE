import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  deleteAdminRecord,
  deleteUserAdmin,
  getAdminRecords,
  getUsersAdmin,
  updateUserAdmin,
} from "../api/adminApi"

function formatDate(value) {
  if (!value) {
    return "Sem data"
  }

  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export default function Admin() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadAdminData() {
    try {
      setLoading(true)
      setError("")

      const [usersData, recordsData] = await Promise.all([
        getUsersAdmin(),
        getAdminRecords(),
      ])

      setUsers(usersData)
      setRecords(recordsData)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "Nao foi possivel carregar os dados de administracao."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  async function handleRoleToggle(targetUser) {
    const nextRole = targetUser.role === "admin" ? "user" : "admin"

    try {
      setError("")
      await updateUserAdmin(targetUser.id, { role: nextRole })
      await loadAdminData()
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "Nao foi possivel atualizar a permissao do usuario."
      )
    }
  }

  async function handleDeleteUser(targetUser) {
    if (targetUser.id === user?.id) {
      return
    }

    try {
      setError("")
      await deleteUserAdmin(targetUser.id)
      await loadAdminData()
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "Nao foi possivel remover o usuario."
      )
    }
  }

  async function handleDeleteRecord(recordId) {
    try {
      setError("")
      await deleteAdminRecord(recordId)
      await loadAdminData()
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "Nao foi possivel remover o registro."
      )
    }
  }

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <span className="eyebrow">Area administrativa</span>
        <div className="section-header">
          <div>
            <h1>Painel Admin</h1>
            <p className="hero-copy">
              Gerencie usuarios, permissoes e registros globais da plataforma.
            </p>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={loadAdminData}
            disabled={loading}
          >
            Atualizar dados
          </button>
        </div>
        {error ? <p className="feedback-error">{error}</p> : null}
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Usuarios</span>
            <h2>Permissoes da conta</h2>
          </div>
          <span className="pill">{users.length} usuarios</span>
        </div>

        <div className="admin-grid">
          {users.map((targetUser) => {
            const isCurrentUser = targetUser.id === user?.id

            return (
              <article key={targetUser.id} className="habit-card">
                <div className="habit-card-top">
                  <div>
                    <strong>{targetUser.email}</strong>
                    <p className="habit-notes">
                      Criado em {formatDate(targetUser.createdAt)}
                    </p>
                  </div>
                  <span className="pill">{targetUser.role}</span>
                </div>

                <div className="button-row">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => handleRoleToggle(targetUser)}
                    disabled={loading || isCurrentUser}
                  >
                    {targetUser.role === "admin" ? "Remover admin" : "Tornar admin"}
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleDeleteUser(targetUser)}
                    disabled={loading || isCurrentUser}
                  >
                    Remover usuario
                  </button>
                </div>

                {isCurrentUser ? (
                  <p className="muted-inline">
                    Sua propria conta fica protegida nesta tela.
                  </p>
                ) : null}
              </article>
            )
          })}
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <div>
            <span className="section-kicker">Registros</span>
            <h2>Todos os habitos enviados</h2>
          </div>
          <span className="pill">{records.length} registros</span>
        </div>

        <div className="admin-grid">
          {records.map((record) => (
            <article key={record.id} className="habit-card">
              <div className="habit-card-top">
                <div>
                  <strong>{record.user?.email || "Usuario sem email"}</strong>
                  <p className="habit-notes">
                    {formatDate(record.date)} - Humor: {record.mood || "nao informado"}
                  </p>
                </div>
                <span className="pill">#{record.id}</span>
              </div>

              <div className="habit-metrics">
                <div>
                  <span className="metric-label">Agua</span>
                  <strong>{record.waterIntakeMl ?? 0} ml</strong>
                </div>
                <div>
                  <span className="metric-label">Atividade</span>
                  <strong>{record.activityMinutes ?? 0} min</strong>
                </div>
              </div>

              <p className="habit-notes">{record.notes || "Sem observacoes."}</p>

              <div className="button-row">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => handleDeleteRecord(record.id)}
                  disabled={loading}
                >
                  Remover registro
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
