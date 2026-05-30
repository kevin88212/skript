import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Zap, Target, ChevronRight, Lock, Heart, Footprints, Activity, Droplets, Sword } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { requestHealthPermissions, getAllHealthData } from '../services/health';
import { BOSSES } from '../data/bosses';

const bmi = (w, h) => (w / (h / 100) ** 2).toFixed(1);

const quests = [
  { id: 1, title: 'Erstes Workout',   desc: 'Absolviere dein erstes Training',         xp: 200 },
  { id: 2, title: '3 Tage Streak',    desc: '3 Tage in Folge trainieren',              xp: 300 },
  { id: 3, title: 'Mahlzeiten-Plan',  desc: 'Schau dir heute deinen Ernährungsplan an', xp: 50  },
  { id: 4, title: 'Übungsdatenbank',  desc: 'Lerne eine neue Übung kennen',            xp: 30  },
];

function StatCard({ icon: Icon, label, value, sub, color, glow }) {
  return (
    <motion.div whileHover={{ scale: 1.03 }} className={`card-dark rounded-2xl p-4 ${glow}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl" style={{ background: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <div className="text-xs text-gray-400">{label}</div>
          <div className="text-xl font-bold text-white">{value}</div>
          {sub && <div className="text-xs text-gray-500">{sub}</div>}
        </div>
      </div>
    </motion.div>
  );
}

// ── Water Tracker ────────────────────────────────────────────────────────────
function WaterTracker() {
  const { waterGlasses, drinkWater } = useApp();
  const GOAL = 8;
  const pct = Math.min(100, (waterGlasses / GOAL) * 100);

  return (
    <div className="card-dark rounded-2xl p-4 border border-cyan-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets size={16} className="text-cyan-400" />
          <span className="text-sm font-semibold text-white">Wasser</span>
        </div>
        <span className="text-xs text-gray-400">{waterGlasses} / {GOAL} Gläser</span>
      </div>

      <div className="flex gap-1.5 mb-3">
        {Array.from({ length: GOAL }).map((_, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.85 }}
            onClick={drinkWater}
            className="flex-1 h-8 rounded-lg transition-all"
            style={{ background: i < waterGlasses ? '#22d3ee' : 'rgba(255,255,255,0.06)', boxShadow: i < waterGlasses ? '0 0 8px rgba(34,211,238,0.4)' : 'none' }}
          />
        ))}
      </div>

      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div animate={{ width: `${pct}%` }} className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #22d3ee, #6366f1)', boxShadow: '0 0 8px rgba(34,211,238,0.4)' }} />
      </div>
      {waterGlasses >= GOAL && (
        <div className="text-xs text-cyan-400 text-center mt-2 font-semibold">💧 Tagesziel erreicht!</div>
      )}
    </div>
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

// ── Boss Selection ───────────────────────────────────────────────────────────
function BossSection() {
  const { startBoss } = useApp();

  return (
    <div className="card-dark rounded-2xl p-4 border border-purple-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Sword size={16} className="text-purple-400" />
        <span className="text-sm font-semibold text-white">Bosskampf</span>
        <span className="text-xs text-gray-500 ml-auto">Wähle deinen Gegner</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {BOSSES.map(boss => (
          <motion.button key={boss.id} whileTap={{ scale: 0.95 }}
            onClick={() => startBoss(boss)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border shrink-0 hover:opacity-90 transition-all min-w-[80px]"
            style={{ borderColor: `${boss.color}40`, background: `${boss.color}10` }}>
            <span className="text-2xl">{boss.emoji}</span>
            <span className="text-xs font-semibold text-white text-center leading-tight">{boss.name}</span>
            <span className="text-xs font-bold" style={{ color: boss.color }}>+{boss.reward.xp} XP</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { profile, focusModeActive, setFocusModeActive, completedWorkoutToday, updateProfile } = useApp();
  const navigate = useNavigate();
  const bmiVal = bmi(profile.weight, profile.height);
  const xpPct = Math.round((profile.xp / profile.xpToNext) * 100);
  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  const [health, setHealth] = useState({ steps: null, calories: null, hr: null, distance: null, connected: false });

  const connectHealth = async () => {
    const { granted } = await requestHealthPermissions();
    if (!granted) return;
    const data = await getAllHealthData();
    setHealth({ ...data, connected: true });
    if (data.weight && Math.abs(data.weight - profile.weight) > 0.4) {
      updateProfile({ weight: data.weight });
    }
    localStorage.setItem('health_connected', 'true');
  };

  useEffect(() => {
    if (localStorage.getItem('health_connected') === 'true') connectHealth();
  }, []);

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
        <StatCard icon={Flame}  label="Streak"   value={`${profile.streak}d`}   color="#f97316" glow="glow-amber"  />
        <StatCard icon={Trophy} label="Workouts" value={profile.totalWorkouts}   color="#fbbf24" glow=""            />
        <StatCard icon={Zap}    label="BMI"      value={bmiVal} sub="Ziel: 24"  color="#818cf8" glow="glow-indigo" />
        <StatCard icon={Target} label="Gewicht"  value={`${profile.weight} kg`} color="#22d3ee" glow="glow-cyan"   />
      </div>

      {/* Water + Challenge */}
      <WaterTracker />
      <DailyChallenge />

      {/* Today's Mission / Focus Mode */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="card-dark rounded-2xl p-5 border border-indigo-500/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs text-indigo-400 uppercase tracking-widest font-medium">Heutige Mission</span>
        </div>
        {completedWorkoutToday ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-xl font-bold text-neon-green">Mission erfüllt!</div>
            <div className="text-gray-400 text-sm mt-1">Du hast heute trainiert. Respekt, Krieger!</div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-1">Trainingstag aktiviert</h2>
            <p className="text-gray-400 text-sm mb-4">Starte den Focus-Mode – er blockiert Ablenkungen bis du trainiert hast.</p>
            <div className="flex gap-3 flex-wrap">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setFocusModeActive(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 text-white font-semibold glow-indigo">
                <Lock size={16} /> Focus Mode
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/workout')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-indigo-500/40 text-indigo-300 font-semibold hover:bg-indigo-500/10 transition-all">
                Training <ChevronRight size={16} />
              </motion.button>
            </div>
          </>
        )}
      </motion.div>

      {/* Boss Fight */}
      <BossSection />

      {/* Quests */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={16} className="text-neon-amber" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Aktive Quests</h2>
        </div>
        <div className="space-y-2">
          {quests.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
              className="card-dark rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-indigo-500/15 text-indigo-300">○</div>
                <div>
                  <div className="text-sm font-medium text-white">{q.title}</div>
                  <div className="text-xs text-gray-500">{q.desc}</div>
                </div>
              </div>
              <div className="text-xs font-bold text-neon-amber">+{q.xp} XP</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Apple Health */}
      <div className="card-dark rounded-2xl p-5 border border-red-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">❤️</span>
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Apple Health</h2>
          </div>
          {!health.connected && (
            <button onClick={connectHealth}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-colors">
              Verbinden
            </button>
          )}
        </div>
        {health.connected ? (
          <div className="grid grid-cols-2 gap-3 text-center">
            {[
              { icon: Footprints, label: 'Schritte',  value: health.steps != null ? health.steps.toLocaleString('de-DE') : '–', color: '#34d399' },
              { icon: Activity,   label: 'Kalorien',  value: health.calories != null ? `${health.calories} kcal` : '–',          color: '#f87171' },
              { icon: Heart,      label: 'Ruhepuls',  value: health.hr != null ? `${health.hr} bpm` : '–',                        color: '#f472b6' },
              { icon: Zap,        label: 'Distanz',   value: health.distance != null ? `${health.distance} km` : '–',             color: '#fbbf24' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-xl p-3" style={{ background: `${color}12` }}>
                <Icon size={16} style={{ color }} className="mx-auto mb-1" />
                <div className="text-base font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Verbinde Apple Health um Schritte, Kalorien, Herzfrequenz und Gewicht zu sehen.
            Nur in der nativen iOS-App verfügbar.
          </p>
        )}
      </div>
    </div>
  );
}
