import { motion } from 'framer-motion'
import { DURATION, EASE_PREMIUM } from '../../lib/motion.js'

const VARIANT_CLASSES = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-glow-sm hover:shadow-glow-md',
  secondary:
    'bg-surface border border-border text-text hover:border-border-strong hover:bg-white/5',
  ghost: 'bg-transparent text-text-secondary hover:text-text hover:bg-white/5',
}

const SIZE_CLASSES = {
  sm: 'h-9 px-4 text-small rounded-sm gap-1.5',
  md: 'h-11 px-6 text-body rounded-md gap-2',
  lg: 'h-14 px-8 text-body-lg rounded-md gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  as = 'button',
  icon: Icon,
  iconPosition = 'right',
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={`inline-flex items-center justify-center font-semibold whitespace-nowrap transition-colors duration-fast ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: DURATION.fast, ease: EASE_PREMIUM }}
      disabled={as === 'button' ? disabled : undefined}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {Icon && iconPosition === 'left' && <Icon size={18} aria-hidden="true" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={18} aria-hidden="true" />}
    </MotionTag>
  )
}
