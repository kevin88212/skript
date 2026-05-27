import Link from "next/link";
import { Zap, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] flex items-center justify-center">
                <Zap size={20} fill="white" stroke="white" />
              </div>
              <span className="text-2xl font-black gradient-text">Zestly</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Dein Lieblingsessen. In unter 30 Minuten. Jeden Tag frisch,
              schnell und mit Liebe.
            </p>
            <div className="flex gap-3 mt-5">
              {["𝕏", "📘", "📸", "🎵"].map((icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-sm hover:border-[#FF6B35]/50 transition-all"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Produkt</h4>
            <ul className="space-y-2">
              {["Speisekarte", "Restaurants", "Angebote", "Tracking", "App herunterladen"].map((l) => (
                <li key={l}>
                  <Link href="#" className="text-white/50 text-sm hover:text-white transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Unternehmen</h4>
            <ul className="space-y-2">
              {["Über uns", "Karriere", "Partner werden", "Presse", "Kontakt"].map((l) => (
                <li key={l}>
                  <Link href="#" className="text-white/50 text-sm hover:text-white transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2025 Zestly GmbH. Alle Rechte vorbehalten.
          </p>
          <p className="text-white/40 text-sm flex items-center gap-1">
            Gemacht mit <Heart size={14} fill="#FF6B35" stroke="none" className="text-[#FF6B35]" /> in Berlin
          </p>
          <div className="flex gap-4">
            {["Datenschutz", "AGB", "Impressum"].map((l) => (
              <Link key={l} href="#" className="text-white/40 text-xs hover:text-white transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
