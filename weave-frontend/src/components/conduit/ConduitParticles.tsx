import { useId } from 'react'

interface Props {
  /** SVG path `d` string the particles travel along */
  path: string
  color?: string
  /** Full loop duration in seconds for the leading particle */
  duration?: number
  /** Diameter of the leading particle in px */
  size?: number
  /** Number of staggered particles (evenly spaced along the path) */
  count?: number
  /** Show a faint dashed stroke along the path as a guide rail */
  showTrack?: boolean
  /** Extra classes applied to the wrapping SVG */
  className?: string
}

/**
 * Renders `count` particles flowing along an SVG path using native SMIL
 * animateMotion — GPU-composited, zero JS frame cost per tick.
 *
 * Each particle is staggered `duration / count` seconds apart so they
 * stay evenly distributed around the path at all times. The leading
 * particle is the largest and brightest; followers shrink and fade
 * to create a natural motion trail.
 */
export default function ConduitParticles({
  path,
  color = '#6C63FF',
  duration = 2,
  size = 5,
  count = 3,
  showTrack = false,
  className = '',
}: Props) {
  // useId gives a stable, unique ID per instance — safe for concurrent
  // rendering and SSR. Strip colons so the value is a valid SVG ID.
  const uid = useId().replace(/:/g, '')
  const pathId   = `${uid}-path`
  const filterId = `${uid}-glow`

  const gap = duration / count // seconds between each particle

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      aria-hidden
    >
      <defs>
        {/* Path referenced by every mpath in this instance */}
        <path id={pathId} d={path} fill="none" />

        {/* Layered glow: blur pass merged with source so the
            particle stays crisp in the centre with a soft corona */}
        <filter
          id={filterId}
          x="-80%"
          y="-80%"
          width="260%"
          height="260%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            // boost the glow colour slightly toward the accent tint
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 14 -4"
            result="boostedBlur"
          />
          <feMerge>
            <feMergeNode in="boostedBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Optional faint guide rail */}
      {showTrack && (
        <path
          d={path}
          stroke={color}
          strokeWidth="1"
          strokeDasharray="3.5 5"
          strokeLinecap="round"
          fill="none"
          opacity={0.25}
        />
      )}

      {/*
        Particles — index 0 is the "leader" (largest, brightest).
        Each subsequent particle is smaller, dimmer, and starts
        `gap` seconds later so it trails behind the leader.
      */}
      {Array.from({ length: count }, (_, i) => {
        const isLeader = i === 0
        // radius: leader is full size; each follower shrinks by 20 %
        const r       = (size / 2) * Math.max(0.3, 1 - i * 0.2)
        // opacity: leader is full; followers fade evenly toward 15 %
        const opacity = isLeader ? 1 : Math.max(0.15, 1 - (i / count) * 0.85)
        // stagger: evenly distributed around the loop
        const begin   = `${(i * gap).toFixed(2)}s`
        const dur     = `${duration}s`

        return (
          <circle
            key={i}
            r={r}
            fill={color}
            opacity={opacity}
            filter={`url(#${filterId})`}
          >
            <animateMotion
              dur={dur}
              begin={begin}
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href={`#${pathId}`} />
            </animateMotion>
          </circle>
        )
      })}
    </svg>
  )
}