import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link to="/" className="brand">
          HabitRecorderr
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          {user && (
            <NavLink to="/habits" className="nav-link">
              Habitos
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-chip">
                {user.email}
                <small>{user.role}</small>
              </span>
              <button type="button" className="secondary-button" onClick={logout}>
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="primary-link">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
