import { useParams } from 'react-router-dom'
import { useConnectors } from '../../hooks/useConnectors'
import { useIngestionStatus } from '../../hooks/useIngestionStatus'
import ConduitPipeline from '../../components/conduit/ConduitPipeline'
import SyncLogTable from '../../components/sources/SyncLogTable'

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

  if (!conn) return <div className="text-text-muted">Source not found</div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-text-primary">{conn.name}</h2>
          <p className="mt-1 text-xs font-mono text-text-muted">Last synced: {conn.lastSynced || 'Never'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-btn border border-line px-3 py-2 text-xs font-medium text-text-primary hover:bg-surface-raised">
            Sync now
          </button>
          <button className="rounded-btn border border-signal-red px-3 py-2 text-xs font-medium text-signal-red hover:bg-signal-red/10">
            Disconnect
          </button>
        </div>
      </div>

      <div className="rounded-card border border-line bg-surface p-6">
        <h3 className="text-sm font-medium text-text-primary">Ingestion pipeline</h3>
        <ConduitPipeline activeStage={activeStage} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-primary">Sync log</h3>
        <SyncLogTable logs={logs} />
      </div>
    </div>
  )
}
