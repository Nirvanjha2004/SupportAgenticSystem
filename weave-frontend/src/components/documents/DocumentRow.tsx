import { FileText, ExternalLink } from 'lucide-react'

interface Props {
  title: string
  snippet: string
  source: string
  date: string
  url?: string
}

export default function DocumentRow({ title, snippet, source, date, url }: Props) {
  return (
    <div className="group flex items-start justify-between rounded-card border border-line bg-surface p-4 hover:border-accent/50 transition-colors">
      <div className="flex items-start gap-3">
        <FileText size={18} className="mt-0.5 text-text-muted" />
        <div>
          <h4 className="font-medium text-text-primary text-sm">{title}</h4>
          <p className="mt-1 text-sm text-text-muted leading-relaxed">
            {snippet}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs font-mono text-text-muted">
            <span className="rounded-chip bg-surface-raised px-1.5 py-0.5">{source}</span>
            <span>·</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-1 text-text-muted hover:text-accent"
        >
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  )
}
