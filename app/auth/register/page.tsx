"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase";
import { Zap, Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const pwStrength = password.length >= 8 ? (password.match(/[A-Z]/) && password.match(/[0-9]/) ? "stark" : "mittel") : "schwach";
  const pwColor = pwStrength === "stark" ? "#06D6A0" : pwStrength === "mittel" ? "#FFD23F" : "#EF233C";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Passwort muss mindestens 8 Zeichen haben.");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="animated-bg min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="text-7xl mb-6">📧</div>
          <h1 className="text-3xl font-black text-white mb-3">Fast geschafft!</h1>
          <p className="text-white/60 mb-6">
            Wir haben eine Bestätigungs-E-Mail an{" "}
            <span className="text-[#FFD23F] font-semibold">{email}</span> geschickt.
            Klicke auf den Link, um dein Konto zu aktivieren.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold px-8 py-4 rounded-2xl"
          >
            Zur Anmeldung
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animated-bg min-h-screen flex items-center justify-center px-6 py-12">
      <div
        className="fixed top-1/3 right-1/4 w-[400px] h-[400px] opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #FFD23F, transparent)" }}
      />

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] flex items-center justify-center orange-glow">
            <Zap size={22} fill="white" stroke="white" />
          </div>
          <span className="text-3xl font-black gradient-text">Zestly</span>
        </Link>

        <div className="glass rounded-3xl p-8">
          <h1 className="text-3xl font-black text-white mb-2">Konto erstellen</h1>
          <p className="text-white/50 mb-8">
            Erste Bestellung{" "}
            <span className="text-[#06D6A0] font-bold">kostenlos geliefert!</span>
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="text-white/60 text-sm font-medium mb-2 block">Vollständiger Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Max Mustermann"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#FF6B35]/50 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-white/60 text-sm font-medium mb-2 block">E-Mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="deine@email.de"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#FF6B35]/50 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/25 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-white/60 text-sm font-medium mb-2 block">Passwort</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Mindestens 8 Zeichen"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#FF6B35]/50 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder-white/25 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: pwStrength === "stark" ? "100%" : pwStrength === "mittel" ? "60%" : "30%",
                        background: pwColor,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: pwColor }}>
                    {pwStrength}
                  </span>
                </div>
              )}
            </div>

            {/* Checks */}
            <div className="space-y-1.5 text-xs text-white/40">
              {[
                { label: "Mindestens 8 Zeichen", ok: password.length >= 8 },
                { label: "Großbuchstabe", ok: /[A-Z]/.test(password) },
                { label: "Zahl", ok: /[0-9]/.test(password) },
              ].map((c) => (
                <div key={c.label} className={`flex items-center gap-1.5 ${c.ok ? "text-[#06D6A0]" : ""}`}>
                  <CheckCircle size={12} className={c.ok ? "text-[#06D6A0]" : "text-white/20"} />
                  {c.label}
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-[#EF233C]/10 border border-[#EF233C]/30 rounded-xl px-4 py-3 text-[#EF233C] text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-press w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold py-4 rounded-2xl orange-glow hover:orange-glow-strong transition-all disabled:opacity-60 text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Wird erstellt…
                </span>
              ) : (
                <>Konto erstellen <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-white/25 text-xs text-center mt-5 leading-relaxed">
            Mit der Registrierung stimmst du unseren{" "}
            <Link href="#" className="underline hover:text-white/50">AGB</Link> und{" "}
            <Link href="#" className="underline hover:text-white/50">Datenschutzrichtlinien</Link> zu.
          </p>

          <div className="mt-4 text-center text-white/50 text-sm">
            Bereits Konto?{" "}
            <Link href="/auth/login" className="text-[#FF6B35] font-semibold hover:text-[#FFD23F] transition-colors">
              Anmelden
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
