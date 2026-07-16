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
  const pathSegments = loc.pathname.split('/')
  const isSourceDetail = pathSegments[1] === 'sources' && !!pathSegments[2]

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#DDD5C8] bg-[#FBF9F5] px-6">
      <h1 className="font-display text-lg font-semibold tracking-tight text-[#2B2A26]">
        {title}
      </h1>
      {isSources && !isSourceDetail && (
        <button className="flex items-center gap-2 rounded-btn bg-[#5E6B3F] px-3 py-2 text-sm font-medium text-[#FBF9F5] transition-colors hover:bg-[#49552F]">
          <Plus size={16} />
          Connect a source
        </button>
      )}
    </header>
  )
}
