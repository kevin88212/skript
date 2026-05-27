"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Zap, MapPin } from "lucide-react";
import { useCartStore } from "../lib/store";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.qty, 0));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-dark py-3 shadow-lg" : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] flex items-center justify-center orange-glow group-hover:scale-110 transition-transform">
            <Zap size={20} fill="white" stroke="white" />
          </div>
          <span className="text-2xl font-black tracking-tight gradient-text">Zestly</span>
        </Link>

        {/* Location pill */}
        <button className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-white/70 hover:text-white hover:border-[#FF6B35]/50 transition-all group">
          <MapPin size={14} className="text-[#FF6B35]" />
          <span>Berlin Mitte</span>
          <span className="text-white/30">▾</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Speisekarte", href: "/menu" },
            { label: "Tracking", href: "/tracking" },
            { label: "Über uns", href: "/#about" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* CTA + Cart */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 glass rounded-full px-4 py-2 hover:border-[#FF6B35]/50 transition-all group"
          >
            <ShoppingCart size={18} className="text-[#FF6B35]" />
            <span className="hidden sm:block text-sm font-medium">Warenkorb</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF6B35] rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            href="/menu"
            className="hidden md:flex btn-press items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] rounded-full px-5 py-2.5 text-sm font-bold text-white hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            Jetzt bestellen
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden glass rounded-full p-2"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark mt-2 mx-4 rounded-2xl p-6 flex flex-col gap-4">
          {[
            { label: "Speisekarte", href: "/menu" },
            { label: "Tracking", href: "/tracking" },
            { label: "Über uns", href: "/#about" },
            { label: "Warenkorb", href: "/cart" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/80 hover:text-white font-medium py-2 border-b border-white/10 last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/menu"
            onClick={() => setMobileOpen(false)}
            className="btn-press mt-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] rounded-full px-5 py-3 text-center font-bold text-white"
          >
            Jetzt bestellen
          </Link>
        </div>
      )}
    </header>
  );
}
