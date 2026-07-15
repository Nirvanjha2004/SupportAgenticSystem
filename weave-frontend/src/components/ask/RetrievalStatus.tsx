import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = ['Searching your sources…', 'Reading matches…', 'Synthesizing answer…']

export default function RetrievalStatus() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1200),
      setTimeout(() => setStep(2), 2400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={step}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          {steps[step]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
