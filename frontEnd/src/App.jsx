import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import HabitList from './pages/HabitList'
import HabitDetail from './pages/HabitDetail'
import Login from './pages/Login'

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/habits"
            element={
              <ProtectedRoute>
                <HabitList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/habits/:id"
            element={
              <ProtectedRoute>
                <HabitDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
