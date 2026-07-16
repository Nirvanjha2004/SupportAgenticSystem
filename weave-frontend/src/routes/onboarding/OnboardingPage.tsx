import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, FileSpreadsheet, FileText, ArrowRight, Check } from 'lucide-react'

const CONNECTORS = [
  {
    type: 'slack',
    name: 'Slack',
    description: 'Messages, threads, and channels',
    icon: MessageSquare,
    gradient: 'from-[#4A154B]/20 to-[#36C5F0]/10',
    glowBorder: 'hover:border-[#36C5F0]/35',
  },
  {
    type: 'google_docs',
    name: 'Google Docs',
    description: 'Docs, sheets, and Drive files',
    icon: FileSpreadsheet,
    gradient: 'from-[#0F9D58]/15 to-[#4285F4]/10',
    glowBorder: 'hover:border-[#4285F4]/35',
  },
  {
    type: 'notion',
    name: 'Notion',
    description: 'Pages, databases, and wikis',
    icon: FileText,
    gradient: 'from-white/[0.04] to-white/0',
    glowBorder: 'hover:border-white/20',
  },
]

function LogoMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-[#5B8DF0] shadow-[0_0_20px_-4px_rgba(108,99,255,0.75)]">
        <span className="h-2 w-2 rounded-[3px] bg-white" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
        Weave
      </span>
    </Link>
  )
}

function BackgroundMesh() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #26314A 1px, transparent 1px), linear-gradient(to bottom, #26314A 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]"
      />
      <motion.div
        animate={{ y: [0, -14, 0], opacity: [0.2, 0.38, 0.2] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/3 right-1/4 h-72 w-72 translate-x-1/2 translate-y-1/2 rounded-full bg-[#5B8DF0]/15 blur-[100px]"
      />
    </div>
  )
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2">
      {([1, 2] as const).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <motion.div
            animate={{
              borderColor: s <= step ? '#6C63FF' : '#26314A',
              backgroundColor: s < step ? '#6C63FF' : 'transparent',
              color: s < step ? '#ffffff' : s === step ? '#6C63FF' : '#8C97B3',
            }}
            transition={{ duration: 0.3 }}
            className="flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[11px]"
          >
            {s < step ? <Check className="h-3 w-3" /> : s}
          </motion.div>
          {s < 2 && (
            <motion.div
              animate={{ backgroundColor: s < step ? '#6C63FF' : '#26314A' }}
              transition={{ duration: 0.3 }}
              className="h-px w-8"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const navigate = useNavigate()

  const canContinue = name.trim().length >= 2

  const handleConnectorClick = (type: string) => {
    setSelected(type)
    setTimeout(() => {
      window.location.href = `http://localhost:8000/connectors/${type}/install`
    }, 350)
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
        className="relative w-full max-w-[460px]"
      >
        {/* outer glow ring */}
        <div className="absolute -inset-px rounded-[13px] bg-gradient-to-b from-accent/25 via-line/40 to-line/20 opacity-70" />

        <div className="relative overflow-hidden rounded-card border border-line bg-surface px-8 py-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.65)]">
          {/* inner top shimmer */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

          {/* step row */}
          <div className="mb-7 flex items-center justify-between">
            <StepIndicator step={step} />
            <span className="font-mono text-[11px] text-text-muted">
              Step {step} of 2
            </span>
          </div>

          {/* animated step content */}
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28 }}
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  Getting started
                </span>
                <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-text-primary">
                  Name your workspace
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  This is how your team will identify this Weave instance.
                </p>

                <div className="mt-6 space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                    Workspace name
                  </label>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && canContinue && setStep(2)}
                    placeholder="e.g. Acme Corp"
                    className="h-11 w-full rounded-btn border border-line bg-surface-raised px-4 text-sm text-text-primary placeholder:text-text-muted/40 transition-all focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                  />
                </div>

                <motion.button
                  disabled={!canContinue}
                  onClick={() => setStep(2)}
                  whileHover={canContinue ? { scale: 1.015 } : {}}
                  whileTap={canContinue ? { scale: 0.985 } : {}}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-btn bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_24px_-6px_rgba(108,99,255,0.55)] transition-opacity disabled:cursor-not-allowed disabled:opacity-25"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28 }}
              >
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  {name}
                </span>
                <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-text-primary">
                  Connect your first source
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  We'll ingest your data and keep it in sync automatically.
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  {CONNECTORS.map((c, i) => (
                    <motion.button
                      key={c.type}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      onClick={() => handleConnectorClick(c.type)}
                      disabled={selected !== null}
                      className={`group relative overflow-hidden rounded-[10px] border border-line p-[1px] text-left transition-all duration-200 ${c.glowBorder} ${
                        selected === c.type
                          ? 'scale-[0.97] opacity-60'
                          : selected !== null
                          ? 'opacity-40'
                          : 'hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(108,99,255,0.2)]'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-3 rounded-[9px] bg-gradient-to-br ${c.gradient} p-4 transition-colors duration-200`}
                      >
                        {/* icon box */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-ink/80 transition-colors group-hover:border-line/80">
                          <c.icon className="h-[18px] w-[18px] text-text-muted transition-colors group-hover:text-text-primary" />
                        </div>

                        {/* label */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary">{c.name}</p>
                          <p className="text-xs text-text-muted">{c.description}</p>
                        </div>

                        {/* arrow */}
                        <ArrowRight className="h-4 w-4 shrink-0 text-text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* bottom row */}
                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={() => { setSelected(null); setStep(1) }}
                    className="text-xs text-text-muted transition-colors hover:text-text-primary"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-xs text-text-muted transition-colors hover:text-text-primary"
                  >
                    I'll do this later
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* legal */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative mt-8 text-center font-mono text-[11px] text-text-muted"
      >
        By continuing, you agree to our{' '}
        <a href="/terms" className="underline underline-offset-2 transition-colors hover:text-text-primary">
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline underline-offset-2 transition-colors hover:text-text-primary">
          Privacy Policy
        </a>.
      </motion.p>
    </div>
  )
}