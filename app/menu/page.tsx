"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { menuItems, categories } from "../lib/data";
import { useCartStore } from "../lib/store";
import { Star, Clock, Search, SlidersHorizontal, Plus, Check } from "lucide-react";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [added, setAdded] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const filtered = menuItems
    .filter((item) => {
      const matchCat = activeCategory === "all" || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });

  const handleAdd = (item: (typeof menuItems)[0]) => {
    addItem({ id: item.id, name: item.name, price: item.price, emoji: item.emoji });
    setAdded(item.id);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <div className="animated-bg min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #FF6B35, transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <div className="slide-in-up">
            <span className="inline-block glass rounded-full px-4 py-1.5 text-[#FF6B35] text-sm font-bold uppercase tracking-widest mb-4">
              Unsere Speisekarte
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
              Was darf es <span className="gradient-text">heute sein?</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl">
              Über 500 handverlesene Gerichte. Frisch zubereitet. Blitzschnell geliefert.
            </p>
          </div>

          {/* Search bar */}
          <div className="mt-8 relative max-w-2xl">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche nach Burgern, Pizza, Sushi…"
              className="w-full glass rounded-2xl pl-14 pr-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#FF6B35]/50 border border-white/0 transition-all text-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories + Sort */}
      <div className="sticky top-20 z-30 glass-dark border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white shadow-lg shadow-orange-500/20"
                    : "glass text-white/60 hover:text-white"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-white/50" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-white/20 rounded-xl px-3 py-2 text-white/70 text-sm focus:outline-none focus:border-[#FF6B35]/50"
            >
              <option value="popular" className="bg-[#1A1A2E]">Beliebt</option>
              <option value="rating" className="bg-[#1A1A2E]">Bewertung</option>
              <option value="price-asc" className="bg-[#1A1A2E]">Preis ↑</option>
              <option value="price-desc" className="bg-[#1A1A2E]">Preis ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-white/40 text-sm mb-6">
            {filtered.length} Gerichte gefunden
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 glass rounded-3xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">Nichts gefunden</h3>
              <p className="text-white/50">Versuch einen anderen Suchbegriff</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="glass rounded-3xl overflow-hidden food-card group"
                >
                  {/* Emoji image area */}
                  <div className="relative bg-gradient-to-br from-[#FF6B35]/10 to-[#FFD23F]/10 p-8 flex items-center justify-center min-h-[160px]">
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                      {item.emoji}
                    </span>
                    {item.tag && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {item.tag}
                      </span>
                    )}
                    {item.popular && (
                      <span className="absolute top-3 right-3 w-7 h-7 bg-[#FFD23F]/20 border border-[#FFD23F]/50 rounded-full flex items-center justify-center text-sm">
                        🔥
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center gap-1 mb-1 text-xs text-white/50">
                      <Star size={11} fill="#FFD23F" stroke="none" className="star-fill" />
                      <span className="font-semibold text-[#FFD23F]">{item.rating}</span>
                      <span>({item.reviews.toLocaleString()})</span>
                      <span className="mx-1 text-white/20">•</span>
                      <Clock size={11} />
                      <span className="ml-0.5">{item.time}</span>
                    </div>

                    <h3 className="font-bold text-white mb-1 leading-snug">{item.name}</h3>
                    <p className="text-white/45 text-xs leading-relaxed line-clamp-2 mb-4">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-black gradient-text">
                          {item.price.toFixed(2)}€
                        </span>
                      </div>
                      <button
                        onClick={() => handleAdd(item)}
                        className={`btn-press flex items-center gap-1.5 rounded-xl px-4 py-2 font-bold text-sm transition-all duration-300 ${
                          added === item.id
                            ? "bg-[#06D6A0] text-white"
                            : "bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white hover:shadow-lg hover:shadow-orange-500/30"
                        }`}
                      >
                        {added === item.id ? (
                          <>
                            <Check size={14} />
                            <span>OK</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            <span>Hinzufügen</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
