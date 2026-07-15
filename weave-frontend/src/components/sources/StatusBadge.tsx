interface Props {
  status: 'idle' | 'syncing' | 'error' | 'synced'
}

export default function StatusBadge({ status }: Props) {
  const map = {
    idle: { text: 'Connect', dot: 'bg-text-muted' },
    syncing: { text: 'Syncing…', dot: 'bg-signal-amber animate-pulse' },
    error: { text: 'Needs attention', dot: 'bg-signal-red' },
    synced: { text: 'Connected', dot: 'bg-signal-green' },
  }
  const s = map[status]
  return (
    <span className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-surface px-2 py-1 text-xs font-mono text-text-muted">
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.text}
    </span>
  )
}
