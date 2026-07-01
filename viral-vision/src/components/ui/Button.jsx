import { motion } from 'framer-motion'
import { DURATION, EASE_PREMIUM } from '../../lib/motion.js'

const VARIANT_CLASSES = {
  primary:
    'bg-primary text-white shadow-[var(--shadow-bevel),var(--shadow-glow-sm)] hover:bg-primary-hover hover:shadow-[var(--shadow-bevel),var(--shadow-glow-md)]',
  secondary:
    'bg-surface border border-border text-text shadow-[var(--shadow-bevel)] hover:border-border-strong hover:bg-white/5',
  ghost: 'bg-transparent text-text-secondary hover:text-text hover:bg-white/5',
  link: 'bg-transparent p-0! h-auto! text-text gap-1.5',
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
  const isLink = variant === 'link'

  return (
    <MotionTag
      className={`group inline-flex items-center justify-center font-semibold whitespace-nowrap transition-colors duration-fast ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${isLink ? '' : SIZE_CLASSES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      whileHover={disabled ? undefined : { scale: isLink ? 1 : 1.02 }}
      whileTap={disabled ? undefined : { scale: isLink ? 1 : 0.98 }}
      transition={{ duration: DURATION.fast, ease: EASE_PREMIUM }}
      disabled={as === 'button' ? disabled : undefined}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {Icon && iconPosition === 'left' && (
        <Icon size={18} aria-hidden="true" className="transition-transform duration-fast ease-premium group-hover:-translate-x-0.5" />
      )}
      <span className={isLink ? 'underline decoration-border-strong decoration-1 underline-offset-4 group-hover:decoration-text' : ''}>
        {children}
      </span>
      {Icon && iconPosition === 'right' && (
        <Icon size={18} aria-hidden="true" className="transition-transform duration-fast ease-premium group-hover:translate-x-0.5" />
      )}
    </MotionTag>
  )
}
