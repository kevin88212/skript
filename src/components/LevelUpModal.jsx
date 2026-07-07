import { useState } from 'react';
import { motion } from 'framer-motion';

const LEVEL_TITLES = [
  '', 'Anfänger', 'Mutig', 'Selbstsicher', 'Furchtlos', 'Charismatisch', 'Legende'
];

const MOTIVATION = [
  'Weiter so — du wirst mit jedem Level mutiger!',
  'Jeder Schritt aus der Komfortzone zählt.',
  'Du wächst gerade an genau den Dingen, die dir schwerfallen.',
  'Kleine Mutproben, große Wirkung — mach weiter so!',
];

export default function LevelUpModal({ level, onClose }) {
  const title = LEVEL_TITLES[level] ?? `Level ${level}`;
  const motivationText = MOTIVATION[level % MOTIVATION.length];
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      x: Math.cos((i / 12) * 2 * Math.PI) * (120 + Math.random() * 80),
      y: Math.sin((i / 12) * 2 * Math.PI) * (120 + Math.random() * 80),
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6"
    >
      {/* Particle bursts */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: ['#6366f1','#22d3ee','#fbbf24','#f472b6','#34d399'][i % 5],
            left: '50%', top: '50%',
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            x: particles[i].x,
            y: particles[i].y,
          }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.4, delay: 0.1 }}
        className="card-dark rounded-3xl w-full max-w-sm p-6 text-center border border-indigo-500/40 glow-indigo"
      >
        {/* Level badge */}
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-6xl mb-2"
        >
          ⭐
        </motion.div>

        <div className="text-xs text-indigo-400 uppercase tracking-widest mb-1">Level Up!</div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-1">
          Level {level}
        </h1>
        <div className="text-lg font-bold text-neon-amber mb-4">{title}</div>

        <div className="mb-5 p-3 rounded-xl bg-white/5 text-sm text-gray-400">
          {motivationText}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold glow-indigo"
        >
          Weiter so! 🚀
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
