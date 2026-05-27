"use client";

import { Star } from "lucide-react";

const testimonials = [
  { name: "Laura M.", city: "Berlin Prenzlberg", avatar: "👩‍💼", rating: 5, text: "Endlich weiß ich wieder wo mein Essen herkommt. Die Erdbeeren vom Hof Bergmann sind unglaublich — wie früher bei Oma." },
  { name: "Tobias K.", city: "Berlin Mitte", avatar: "👨‍💻", rating: 5, text: "Als Stadtmensch hatte ich keine Ahnung wie frisches Gemüse schmeckt. Zestly hat das geändert. Die Karotten sind ein Game-Changer!" },
  { name: "Sofia A.", city: "Berlin Kreuzberg", avatar: "👩‍🎨", rating: 5, text: "Die Tagliatelle aus der Manufaktur sind das Beste was mir je passiert ist. Und alles in 30 Minuten — unglaublich." },
  { name: "Max R.", city: "Berlin Lichtenberg", avatar: "👨‍🍳", rating: 5, text: "Als Koch teste ich viel. Zestly liefert Qualität, die sonst nur Profiköche auf dem Großmarkt bekommen. Absolute Empfehlung." },
  { name: "Elena V.", city: "Berlin Schöneberg", avatar: "👩‍🔬", rating: 5, text: "Plastikfrei, regional, schnell. Ich bestelle jeden Donnerstag meine Wochenbox. Nie wieder Supermarkt-Gemüse." },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block glass rounded-full px-4 py-2 text-[#FFD23F] text-sm font-bold uppercase tracking-widest mb-4">
            Kundenstimmen
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white">
            Geliebt von <span className="gradient-text">50.000+</span>
          </h2>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-6" style={{ animation: "scrollLeft 35s linear infinite", width: "max-content" }}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="glass rounded-3xl p-6 w-80 flex-shrink-0 hover:border-[#22D470]/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-white/50 text-sm">{t.city}</div>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} fill="#FFD23F" stroke="none" className="star-fill" />
                    ))}
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
