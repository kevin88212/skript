import { motion } from 'framer-motion'
import { fadeInUp, scaleIn, blurIn } from '../../lib/motion.js'

const VARIANTS = { fadeInUp, scaleIn, blurIn }

export default function Reveal({ as = 'div', variant = 'fadeInUp', delay = 0, className = '', children }) {
  const MotionTag = motion[as]
  const selected = VARIANTS[variant]

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: selected.hidden,
        visible: {
          ...selected.visible,
          transition: { ...selected.visible.transition, delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {children}
    </MotionTag>
  )
}
