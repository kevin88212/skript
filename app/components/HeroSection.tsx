"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, ChevronDown } from "lucide-react";

const FLOATING_EMOJIS = [
  { emoji: "🍔", x: 10, y: 20, delay: 0, size: "text-5xl" },
  { emoji: "🍕", x: 80, y: 15, delay: 0.5, size: "text-6xl" },
  { emoji: "🍣", x: 70, y: 65, delay: 1, size: "text-4xl" },
  { emoji: "🥗", x: 15, y: 70, delay: 1.5, size: "text-5xl" },
  { emoji: "🍰", x: 90, y: 45, delay: 0.8, size: "text-4xl" },
  { emoji: "🍝", x: 5, y: 45, delay: 1.2, size: "text-3xl" },
  { emoji: "🍟", x: 55, y: 80, delay: 0.3, size: "text-4xl" },
  { emoji: "🥤", x: 40, y: 10, delay: 0.7, size: "text-3xl" },
];

const WORDS = ["Schnell.", "Heiß.", "Unvergesslich.", "Zestly."];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, 400);
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-bg">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 blob opacity-20"
          style={{ background: "radial-gradient(circle, #FF6B35, transparent)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 blob opacity-15"
          style={{
            background: "radial-gradient(circle, #FFD23F, transparent)",
            animationDelay: "4s",
          }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 blob opacity-10"
          style={{
            background: "radial-gradient(circle, #06D6A0, transparent)",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Floating food emojis */}
      {FLOATING_EMOJIS.map((item, i) => (
        <div
          key={i}
          className={`absolute hidden lg:block ${item.size} select-none pointer-events-none`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animation: `float ${3 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`,
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
            opacity: 0.85,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 mb-8 slide-in-up">
          <span className="w-2 h-2 bg-[#06D6A0] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-white/80">
            Jetzt verfügbar in deiner Stadt
          </span>
          <span className="text-[#FF6B35] text-sm font-bold">→ Kostenlos testen</span>
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-6">
          <span className="block text-white slide-in-up delay-100">Essen.</span>
          <span
            className="block gradient-text transition-all duration-500"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {WORDS[wordIndex]}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed slide-in-up delay-300">
          Dein Lieblingsessen. In{" "}
          <span className="text-[#FFD23F] font-bold">unter 30 Minuten</span> bei dir.
          <br />
          Heiß, frisch, unwiderstehlich.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 slide-in-up delay-400">
          <Link
            href="/menu"
            className="group btn-press flex items-center gap-3 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold text-lg px-8 py-4 rounded-2xl orange-glow hover:orange-glow-strong transition-all duration-300"
          >
            Jetzt bestellen
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="/tracking"
            className="btn-press flex items-center gap-3 glass text-white font-semibold text-lg px-8 py-4 rounded-2xl hover:border-[#FF6B35]/50 transition-all"
          >
            Bestellung verfolgen
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/50 slide-in-up delay-500">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className="star-fill"
                  fill="#FFD23F"
                  stroke="none"
                />
              ))}
            </div>
            <span className="text-white/70 font-semibold">4.9/5</span>
            <span>(50.000+ Bewertungen)</span>
          </div>
          <span className="hidden sm:block text-white/20">|</span>
          <div className="flex items-center gap-2">
            <span className="text-[#06D6A0] font-bold">⚡ Ø 12 Minuten</span>
            <span>Lieferzeit</span>
          </div>
          <span className="hidden sm:block text-white/20">|</span>
          <span>
            <span className="text-white/70 font-semibold">Kostenlose</span> Lieferung ab 15€
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30">
          <span className="text-xs">Mehr entdecken</span>
          <ChevronDown size={20} className="animate-bounce" />
        </div>
      </div>
    </section>
  );
}
