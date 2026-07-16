interface Props {
  status: 'idle' | 'syncing' | 'error' | 'synced'
}

export default function StatusBadge({ status }: Props) {
  const map = {
    idle: { text: 'Connect', dot: 'bg-[#8A857D]' },
    syncing: { text: 'Syncing', dot: 'bg-[#C68A32] animate-pulse' },
    error: { text: 'Needs attention', dot: 'bg-[#A84F3A]' },
    synced: { text: 'Connected', dot: 'bg-[#567D46]' },
  }
  const s = map[status]
  return (
    <span className="inline-flex items-center gap-1.5 rounded-chip border border-[#DDD5C8] bg-[#FBF9F5] px-2 py-1 text-xs font-mono text-[#6D685F]">
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.text}
    </span>
  )
}
