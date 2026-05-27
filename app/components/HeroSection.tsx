"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, ChevronDown, Zap } from "lucide-react";
import ParticleField from "./ParticleField";

const WORDS = ["Schnell.", "Heiß.", "Frisch.", "Zestly."];

const FOOD_ITEMS = [
  { emoji: "🍔", label: "Burger", x: 8, y: 22, delay: 0, rot: -10 },
  { emoji: "🍕", label: "Pizza", x: 82, y: 14, delay: 0.4, rot: 8 },
  { emoji: "🍣", label: "Sushi", x: 74, y: 68, delay: 0.9, rot: -6 },
  { emoji: "🥗", label: "Salad", x: 12, y: 72, delay: 1.3, rot: 5 },
  { emoji: "🍰", label: "Cake", x: 88, y: 44, delay: 0.6, rot: -12 },
  { emoji: "🍝", label: "Pasta", x: 4, y: 48, delay: 1.1, rot: 10 },
  { emoji: "🍟", label: "Fries", x: 52, y: 84, delay: 0.2, rot: -8 },
  { emoji: "🥤", label: "Drink", x: 44, y: 8, delay: 0.7, rot: 6 },
  { emoji: "🌮", label: "Taco", x: 28, y: 88, delay: 1.5, rot: -5 },
  { emoji: "🍜", label: "Ramen", x: 64, y: 90, delay: 0.3, rot: 9 },
];

export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setWordIdx((i) => (i + 1) % WORDS.length); setVisible(true); }, 350);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden animated-bg"
    >
      {/* Particle canvas */}
      <ParticleField />

      {/* Mouse-parallax orbs */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full opacity-[0.07] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #FF6B35, transparent 70%)",
          left: `calc(${mousePos.x * 100}% - 350px)`,
          top: `calc(${mousePos.y * 100}% - 350px)`,
          transition: "left 1.2s ease, top 1.2s ease",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #FFD23F, transparent 70%)",
          left: `calc(${(1 - mousePos.x) * 100}% - 200px)`,
          top: `calc(${(1 - mousePos.y) * 100}% - 200px)`,
          transition: "left 1.8s ease, top 1.8s ease",
        }}
      />

      {/* Floating food emojis */}
      {FOOD_ITEMS.map((item, i) => (
        <div
          key={i}
          className="absolute hidden lg:flex flex-col items-center gap-1 select-none pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animation: `float ${3.5 + i * 0.2}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`,
            filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.4))",
          }}
        >
          <span
            className="text-5xl"
            style={{ transform: `rotate(${item.rot}deg)`, display: "block" }}
          >
            {item.emoji}
          </span>
        </div>
      ))}

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,107,53,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-28">
        {/* Live pill */}
        <div
          className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2.5 mb-10"
          style={{ animation: "slideInUp 0.7s ease-out both" }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06D6A0] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#06D6A0]" />
          </span>
          <span className="text-sm font-medium text-white/80">Jetzt verfügbar in deiner Stadt</span>
          <span className="text-[#FF6B35] text-sm font-bold flex items-center gap-1">
            Kostenlos testen <ArrowRight size={12} />
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-black leading-[0.92] mb-7 tracking-tight"
          style={{ animation: "slideInUp 0.7s 0.1s ease-out both" }}
        >
          <span className="block text-white" style={{ fontSize: "clamp(4rem,10vw,8rem)" }}>
            Essen.
          </span>
          <span
            className="block gradient-text"
            style={{
              fontSize: "clamp(4rem,10vw,8rem)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
          >
            {WORDS[wordIdx]}
          </span>
        </h1>

        {/* Sub */}
        <p
          className="text-xl md:text-2xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animation: "slideInUp 0.7s 0.2s ease-out both" }}
        >
          Dein Lieblingsessen in{" "}
          <span className="text-[#FFD23F] font-bold px-2 py-0.5 bg-[#FFD23F]/10 rounded-lg">
            unter 30 Minuten
          </span>{" "}
          bei dir. Heiß, frisch, unwiderstehlich.
        </p>

        {/* CTA row */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14"
          style={{ animation: "slideInUp 0.7s 0.3s ease-out both" }}
        >
          <Link
            href="/menu"
            className="group btn-press relative flex items-center gap-3 text-white font-bold text-lg px-9 py-4 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #FF6B35, #FFD23F)",
              boxShadow: "0 8px 32px rgba(255,107,53,0.45)",
            }}
          >
            {/* Shine sweep */}
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            <span className="relative">Jetzt bestellen</span>
            <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/tracking"
            className="btn-press flex items-center gap-3 glass text-white font-semibold text-lg px-9 py-4 rounded-2xl hover:border-[#FF6B35]/40 transition-all"
          >
            <Zap size={18} className="text-[#FFD23F]" />
            Bestellung verfolgen
          </Link>
        </div>

        {/* Social proof row */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-5 text-sm"
          style={{ animation: "slideInUp 0.7s 0.4s ease-out both" }}
        >
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#FFD23F" stroke="none" className="star-fill" />
            ))}
            <span className="text-white/80 font-semibold ml-1">4.9</span>
            <span className="text-white/40">(50.000+ Bewertungen)</span>
          </div>
          <span className="hidden sm:block text-white/20">|</span>
          <span className="text-[#06D6A0] font-bold flex items-center gap-1.5">
            <Zap size={14} fill="#06D6A0" stroke="none" /> Ø 12 Min. Lieferzeit
          </span>
          <span className="hidden sm:block text-white/20">|</span>
          <span className="text-white/50">
            <span className="text-white font-semibold">Kostenlos</span> ab 15€
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
          <div
            className="w-1 h-1.5 bg-white/50 rounded-full"
            style={{ animation: "scrollDot 2s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(10px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
