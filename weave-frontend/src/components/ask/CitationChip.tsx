import { motion } from 'framer-motion'
import { MessageSquare, FileText, FileSpreadsheet, File } from 'lucide-react'

type SourceType = 'slack' | 'notion' | 'google_docs' | 'default'

const SOURCE_META: Record<SourceType, { icon: React.ElementType; color: string; glow: string }> = {
  slack: {
    icon: MessageSquare,
    color: 'hover:border-[#36C5F0]/50 hover:text-[#36C5F0]',
    glow: 'hover:shadow-[0_0_12px_-3px_rgba(54,197,240,0.3)]',
  },
  notion: {
    icon: FileText,
    color: 'hover:border-white/30 hover:text-text-primary',
    glow: 'hover:shadow-[0_0_12px_-3px_rgba(255,255,255,0.1)]',
  },
  google_docs: {
    icon: FileSpreadsheet,
    color: 'hover:border-[#4285F4]/50 hover:text-[#4285F4]',
    glow: 'hover:shadow-[0_0_12px_-3px_rgba(66,133,244,0.3)]',
  },
  default: {
    icon: File,
    color: 'hover:border-accent/50 hover:text-accent',
    glow: 'hover:shadow-[0_0_12px_-3px_rgba(108,99,255,0.3)]',
  },
}

interface Props {
  index: number
  label: string
  source?: SourceType
  onClick?: () => void
}

export default function CitationChip({ index, label, source = 'default', onClick }: Props) {
  const meta = SOURCE_META[source] ?? SOURCE_META.default
  const Icon = meta.icon

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className={`
        group inline-flex items-center gap-1.5
        rounded-full border border-line bg-surface-raised
        px-2.5 py-1 font-mono text-[11px] text-text-muted
        transition-all duration-200
        ${meta.color} ${meta.glow}
      `}
    >
      {/* index badge */}
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-line text-[10px] leading-none text-text-muted transition-colors group-hover:bg-current/10">
        {index}
      </span>

      <Icon className="h-3 w-3 shrink-0 opacity-70" />

      <span className="max-w-[140px] truncate">{label}</span>
    </motion.button>
  )
}