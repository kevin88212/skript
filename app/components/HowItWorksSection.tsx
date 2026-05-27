"use client";

import ScrollReveal from "./ScrollReveal";

const steps = [
  { step: "01", emoji: "📍", title: "Standort eingeben", desc: "Gib deine Adresse ein – wir zeigen dir welche Erzeuger in deiner Region liefern.", color: "#22D470" },
  { step: "02", emoji: "🍽️", title: "Auswählen & bestellen", desc: "Wähle Obst, Gemüse, Nudeln & Spezialitäten. Bezahle sicher in Sekunden.", color: "#FFD23F" },
  { step: "03", emoji: "⚡", title: "Live verfolgen", desc: "Sieh deinen Fahrer in Echtzeit auf der Karte. Kein Rätselraten.", color: "#06D6A0" },
  { step: "04", emoji: "🎉", title: "Genießen!", desc: "Erntefrisch bei dir. Pack aus, genieße – und schmeck den Unterschied.", color: "#22D470" },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 relative" id="how-it-works">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#22D470]/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block glass rounded-full px-4 py-2 text-[#06D6A0] text-sm font-bold uppercase tracking-widest mb-4">
            So einfach geht's
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white">
            In <span className="gradient-text">4 Schritten</span> zum Genuss
          </h2>
        </ScrollReveal>

        <div className="relative">
          {/* Connecting line */}
          <ScrollReveal>
            <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#22D470] via-[#FFD23F] to-[#06D6A0] opacity-25" />
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.12} direction="up">
                <div className="glass rounded-3xl p-8 text-center hover:border-white/20 transition-colors h-full flex flex-col">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-full text-white font-black text-sm mb-5 mx-auto"
                    style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}99)`, boxShadow: `0 0 20px ${s.color}40` }}
                  >
                    {s.step}
                  </div>
                  <div
                    className="text-5xl mb-4"
                    style={{ animation: `float ${3.5 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }}
                  >
                    {s.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed flex-1">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
