import { MotionConfig } from 'framer-motion'
import Navigation from './components/layout/Navigation.jsx'
import Hero from './sections/Hero.jsx'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="sr-only focus:not-sr-only focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-sm focus:top-4 focus:left-4 focus:z-[100]">
        Zum Inhalt springen
      </a>
      <Navigation />
      <main id="main">
        <Hero />
      </main>
    </MotionConfig>
  )
}
