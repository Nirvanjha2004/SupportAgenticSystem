import { useId } from 'react'

interface Props {
  path: string
  color?: string
  duration?: number
  size?: number
  count?: number
  showTrack?: boolean
  className?: string
}

export default function ConduitParticles({
  path,
  color = '#5E6B3F',
  duration = 2,
  size = 5,
  count = 3,
  showTrack = false,
  className = '',
}: Props) {
  const uid = useId().replace(/:/g, '')
  const pathId = `${uid}-path`
  const filterId = `${uid}-glow`
  const gap = duration / count

  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`} aria-hidden>
      <defs>
        <path id={pathId} d={path} fill="none" />
        <filter id={filterId} x="-80%" y="-80%" width="260%" height="260%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 14 -4" result="boostedBlur" />
          <feMerge>
            <feMergeNode in="boostedBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {showTrack && (
        <path d={path} stroke={color} strokeWidth="1" strokeDasharray="3.5 5" strokeLinecap="round" fill="none" opacity={0.25} />
      )}

      {Array.from({ length: count }, (_, i) => {
        const isLeader = i === 0
        const r = (size / 2) * Math.max(0.3, 1 - i * 0.2)
        const opacity = isLeader ? 1 : Math.max(0.15, 1 - (i / count) * 0.85)
        const begin = `${(i * gap).toFixed(2)}s`
        const dur = `${duration}s`

        return (
          <circle key={i} r={r} fill={color} opacity={opacity} filter={`url(#${filterId})`}>
            <animateMotion dur={dur} begin={begin} repeatCount="indefinite" rotate="auto">
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        )
      })}
    </svg>
  )
}
