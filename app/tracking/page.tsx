"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TrackingMap from "../components/TrackingMap";
import { MapPin, Clock, Phone, MessageCircle, Star } from "lucide-react";

const STEPS = [
  { id: 0, label: "Bestätigt", emoji: "✅" },
  { id: 1, label: "Zubereitung", emoji: "👨‍🍳" },
  { id: 2, label: "Unterwegs", emoji: "🛵" },
  { id: 3, label: "Fast da!", emoji: "📍" },
  { id: 4, label: "Geliefert", emoji: "🎉" },
];

// Berlin Mitte coordinates
const DEST_LAT = 52.5166;
const DEST_LNG = 13.3873;

const ORDER_ITEMS = [
  { emoji: "🍔", name: "Zestly Signature Burger", qty: 1, price: 14.9 },
  { emoji: "🥤", name: "Zestly Signature Shake", qty: 2, price: 6.9 },
];

export default function TrackingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(12 * 60);
  const [riderLat, setRiderLat] = useState(52.5245);
  const [riderLng, setRiderLng] = useState(13.4105);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= 4) {
          clearInterval(stepInterval);
          setTimeout(() => setShowRating(true), 1500);
          return 4;
        }
        return s + 1;
      });
    }, 4500);
    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    if (etaSeconds <= 0) return;
    const timer = setInterval(() => setEtaSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [etaSeconds]);

  // Rider moves toward destination
  useEffect(() => {
    const move = setInterval(() => {
      setRiderLat((v) => {
        const diff = DEST_LAT - v;
        return v + diff * 0.05 + (Math.random() - 0.5) * 0.001;
      });
      setRiderLng((v) => {
        const diff = DEST_LNG - v;
        return v + diff * 0.05 + (Math.random() - 0.5) * 0.001;
      });
    }, 2000);
    return () => clearInterval(move);
  }, []);

  const formatEta = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPct = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className="animated-bg min-h-screen">
      <Navbar />

      <div className="pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 slide-in-up">
            <span className="inline-block glass rounded-full px-4 py-1.5 text-[#06D6A0] text-sm font-bold uppercase tracking-widest mb-4">
              Live Tracking
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white">
              Deine Bestellung ist{" "}
              <span className="gradient-text">unterwegs!</span>
            </h1>
            <p className="text-white/60 mt-2">
              Bestellung #ZE-4821 · Heute,{" "}
              {new Date().toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              Uhr
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Map + Progress */}
            <div className="lg:col-span-3 space-y-6">
              {/* Map */}
              <div className="h-80 lg:h-96 relative">
                <TrackingMap
                  riderLat={riderLat}
                  riderLng={riderLng}
                  destLat={DEST_LAT}
                  destLng={DEST_LNG}
                />

                {/* ETA overlay */}
                <div className="absolute bottom-4 left-4 glass-dark rounded-2xl px-5 py-3 z-10">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-[#22D470]" />
                    <div>
                      <div className="text-white/50 text-xs">Ankunft in</div>
                      <div className="text-white font-black text-2xl">
                        {currentStep >= 4
                          ? "Geliefert! 🎉"
                          : formatEta(etaSeconds)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 glass rounded-full px-3 py-1.5 z-10">
                  <div className="w-2 h-2 bg-[#06D6A0] rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-white">LIVE</span>
                </div>
              </div>

              {/* Progress */}
              <div className="glass rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white">Bestellstatus</h3>
                  <span className="text-white/50 text-sm">
                    Schritt {Math.min(currentStep + 1, 5)}/5
                  </span>
                </div>

                <div className="h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#22D470] to-[#06D6A0] rounded-full transition-all duration-1000"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex justify-between">
                  {STEPS.map((step) => (
                    <div
                      key={step.id}
                      className="flex flex-col items-center gap-2 text-center flex-1"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 ${
                          step.id <= currentStep
                            ? "bg-gradient-to-br from-[#22D470] to-[#A3E635] shadow-lg orange-glow scale-110"
                            : "bg-white/10 opacity-40"
                        }`}
                      >
                        {step.emoji}
                      </div>
                      <span
                        className={`text-xs font-medium hidden sm:block ${
                          step.id <= currentStep ? "text-white" : "text-white/30"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-4">
              {/* Rider */}
              <div className="glass rounded-3xl p-5">
                <h3 className="font-bold text-white mb-4">Dein Fahrer</h3>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#22D470] to-[#A3E635] flex items-center justify-center text-2xl">
                    👨‍💼
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-white">Max Keller</div>
                    <div className="flex items-center gap-1 text-sm text-white/60">
                      <Star size={12} fill="#FFD23F" stroke="none" className="star-fill" />
                      <span className="font-semibold text-[#FFD23F]">4.98</span>
                      <span>(2.341)</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#06D6A0] mt-1">
                      <MapPin size={11} />
                      <span>~800m entfernt</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="btn-press flex-1 flex items-center justify-center gap-2 glass rounded-xl py-3 text-sm font-medium text-white/70 hover:text-white transition-all">
                    <Phone size={15} className="text-[#22D470]" /> Anrufen
                  </button>
                  <button className="btn-press flex-1 flex items-center justify-center gap-2 glass rounded-xl py-3 text-sm font-medium text-white/70 hover:text-white transition-all">
                    <MessageCircle size={15} className="text-[#FFD23F]" /> Chat
                  </button>
                </div>
              </div>

              {/* Order items */}
              <div className="glass rounded-3xl p-5">
                <h3 className="font-bold text-white mb-4">Deine Bestellung</h3>
                <div className="space-y-3">
                  {ORDER_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#22D470]/20 to-[#FFD23F]/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm truncate">{item.name}</div>
                        <div className="text-white/50 text-xs">{item.qty}× · {item.price.toFixed(2)}€</div>
                      </div>
                      <div className="text-[#FFD23F] font-bold text-sm">
                        {(item.qty * item.price).toFixed(2)}€
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 mt-4 pt-4 flex justify-between">
                  <span className="text-white/60 text-sm">Gesamt</span>
                  <span className="font-black gradient-text">
                    {ORDER_ITEMS.reduce((s, i) => s + i.qty * i.price, 0).toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="glass rounded-3xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#22D470]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#22D470]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Lieferadresse</h4>
                    <p className="text-white/60 text-sm mt-1">
                      Unter den Linden 77<br />10117 Berlin Mitte
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-dark rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-black text-white mb-2">Guten Appetit!</h3>
            <p className="text-white/60 mb-6">Wie war deine Zestly-Erfahrung?</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="transition-transform hover:scale-125"
                >
                  <Star
                    size={36}
                    fill={(hoveredStar || rating) >= star ? "#FFD23F" : "transparent"}
                    stroke={(hoveredStar || rating) >= star ? "#FFD23F" : "rgba(255,255,255,0.3)"}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <button
                onClick={() => setShowRating(false)}
                className="btn-press w-full bg-gradient-to-r from-[#22D470] to-[#A3E635] text-white font-bold py-3 rounded-2xl"
              >
                Bewertung absenden ✓
              </button>
            )}
            <button
              onClick={() => setShowRating(false)}
              className="text-white/30 text-sm mt-3 hover:text-white transition-colors block mx-auto"
            >
              Überspringen
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
