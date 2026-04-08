import { createContext, useContext, useMemo, useState } from 'react'
import { loginRequest, registerRequest } from '../api/authApi'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStorage('auth:user', null))
  const [token, setToken] = useState(() => readStorage('auth:token', null))

  function persistSession(nextUser, nextToken) {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem('auth:user', JSON.stringify(nextUser))
    localStorage.setItem('auth:token', JSON.stringify(nextToken))
  }

  async function login(email, password) {
    const response = await loginRequest({ email, password })
    persistSession(response.data.user, response.data.token)
    return response.data.user
  }

  async function register(email, password) {
    await registerRequest({ email, password })
    return login(email, password)
  }

  function logout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth:user')
    localStorage.removeItem('auth:token')
  }

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
