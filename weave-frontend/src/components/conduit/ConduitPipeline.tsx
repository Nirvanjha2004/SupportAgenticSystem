import { motion } from 'framer-motion'

const stages = ['Fetching', 'Chunking', 'Embedding', 'Stored']

interface Props {
  activeStage: number
}

export default function ConduitPipeline({ activeStage }: Props) {
  return (
    <div className="relative flex items-center justify-between py-8">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-line -translate-y-1/2" />
      {stages.map((stage, i) => {
        const done = i < activeStage
        const active = i === activeStage
        return (
          <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
            <motion.div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                done
                  ? 'border-signal-green bg-signal-green/10 text-signal-green'
                  : active
                  ? 'border-accent bg-accent-soft text-accent'
                  : 'border-line bg-surface text-text-muted'
              }`}
              animate={active ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {done ? '✓' : i + 1}
            </motion.div>
            <span
              className={`text-xs font-mono ${
                active ? 'text-accent' : done ? 'text-signal-green' : 'text-text-muted'
              }`}
            >
              {stage}
            </span>
            {active && (
              <motion.div
                className="absolute -top-1 h-2 w-2 rounded-full bg-accent"
                animate={{ x: [0, 120] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
