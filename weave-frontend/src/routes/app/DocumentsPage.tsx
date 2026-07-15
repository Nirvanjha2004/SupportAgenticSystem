import { useState } from 'react'
import DocumentSearchBar from '../../components/documents/DocumentSearchBar'
import DocumentRow from '../../components/documents/DocumentRow'

const mockDocs = [
  {
    title: 'Refund policy — Q3 update',
    snippet: 'Customers who purchased within 30 days are eligible for a full refund. After 30 days, partial refunds...',
    source: 'Notion',
    date: '3 days ago',
  },
  {
    title: '#support-eng thread: API outage postmortem',
    snippet: 'Root cause was a missing index on the events table. Fix deployed at 14:23 UTC...',
    source: 'Slack',
    date: '1 week ago',
  },
]

export default function DocumentsPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="max-w-3xl space-y-4">
      <DocumentSearchBar value={query} onChange={setQuery} />
      <div className="flex gap-2">
        {['All', 'Slack', 'Notion', 'Google Docs'].map((f) => (
          <button
            key={f}
            className="rounded-chip border border-line bg-surface px-2 py-1 text-xs font-mono text-text-muted hover:text-text-primary"
          >
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {mockDocs
          .filter((d) => d.title.toLowerCase().includes(query.toLowerCase()) || d.snippet.toLowerCase().includes(query.toLowerCase()))
          .map((d) => (
            <DocumentRow key={d.title} {...d} />
          ))}
        {query && mockDocs.length === 0 && (
          <div className="py-8 text-center text-sm text-text-muted">
            No documents match that search. Try broadening your query.
          </div>
        )}
      </div>
    </div>
  )
}
