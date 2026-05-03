import { createContext, useContext, useState, useEffect } from 'react'
import { getToken, clearTokens } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => !!localStorage.getItem('fp_access_token'))

  function login() { setIsAuthed(true) }

  function logout() {
    clearTokens()
    setIsAuthed(false)
  }

  // Sync across tabs
  useEffect(() => {
    const handler = () => setIsAuthed(!!localStorage.getItem('fp_access_token'))
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthed, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
