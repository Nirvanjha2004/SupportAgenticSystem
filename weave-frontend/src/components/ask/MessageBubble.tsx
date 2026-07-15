import { useState } from 'react'
import CitationChip from './CitationChip'

interface Source {
  index: number
  label: string
  content?: string
}

interface Props {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

export default function MessageBubble({ role, content, sources }: Props) {
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${role === 'user' ? 'bg-accent text-white rounded-card px-4 py-3' : ''}`}>
        {role === 'assistant' && (
          <div className="space-y-3">
            <div className="text-text-primary leading-relaxed whitespace-pre-wrap">{content}</div>
            {sources && sources.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {sources.map((s) => (
                  <CitationChip
                    key={s.index}
                    index={s.index}
                    label={s.label}
                    onClick={() => setSelectedSource(s)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        {role === 'user' && <span className="text-sm">{content}</span>}
      </div>

      {selectedSource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedSource(null)}
        >
          <div
            className="w-full max-w-lg rounded-card border border-line bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-2 font-display text-sm font-medium text-text-primary">
              Source [{selectedSource.index}]
            </h4>
            <p className="font-mono text-xs text-text-muted mb-4">{selectedSource.label}</p>
            <div className="max-h-64 overflow-y-auto rounded-btn border border-line bg-surface-raised p-3 text-sm text-text-primary">
              {selectedSource.content || 'Full source content would appear here from the backend.'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
