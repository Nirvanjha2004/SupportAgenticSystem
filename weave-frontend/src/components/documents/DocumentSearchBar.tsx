import { Search } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function DocumentSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A857D]" size={16} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your knowledge base…"
        className="h-10 w-full rounded-btn border border-[#DDD5C8] bg-[#FBF9F5] pl-10 pr-4 text-sm text-[#2B2A26] placeholder:text-[#8A857D] transition-all focus:border-[#5E6B3F]/50 focus:outline-none focus:ring-2 focus:ring-[#5E6B3F]/10"
      />
    </div>
  )
}
