import { motion, AnimatePresence } from 'framer-motion';
import { exercises } from '../data/exercises';
import { meals } from '../data/meals';

function getUnlocksAtLevel(level) {
  const newExercises = exercises.filter(e => e.unlockLevel === level);
  const newMeals = [
    ...meals.breakfasts.filter(m => m.unlockLevel === level),
    ...meals.lunches.filter(m => m.unlockLevel === level),
    ...meals.dinners.filter(m => m.unlockLevel === level),
  ];
  return { newExercises, newMeals };
}

const LEVEL_TITLES = [
  '', 'Newcomer', 'Krieger', 'Kämpfer', 'Veteran', 'Champion', 'Legende'
];

export default function LevelUpModal({ level, onClose }) {
  const { newExercises, newMeals } = getUnlocksAtLevel(level);
  const title = LEVEL_TITLES[level] ?? `Level ${level}`;

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
            x: Math.cos((i / 12) * 2 * Math.PI) * (120 + Math.random() * 80),
            y: Math.sin((i / 12) * 2 * Math.PI) * (120 + Math.random() * 80),
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

        {/* Neu freigeschaltet */}
        {(newExercises.length > 0 || newMeals.length > 0) ? (
          <div className="space-y-3 mb-5 text-left">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">
              🔓 Jetzt freigeschaltet
            </div>

            {newExercises.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs text-indigo-300 font-semibold">⚔️ Übungen</div>
                {newExercises.map(ex => (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20"
                  >
                    <span className="text-lg">{ex.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{ex.name}</div>
                      <div className="text-xs text-gray-500">{ex.muscle} · +{ex.xp} XP</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {newMeals.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs text-cyan-300 font-semibold">🍽️ Rezepte</div>
                {newMeals.map(m => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.kcal} kcal · {m.protein}g Protein</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-5 p-3 rounded-xl bg-white/5 text-sm text-gray-400">
            Weiter so – mehr Inhalte warten auf den nächsten Level!
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold glow-indigo"
        >
          Weiter kämpfen! 💪
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
