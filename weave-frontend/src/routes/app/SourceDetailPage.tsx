import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useConnectors } from '../../hooks/useConnectors'
import { useIngestionStatus } from '../../hooks/useIngestionStatus'
import ConduitPipeline from '../../components/conduit/ConduitPipeline'
import SyncLogTable from '../../components/sources/SyncLogTable'
import { ArrowLeft } from 'lucide-react'

export default function SourceDetailPage() {
  const { type } = useParams<{ type: string }>()
  const { data: connectors } = useConnectors()
  const conn = connectors?.find((c) => c.type === type)
  const { data: jobs } = useIngestionStatus(type)

  const activeStage = (() => {
    if (!jobs || jobs.length === 0) return 0
    const stageMap: Record<string, number> = { fetching: 0, chunking: 1, embedding: 2, stored: 3 }
    return stageMap[jobs[0].stage] ?? 0
  })()

  const logs = [
    { time: '14:32:01', message: 'OAuth authorized', status: 'ok' as const },
    { time: '14:32:05', message: 'Fetched 1,247 messages', status: 'ok' as const },
    { time: '14:32:12', message: 'Chunked into 3,891 chunks', status: 'ok' as const },
    { time: '14:33:01', message: 'Embedding batch 12/40', status: 'ok' as const },
  ]

  if (!conn) return <div className="text-[#8A857D]">Source not found</div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <Link to="/sources" className="group inline-flex items-center gap-1.5 text-xs font-mono text-[#8A857D] transition-colors hover:text-[#5E6B3F]">
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to sources
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[9px] font-medium uppercase tracking-[0.15em] text-[#8A857D]">
            {conn.type}
          </span>
          <h2 className="mt-1 font-display text-2xl font-semibold text-[#2B2A26]">{conn.name}</h2>
          <p className="mt-1 font-mono text-xs text-[#8A857D]">Last synced: {conn.lastSynced || 'Never'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-btn border border-[#DDD5C8] bg-[#FBF9F5] px-3 py-2 text-xs font-medium text-[#2B2A26] transition-colors hover:bg-[#EEE7DA]">
            Sync now
          </button>
          <button className="rounded-btn border border-[#A84F3A]/50 bg-[#FBF9F5] px-3 py-2 text-xs font-medium text-[#A84F3A] transition-colors hover:bg-[#A84F3A]/5">
            Disconnect
          </button>
        </div>
      </div>

      {/* Pipeline */}
      <div className="card-sand p-6">
        <h3 className="text-sm font-medium text-[#2B2A26]">Ingestion pipeline</h3>
        <ConduitPipeline activeStage={activeStage} />
      </div>

      {/* Sync log */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-[#2B2A26]">Sync log</h3>
        <SyncLogTable logs={logs} />
      </div>
    </motion.div>
  )
}
