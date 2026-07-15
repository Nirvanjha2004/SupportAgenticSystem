import { motion } from 'framer-motion'

interface Props {
  path: string
  color?: string
  duration?: number
  size?: number
}

export default function ConduitParticles({ path, color = '#6C63FF', duration = 2, size = 4 }: Props) {
  return (
    <svg className="absolute inset-0 h-full w-full pointer-events-none">
      <defs>
        <path id="conduit-path" d={path} fill="none" />
      </defs>
      <motion.circle r={size / 2} fill={color}>
        <motion.animateMotion dur={duration} repeatCount="indefinite" path="url(#conduit-path)" />
      </motion.circle>
    </svg>
  )
}
