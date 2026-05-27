"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "../lib/data";

function AnimatedStat({ value, label, emoji }: { value: string; label: string; emoji: string }) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center gap-3 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="text-4xl">{emoji}</div>
      <div className="text-4xl md:text-5xl font-black gradient-text">{value}</div>
      <div className="text-white/60 text-sm font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#22D470]/10 via-transparent to-[#FFD23F]/10" />
      <div className="max-w-5xl mx-auto px-6">
        <div className="glass rounded-3xl p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <AnimatedStat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
