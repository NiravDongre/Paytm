import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth()
  if (!isAuthed) return <Navigate to="/signin" replace />
  return children
}
