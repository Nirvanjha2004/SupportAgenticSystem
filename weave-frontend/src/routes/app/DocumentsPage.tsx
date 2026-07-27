import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DocumentSearchBar from '../../components/documents/DocumentSearchBar'
import DocumentRow from '../../components/documents/DocumentRow'
import { FileText, Filter } from 'lucide-react'
import { apiFetch } from '../../lib/api'
import { useAppStore } from '../../store/useAppStore'

interface Document {
  title: string
  snippet: string
  source: string
  date: string
}

export default function DocumentsPage() {
  const activeWorkspace = useAppStore((state) => state.activeWorkspace)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)

  const filters = ['All', 'Slack', 'Notion', 'Google Docs']

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true)
      try {
        const sourceMap: Record<string, string> = {
          'Slack': 'slack',
          'Notion': 'notion',
          'Google Docs': 'google_docs',
        }
        const sourceParam = activeFilter !== 'All' ? sourceMap[activeFilter] : undefined
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (sourceParam) params.set('source', sourceParam)
        if (activeWorkspace?.id) params.set('workspace_id', activeWorkspace.id)
        
        const data = await apiFetch(`/documents?${params.toString()}`)
        setDocuments(data || [])
      } catch (error) {
        console.error('Failed to fetch documents:', error)
        setDocuments([])
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [query, activeFilter, activeWorkspace?.id])

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
        <span className="font-mono">{documents.length} document{documents.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Document list */}
      <div className="space-y-3">
        {loading ? (
          <div className="card-sand flex flex-col items-center py-12 text-center">
            <p className="text-sm text-[#6D685F]">Loading documents...</p>
          </div>
        ) : documents.length > 0 ? (
          documents.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <DocumentRow {...d} />
            </motion.div>
          ))
        ) : (
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
