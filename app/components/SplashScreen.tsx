"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 600);
    const t2 = setTimeout(() => setPhase("out"), 1800);
    const t3 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #0F3460 100%)",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.6s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at center, rgba(255,107,53,0.15) 0%, transparent 60%)",
          transform: phase === "hold" ? "scale(2)" : "scale(0.5)",
          transition: "transform 0.8s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />

      {/* Logo */}
      <div
        className="relative flex flex-col items-center gap-4"
        style={{
          transform: phase === "in" ? "scale(0.5) translateY(20px)" : "scale(1) translateY(0)",
          opacity: phase === "in" ? 0 : 1,
          transition: "all 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#22D470] to-[#A3E635] flex items-center justify-center orange-glow-strong">
          <Zap size={40} fill="white" stroke="white" />
        </div>
        <span className="text-5xl font-black gradient-text tracking-tight">Zestly</span>
        <span className="text-white/50 text-sm tracking-[0.3em] uppercase">Taste the Speed</span>

        {/* Loading bar */}
        <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-[#22D470] to-[#A3E635] rounded-full"
            style={{
              width: phase === "hold" ? "100%" : "0%",
              transition: "width 0.8s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
