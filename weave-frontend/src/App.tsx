import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './routes/marketing/LandingPage'
import LoginPage from './routes/auth/LoginPage'
import SignupPage from './routes/auth/SignupPage'
import OnboardingPage from './routes/onboarding/OnboardingPage'
import AppShell from './components/layout/AppShell'
import DashboardPage from './routes/app/DashboardPage'
import SourcesPage from './routes/app/SourcesPage'
import SourceDetailPage from './routes/app/SourceDetailPage'
import DocumentsPage from './routes/app/DocumentsPage'
import AskPage from './routes/app/AskPage'
import SettingsPage from './routes/app/SettingsPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const { user, token } = useAppStore()
  const isAuthenticated = user !== null && token !== null

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
      />
      <Route path="/onboarding" element={<OnboardingPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/sources/:type" element={<SourceDetailPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
