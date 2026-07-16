import { useState } from 'react'
import { motion } from 'framer-motion'
import DocumentSearchBar from '../../components/documents/DocumentSearchBar'
import DocumentRow from '../../components/documents/DocumentRow'
import { FileText, Filter } from 'lucide-react'

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
  const [activeFilter, setActiveFilter] = useState('All')

  const filters = ['All', 'Slack', 'Notion', 'Google Docs']

  const filteredDocs = mockDocs.filter((d) => {
    const matchesQuery = d.title.toLowerCase().includes(query.toLowerCase()) || d.snippet.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = activeFilter === 'All' || d.source === activeFilter
    return matchesQuery && matchesFilter
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl space-y-6"
    >
      {/* Editorial header */}
      <div>
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
          Knowledge base
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#2B2A26] md:text-3xl">
          Documents
        </h1>
        <p className="mt-1.5 text-sm text-[#6D685F]">
          Search and browse all your indexed documents across connected sources.
        </p>
      </div>

      {/* Search + filters */}
      <div className="card-sand p-5">
        <DocumentSearchBar value={query} onChange={setQuery} />
        <div className="mt-4 flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-[#8A857D]" />
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`rounded-chip px-2.5 py-1 text-xs font-mono transition-all ${
                  activeFilter === f
                    ? 'bg-[#5E6B3F] text-[#FBF9F5]'
                    : 'border border-[#DDD5C8] bg-[#FBF9F5] text-[#6D685F] hover:bg-[#EEE7DA] hover:text-[#2B2A26]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-xs text-[#8A857D]">
        <FileText className="h-3.5 w-3.5" />
        <span className="font-mono">{filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {filteredDocs.map((d, i) => (
          <motion.div
            key={d.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <DocumentRow {...d} />
          </motion.div>
        ))}
        {query && filteredDocs.length === 0 && (
          <div className="card-sand flex flex-col items-center py-12 text-center">
            <FileText className="h-10 w-10 text-[#8A857D]/40 mb-3" />
            <p className="text-sm text-[#6D685F]">No documents match that search.</p>
            <p className="mt-1 text-xs text-[#8A857D]">Try broadening your query or selecting a different source filter.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
