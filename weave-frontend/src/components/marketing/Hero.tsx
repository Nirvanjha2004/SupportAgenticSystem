import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare, FileText, FileSpreadsheet, Sparkles } from 'lucide-react'

const TRUST_ITEMS = [
  { label: 'Slack', icon: MessageSquare },
  { label: 'Notion', icon: FileText },
  { label: 'Google Docs', icon: FileSpreadsheet },
]

function BackgroundMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* soft grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #26314A 1px, transparent 1px), linear-gradient(to bottom, #26314A 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      {/* floating blurred orbs */}
      <motion.div
        animate={{ y: [0, 24, 0], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-accent/25 blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute right-0 top-40 h-96 w-96 rounded-full bg-[#5B8DF0]/20 blur-[110px]"
      />

      {/* noise */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  )
}

function HeroVisual() {
  const sources = [
    { label: 'Slack', icon: MessageSquare },
    { label: 'Notion', icon: FileText },
    { label: 'Docs', icon: FileSpreadsheet },
  ]

  return (
    <div className="relative mx-auto w-full max-w-md rounded-card border border-line bg-surface/60 p-6 backdrop-blur-sm">
      <div className="absolute -inset-px rounded-card bg-gradient-to-b from-accent/10 to-transparent" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          {sources.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
              className="flex items-center gap-2 rounded-lg border border-line bg-surface-raised px-3 py-2"
            >
              <s.icon className="h-3.5 w-3.5 text-text-muted" />
              <span className="font-mono text-[11px] text-text-muted">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* connecting lines -> center node */}
        <svg className="absolute left-[104px] top-1 h-[132px] w-16 overflow-visible" viewBox="0 0 64 132">
          {[16, 66, 116].map((y, i) => (
            <motion.path
              key={y}
              d={`M0 ${y} C 28 ${y}, 36 66, 64 66`}
              stroke="#6C63FF"
              strokeWidth="1.5"
              strokeDasharray="4 5"
              fill="none"
              opacity={0.55}
              initial={{ strokeDashoffset: 40 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', delay: i * 0.15 }}
            />
          ))}
        </svg>

        <motion.div
          animate={{ boxShadow: ['0 0 20px 2px rgba(108,99,255,0.35)', '0 0 32px 6px rgba(108,99,255,0.55)', '0 0 20px 2px rgba(108,99,255,0.35)'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-9 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#5B8DF0]"
        >
          <Sparkles className="h-5 w-5 text-white" />
        </motion.div>
      </div>

      {/* answer card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="relative mt-6 rounded-lg border border-line bg-surface-raised p-4"
      >
        <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">Asked</p>
        <p className="mt-1.5 text-sm text-text-primary">"What's our refund policy for annual plans?"</p>
        <div className="mt-3 h-px w-full bg-line" />
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          Annual plans are refundable within 30 days, prorated after that window.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-line bg-ink px-2.5 py-1 font-mono text-[10px] text-text-muted">
            #billing-faq · Notion
          </span>
          <span className="rounded-full border border-line bg-ink px-2.5 py-1 font-mono text-[10px] text-text-muted">
            #support-eng · Slack
          </span>
        </div>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <BackgroundMesh />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                AI-native knowledge layer
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-text-primary md:text-[56px]"
            >
              Your company's knowledge, one conversation away.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-lg text-lg leading-relaxed text-text-muted"
            >
              Connect Slack, Notion, and Google Docs. Weave keeps everything in sync and
              answers questions in plain English — with a source for every answer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/onboarding"
                className="group relative overflow-hidden rounded-btn bg-accent px-6 py-3 text-sm font-medium text-white shadow-[0_8px_30px_-8px_rgba(108,99,255,0.6)] transition-transform hover:scale-[1.02]"
              >
                <span className="relative z-10">Connect your first source</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <a
                href="#how-it-works"
                className="rounded-btn border border-line px-6 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-raised"
              >
                See how it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-12"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                Works with the tools you already use
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                {TRUST_ITEMS.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-text-muted">
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
