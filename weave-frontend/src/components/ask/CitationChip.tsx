import { FileText } from 'lucide-react'

interface Props {
  index: number
  label: string
  onClick?: () => void
}

export default function CitationChip({ index, label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-surface-raised px-2 py-1 text-xs font-mono text-text-muted hover:border-accent hover:text-accent transition-colors"
    >
      <FileText size={12} />
      <span>[{index}]</span>
      <span className="truncate max-w-[120px]">{label}</span>
    </button>
  )
}
