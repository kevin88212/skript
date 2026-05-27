"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, ChevronDown, Leaf } from "lucide-react";
import ParticleField from "./ParticleField";

const WORDS = ["Frisch.", "Regional.", "Direkt.", "Zestly."];

const FLOATING = [
  { emoji: "🍎", x: 8, y: 22, delay: 0, rot: -10 },
  { emoji: "🥦", x: 82, y: 14, delay: 0.4, rot: 8 },
  { emoji: "🍓", x: 74, y: 68, delay: 0.9, rot: -6 },
  { emoji: "🥕", x: 12, y: 72, delay: 1.3, rot: 5 },
  { emoji: "🍝", x: 88, y: 44, delay: 0.6, rot: -12 },
  { emoji: "🧀", x: 4, y: 48, delay: 1.1, rot: 10 },
  { emoji: "🍞", x: 52, y: 84, delay: 0.2, rot: -8 },
  { emoji: "🌿", x: 44, y: 8, delay: 0.7, rot: 6 },
  { emoji: "🫐", x: 28, y: 88, delay: 1.5, rot: -5 },
  { emoji: "🥬", x: 64, y: 90, delay: 0.3, rot: 9 },
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
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden animated-bg">
      <ParticleField />

      {/* Parallax orbs */}
      <div className="absolute w-[700px] h-[700px] rounded-full opacity-[0.08] pointer-events-none"
        style={{ background: "radial-gradient(circle, #22D470, transparent 70%)", left: `calc(${mousePos.x * 100}% - 350px)`, top: `calc(${mousePos.y * 100}% - 350px)`, transition: "left 1.2s ease, top 1.2s ease" }} />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: "radial-gradient(circle, #A3E635, transparent 70%)", left: `calc(${(1 - mousePos.x) * 100}% - 200px)`, top: `calc(${(1 - mousePos.y) * 100}% - 200px)`, transition: "left 1.8s ease, top 1.8s ease" }} />

      {/* Floating produce */}
      {FLOATING.map((item, i) => (
        <div key={i} className="absolute hidden lg:flex select-none pointer-events-none"
          style={{ left: `${item.x}%`, top: `${item.y}%`, animation: `float ${3.5 + i * 0.2}s ease-in-out infinite`, animationDelay: `${item.delay}s`, filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.4))" }}>
          <span className="text-5xl" style={{ transform: `rotate(${item.rot}deg)`, display: "block" }}>{item.emoji}</span>
        </div>
      ))}

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(rgba(34,212,112,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,212,112,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-28">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 glass rounded-full px-5 py-2.5 mb-10" style={{ animation: "slideInUp 0.7s ease-out both" }}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D470] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22D470]" />
          </span>
          <span className="text-sm font-medium text-white/80">Heute geerntet, heute geliefert</span>
          <span className="text-[#22D470] text-sm font-bold flex items-center gap-1">Jetzt entdecken <ArrowRight size={12} /></span>
        </div>

        {/* Headline */}
        <h1 className="font-black leading-[0.92] mb-7 tracking-tight" style={{ animation: "slideInUp 0.7s 0.1s ease-out both" }}>
          <span className="block text-white" style={{ fontSize: "clamp(3.5rem,9vw,7.5rem)" }}>Dein Wochenmarkt.</span>
          <span className="block" style={{
            fontSize: "clamp(3.5rem,9vw,7.5rem)",
            background: "linear-gradient(135deg, #22D470, #A3E635)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}>
            {WORDS[wordIdx]}
          </span>
        </h1>

        {/* Sub */}
        <p className="text-xl md:text-2xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animation: "slideInUp 0.7s 0.2s ease-out both" }}>
          Obst, Gemüse, Nudeln & regionale Spezialitäten — frisch von{" "}
          <span className="text-[#22D470] font-bold px-2 py-0.5 bg-[#22D470]/10 rounded-lg">35+ lokalen Erzeugern</span>{" "}
          direkt zu dir.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14" style={{ animation: "slideInUp 0.7s 0.3s ease-out both" }}>
          <Link href="/menu" className="group btn-press relative flex items-center gap-3 text-white font-bold text-lg px-9 py-4 rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #22D470, #A3E635)", boxShadow: "0 8px 32px rgba(34,212,112,0.4)" }}>
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            <span className="relative">Zum Markt</span>
            <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/tracking" className="btn-press flex items-center gap-3 glass text-white font-semibold text-lg px-9 py-4 rounded-2xl hover:border-[#22D470]/40 transition-all">
            <Leaf size={18} className="text-[#22D470]" />
            Lieferung verfolgen
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 text-sm" style={{ animation: "slideInUp 0.7s 0.4s ease-out both" }}>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FFD23F" stroke="none" className="star-fill" />)}
            <span className="text-white/80 font-semibold ml-1">4.9</span>
            <span className="text-white/40">(50.000+ Kunden)</span>
          </div>
          <span className="hidden sm:block text-white/20">|</span>
          <span className="text-[#22D470] font-bold flex items-center gap-1.5">🌱 35+ regionale Erzeuger</span>
          <span className="hidden sm:block text-white/20">|</span>
          <span className="text-white/50"><span className="text-white font-semibold">Kostenlos</span> ab 20€</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} className="animate-bounce" />
      </div>
    </section>
  );
}
