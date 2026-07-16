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
    <div className="card-sand card-sand-hover flex items-start justify-between p-4">
      <div className="flex items-start gap-3">
        <FileText size={18} className="mt-0.5 text-[#8A857D]" />
        <div>
          <h4 className="text-sm font-medium text-[#2B2A26]">{title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-[#6D685F]">{snippet}</p>
          <div className="mt-2 flex items-center gap-2 font-mono text-xs text-[#8A857D]">
            <span className="rounded-chip bg-[#EEE7DA] px-1.5 py-0.5">{source}</span>
            <span>·</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
      {url && (
        <a href={url} target="_blank" rel="noreferrer" className="mt-1 text-[#8A857D] transition-colors hover:text-[#5E6B3F]">
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  )
}
