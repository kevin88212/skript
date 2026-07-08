import { motion } from 'framer-motion';
import { Flame, Zap, BookOpen, Target, Bot, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/lessons';
import { SCENARIOS } from '../data/scenarios';

function StatCard({ icon: Icon, label, value, color, glow }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className={`card-dark rounded-2xl p-4 ${glow}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl" style={{ background: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <div className="text-xs text-gray-400">{label}</div>
          <div className="text-xl font-bold text-white">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Daily Challenge ──────────────────────────────────────────────────────────
function DailyChallenge() {
  const { dailyChallenge, completeChallenge } = useApp();
  if (!dailyChallenge) return null;

  return (
    <div className={`card-dark rounded-2xl p-4 border transition-all ${dailyChallenge.done ? 'border-green-500/30' : 'border-amber-500/30'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs uppercase tracking-widest font-semibold text-neon-amber">⚡ Tägliche Challenge</span>
      </div>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{dailyChallenge.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm ${dailyChallenge.done ? 'text-gray-500 line-through' : 'text-white'}`}>
            {dailyChallenge.title}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{dailyChallenge.desc}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs font-bold text-neon-amber mb-1">+{dailyChallenge.xp} XP</div>
          {!dailyChallenge.done ? (
            <motion.button whileTap={{ scale: 0.92 }} onClick={completeChallenge}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold hover:bg-amber-500/30 transition-all">
              Erledigt!
            </motion.button>
          ) : (
            <span className="text-xs text-neon-green font-semibold">✓ Done</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Lektionen Quick-Links ─────────────────────────────────────────────────────
function CategorySection() {
  const navigate = useNavigate();
  return (
    <div className="card-dark rounded-2xl p-4 border border-indigo-500/20">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={16} className="text-indigo-400" />
        <span className="text-sm font-semibold text-white">Lektionen entdecken</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <motion.button key={key} whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/lektionen?category=${key}`)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border shrink-0 hover:opacity-90 transition-all min-w-[110px]"
            style={{ borderColor: `${cat.color}40`, background: `${cat.color}10` }}>
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-xs font-semibold text-white text-center leading-tight">{cat.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { profile, challengeHistory, completedLessons, completedScenarios, startScenario } = useApp();
  const navigate = useNavigate();
  const xpPct = Math.round((profile.xp / profile.xpToNext) * 100);
  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  const startRandomScenario = () => {
    const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    startScenario(scenario);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs text-gray-500 uppercase tracking-widest">{today}</div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 mt-1">
          Willkommen zurück, {profile.name}!
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Level {profile.level} · {profile.xp}/{profile.xpToNext} XP
        </p>
      </motion.div>

      {/* XP Bar */}
      <div className="w-full h-3 bg-gray-800/80 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 1, delay: 0.2 }}
          className="h-full xp-bar rounded-full" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Flame}      label="Streak"              value={`${profile.streak}d`}          color="#f97316" glow="glow-amber"  />
        <StatCard icon={Zap}        label="Challenges"          value={challengeHistory.length}       color="#fbbf24" glow=""            />
        <StatCard icon={BookOpen}   label="Lektionen"           value={completedLessons.length}       color="#22d3ee" glow="glow-cyan"   />
        <StatCard icon={Target}     label="Trainings"           value={completedScenarios.length}     color="#a855f7" glow="glow-indigo" />
      </div>

      <DailyChallenge />

      {/* Trainings-Modus CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="card-dark rounded-2xl p-5 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs text-purple-400 uppercase tracking-widest font-medium">Trainings-Modus</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Übe echte Situationen</h2>
        <p className="text-gray-400 text-sm mb-4">Triff Entscheidungen in realistischen Gesprächen und bekomm direktes Feedback.</p>
        <div className="flex gap-3 flex-wrap">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={startRandomScenario}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-500 text-white font-semibold glow-indigo">
            <Target size={16} /> Zufälliges Szenario
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/training')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-500/40 text-purple-300 font-semibold hover:bg-purple-500/10 transition-all">
            Alle Szenarien <ChevronRight size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* KI-Trainer CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card-dark rounded-2xl p-5 border border-emerald-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Bot size={16} className="text-emerald-400" />
          <span className="text-xs text-emerald-400 uppercase tracking-widest font-medium">KI-Trainer</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">Übe im echten Gespräch</h2>
        <p className="text-gray-400 text-sm mb-4">Chatte mit einem KI-Partner – Smalltalk, Flirten, Kontern – und bekomm Coach-Feedback.</p>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/ki')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold glow-green">
          <Bot size={16} /> Gespräch starten
        </motion.button>
      </motion.div>

      <CategorySection />
    </div>
  );
}
