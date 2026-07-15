import { Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/sources/:type" element={<SourceDetailPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/ask" element={<AskPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
