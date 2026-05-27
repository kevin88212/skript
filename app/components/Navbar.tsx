"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, Zap, MapPin, User, LogIn } from "lucide-react";
import { useCartStore } from "../lib/store";
import { useAuth } from "../lib/auth-context";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.qty, 0));
  const { user, loading } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const displayName = user?.user_metadata?.full_name?.split(" ")[0]
    || user?.email?.split("@")[0]
    || null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-dark py-3 shadow-lg" : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#22D470] to-[#A3E635] flex items-center justify-center orange-glow group-hover:scale-110 transition-transform">
            <Zap size={20} fill="white" stroke="white" />
          </div>
          <span className="text-2xl font-black tracking-tight gradient-text">Zestly</span>
        </Link>

        {/* Location pill */}
        <button className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-white/70 hover:text-white hover:border-[#22D470]/50 transition-all">
          <MapPin size={14} className="text-[#22D470]" />
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
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#22D470] to-[#A3E635] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 glass rounded-full px-4 py-2 hover:border-[#22D470]/50 transition-all"
          >
            <ShoppingCart size={18} className="text-[#22D470]" />
            <span className="hidden sm:block text-sm font-medium">Warenkorb</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#22D470] rounded-full text-xs font-bold flex items-center justify-center animate-bounce">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {!loading && (
            user ? (
              <Link
                href="/profile"
                className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2 hover:border-[#FFD23F]/50 transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#22D470] to-[#A3E635] flex items-center justify-center text-xs font-black text-white">
                  {displayName?.[0]?.toUpperCase() ?? <User size={12} />}
                </div>
                <span className="text-sm font-medium text-white/80">{displayName}</span>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:flex items-center gap-2 glass rounded-full px-4 py-2 hover:border-[#22D470]/50 transition-all"
              >
                <LogIn size={16} className="text-[#22D470]" />
                <span className="text-sm font-medium">Anmelden</span>
              </Link>
            )
          )}

          {/* CTA */}
          <Link
            href="/menu"
            className="hidden md:flex btn-press items-center gap-2 bg-gradient-to-r from-[#22D470] to-[#A3E635] rounded-full px-5 py-2.5 text-sm font-bold text-white hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            Bestellen
          </Link>

          {/* Mobile menu */}
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
            { label: "Warenkorb", href: "/cart" },
            ...(user
              ? [{ label: "Mein Profil", href: "/profile" }]
              : [
                  { label: "Anmelden", href: "/auth/login" },
                  { label: "Registrieren", href: "/auth/register" },
                ]),
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
            className="btn-press mt-2 bg-gradient-to-r from-[#22D470] to-[#A3E635] rounded-full px-5 py-3 text-center font-bold text-white"
          >
            Jetzt bestellen
          </Link>
        </div>
      )}
    </header>
  );
}
