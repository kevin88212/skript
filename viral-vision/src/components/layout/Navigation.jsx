import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Container from '../ui/Container.jsx'
import Logo from '../ui/Logo.jsx'
import Button from '../ui/Button.jsx'
import MobileMenu from './MobileMenu.jsx'
import { DURATION, EASE_PREMIUM } from '../../lib/motion.js'

const NAV_LINKS = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Ergebnisse', href: '#ergebnisse' },
  { label: 'Prozess', href: '#prozess' },
  { label: 'Kontakt', href: '#kontakt' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
        <Container size="wide" className="px-0!">
          <motion.nav
            aria-label="Hauptnavigation"
            className={`flex h-14 md:h-16 items-center justify-between rounded-full border px-4 md:px-6 transition-colors duration-base ease-premium ${
              scrolled ? 'glass-nav border-border shadow-elevation-sm' : 'border-transparent bg-transparent'
            }`}
            transition={{ duration: DURATION.base, ease: EASE_PREMIUM }}
          >
            <Logo />

            <ul className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group relative inline-flex items-center px-3 py-2 text-small text-text-secondary hover:text-text transition-colors duration-fast"
                  >
                    {link.label}
                    <span className="absolute bottom-0.5 left-3 right-3 h-px scale-x-0 bg-primary transition-transform duration-fast ease-premium origin-center group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden md:block">
              <Button variant="primary" size="sm" as="a" href="#kontakt">
                Strategiegespräch
              </Button>
            </div>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </motion.nav>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} />
    </>
  )
}
