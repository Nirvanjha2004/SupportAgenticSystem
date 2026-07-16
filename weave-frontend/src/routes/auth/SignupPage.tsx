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

const STRENGTH_META: Record<Strength, { label: string; color: string }> = {
  0: { label: '', color: '' },
  1: { label: 'Weak', color: 'bg-[#A84F3A]' },
  2: { label: 'Fair', color: 'bg-[#C68A32]' },
  3: { label: 'Good', color: 'bg-[#5E6B3F]' },
  4: { label: 'Strong', color: 'bg-[#567D46]' },
}

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getStrength(password)
  const meta = STRENGTH_META[strength]

  if (!password) return null

  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-[#DDD5C8]">
            <motion.div
              className={`h-full rounded-full ${i < strength ? meta.color : ''}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < strength ? 1 : 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        ))}
      </div>
      {meta.label && (
        <p className="font-mono text-[10px] text-[#8A857D]">
          Strength:{' '}
          <span className={strength === 1 ? 'text-[#A84F3A]' : strength === 2 ? 'text-[#C68A32]' : strength === 3 ? 'text-[#5E6B3F]' : 'text-[#567D46]'}>
            {meta.label}
          </span>
        </p>
      )}
    </motion.div>
  )
}

export default function SignupPage() {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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
    navigate('/onboarding')
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F5F1E8] px-4 py-16">
      <BackgroundMesh />

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative mb-10">
        <LogoMark />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, delay: 0.08 }} className="w-full max-w-[420px]">
        <AuthCard>
          <div className="mb-6">
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A857D]">
              Free to get started
            </span>
            <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-[#2B2A26]">
              Create your account
            </h1>
          </div>

          <GoogleButton label="Sign up with Google" />
          <OrDivider />

          <div className="space-y-4">
            <AuthInput
              label="Full name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError() }}
              placeholder="Ada Lovelace"
            />

            <AuthInput
              label="Work email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError() }}
              placeholder="ada@company.com"
            />

            <div className="space-y-2">
              <AuthInput
                label="Password"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError() }}
                placeholder="Min. 8 characters"
                right={
                  <button type="button" onClick={() => setShow(!show)} className="text-[#8A857D] transition-colors hover:text-[#2B2A26]">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <PasswordStrengthBar password={password} />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2 rounded-btn border border-[#A84F3A]/30 bg-[#A84F3A]/5 px-3 py-2.5">
                <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0 text-[#A84F3A]" />
                <p className="font-mono text-[11px] leading-relaxed text-[#A84F3A]">{error}</p>
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
                  Create account
                </span>
              )}
            </motion.button>
          </div>

          <p className="mt-6 text-center font-mono text-[11px] text-[#8A857D]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#5E6B3F] underline underline-offset-2 transition-colors hover:text-[#49552F]">
              Log in
            </Link>
          </p>
        </AuthCard>
      </motion.div>

      <LegalFooter />
    </div>
  )
}
