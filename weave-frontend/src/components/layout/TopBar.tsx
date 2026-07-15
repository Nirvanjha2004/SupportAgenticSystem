import { useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/sources': 'Sources',
  '/documents': 'Documents',
  '/ask': 'Ask',
  '/settings': 'Settings',
}

export default function TopBar() {
  const loc = useLocation()
  const title = titles[loc.pathname] || 'Weave'

  const isSources = loc.pathname === '/sources'

  return (
    <header className="flex h-14 items-center justify-between border-b border-line bg-surface px-6">
      <h1 className="font-display text-lg font-semibold tracking-tight text-text-primary">
        {title}
      </h1>
      {isSources && (
        <button className="flex items-center gap-2 rounded-btn bg-accent px-3 py-2 text-sm font-medium text-white hover:opacity-90">
          <Plus size={16} />
          Connect a source
        </button>
      )}
    </header>
  )
}
