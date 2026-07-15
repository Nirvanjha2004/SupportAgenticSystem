interface LogEntry {
  time: string
  message: string
  status: 'ok' | 'error' | 'warn'
}

export default function SyncLogTable({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="rounded-card border border-line bg-surface overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-surface-raised">
          <tr>
            <th className="px-4 py-2 font-mono text-xs text-text-muted">Time</th>
            <th className="px-4 py-2 font-mono text-xs text-text-muted">Event</th>
            <th className="px-4 py-2 font-mono text-xs text-text-muted">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {logs.map((log, i) => (
            <tr key={i} className="hover:bg-surface-raised/50">
              <td className="px-4 py-2 font-mono text-xs text-text-muted">{log.time}</td>
              <td className="px-4 py-2 text-text-primary">{log.message}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    log.status === 'ok'
                      ? 'bg-signal-green'
                      : log.status === 'error'
                      ? 'bg-signal-red'
                      : 'bg-signal-amber'
                  }`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
