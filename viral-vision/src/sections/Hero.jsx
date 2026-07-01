import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import CornerBrackets from '../components/ui/CornerBrackets.jsx'
import Spotlight from '../components/ui/Spotlight.jsx'
import { staggerContainer } from '../lib/motion.js'

const STATS = [
  { value: '50+', label: 'Projekte umgesetzt' },
  { value: '100%', label: 'Fokus auf Ergebnisse' },
  { value: '24H', label: 'Antwortzeit' },
]

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-40 pb-28 md:pt-56 md:pb-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-120px] h-[640px] w-[520px] -translate-x-1/2 rounded-full bg-primary/[0.16] blur-[140px]" />
        <div className="absolute bottom-[-160px] left-1/2 h-[360px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.08] blur-[120px]" />
        <div className="grid-texture absolute inset-0 opacity-60" />
        <div className="grain-overlay absolute inset-0" />
        <Spotlight />
      </div>

      <Container size="narrow">
        <motion.div
          className="relative flex flex-col items-center rounded-[2rem] px-2 py-14 text-center md:px-16 md:py-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <CornerBrackets />

          <Reveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-border px-4 py-1.5 font-mono text-micro uppercase tracking-wide text-text-secondary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Social Media — Premium Web — KI-Automatisierung
            </span>
          </Reveal>

          <Reveal variant="blurIn" delay={0.1} className="mt-8">
            <h1 className="text-balance max-w-3xl text-display font-semibold tracking-tight text-text">
              Wachstum, das man
              <span className="text-primary"> sieht.</span>
            </h1>
          </Reveal>

          <Reveal variant="fadeInUp" delay={0.25} className="mt-6">
            <p className="text-balance max-w-xl text-body-lg text-text-secondary">
              Wir entwickeln Social-Media-Strategien, Premium-Webseiten und
              KI-Automatisierungen für Marken, die mehr wollen als Reichweite
              — messbaren Umsatz.
            </p>
          </Reveal>

          <Reveal variant="fadeInUp" delay={0.4} className="mt-10">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <Button variant="primary" size="lg" as="a" href="#kontakt" icon={ArrowRight}>
                Kostenloses Strategiegespräch
              </Button>
              <Button variant="link" as="a" href="#ergebnisse" icon={ArrowRight}>
                Ergebnisse ansehen
              </Button>
            </div>
          </Reveal>

          <Reveal variant="fadeInUp" delay={0.55} className="mt-20">
            <dl className="flex items-center divide-x divide-border font-mono">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1.5 px-6 md:px-10 first:pl-0 last:pr-0">
                  <dd className="text-h3 font-semibold text-text">{stat.value}</dd>
                  <dt className="text-micro uppercase tracking-wide text-text-secondary">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </motion.div>
      </Container>
    </section>
  )
}
