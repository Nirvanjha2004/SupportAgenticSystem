interface LogEntry {
  time: string
  message: string
  status: 'ok' | 'error' | 'warn'
}

export default function SyncLogTable({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="card-sand overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[#DDD5C8] bg-[#EEE7DA]">
          <tr>
            <th className="px-4 py-2 font-mono text-xs text-[#6D685F]">Time</th>
            <th className="px-4 py-2 font-mono text-xs text-[#6D685F]">Event</th>
            <th className="px-4 py-2 font-mono text-xs text-[#6D685F]">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DDD5C8]">
          {logs.map((log, i) => (
            <tr key={i} className="transition-colors hover:bg-[#F5F1E8]">
              <td className="px-4 py-2 font-mono text-xs text-[#8A857D]">{log.time}</td>
              <td className="px-4 py-2 text-[#2B2A26]">{log.message}</td>
              <td className="px-4 py-2">
                <span className={`inline-block h-2 w-2 rounded-full ${log.status === 'ok' ? 'bg-[#567D46]' : log.status === 'error' ? 'bg-[#A84F3A]' : 'bg-[#C68A32]'}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
