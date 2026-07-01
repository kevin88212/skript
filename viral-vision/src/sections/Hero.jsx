import { motion } from 'framer-motion'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { staggerContainer } from '../lib/motion.js'

const STATS = [
  { value: '50+', label: 'Projekte umgesetzt' },
  { value: '100%', label: 'Fokus auf Ergebnisse' },
  { value: '24h', label: 'Antwortzeit' },
]

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/20 blur-[160px]" />
        <div className="grid-texture absolute inset-0" />
      </div>

      <Container>
        <motion.div
          className="flex flex-col items-center text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <Reveal variant="fadeInUp">
            <span className="inline-flex items-center rounded-full border border-border px-4 py-1.5 text-micro uppercase tracking-wide text-text-secondary">
              Social Media &middot; Premium Webseiten &middot; KI-Automatisierung
            </span>
          </Reveal>

          <Reveal variant="blurIn" delay={0.1} className="mt-8">
            <h1 className="max-w-4xl text-display font-semibold tracking-tight text-text">
              Mehr Kunden. Mehr Sichtbarkeit.
              <span className="text-primary"> Mehr Umsatz.</span>
            </h1>
          </Reveal>

          <Reveal variant="fadeInUp" delay={0.25} className="mt-6">
            <p className="max-w-2xl text-body-lg text-text-secondary">
              Wir entwickeln Social-Media-Strategien, Premium-Webseiten und
              KI-Automatisierungen, die messbar mehr Kunden bringen &mdash; nicht
              nur mehr Likes.
            </p>
          </Reveal>

          <Reveal variant="fadeInUp" delay={0.4} className="mt-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" as="a" href="#kontakt">
                Kostenloses Strategiegespräch
              </Button>
              <Button variant="secondary" size="lg" as="a" href="#ergebnisse">
                Ergebnisse ansehen
              </Button>
            </div>
          </Reveal>

          <Reveal variant="fadeInUp" delay={0.55} className="mt-20 w-full">
            <dl className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 border-t border-border pt-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-h3 font-semibold text-text">{stat.value}</dd>
                  <span className="text-small text-text-secondary">{stat.label}</span>
                </div>
              ))}
            </dl>
          </Reveal>
        </motion.div>
      </Container>
    </section>
  )
}
