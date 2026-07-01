export const EASE_PREMIUM = [0.16, 1, 0.3, 1]
export const EASE_INOUT_PREMIUM = [0.65, 0, 0.35, 1]

export const DURATION = {
  fast: 0.15,
  base: 0.3,
  reveal: 0.6,
  blur: 0.7,
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.reveal, ease: EASE_PREMIUM },
  },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.reveal, ease: EASE_PREMIUM },
  },
}

export const blurIn = {
  hidden: { opacity: 0, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: DURATION.blur, ease: EASE_PREMIUM },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}
