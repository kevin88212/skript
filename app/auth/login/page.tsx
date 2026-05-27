"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "../../lib/supabase";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Info } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setError("Supabase ist noch nicht eingerichtet. Bitte .env.local konfigurieren.");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-Mail oder Passwort falsch. Bitte nochmal versuchen.");
      setLoading(false);
    } else {
      router.push(redirect);
      router.refresh();
    }
  };

  return (
    <div className="animated-bg min-h-screen flex items-center justify-center px-6">
      {/* Background orb */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF6B35, transparent)" }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FFD23F] flex items-center justify-center orange-glow">
            <Zap size={22} fill="white" stroke="white" />
          </div>
          <span className="text-3xl font-black gradient-text">Zestly</span>
        </Link>

        <div className="glass rounded-3xl p-8">
          <h1 className="text-3xl font-black text-white mb-2">Willkommen zurück!</h1>
          <p className="text-white/50 mb-6">Melde dich an und bestell los.</p>

          {!isSupabaseConfigured() && (
            <div className="flex items-start gap-2 bg-[#FFD23F]/10 border border-[#FFD23F]/30 rounded-xl px-4 py-3 text-[#FFD23F] text-sm mb-6">
              <Info size={16} className="flex-shrink-0 mt-0.5" />
              <span>
                Supabase ist noch nicht eingerichtet. Erstelle eine <code className="font-mono bg-black/20 px-1 rounded">.env.local</code> Datei nach dem <code className="font-mono bg-black/20 px-1 rounded">.env.local.example</code> Muster.
              </span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="••••••••"
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
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-[#EF233C]/10 border border-[#EF233C]/30 rounded-xl px-4 py-3 text-[#EF233C] text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-press w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#FFD23F] text-white font-bold py-4 rounded-2xl orange-glow hover:orange-glow-strong transition-all disabled:opacity-60 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Einen Moment…
                </span>
              ) : (
                <>Anmelden <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-white/50 text-sm">
            Noch kein Konto?{" "}
            <Link href="/auth/register" className="text-[#FF6B35] font-semibold hover:text-[#FFD23F] transition-colors">
              Jetzt registrieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
