import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, CheckCircle, X, Timer } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FocusMode() {
  const { completeWorkout, setFocusModeActive, profile } = useApp();
  const [timeActive, setTimeActive] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [checklist, setChecklist] = useState([
    { id: 1, label: 'Aufgewärmt (5–10 min)', done: false },
    { id: 2, label: 'Workout absolviert', done: false },
    { id: 3, label: 'Abgekühlt / Stretching', done: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => setTimeActive(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const allDone = checklist.every(c => c.done);
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;
  const toggle = (id) => setChecklist(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));

  return (
    <div className="fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full opacity-5"
            style={{
              background: `radial-gradient(circle, ${i % 2 === 0 ? '#6366f1' : '#22d3ee'} 0%, transparent 70%)`,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
            transition={{ duration: 4 + i, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Lock icon */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-6 w-20 h-20 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center glow-indigo"
      >
        <Lock size={36} className="text-indigo-400" />
      </motion.div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-white mb-2">FOCUS MODE</h1>
        <p className="text-gray-400">Ablenkungen blockiert. Deine Mission wartet.</p>
        <div className="mt-3 text-3xl font-mono font-bold text-neon-cyan">
          <Timer size={20} className="inline mr-2 text-gray-500" />
          {fmt(timeActive)}
        </div>
      </div>

      {/* Motivational quote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 max-w-sm text-center p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20"
      >
        <p className="text-indigo-200 italic text-sm">
          "Du bist 24 Jahre alt. Jede Wiederholung die du heute machst, zahlt sich für die nächsten Jahrzehnte aus."
        </p>
      </motion.div>

      {/* Checklist */}
      <div className="w-full max-w-sm space-y-3 mb-8">
        {checklist.map(item => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => toggle(item.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left
              ${item.done
                ? 'bg-green-500/15 border-green-500/40 text-neon-green'
                : 'card-dark border-gray-700/50 text-gray-300 hover:border-indigo-500/40'
              }`}
          >
            <CheckCircle size={20} className={item.done ? 'text-green-400' : 'text-gray-600'} />
            <span className={`text-sm font-medium ${item.done ? 'line-through' : ''}`}>
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Complete button */}
      <AnimatePresence>
        {allDone && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={completeWorkout}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg glow-green mb-4"
          >
            🏆 Workout abschließen! +200 XP
          </motion.button>
        )}
      </AnimatePresence>

      {/* Emergency exit */}
      <button
        onClick={() => setShowConfirm(true)}
        className="text-xs text-gray-600 hover:text-gray-400 transition-colors mt-2 flex items-center gap-1"
      >
        <X size={12} /> Focus Mode beenden
      </button>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="card-dark rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <Unlock size={32} className="text-neon-red mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Wirklich aufgeben?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Du verlässt den Focus Mode ohne Training. Kein XP, kein Streak.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition-colors"
                >
                  Weitertrainieren!
                </button>
                <button
                  onClick={() => { setFocusModeActive(false); setShowConfirm(false); }}
                  className="flex-1 py-3 rounded-xl border border-red-500/40 text-neon-red font-semibold hover:bg-red-500/10 transition-colors"
                >
                  Aufgeben
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
