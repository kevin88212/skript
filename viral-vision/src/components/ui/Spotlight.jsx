import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Spotlight({ className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 120, damping: 30 })
  const springY = useSpring(y, { stiffness: 120, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      const bounds = ref.current?.getBoundingClientRect()
      if (!bounds) return
      x.set(event.clientX - bounds.left)
      y.set(event.clientY - bounds.top)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [x, y])

  return (
    <div ref={ref} className={`pointer-events-none absolute inset-0 hidden md:block ${className}`} aria-hidden="true">
      <motion.div
        className="absolute h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.08] blur-[90px]"
        style={{ left: springX, top: springY }}
      />
    </div>
  )
}
