import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, FileText, FileSpreadsheet, Check } from 'lucide-react'

interface Step {
  id: string
  label: string
  detail: string
  doneDetail: string
  duration: number
}

interface Source {
  icon: typeof MessageSquare
  label: string
  count: number
}

const STEPS: Step[] = [
  {
    id: 'search',
    label: 'Searching sources',
    detail: 'Running semantic search across connected sources…',
    doneDetail: '3 sources searched',
    duration: 1100,
  },
  {
    id: 'read',
    label: 'Reading matches',
    detail: 'Ranking and reading the most relevant chunks…',
    doneDetail: '8 chunks selected',
    duration: 2400,
  },
  {
    id: 'synthesize',
    label: 'Synthesizing',
    detail: 'Grounding answer in retrieved context…',
    doneDetail: 'Answer ready',
    duration: 3900,
  },
]

const SOURCES: Source[] = [
  { icon: MessageSquare, label: 'Slack', count: 4 },
  { icon: FileText, label: 'Notion', count: 3 },
  { icon: FileSpreadsheet, label: 'Docs', count: 1 },
]

function PulsingDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full bg-[#5E6B3F]"
        animate={{ scale: [1, 1.9], opacity: [0.7, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
      />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5E6B3F]" />
    </span>
  )
}

function StepRow({ step, state }: { step: Step; state: 'pending' | 'active' | 'done' }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
        {state === 'done' ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Check className="h-3.5 w-3.5 text-[#567D46]" />
          </motion.div>
        ) : state === 'active' ? (
          <PulsingDot />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-[#DDD5C8]" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className={`text-xs font-medium transition-colors duration-300 ${
            state === 'done' ? 'text-[#6D685F]' : state === 'active' ? 'text-[#2B2A26]' : 'text-[#8A857D]/40'
          }`}>
            {step.label}
          </span>
          {state === 'done' && (
            <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              className="font-mono text-[10px] text-[#567D46]">
              {step.doneDetail}
            </motion.span>
          )}
        </div>
        <AnimatePresence>
          {state === 'active' && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-0.5 font-mono text-[10px] leading-relaxed text-[#8A857D]">
              {step.detail}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SourceChips({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden">
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SOURCES.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 380, damping: 22 }}
                className="flex items-center gap-1.5 rounded-full border border-[#DDD5C8] bg-[#FBF9F5] px-2.5 py-1">
                <s.icon className="h-3 w-3 text-[#6D685F]" />
                <span className="font-mono text-[10px] text-[#6D685F]">{s.label}</span>
                <span className="font-mono text-[10px] text-[#5E6B3F]">+{s.count}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface RetrievalStatusProps {
  onComplete?: () => void
}

export default function RetrievalStatus({ onComplete }: RetrievalStatusProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timers = STEPS.map((step, i) =>
      setTimeout(() => {
        setCurrentStep(i + 1)
        if (i === STEPS.length - 1) onComplete?.()
      }, step.duration),
    )
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const allDone = currentStep === STEPS.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card-sand w-full max-w-sm p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!allDone && <PulsingDot />}
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#8A857D]">
            {allDone ? 'Retrieval complete' : 'Retrieving context'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#8A857D]">
          {Math.min(currentStep, STEPS.length)}/{STEPS.length}
        </span>
      </div>

      <div className="mb-4 h-px w-full overflow-hidden rounded-full bg-[#DDD5C8]">
        <motion.div
          className="h-full bg-[#5E6B3F]"
          animate={{ width: `${(Math.min(currentStep, STEPS.length) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="space-y-3">
        {STEPS.map((step, i) => {
          const state = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending'
          return <StepRow key={step.id} step={step} state={state} />
        })}
      </div>

      <SourceChips visible={currentStep >= 1} />
    </motion.div>
  )
}
