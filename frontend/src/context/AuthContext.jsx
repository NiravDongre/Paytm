import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(() => !!localStorage.getItem('fp_access_token'))

  function login() { setIsAuthed(true) }

  function logout() {
    localStorage.removeItem('fp_access_token')
    localStorage.removeItem('fp_refresh_token')
    localStorage.removeItem('fp_user_id')
    setIsAuthed(false)
  }

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
