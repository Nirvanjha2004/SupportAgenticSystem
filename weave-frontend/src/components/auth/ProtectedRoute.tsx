import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'

export default function ProtectedRoute() {
  const { user, token } = useAppStore()
  
  const isAuthenticated = user !== null && token !== null
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <Outlet />
}
