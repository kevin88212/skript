"use client";

import { useEffect, useRef, useState } from "react";
import { features } from "../lib/data";

export default function FeaturesSection() {
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
    <section className="py-24 relative" id="features">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block glass rounded-full px-4 py-2 text-[#FF6B35] text-sm font-bold uppercase tracking-widest mb-4">
            Warum Zestly?
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white">
            Lieferung{" "}
            <span className="gradient-text">neu gedacht</span>
          </h2>
        </div>

        {/* Feature grid */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`glass rounded-3xl p-8 food-card transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="text-5xl mb-5">{f.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
