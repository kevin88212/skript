"use client";

import Link from "next/link";
import { Star, Clock, ArrowRight, Plus } from "lucide-react";
import { menuItems } from "../lib/data";
import { useCartStore } from "../lib/store";
import { useState } from "react";

const popular = menuItems.filter((i) => i.popular);

export default function PopularSection() {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState<string | null>(null);

  const handleAdd = (item: typeof popular[0]) => {
    addItem({ id: item.id, name: item.name, price: item.price, emoji: item.emoji });
    setAdded(item.id);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <section className="py-24 relative" id="popular">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block glass rounded-full px-4 py-2 text-[#FFD23F] text-sm font-bold uppercase tracking-widest mb-4">
              Beliebt
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Die <span className="gradient-text">Lieblingsgerichte</span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="hidden md:flex items-center gap-2 text-[#FF6B35] font-semibold hover:gap-3 transition-all"
          >
            Alle anzeigen <ArrowRight size={18} />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popular.map((item) => (
            <div key={item.id} className="glass rounded-3xl overflow-hidden food-card group">
              {/* Emoji display */}
              <div className="relative bg-gradient-to-br from-[#FF6B35]/10 to-[#FFD23F]/10 p-8 flex items-center justify-center">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                  {item.emoji}
                </span>
                {item.tag && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center gap-1 mb-2 text-xs text-white/50">
                  <Star size={12} fill="#FFD23F" stroke="none" className="star-fill" />
                  <span className="font-semibold text-[#FFD23F]">{item.rating}</span>
                  <span>({item.reviews.toLocaleString()})</span>
                  <span className="mx-1">•</span>
                  <Clock size={12} />
                  <span>{item.time}</span>
                </div>

                <h3 className="font-bold text-white text-lg leading-tight mb-1">{item.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-4">
                  {item.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black gradient-text">
                    {item.price.toFixed(2)}€
                  </span>
                  <button
                    onClick={() => handleAdd(item)}
                    className={`btn-press flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-sm transition-all duration-300 ${
                      added === item.id
                        ? "bg-[#06D6A0] text-white scale-95"
                        : "bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white hover:shadow-lg hover:shadow-orange-500/30"
                    }`}
                  >
                    {added === item.id ? (
                      "✓ Hinzugefügt"
                    ) : (
                      <>
                        <Plus size={16} />
                        Bestellen
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center mt-8 md:hidden">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 btn-press bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold px-8 py-4 rounded-2xl"
          >
            Alle Gerichte anzeigen <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
