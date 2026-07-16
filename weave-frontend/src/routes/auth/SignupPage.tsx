import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import {
  LogoMark,
  BackgroundMesh,
  AuthCard,
  AuthInput,
  GoogleButton,
  OrDivider,
  LegalFooter,
} from '../../components/auth/AuthShared'

// ── password strength ────────────────────────────────────────────────────────

type Strength = 0 | 1 | 2 | 3 | 4

function getStrength(pw: string): Strength {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4) as Strength
}

const STRENGTH_META: Record<Strength, { label: string; color: string; segments: number }> = {
  0: { label: '',        color: 'bg-line',         segments: 0 },
  1: { label: 'Weak',   color: 'bg-signal-red',   segments: 1 },
  2: { label: 'Fair',   color: 'bg-signal-amber',  segments: 2 },
  3: { label: 'Good',   color: 'bg-accent',        segments: 3 },
  4: { label: 'Strong', color: 'bg-signal-green',  segments: 4 },
}

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getStrength(password)
  const meta = STRENGTH_META[strength]

  if (!password) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1.5"
    >
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
            <motion.div
              className={`h-full rounded-full ${i < meta.segments ? meta.color : ''}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < meta.segments ? 1 : 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        ))}
      </div>
      {meta.label && (
        <p className="font-mono text-[10px] text-text-muted">
          Strength:{' '}
          <span
            className={
              strength === 1 ? 'text-signal-red'
              : strength === 2 ? 'text-signal-amber'
              : strength === 3 ? 'text-accent'
              : 'text-signal-green'
            }
          >
            {meta.label}
          </span>
        </p>
      )}
    </motion.div>
  )
}

// ── page ────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const [show, setShow] = useState(false)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  const clearError = () => setError('')

  const canSubmit = useMemo(
    () => name.trim().length >= 2 && email.includes('@') && password.length >= 8,
    [name, email, password],
  )

  const handleSubmit = async () => {
    setError('')
    if (!canSubmit) { setError('Please fill in all fields correctly.'); return }
    if (getStrength(password) < 2) {
      setError('Password is too weak. Try mixing letters, numbers, and symbols.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    // Replace with real signup call — navigate to onboarding on success
    navigate('/onboarding')
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-ink px-4 py-16">
      <BackgroundMesh />

      {/* logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mb-10"
      >
        <LogoMark />
      </motion.div>

      {/* card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="w-full max-w-[420px]"
      >
        <AuthCard>
          {/* heading */}
          <div className="mb-6">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
              Free to get started
            </span>
            <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-text-primary">
              Create your account
            </h1>
          </div>

          <GoogleButton label="Sign up with Google" />
          <OrDivider />

          <div className="space-y-4">
            {/* name */}
            <AuthInput
              label="Full name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError() }}
              placeholder="Ada Lovelace"
            />

            {/* email */}
            <AuthInput
              label="Work email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError() }}
              placeholder="ada@company.com"
            />

            {/* password */}
            <div className="space-y-2">
              <AuthInput
                label="Password"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError() }}
                placeholder="Min. 8 characters"
                right={
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="text-text-muted transition-colors hover:text-text-primary"
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <PasswordStrengthBar password={password} />
            </div>

            {/* inline error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-btn border border-signal-red/30 bg-signal-red/10 px-3 py-2.5"
              >
                <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0 text-signal-red" />
                <p className="font-mono text-[11px] leading-relaxed text-signal-red">{error}</p>
              </motion.div>
            )}

            {/* submit */}
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              whileHover={!loading ? { scale: 1.015 } : {}}
              whileTap={!loading ? { scale: 0.985 } : {}}
              className="group relative mt-1 flex h-11 w-full items-center justify-center overflow-hidden rounded-btn bg-accent text-sm font-medium text-white shadow-[0_4px_24px_-6px_rgba(108,99,255,0.55)] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
              ) : (
                <>
                  <span className="relative z-10">Create account</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
                </>
              )}
            </motion.button>
          </div>

          {/* footer */}
          <p className="mt-6 text-center font-mono text-[11px] text-text-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-accent underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              Log in
            </Link>
          </p>
        </AuthCard>
      </motion.div>

      <LegalFooter />
    </div>
  )
}
