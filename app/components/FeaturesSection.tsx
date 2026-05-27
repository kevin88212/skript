"use client";

import { features } from "../lib/data";
import TiltCard from "./TiltCard";
import ScrollReveal from "./ScrollReveal";

export default function FeaturesSection() {
  return (
    <section className="py-24 relative" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block glass rounded-full px-4 py-2 text-[#FF6B35] text-sm font-bold uppercase tracking-widest mb-4">
            Warum Zestly?
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white">
            Lieferung{" "}
            <span className="gradient-text">neu gedacht</span>
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.1} direction="up">
              <TiltCard className="glass rounded-3xl p-8 h-full flex flex-col hover:border-[#FF6B35]/30 transition-colors">
                <div className="text-5xl mb-5">{f.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed flex-1">{f.desc}</p>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
