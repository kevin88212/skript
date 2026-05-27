"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../lib/auth-context";
import type { Order, OrderItem } from "../lib/database.types";
import {
  User, MapPin, Phone, Clock, Package, LogOut,
  ChevronRight, Star, Edit3, Check, X,
} from "lucide-react";
import { createClient } from "../lib/supabase";

type OrderWithItems = Order & { order_items: OrderItem[] };

const STATUS_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  confirmed: { label: "Bestätigt", color: "#FFD23F", emoji: "✅" },
  preparing: { label: "In Zubereitung", color: "#FF6B35", emoji: "👨‍🍳" },
  on_the_way: { label: "Unterwegs", color: "#06D6A0", emoji: "🛵" },
  almost_there: { label: "Fast da", color: "#06D6A0", emoji: "📍" },
  delivered: { label: "Geliefert", color: "#06D6A0", emoji: "🎉" },
};

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [address, setAddress] = useState("");
  const [savedAddress, setSavedAddress] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/profile");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    loadProfile();
    loadOrders();
  }, [user]);

  const loadProfile = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("address")
      .eq("id", user!.id)
      .single();
    if (data?.address) setSavedAddress(data.address);
  };

  const loadOrders = async () => {
    const res = await fetch("/api/orders");
    if (res.ok) {
      const { orders } = await res.json();
      setOrders(orders ?? []);
    }
    setOrdersLoading(false);
  };

  const saveAddress = async () => {
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ address })
      .eq("id", user!.id);
    setSavedAddress(address);
    setEditingAddress(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="animated-bg min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#FF6B35]/30 border-t-[#FF6B35] rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Nutzer";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="animated-bg min-h-screen">
      <Navbar />

      <div className="pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Profile header */}
          <div className="glass rounded-3xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] flex items-center justify-center text-3xl font-black text-white orange-glow flex-shrink-0">
                {initials}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-black text-white">{displayName}</h1>
                <p className="text-white/50 mt-1 flex items-center gap-2">
                  <span>✉️</span>
                  {user.email}
                </p>
                {savedAddress && (
                  <p className="text-white/50 text-sm mt-1 flex items-center gap-2">
                    <MapPin size={14} className="text-[#FF6B35]" />
                    {savedAddress}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-2xl font-black gradient-text">{orders.length}</div>
                  <div className="text-white/50 text-xs">Bestellungen</div>
                </div>
                <div>
                  <div className="text-2xl font-black gradient-text">
                    {orders.reduce((s, o) => s + o.total, 0).toFixed(0)}€
                  </div>
                  <div className="text-white/50 text-xs">Ausgegeben</div>
                </div>
                <div>
                  <div className="text-2xl font-black gradient-text">
                    {orders.filter((o) => o.status === "delivered").length}
                  </div>
                  <div className="text-white/50 text-xs">Geliefert</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["orders", "settings"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white"
                    : "glass text-white/60 hover:text-white"
                }`}
              >
                {tab === "orders" ? "📦 Bestellhistorie" : "⚙️ Einstellungen"}
              </button>
            ))}
          </div>

          {/* Orders tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {ordersLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-[#FF6B35]/30 border-t-[#FF6B35] rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="glass rounded-3xl p-16 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-white mb-2">Noch keine Bestellungen</h3>
                  <p className="text-white/50 mb-6">Deine erste Bestellung wartet!</p>
                  <Link
                    href="/menu"
                    className="btn-press inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold px-8 py-4 rounded-2xl"
                  >
                    Jetzt bestellen
                  </Link>
                </div>
              ) : (
                orders.map((order) => {
                  const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.confirmed;
                  return (
                    <div key={order.id} className="glass rounded-3xl p-6 hover:border-[#FF6B35]/20 transition-all">
                      <div className="flex items-start justify-between mb-4 gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white">
                              Bestellung #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span
                              className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{
                                background: `${status.color}20`,
                                color: status.color,
                                border: `1px solid ${status.color}40`,
                              }}
                            >
                              {status.emoji} {status.label}
                            </span>
                          </div>
                          <p className="text-white/40 text-sm mt-1 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(order.created_at).toLocaleString("de-DE", {
                              day: "2-digit", month: "2-digit", year: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-black gradient-text text-xl">
                            {order.total.toFixed(2)}€
                          </div>
                          <div className="text-white/40 text-xs">
                            {order.order_items?.length ?? 0} Artikel
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-1.5 bg-white/5 rounded-xl px-3 py-1.5 text-sm"
                          >
                            <span>{item.item_emoji}</span>
                            <span className="text-white/70">
                              {item.quantity}× {item.item_name}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        {order.status !== "delivered" && (
                          <Link
                            href="/tracking"
                            className="flex items-center gap-1 text-[#FF6B35] text-sm font-semibold hover:gap-2 transition-all"
                          >
                            Live verfolgen <ChevronRight size={16} />
                          </Link>
                        )}
                        {order.status === "delivered" && (
                          <div className="flex items-center gap-1 text-[#06D6A0] text-sm">
                            <Check size={14} /> Erfolgreich geliefert
                          </div>
                        )}
                        <button className="flex items-center gap-1.5 glass rounded-xl px-4 py-2 text-sm text-white/60 hover:text-white transition-all">
                          <Package size={14} />
                          Nachbestellen
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <div className="space-y-4">
              {/* Address */}
              <div className="glass rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <MapPin size={16} className="text-[#FF6B35]" />
                    Lieferadresse
                  </h3>
                  {!editingAddress && (
                    <button
                      onClick={() => { setAddress(savedAddress); setEditingAddress(true); }}
                      className="text-[#FF6B35] text-sm flex items-center gap-1 hover:text-[#FFD23F] transition-colors"
                    >
                      <Edit3 size={14} /> Bearbeiten
                    </button>
                  )}
                </div>
                {editingAddress ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Musterstraße 1, 10115 Berlin"
                      className="w-full bg-white/5 border border-white/10 focus:border-[#FF6B35]/50 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveAddress}
                        className="btn-press flex items-center gap-1.5 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold px-5 py-2.5 rounded-xl text-sm"
                      >
                        <Check size={14} /> Speichern
                      </button>
                      <button
                        onClick={() => setEditingAddress(false)}
                        className="flex items-center gap-1.5 glass text-white/60 px-5 py-2.5 rounded-xl text-sm hover:text-white"
                      >
                        <X size={14} /> Abbrechen
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-white/60">
                    {savedAddress || "Noch keine Adresse gespeichert"}
                  </p>
                )}
              </div>

              {/* Account info */}
              <div className="glass rounded-3xl p-6">
                <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                  <User size={16} className="text-[#FFD23F]" />
                  Kontodaten
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/50">Name</span>
                    <span className="text-white">{displayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">E-Mail</span>
                    <span className="text-white">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Mitglied seit</span>
                    <span className="text-white">
                      {new Date(user.created_at).toLocaleDateString("de-DE", {
                        month: "long", year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loyalty */}
              <div className="glass rounded-3xl p-6">
                <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                  <Star size={16} className="star-fill" fill="#FFD23F" stroke="none" />
                  Zestly Punkte
                </h3>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-4xl font-black gradient-text">
                    {orders.length * 47}
                  </span>
                  <span className="text-white/50 pb-1">Punkte</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] rounded-full"
                    style={{ width: `${Math.min((orders.length * 47) / 500 * 100, 100)}%` }}
                  />
                </div>
                <p className="text-white/40 text-xs">
                  {Math.max(500 - orders.length * 47, 0)} Punkte bis zur Gold-Mitgliedschaft
                </p>
              </div>

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="btn-press w-full flex items-center justify-center gap-2 glass neon-border rounded-2xl py-4 text-[#EF233C] font-semibold hover:bg-[#EF233C]/10 transition-all"
              >
                <LogOut size={16} />
                Abmelden
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
