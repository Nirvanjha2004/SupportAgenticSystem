import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import {
  LogoMark,
  BackgroundMesh,
  AuthCard,
  AuthInput,
  GoogleButton,
  OrDivider,
  LegalFooter,
} from '../../components/auth/AuthShared'
import { useAppStore } from '../../store/useAppStore'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAppStore()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setError('')
    if (!email || !password) { setError('Please fill in both fields.'); return }
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 900))
      // Demo: accept any non-empty email/password for now
      login(
        {
          id: 'user-1',
          name: email.split('@')[0],
          email,
        },
        'demo-token-12345'
      )
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError('')

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F5F1E8] px-4 py-16">
      <BackgroundMesh />

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative mb-10">
        <LogoMark />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, delay: 0.08 }} className="w-full max-w-[420px]">
        <AuthCard>
          <div className="mb-6">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A857D]">Welcome back</span>
            <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-[#2B2A26]">Log in to Weave</h1>
          </div>

          <GoogleButton />
          <OrDivider />

          <div className="space-y-4">
            <AuthInput
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError() }}
              placeholder="you@company.com"
            />

            <AuthInput
              label="Password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError() }}
              placeholder="••••••••"
              hint={
                <a href="/forgot-password" className="font-mono text-[10px] text-[#8A857D] transition-colors hover:text-[#2B2A26]">
                  Forgot password?
                </a>
              }
              right={
                <button type="button" onClick={() => setShow(!show)} className="text-[#8A857D] transition-colors hover:text-[#2B2A26]">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-btn border border-[#A84F3A]/30 bg-[#A84F3A]/5 px-3 py-2.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#A84F3A]" />
                <p className="font-mono text-[11px] text-[#A84F3A]">{error}</p>
              </motion.div>
            )}

            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileHover={!loading ? { scale: 1.015 } : {}}
              whileTap={!loading ? { scale: 0.985 } : {}}
              className="group relative mt-1 flex h-11 w-full items-center justify-center overflow-hidden rounded-btn bg-[#5E6B3F] text-sm font-medium text-[#FBF9F5] shadow-soft transition-all duration-300 hover:bg-[#49552F] hover:shadow-card disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
              ) : (
                <span className="flex items-center gap-2">
                  Log in
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              )}
            </motion.button>
          </div>

          <p className="mt-6 text-center font-mono text-[11px] text-[#8A857D]">
            No account?{' '}
            <Link to="/signup" className="text-[#5E6B3F] underline underline-offset-2 transition-colors hover:text-[#49552F]">
              Sign up free
            </Link>
          </p>
        </AuthCard>
      </motion.div>

      <LegalFooter />
    </div>
  )
}
