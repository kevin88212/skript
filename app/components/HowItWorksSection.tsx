"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    step: "01",
    emoji: "📍",
    title: "Standort eingeben",
    desc: "Gib deine Adresse ein – wir zeigen dir alle Restaurants in deiner Nähe.",
    color: "#FF6B35",
  },
  {
    step: "02",
    emoji: "🍽️",
    title: "Auswählen & bestellen",
    desc: "Wähle aus über 500 Gerichten. Bezahle sicher mit einem Klick.",
    color: "#FFD23F",
  },
  {
    step: "03",
    emoji: "⚡",
    title: "Live verfolgen",
    desc: "Sieh deinen Fahrer in Echtzeit auf der Karte. Kein Rätselraten.",
    color: "#06D6A0",
  },
  {
    step: "04",
    emoji: "🎉",
    title: "Genießen!",
    desc: "Heiß geliefert, perfekt angerichtet. Lass es dir schmecken.",
    color: "#FF6B35",
  },
];

export default function HowItWorksSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 relative" id="how-it-works">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF6B35]/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block glass rounded-full px-4 py-2 text-[#06D6A0] text-sm font-bold uppercase tracking-widest mb-4">
            So einfach geht's
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white">
            In <span className="gradient-text">4 Schritten</span> zum Genuss
          </h2>
        </div>

        <div ref={ref} className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B35] via-[#FFD23F] to-[#06D6A0] opacity-30 -translate-y-1/2" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className={`relative glass rounded-3xl p-8 text-center transition-all duration-700 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                {/* Step number */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full text-white font-black text-sm mb-6"
                  style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}88)` }}
                >
                  {s.step}
                </div>

                {/* Emoji */}
                <div className="text-5xl mb-4 animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
                  {s.emoji}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
