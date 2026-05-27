import { motion } from 'framer-motion';
import { Flame, Trophy, Zap, Target, ChevronRight, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const bmi = (w, h) => (w / (h / 100) ** 2).toFixed(1);

const quests = [
  { id: 1, title: 'Erstes Workout', desc: 'Absolviere dein erstes Training', xp: 200, done: false },
  { id: 2, title: '3 Tage Streak', desc: '3 Tage in Folge trainieren', xp: 300, done: false },
  { id: 3, title: 'Mahlzeiten tracken', desc: 'Schau dir heute deinen Ernährungsplan an', xp: 50, done: false },
  { id: 4, title: 'Übungsdatenbank', desc: 'Lerne eine neue Übung kennen', xp: 30, done: false },
];

function StatCard({ icon: Icon, label, value, sub, color, glow }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`card-dark rounded-2xl p-4 ${glow}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl`} style={{ background: `${color}20` }}>
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

export default function Dashboard() {
  const { profile, focusModeActive, setFocusModeActive, completedWorkoutToday } = useApp();
  const navigate = useNavigate();
  const bmiVal = bmi(profile.weight, profile.height);
  const xpPct = Math.round((profile.xp / profile.xpToNext) * 100);

  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xs text-gray-500 uppercase tracking-widest">{today}</div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 mt-1">
          Willkommen zurück, {profile.name}!
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Level {profile.level} Krieger · {profile.xp}/{profile.xpToNext} XP bis Level {profile.level + 1}
        </p>
      </motion.div>

      {/* XP Bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        className="w-full h-3 bg-gray-800/80 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${xpPct}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full xp-bar rounded-full"
        />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Flame}  label="Streak"       value={`${profile.streak}d`}     color="#f97316" glow="glow-amber"  />
        <StatCard icon={Trophy} label="Workouts"     value={profile.totalWorkouts}     color="#fbbf24" glow=""            />
        <StatCard icon={Zap}    label="BMI"          value={bmiVal}   sub="Ziel: 24"   color="#818cf8" glow="glow-indigo" />
        <StatCard icon={Target} label="Gewicht"      value={`${profile.weight} kg`}   color="#22d3ee" glow="glow-cyan"   />
      </div>

      {/* Today's Quest / Focus Mode */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-dark rounded-2xl p-5 border border-indigo-500/30"
      >
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
            <p className="text-gray-400 text-sm mb-4">
              Starte den Focus-Mode – er blockiert Ablenkungen bis du trainiert hast.
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFocusModeActive(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 text-white font-semibold glow-indigo transition-all"
              >
                <Lock size={16} /> Focus Mode starten
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/workout')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-indigo-500/40 text-indigo-300 font-semibold hover:bg-indigo-500/10 transition-all"
              >
                Training ansehen <ChevronRight size={16} />
              </motion.button>
            </div>
          </>
        )}
      </motion.div>

      {/* Quests */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={16} className="text-neon-amber" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Aktive Quests</h2>
        </div>
        <div className="space-y-2">
          {quests.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="card-dark rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/40 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm
                  ${q.done ? 'bg-green-500/20 text-neon-green' : 'bg-indigo-500/15 text-indigo-300'}`}>
                  {q.done ? '✓' : '○'}
                </div>
                <div>
                  <div className={`text-sm font-medium ${q.done ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {q.title}
                  </div>
                  <div className="text-xs text-gray-500">{q.desc}</div>
                </div>
              </div>
              <div className="text-xs font-bold text-neon-amber">+{q.xp} XP</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Body Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card-dark rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📊</span>
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Deine Statistiken</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Gewicht', value: `${profile.weight} kg`, target: '90 kg Ziel' },
            { label: 'Größe', value: `${profile.height} cm`, target: '' },
            { label: 'BMI', value: bmiVal, target: 'Ziel: < 25' },
          ].map(({ label, value, target }) => (
            <div key={label} className="bg-white/3 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <div className="text-xl font-bold text-white">{value}</div>
              {target && <div className="text-xs text-neon-amber mt-1">{target}</div>}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
          💡 Mit 3× Training pro Woche + Kaloriendefizit kannst du in 6 Monaten ~10 kg abnehmen.
          Du hast das schon mal geschafft – du schaffst es wieder!
        </div>
      </motion.div>
    </div>
  );
}
