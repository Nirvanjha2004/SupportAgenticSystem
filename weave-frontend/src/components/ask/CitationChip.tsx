import { motion } from 'framer-motion'
import { MessageSquare, FileText, FileSpreadsheet, File } from 'lucide-react'

type SourceType = 'slack' | 'notion' | 'google_docs' | 'default'

const SOURCE_META: Record<SourceType, { icon: React.ElementType; color: string }> = {
  slack: {
    icon: MessageSquare,
    color: 'hover:border-[#5E6B3F]/40 hover:text-[#5E6B3F]',
  },
  notion: {
    icon: FileText,
    color: 'hover:border-[#5E6B3F]/40 hover:text-[#5E6B3F]',
  },
  google_docs: {
    icon: FileSpreadsheet,
    color: 'hover:border-[#5E6B3F]/40 hover:text-[#5E6B3F]',
  },
  default: {
    icon: File,
    color: 'hover:border-[#5E6B3F]/40 hover:text-[#5E6B3F]',
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
        rounded-full border border-[#DDD5C8] bg-[#FBF9F5]
        px-2.5 py-1 font-mono text-[11px] text-[#6D685F]
        transition-all duration-200
        ${meta.color}
      `}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EEE7DA] text-[10px] leading-none text-[#8A857D] transition-colors">
        {index}
      </span>
      <Icon className="h-3 w-3 shrink-0 opacity-60" />
      <span className="max-w-[140px] truncate">{label}</span>
    </motion.button>
  )
}
