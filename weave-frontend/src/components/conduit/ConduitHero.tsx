import { motion } from 'framer-motion'
import { MessageSquare, FileText, FileSpreadsheet, Sparkles } from 'lucide-react'

// ─── layout constants ────────────────────────────────────────────────────────
const W = 440
const H = 220
const NODE_CX = 218
const NODE_CY = 110
const NODE_R  = 17
const CARD_X  = 332
const CARD_Y  = 64

// ─── sources ─────────────────────────────────────────────────────────────────
const SOURCES = [
  { Icon: MessageSquare, label: 'Slack',   cy: 58  },
  { Icon: FileText,       label: 'Notion',  cy: 110 },
  { Icon: FileSpreadsheet, label: 'Docs',  cy: 162 },
]

// paths: right edge of icon (x=70) → left edge of node
const FEED_D = [
  `M 70 58  C 148 58,  182 110, ${NODE_CX - NODE_R} 110`,
  `M 70 110 C 148 110, 182 110, ${NODE_CX - NODE_R} 110`,
  `M 70 162 C 148 162, 182 110, ${NODE_CX - NODE_R} 110`,
]

// node right edge → card left edge
const OUT_D = `M ${NODE_CX + NODE_R} 110 C 268 110, 292 110, ${CARD_X} 110`

// per-source draw delay
const DRAW_DELAY = [0.4, 0.55, 0.7]

// particle pairs per feed path [fast, slow]
const PARTICLE_CONFIG = [
  { dur: '1.7s', begins: ['1.5s', '2.35s'] },
  { dur: '1.5s', begins: ['1.65s', '2.4s'] },
  { dur: '1.7s', begins: ['1.8s', '2.55s'] },
]

export default function ConduitHero() {
  return (
    <div className="relative h-64 w-full select-none" aria-hidden>
      {/* ambient glow behind node */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute rounded-full bg-accent/20 blur-[64px]"
          style={{
            width: 140, height: 140,
            left: '50%', top: '50%',
            transform: 'translate(-38%, -50%)',
          }}
        />
      </motion.div>

      <svg
        className="h-full w-full overflow-visible"
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
      >
        <defs>
          {/* hidden paths for animateMotion */}
          {FEED_D.map((d, i) => <path key={i} id={`fp${i}`} d={d} />)}
          <path id="op" d={OUT_D} />

          {/* node gradient */}
          <radialGradient id="nodeGrad" cx="35%" cy="32%" r="65%">
            <stop offset="0%"   stopColor="#A8A3FF" />
            <stop offset="100%" stopColor="#6C63FF" />
          </radialGradient>

          {/* soft glow on paths */}
          <filter id="lineGlow" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* stronger glow for node */}
          <filter id="nodeGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── source icon cards ─────────────────────────────────── */}
        {SOURCES.map(({ Icon, label, cy }, i) => (
          <motion.foreignObject
            key={label}
            x={10} y={cy - 20} width={60} height={40}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.45, ease: 'easeOut' }}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-[8px] border border-line bg-surface-raised shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
              <Icon className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-[9px] leading-none text-text-muted">
                {label}
              </span>
            </div>
          </motion.foreignObject>
        ))}

        {/* ── feed paths ────────────────────────────────────────── */}
        {FEED_D.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="#6C63FF"
            strokeWidth="1.2"
            strokeDasharray="3.5 5"
            strokeLinecap="round"
            filter="url(#lineGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ delay: DRAW_DELAY[i], duration: 1, ease: 'easeOut' }}
          />
        ))}

        {/* ── feed particles ────────────────────────────────────── */}
        {PARTICLE_CONFIG.map(({ dur, begins }, pi) =>
          begins.map((begin, bi) => (
            <circle
              key={`fp${pi}-${bi}`}
              r={bi === 0 ? 2.5 : 1.8}
              fill="#6C63FF"
              opacity={bi === 0 ? 0.9 : 0.5}
            >
              <animateMotion dur={dur} begin={begin} repeatCount="indefinite">
                <mpath href={`#fp${pi}`} />
              </animateMotion>
            </circle>
          ))
        )}

        {/* ── pulse rings around node ────────────────────────────── */}
        {[0, 0.7].map((delay, i) => (
          <motion.circle
            key={`ring${i}`}
            cx={NODE_CX} cy={NODE_CY}
            stroke="#6C63FF" strokeWidth="1" fill="none"
            style={{ transformOrigin: `${NODE_CX}px ${NODE_CY}px` }}
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 2.2], opacity: [0.45, 0] }}
            transition={{
              delay: 2.1 + delay,
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            r={NODE_R}
          />
        ))}

        {/* ── center node ───────────────────────────────────────── */}
        <motion.circle
          cx={NODE_CX} cy={NODE_CY} r={NODE_R}
          fill="url(#nodeGrad)"
          filter="url(#nodeGlow)"
          style={{ transformOrigin: `${NODE_CX}px ${NODE_CY}px` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.7, type: 'spring', stiffness: 220, damping: 16 }}
        />

        {/* sparkles icon inside node */}
        <motion.foreignObject
          x={NODE_CX - 10} y={NODE_CY - 10} width={20} height={20}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.35 }}
        >
          <div className="flex h-full w-full items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white drop-shadow-sm" />
          </div>
        </motion.foreignObject>

        {/* ── out path ──────────────────────────────────────────── */}
        <motion.path
          d={OUT_D}
          stroke="#6C63FF"
          strokeWidth="1.2"
          strokeDasharray="3.5 5"
          strokeLinecap="round"
          filter="url(#lineGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ delay: 2.4, duration: 0.75, ease: 'easeOut' }}
        />

        {/* out particles */}
        {['3.2s', '4.1s'].map((begin, i) => (
          <circle
            key={`op${i}`}
            r={i === 0 ? 2.5 : 1.8}
            fill="#6C63FF"
            opacity={i === 0 ? 0.9 : 0.5}
          >
            <animateMotion dur="1.1s" begin={begin} repeatCount="indefinite">
              <mpath href="#op" />
            </animateMotion>
          </circle>
        ))}

        {/* ── answer card ───────────────────────────────────────── */}
        <motion.foreignObject
          x={CARD_X} y={CARD_Y} width={98} height={92}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.1, duration: 0.5, ease: 'easeOut' }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[10px] border border-line bg-surface shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
            {/* top shimmer */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <div className="flex h-full flex-col p-2.5">
              <p className="font-mono text-[8px] uppercase tracking-wider text-text-muted">
                Answer
              </p>
              <p className="mt-1 flex-1 text-[9.5px] leading-relaxed text-text-primary">
                Refunds available within 30 days, prorated after.
              </p>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-1 rounded-full bg-surface-raised px-1.5 py-[3px]">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-signal-green" />
                  <span className="truncate font-mono text-[8px] text-text-muted">
                    #billing · Notion
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-surface-raised px-1.5 py-[3px]">
                  <span className="h-1 w-1 shrink-0 rounded-full bg-signal-green" />
                  <span className="truncate font-mono text-[8px] text-text-muted">
                    #support · Slack
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.foreignObject>

        {/* connecting dot: node right edge → out path start */}
        <motion.circle
          cx={NODE_CX + NODE_R} cy={NODE_CY} r={2}
          fill="#6C63FF"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ transformOrigin: `${NODE_CX + NODE_R}px ${NODE_CY}px` }}
          transition={{ delay: 2.3, type: 'spring', stiffness: 300 }}
        />
      </svg>
    </div>
  )
}