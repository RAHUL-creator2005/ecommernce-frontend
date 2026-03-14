import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

const readToken = () => {
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

const readUser = () => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readToken())
  const [user, setUser] = useState(() => readUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'token' || event.key === 'user') {
        setToken(readToken())
        setUser(readUser())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = async (payload) => {
    setLoading(true)
    try {
      const data = await authService.login(payload)
      setToken(data?.token || readToken())
      setUser(data?.user || readUser())
      return data
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const data = await authService.register(payload)
      setToken(data?.token || readToken())
      setUser(data?.user || readUser())
      return data
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
