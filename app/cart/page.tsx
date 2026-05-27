"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCartStore } from "../lib/store";
import { useAuth } from "../lib/auth-context";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, ChevronLeft } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, total } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = total();
  const delivery = subtotal >= 15 ? 0 : 2.99;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = subtotal + delivery - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "ZESTLY10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Ungültiger Code");
      setPromoApplied(false);
    }
  };

  const placeOrder = async () => {
    if (!user) {
      router.push("/auth/login?redirect=/cart");
      return;
    }
    setOrderLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id, name: i.name, emoji: i.emoji, qty: i.qty, price: i.price,
          })),
          delivery_address: "Unter den Linden 77, 10117 Berlin Mitte",
          total: finalTotal,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderId(data.order.id);
        setOrderPlaced(true);
        setTimeout(() => clearCart(), 500);
      } else {
        alert(data.error || "Fehler beim Bestellen");
      }
    } catch {
      alert("Netzwerkfehler. Bitte nochmal versuchen.");
    } finally {
      setOrderLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="animated-bg min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6 pt-24">
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-4xl font-black text-white mb-4">
              Bestellung <span className="gradient-text">aufgegeben!</span>
            </h1>
            <p className="text-white/60 text-lg mb-4">
              Deine Bestellung wird zubereitet. Ø Lieferzeit:{" "}
              <span className="text-[#06D6A0] font-bold">12 Minuten</span>
            </p>
            <div className="glass rounded-3xl p-6 mb-8 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#06D6A0] animate-pulse" />
                <span className="text-white font-medium">
                  Bestellung #{orderId ? orderId.slice(0, 8).toUpperCase() : "ZE-" + (Math.floor(Math.random() * 9000) + 1000)}
                </span>
              </div>
              <div className="flex gap-3">
                {["✅ Bestätigt", "👨‍🍳 Zubereitung", "🛵 Unterwegs", "📍 Geliefert"].map((s, i) => (
                  <div
                    key={s}
                    className={`flex-1 text-center text-xs py-2 rounded-xl ${
                      i === 0
                        ? "bg-[#06D6A0]/20 text-[#06D6A0] border border-[#06D6A0]/30"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/tracking"
              className="btn-press inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold px-8 py-4 rounded-2xl"
            >
              Live verfolgen <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="animated-bg min-h-screen">
      <Navbar />

      <div className="pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <Link
              href="/menu"
              className="glass rounded-xl p-2.5 hover:border-[#FF6B35]/30 transition-all"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-4xl font-black text-white">
                Dein <span className="gradient-text">Warenkorb</span>
              </h1>
              <p className="text-white/50 text-sm mt-1">
                {items.length === 0 ? "Noch leer" : `${items.reduce((a, i) => a + i.qty, 0)} Artikel`}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24 glass rounded-3xl">
              <div className="text-7xl mb-6">🛒</div>
              <h3 className="text-2xl font-bold text-white mb-3">Dein Warenkorb ist leer</h3>
              <p className="text-white/50 mb-8">Stöbere in unserer Speisekarte und füge Leckereien hinzu!</p>
              <Link
                href="/menu"
                className="btn-press inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold px-8 py-4 rounded-2xl"
              >
                Zur Speisekarte <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="glass rounded-2xl p-5 flex items-center gap-5 group hover:border-[#FF6B35]/20 transition-all"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35]/15 to-[#FFD23F]/10 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                      {item.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">{item.name}</h3>
                      <p className="text-[#FFD23F] font-bold mt-1">
                        {item.price.toFixed(2)}€
                      </p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 glass rounded-full flex items-center justify-center hover:border-[#FF6B35]/50 transition-all active:scale-90"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-bold text-white">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-orange-500/30 transition-all active:scale-90"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right hidden sm:block">
                      <p className="font-black gradient-text text-lg">
                        {(item.price * item.qty).toFixed(2)}€
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-[#EF233C] ml-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {/* Add more */}
                <Link
                  href="/menu"
                  className="flex items-center gap-3 glass rounded-2xl p-5 border-dashed border-white/20 hover:border-[#FF6B35]/50 transition-all group text-white/50 hover:text-white"
                >
                  <div className="w-10 h-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center">
                    <Plus size={18} />
                  </div>
                  <span className="font-medium">Weiteres hinzufügen</span>
                </Link>
              </div>

              {/* Order summary */}
              <div className="space-y-4">
                {/* Promo code */}
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Tag size={16} className="text-[#FF6B35]" />
                    Promo-Code
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                      placeholder="z.B. ZESTLY10"
                      className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none border border-white/10 focus:border-[#FF6B35]/50"
                    />
                    <button
                      onClick={applyPromo}
                      className="btn-press bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold px-4 py-2.5 rounded-xl text-sm"
                    >
                      Ok
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-[#06D6A0] text-sm mt-2">✓ 10% Rabatt aktiviert!</p>
                  )}
                  {promoError && (
                    <p className="text-[#EF233C] text-sm mt-2">{promoError}</p>
                  )}
                  <p className="text-white/30 text-xs mt-2">Tipp: Probier mal ZESTLY10</p>
                </div>

                {/* Summary */}
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-bold text-white mb-5 flex items-center gap-2">
                    <ShoppingBag size={16} className="text-[#FF6B35]" />
                    Zusammenfassung
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-white/60">
                      <span>Zwischensumme</span>
                      <span>{subtotal.toFixed(2)}€</span>
                    </div>
                    <div className="flex justify-between text-white/60">
                      <span>Lieferung</span>
                      <span className={delivery === 0 ? "text-[#06D6A0] font-semibold" : ""}>
                        {delivery === 0 ? "Kostenlos 🎉" : `${delivery.toFixed(2)}€`}
                      </span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-[#06D6A0]">
                        <span>Rabatt (10%)</span>
                        <span>-{discount.toFixed(2)}€</span>
                      </div>
                    )}
                    {delivery > 0 && (
                      <p className="text-white/30 text-xs">
                        Noch {(15 - subtotal).toFixed(2)}€ bis zur kostenlosen Lieferung
                      </p>
                    )}
                    <div className="border-t border-white/10 pt-3 flex justify-between">
                      <span className="font-bold text-white">Gesamt</span>
                      <span className="font-black gradient-text text-xl">
                        {finalTotal.toFixed(2)}€
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={orderLoading}
                    className="btn-press mt-6 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold py-4 rounded-2xl orange-glow hover:orange-glow-strong transition-all text-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {orderLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Wird verarbeitet…
                      </>
                    ) : !user ? (
                      <>Anmelden & bestellen <ArrowRight size={20} /></>
                    ) : (
                      <>Jetzt bestellen <ArrowRight size={20} /></>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-white/30 text-xs">
                    <span>🔒</span>
                    <span>Sichere Zahlung mit SSL-Verschlüsselung</span>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="glass rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="text-white text-sm font-medium">Lieferzeit: ~12 Minuten</p>
                    <p className="text-white/50 text-xs">Dein Fahrer wartet schon</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
