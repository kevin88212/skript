"use client";

export default function AppDownloadSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="app">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative glass rounded-[40px] p-8 md:p-16 overflow-hidden">
          {/* BG decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle, #FF6B35, transparent)" }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle, #FFD23F, transparent)" }} />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <span className="inline-block bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] rounded-full px-4 py-1.5 text-white text-sm font-bold uppercase tracking-widest mb-6">
                Jetzt kostenlos
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Hol dir die <br />
                <span className="gradient-text">Zestly App</span>
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Bestell schneller, tracke genauer, spare mehr. Exklusive Deals
                nur für App-Nutzer. Erste Bestellung{" "}
                <span className="text-[#FFD23F] font-bold">kostenlos geliefert!</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-press flex items-center gap-4 glass neon-border rounded-2xl px-6 py-4 hover:bg-white/10 transition-all group">
                  <span className="text-3xl">🍎</span>
                  <div className="text-left">
                    <div className="text-white/60 text-xs">Download im</div>
                    <div className="font-bold text-white">App Store</div>
                  </div>
                </button>
                <button className="btn-press flex items-center gap-4 glass neon-border rounded-2xl px-6 py-4 hover:bg-white/10 transition-all group">
                  <span className="text-3xl">🤖</span>
                  <div className="text-left">
                    <div className="text-white/60 text-xs">Download im</div>
                    <div className="font-bold text-white">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] rounded-[40px] blur-3xl opacity-20 scale-110" />

                {/* Phone body */}
                <div className="relative w-64 h-[520px] bg-[#1A1A2E] rounded-[40px] border-2 border-white/10 overflow-hidden shadow-2xl">
                  {/* Status bar */}
                  <div className="bg-[#0F3460] px-6 pt-4 pb-3 flex items-center justify-between">
                    <span className="text-white/60 text-xs">9:41</span>
                    <div className="w-20 h-5 bg-[#1A1A2E] rounded-full" />
                    <div className="flex gap-1">
                      <div className="w-4 h-2 rounded-sm bg-white/60" />
                      <div className="w-1.5 h-2 rounded-sm bg-white/60" />
                    </div>
                  </div>

                  {/* App header */}
                  <div className="bg-gradient-to-br from-[#FF6B35]/20 to-[#FFD23F]/10 px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-white/60 text-xs">Lieferung nach</div>
                        <div className="text-white font-bold text-sm">Berlin Mitte 📍</div>
                      </div>
                      <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🛒</span>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl px-3 py-2 text-white/40 text-xs">
                      🔍 Was möchtest du bestellen?
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="px-4 py-3 flex gap-2 overflow-x-hidden">
                    {["🍔", "🍕", "🍣", "🥗"].map((e, i) => (
                      <div
                        key={i}
                        className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                          i === 0
                            ? "bg-gradient-to-br from-[#FF6B35] to-[#FFD23F]"
                            : "bg-white/10"
                        }`}
                      >
                        {e}
                      </div>
                    ))}
                  </div>

                  {/* Popular item card */}
                  <div className="px-4 py-2">
                    <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3">
                      Beliebt bei dir
                    </div>
                    <div className="glass rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35]/20 to-[#FFD23F]/10 rounded-xl flex items-center justify-center text-3xl">
                          🍔
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-bold text-xs">Zestly Burger</div>
                          <div className="text-[#FFD23F] text-xs">⭐ 4.9</div>
                          <div className="text-white/60 text-xs">14,90€</div>
                        </div>
                        <div className="w-7 h-7 bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">+</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom nav */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#0F3460] px-4 py-4 flex justify-around items-center">
                    {["🏠", "🔍", "🛒", "👤"].map((icon, i) => (
                      <button
                        key={i}
                        className={`text-xl p-2 rounded-xl transition-all ${
                          i === 0 ? "bg-[#FF6B35]/20" : ""
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
