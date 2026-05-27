"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "../lib/store";
import ScrollReveal from "./ScrollReveal";

const DEALS = [
  {
    id: "deal1", emoji: "🍓", name: "Erdbeer-Kiste groß",
    originalPrice: 12.9, dealPrice: 7.9,
    tag: "38% RABATT", tagColor: "#EF233C",
    desc: "2kg Erdbeeren vom Hof Bergmann — Saisonstart zum Einführungspreis.",
    endsIn: 4 * 3600 + 23 * 60 + 11,
  },
  {
    id: "deal2", emoji: "🥦", name: "Gemüse-Wochenbox",
    originalPrice: 24.9, dealPrice: 16.9,
    tag: "WOCHENMARKT-DEAL", tagColor: "#22D470",
    desc: "Brokkoli, Tomaten, Karotten, Spinat — 5 Sorten, alles regional, alles frisch.",
    endsIn: 11 * 3600 + 5 * 60 + 44,
  },
  {
    id: "deal3", emoji: "🍝", name: "Pasta & Pesto Bundle",
    originalPrice: 14.9, dealPrice: 9.9,
    tag: "BUNDLE", tagColor: "#FFD23F",
    desc: "Handgemachte Tagliatelle + Basilikum-Pesto aus der Berliner Manufaktur.",
    endsIn: 2 * 3600 + 48 * 60 + 3,
  },
];

function Countdown({ seconds }: { seconds: number }) {
  const [s, setS] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setS((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const fmt = (n: number) => n.toString().padStart(2, "0");
  return (
    <div className="flex items-center gap-1.5 text-xs font-mono">
      <span className="text-white/40">Endet in</span>
      {[h, m, sec].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-white/10 text-white font-bold px-2 py-1 rounded-lg">{fmt(v)}</span>
          {i < 2 && <span className="text-white/30">:</span>}
        </span>
      ))}
    </div>
  );
}

export default function DealsSection() {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState<string | null>(null);

  const handleAdd = (deal: (typeof DEALS)[0]) => {
    addItem({ id: deal.id, name: deal.name, price: deal.dealPrice, emoji: deal.emoji });
    setAdded(deal.id);
    setTimeout(() => setAdded(null), 1400);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#22D470]/4 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-[#EF233C] text-sm font-bold uppercase tracking-widest mb-5">
            <span className="w-2 h-2 bg-[#EF233C] rounded-full animate-pulse" />
            Tagesangebote
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white">
            Saisonale Deals,{" "}
            <span className="gradient-text">täglich frisch</span>
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {DEALS.map((deal, i) => (
            <ScrollReveal key={deal.id} delay={i * 0.1} direction="up">
              <div className="glass rounded-3xl overflow-hidden group hover:border-[#22D470]/30 transition-all duration-300 flex flex-col">
                <div className="relative bg-gradient-to-br from-[#22D470]/15 to-[#A3E635]/8 p-10 flex items-center justify-center">
                  <span className="text-8xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-xl">{deal.emoji}</span>
                  <span className="absolute top-4 left-4 text-xs font-black px-3 py-1.5 rounded-full text-white tracking-wider"
                    style={{ background: deal.tagColor }}>
                    {deal.tag}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-black text-white text-xl mb-2">{deal.name}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4 flex-1">{deal.desc}</p>
                  <Countdown seconds={deal.endsIn} />
                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <span className="text-white/30 line-through text-sm">{deal.originalPrice.toFixed(2)}€</span>
                      <div className="text-3xl font-black gradient-text leading-tight">{deal.dealPrice.toFixed(2)}€</div>
                    </div>
                    <button
                      onClick={() => handleAdd(deal)}
                      className={`btn-press flex items-center gap-2 font-bold px-5 py-3 rounded-2xl text-white transition-all duration-300 ${
                        added === deal.id
                          ? "bg-[#06D6A0]"
                          : "bg-gradient-to-r from-[#22D470] to-[#A3E635] text-[#1A1A2E] hover:shadow-lg hover:shadow-green-500/30"
                      }`}
                    >
                      {added === deal.id ? "✓ Im Korb!" : "Deal sichern"}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="text-center mt-10">
          <Link href="/menu" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
            Alle Produkte ansehen →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
