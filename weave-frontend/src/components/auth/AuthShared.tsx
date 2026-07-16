import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

export function LogoMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5E6B3F] shadow-soft">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="3" width="10" height="10" rx="2.5" stroke="#FBF9F5" strokeWidth="1.5" />
          <path d="M5.5 8L7.5 10L10.5 6" stroke="#FBF9F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-[#2B2A26]">Weave</span>
    </Link>
  )
}

export function BackgroundMesh() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Warm grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #5E6B3F 1px, transparent 1px), linear-gradient(to bottom, #5E6B3F 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
      {/* Warm organic orbs */}
      <motion.div
        animate={{ y: [0, 16, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/3 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DCCB9A]/20 blur-[120px]"
      />
      <motion.div
        animate={{ y: [0, -12, 0], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-1/3 right-1/3 h-72 w-72 translate-x-1/2 translate-y-1/2 rounded-full bg-[#A8B18A]/15 blur-[100px]"
      />
      {/* Paper grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.02] mix-blend-multiply">
        <filter id="authGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#authGrain)" />
      </svg>
    </div>
  )
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

/** Shared card shell — warm sand card */
export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[420px]">
      <div className="card-sand overflow-hidden px-8 py-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A8B18A]/30 to-transparent" />
        {children}
      </div>
    </div>
  )
}

/** Reusable text input — warm sand theme */
export function AuthInput({
  label,
  hint,
  right,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A857D]">
          {label}
        </label>
        {hint}
      </div>
      <div className="relative">
        <input
          {...props}
          className={`h-11 w-full rounded-btn border border-[#DDD5C8] bg-[#FBF9F5] px-4 text-sm text-[#2B2A26] placeholder:text-[#8A857D]/50 transition-all focus:border-[#5E6B3F]/50 focus:outline-none focus:ring-2 focus:ring-[#5E6B3F]/10 ${right ? 'pr-11' : ''} ${props.className ?? ''}`}
        />
        {right && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  )
}

/** Google SSO button */
export function GoogleButton({ label = 'Continue with Google' }: { label?: string }) {
  return (
    <button
      type="button"
      className="group flex w-full items-center justify-center gap-2.5 rounded-btn border border-[#DDD5C8] bg-[#FBF9F5] py-2.5 text-sm font-medium text-[#2B2A26] transition-all duration-300 hover:-translate-y-px hover:border-[#C5BBAA] hover:shadow-soft"
    >
      <GoogleIcon />
      {label}
    </button>
  )
}

/** "or" divider */
export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-[#DDD5C8]" />
      <span className="font-mono text-[10px] text-[#8A857D]">or</span>
      <div className="h-px flex-1 bg-[#DDD5C8]" />
    </div>
  )
}

/** Legal footer copy */
export function LegalFooter() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="relative mt-8 text-center font-mono text-[11px] text-[#8A857D]"
    >
      By continuing, you agree to our{' '}
      <a href="/terms" className="underline underline-offset-2 transition-colors hover:text-[#2B2A26]">
        Terms
      </a>{' '}
      and{' '}
      <a href="/privacy" className="underline underline-offset-2 transition-colors hover:text-[#2B2A26]">
        Privacy Policy
      </a>.
    </motion.p>
  )
}
