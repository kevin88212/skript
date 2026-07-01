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
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-base ease-premium ${
          scrolled ? 'glass-nav border-border' : 'bg-transparent border-transparent'
        }`}
        transition={{ duration: DURATION.base, ease: EASE_PREMIUM }}
      >
        <Container>
          <nav aria-label="Hauptnavigation" className="flex h-16 md:h-20 items-center justify-between">
            <Logo />

            <ul className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-small text-text-secondary hover:text-text transition-colors duration-fast"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden md:block">
              <Button variant="primary" size="sm" as="a" href="#kontakt">
                Kostenloses Strategiegespräch
              </Button>
            </div>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </Container>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} />
    </>
  )
}
