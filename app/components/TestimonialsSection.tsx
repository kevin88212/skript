"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Laura M.",
    city: "Berlin",
    avatar: "👩‍💼",
    rating: 5,
    text: "Ich habe noch nie so schnell mein Essen bekommen! 11 Minuten von Bestellung bis Haustür. Absolut begeistert.",
  },
  {
    name: "Tobias K.",
    city: "München",
    avatar: "👨‍💻",
    rating: 5,
    text: "Das Live-Tracking ist der Hammer. Man sieht wirklich live, wo der Fahrer ist. Kein Vergleich zu anderen Apps.",
  },
  {
    name: "Sofia A.",
    city: "Hamburg",
    avatar: "👩‍🎨",
    rating: 5,
    text: "Die Qualität ist top. Alles kommt heiß an und schmeckt genauso gut wie im Restaurant. Bin Fan!",
  },
  {
    name: "Max R.",
    city: "Köln",
    avatar: "👨‍🍳",
    rating: 5,
    text: "Zestly hat Lieferdienste neu erfunden. Die App ist so intuitiv und das Design macht einfach Spaß.",
  },
  {
    name: "Elena V.",
    city: "Frankfurt",
    avatar: "👩‍🔬",
    rating: 5,
    text: "Jeden Tag Zestly – kein Tag ohne es bereut! Die Auswahl ist riesig und immer was Neues dabei.",
  },
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

        {/* Scrolling row 1 */}
        <div className="relative">
          <div
            className="flex gap-6"
            style={{
              animation: "scrollLeft 30s linear infinite",
              width: "max-content",
            }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="glass rounded-3xl p-6 w-80 flex-shrink-0"
              >
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
