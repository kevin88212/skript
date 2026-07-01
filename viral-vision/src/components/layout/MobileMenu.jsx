import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button.jsx'
import { DURATION, EASE_PREMIUM } from '../../lib/motion.js'

export default function MobileMenu({ open, onClose, links }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    const focusable = panel?.querySelectorAll('a[href], button:not([disabled])')
    focusable?.[0]?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-background md:hidden"
          initial={{ opacity: 0, filter: 'blur(12px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: DURATION.base, ease: EASE_PREMIUM }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-h3 font-semibold text-text-secondary hover:text-text transition-colors duration-fast"
            >
              {link.label}
            </a>
          ))}
          <Button variant="primary" size="lg" as="a" href="#kontakt" onClick={onClose}>
            Kostenloses Strategiegespräch
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
