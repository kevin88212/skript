import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { exercises, MUSCLE_GROUPS, DIFFICULTY } from '../data/exercises';
import { useApp } from '../context/AppContext';

function ExerciseDetail({ ex, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-end md:items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="card-dark rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{ex.emoji}</span>
            <div>
              <h2 className="text-xl font-black text-white">{ex.name}</h2>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {ex.muscle}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: `${DIFFICULTY[ex.difficulty].color}20`,
                    color: DIFFICULTY[ex.difficulty].color,
                  }}
                >
                  {DIFFICULTY[ex.difficulty].label}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl">✕</button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
          {[
            { l: 'Equipment', v: ex.equipment },
            { l: 'Sets/Reps', v: ex.sets },
            { l: 'XP', v: `+${ex.xp}` },
          ].map(({ l, v }) => (
            <div key={l} className="bg-white/5 rounded-xl p-2">
              <div className="text-gray-400">{l}</div>
              <div className="font-bold text-white mt-0.5">{v}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Ausführung</h3>
            <div className="space-y-3">
              {ex.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center shrink-0 font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-200 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wide">💡 Profi-Tipp</div>
            <p className="text-sm text-amber-100">{ex.tips}</p>
          </div>

          {ex.muscles_secondary.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mithelfende Muskeln</div>
              <div className="flex flex-wrap gap-2">
                {ex.muscles_secondary.map(m => (
                  <span key={m} className="text-xs px-2 py-1 rounded-lg bg-gray-800 text-gray-400">{m}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Exercises() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Alle');
  const [selected, setSelected] = useState(null);
  const { gainXP } = useApp();

  const filtered = exercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.muscle.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Alle' || e.muscle === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-3xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-indigo-400 uppercase tracking-widest font-medium">⚔️ Übungsdatenbank</span>
        </div>
        <h1 className="text-2xl font-black text-white">Alle Übungen</h1>
        <p className="text-gray-400 text-sm">{exercises.length} Übungen mit detaillierter Ausführung</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Übung suchen..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700/50 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
        />
      </div>

      {/* Muscle filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {MUSCLE_GROUPS.map(mg => (
          <button
            key={mg}
            onClick={() => setFilter(mg)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all
              ${filter === mg
                ? 'bg-indigo-500 text-white'
                : 'card-dark text-gray-400 hover:text-white border border-gray-700/40'
              }`}
          >
            {mg}
          </button>
        ))}
      </div>

      {/* Exercise grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((ex, i) => (
          <motion.button
            key={ex.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => { setSelected(ex); gainXP(30); }}
            className="card-dark rounded-2xl p-4 text-left border border-indigo-500/15 hover:border-indigo-500/40 hover:glow-indigo transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{ex.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">{ex.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{ex.muscle}</span>
                  <span className="text-gray-700">·</span>
                  <span
                    className="text-xs"
                    style={{ color: DIFFICULTY[ex.difficulty].color }}
                  >
                    {DIFFICULTY[ex.difficulty].label}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-neon-amber shrink-0">+{ex.xp} XP</span>
            </div>
          </motion.button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Keine Übungen gefunden für „{search}"
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <ExerciseDetail ex={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
