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
  },
  {
    type: 'google_docs',
    name: 'Google Docs',
    description: 'Docs, sheets, and Drive files',
    icon: FileSpreadsheet,
  },
  {
    type: 'notion',
    name: 'Notion',
    description: 'Pages, databases, and wikis',
    icon: FileText,
  },
]

function LogoMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5E6B3F] shadow-soft">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="2" width="10" height="10" rx="2" stroke="#FBF9F5" strokeWidth="1.5" />
          <path d="M5 7l2 2 3-3" stroke="#FBF9F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-[#2B2A26]">Weave</span>
    </Link>
  )
}

function BackgroundMesh() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #5E6B3F 1px, transparent 1px), linear-gradient(to bottom, #5E6B3F 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
      <motion.div
        animate={{ y: [0, 16, 0], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DCCB9A]/20 blur-[120px]"
      />
      <motion.div
        animate={{ y: [0, -12, 0], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-1/3 right-1/4 h-72 w-72 translate-x-1/2 translate-y-1/2 rounded-full bg-[#A8B18A]/12 blur-[100px]"
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
              borderColor: s <= step ? '#5E6B3F' : '#DDD5C8',
              backgroundColor: s < step ? '#5E6B3F' : 'transparent',
              color: s < step ? '#FBF9F5' : s === step ? '#5E6B3F' : '#8A857D',
            }}
            transition={{ duration: 0.3 }}
            className="flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[11px]"
          >
            {s < step ? <Check className="h-3 w-3" /> : s}
          </motion.div>
          {s < 2 && (
            <motion.div
              animate={{ backgroundColor: s < step ? '#5E6B3F' : '#DDD5C8' }}
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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F5F1E8] px-4 py-16">
      <BackgroundMesh />

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative mb-10">
        <LogoMark />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="relative w-full max-w-[460px]"
      >
        <div className="card-sand overflow-hidden px-8 py-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A8B18A]/30 to-transparent" />

          <div className="mb-7 flex items-center justify-between">
            <StepIndicator step={step} />
            <span className="font-mono text-[11px] text-[#8A857D]">Step {step} of 2</span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28 }}
              >
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A857D]">
                  Getting started
                </span>
                <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#2B2A26]">
                  Name your workspace
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6D685F]">
                  This is how your team will identify this Weave instance.
                </p>

                <div className="mt-6 space-y-1.5">
                  <label className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A857D]">
                    Workspace name
                  </label>
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && canContinue && setStep(2)}
                    placeholder="e.g. Acme Corp"
                    className="h-11 w-full rounded-btn border border-[#DDD5C8] bg-[#FBF9F5] px-4 text-sm text-[#2B2A26] placeholder:text-[#8A857D]/40 transition-all focus:border-[#5E6B3F]/50 focus:outline-none focus:ring-2 focus:ring-[#5E6B3F]/10"
                  />
                </div>

                <motion.button
                  disabled={!canContinue}
                  onClick={() => setStep(2)}
                  whileHover={canContinue ? { scale: 1.015 } : {}}
                  whileTap={canContinue ? { scale: 0.985 } : {}}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-btn bg-[#5E6B3F] px-5 py-2.5 text-sm font-medium text-[#FBF9F5] shadow-soft transition-all duration-300 hover:bg-[#49552F] disabled:cursor-not-allowed disabled:opacity-40"
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
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-[#8A857D]">
                  {name}
                </span>
                <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#2B2A26]">
                  Connect your first source
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6D685F]">
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
                      className={`group relative overflow-hidden rounded-xl border border-[#DDD5C8] bg-[#FBF9F5] p-4 text-left transition-all duration-200 ${
                        selected === c.type
                          ? 'scale-[0.97] opacity-60'
                          : selected !== null
                          ? 'opacity-40'
                          : 'hover:-translate-y-0.5 hover:shadow-card-hover'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#DDD5C8]/60 bg-[#F5F1E8] transition-colors">
                          <c.icon className="h-[18px] w-[18px] text-[#5E6B3F]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-[#2B2A26]">{c.name}</p>
                          <p className="text-xs text-[#6D685F]">{c.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-[#8A857D] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button onClick={() => { setSelected(null); setStep(1) }} className="text-xs text-[#8A857D] transition-colors hover:text-[#2B2A26]">
                    ← Back
                  </button>
                  <button onClick={() => navigate('/dashboard')} className="text-xs text-[#8A857D] transition-colors hover:text-[#2B2A26]">
                    I'll do this later
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative mt-8 text-center font-mono text-[11px] text-[#8A857D]"
      >
        By continuing, you agree to our{' '}
        <a href="/terms" className="underline underline-offset-2 transition-colors hover:text-[#2B2A26]">Terms</a>{' '}
        and{' '}
        <a href="/privacy" className="underline underline-offset-2 transition-colors hover:text-[#2B2A26]">Privacy Policy</a>.
      </motion.p>
    </div>
  )
}
