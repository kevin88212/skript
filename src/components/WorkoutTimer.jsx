import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Timer } from 'lucide-react';

const PRESETS = [30, 60, 90, 120];

export default function WorkoutTimer({ onClose }) {
  const [duration, setDuration] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (remaining === null || remaining <= 0) return;
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  useEffect(() => {
    if (remaining === 0 && duration) {
      if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
      setDone(true);
    }
  }, [remaining, duration]);

  const startTimer = (d) => {
    setDuration(d);
    setRemaining(d);
    setDone(false);
  };

  const pct = duration && remaining !== null ? remaining / duration : 1;
  const R = 54;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - pct);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(5,5,8,0.92)', backdropFilter: 'blur(20px)' }}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
        <X size={24} />
      </button>

      <div className="flex items-center gap-2 mb-8">
        <Timer size={18} className="text-indigo-400" />
        <span className="text-xs text-indigo-400 uppercase tracking-widest font-semibold">Pausentimer</span>
      </div>

      {/* Circle */}
      <div className="relative mb-8">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="70" cy="70" r={R}
            fill="none"
            stroke={done ? '#34d399' : '#6366f1'}
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
            style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s', filter: `drop-shadow(0 0 10px ${done ? '#34d399' : '#6366f1'})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {done ? (
            <span className="text-2xl">💪</span>
          ) : remaining !== null ? (
            <>
              <span className="text-4xl font-black text-white">{remaining}</span>
              <span className="text-xs text-gray-500">Sekunden</span>
            </>
          ) : (
            <span className="text-gray-500 text-sm">Wähle Zeit</span>
          )}
        </div>
      </div>

      {done ? (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-xl font-bold text-neon-green mb-4">Pause vorbei! 💪</div>
          <button onClick={onClose} className="px-6 py-3 rounded-xl bg-indigo-500 text-white font-bold">
            Weiter trainieren
          </button>
        </motion.div>
      ) : (
        <div className="flex gap-3">
          {PRESETS.map(d => (
            <motion.button
              key={d}
              whileTap={{ scale: 0.92 }}
              onClick={() => startTimer(d)}
              className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border
                ${duration === d && remaining !== null
                  ? 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                  : 'bg-gray-800/80 border-gray-700/60 text-white hover:border-indigo-500/40'
                }`}
            >
              {d}s
            </motion.button>
          ))}
        </div>
      )}

      {remaining !== null && !done && (
        <button
          onClick={() => { setRemaining(null); setDuration(null); }}
          className="mt-6 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Abbrechen
        </button>
      )}
    </motion.div>
  );
}
