import { motion } from 'framer-motion'
import { MessageSquare, FileText, Globe } from 'lucide-react'

export default function ConduitHero() {
  return (
    <div className="relative h-64 w-full">
      <svg className="h-full w-full" viewBox="0 0 320 160" fill="none">
        <motion.path
          d="M 40 40 Q 100 40 160 80"
          stroke="#6C63FF"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 40 80 Q 100 80 160 80"
          stroke="#6C63FF"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 40 120 Q 100 120 160 80"
          stroke="#6C63FF"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: 'easeInOut' }}
        />

        <motion.circle
          cx="160"
          cy="80"
          r="12"
          fill="#6C63FF"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}
        />

        <motion.path
          d="M 172 80 Q 220 80 260 80"
          stroke="#6C63FF"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.5, ease: 'easeInOut' }}
        />

        <foreignObject x="16" y="24" width="32" height="32">
          <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-surface-raised border border-line">
            <MessageSquare size={16} className="text-accent" />
          </div>
        </foreignObject>
        <foreignObject x="16" y="64" width="32" height="32">
          <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-surface-raised border border-line">
            <FileText size={16} className="text-accent" />
          </div>
        </foreignObject>
        <foreignObject x="16" y="104" width="32" height="32">
          <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-surface-raised border border-line">
            <Globe size={16} className="text-accent" />
          </div>
        </foreignObject>

        <motion.foreignObject
          x="240"
          y="56"
          width="72"
          height="48"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
        >
          <div className="h-full w-full rounded-card bg-surface-raised border border-line p-2 text-[10px] text-text-muted">
            <span className="text-signal-green">●</span> Refund policy?
          </div>
        </motion.foreignObject>
      </svg>
    </div>
  )
}
