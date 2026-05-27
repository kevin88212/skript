import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Trash2, X } from 'lucide-react';
import { exercises as builtinExercises, MUSCLE_GROUPS, DIFFICULTY } from '../data/exercises';
import { useApp } from '../context/AppContext';

const EMOJIS = ['💪','🏋️','🤸','🦵','🔥','⚡','🎯','🏃','🚴','🧘','🥊','⚔️','🛡️','🌀','🔱'];

// ── Detail-Modal ─────────────────────────────────────────────────────────────
function ExerciseDetail({ ex, onClose, onDelete, isCustom }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-end md:items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="card-dark rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{ex.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{ex.name}</h2>
                {isCustom && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Eigene
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {ex.muscle}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${DIFFICULTY[ex.difficulty].color}20`, color: DIFFICULTY[ex.difficulty].color }}
                >
                  {DIFFICULTY[ex.difficulty].label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCustom && (
              <button
                onClick={() => { onDelete(ex.id); onClose(); }}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/15 transition-colors"
                title="Löschen"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl">✕</button>
          </div>
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

          {ex.tips && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wide">💡 Profi-Tipp</div>
              <p className="text-sm text-amber-100">{ex.tips}</p>
            </div>
          )}

          {ex.muscles_secondary?.length > 0 && (
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

// ── Formular für neue Übung ───────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', muscle: 'Brust', equipment: '', sets: '3 × 10',
  difficulty: 'beginner', emoji: '💪', tips: '',
  steps: ['', '', ''],
};

function AddExerciseModal({ onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const setStep = (i, val) =>
    setForm(f => { const s = [...f.steps]; s[i] = val; return { ...f, steps: s }; });

  const addStep = () =>
    setForm(f => ({ ...f, steps: [...f.steps, ''] }));

  const removeStep = (i) =>
    setForm(f => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));

  const save = () => {
    if (!form.name.trim()) { setError('Name darf nicht leer sein.'); return; }
    if (!form.equipment.trim()) { setError('Equipment angeben.'); return; }
    const steps = form.steps.filter(s => s.trim());
    if (steps.length === 0) { setError('Mindestens 1 Ausführungsschritt angeben.'); return; }
    onSave({ ...form, steps, muscles_secondary: [], xp: 80, id: `custom_${Date.now()}` });
    onClose();
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700/60 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/70';
  const labelCls = 'text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-end md:items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="card-dark rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">Eigene Übung</h2>
            <p className="text-xs text-gray-400 mt-0.5">Wird lokal gespeichert</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300"><X size={20} /></button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Emoji picker */}
        <div>
          <label className={labelCls}>Icon</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => setField('emoji', e)}
                className={`w-9 h-9 rounded-xl text-lg transition-all
                  ${form.emoji === e ? 'bg-indigo-500/30 border border-indigo-500/60 scale-110' : 'bg-white/5 hover:bg-white/10'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className={labelCls}>Name *</label>
          <input className={inputCls} placeholder="z.B. Kabelzug Bizeps" value={form.name}
            onChange={e => setField('name', e.target.value)} />
        </div>

        {/* Muscle + Difficulty */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Muskelgruppe *</label>
            <select className={inputCls} value={form.muscle} onChange={e => setField('muscle', e.target.value)}>
              {MUSCLE_GROUPS.filter(m => m !== 'Alle').map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Schwierigkeit</label>
            <select className={inputCls} value={form.difficulty} onChange={e => setField('difficulty', e.target.value)}>
              {Object.entries(DIFFICULTY).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Equipment + Sets */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Equipment *</label>
            <input className={inputCls} placeholder="z.B. Kabelzug" value={form.equipment}
              onChange={e => setField('equipment', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Sets / Reps</label>
            <input className={inputCls} placeholder="3 × 12" value={form.sets}
              onChange={e => setField('sets', e.target.value)} />
          </div>
        </div>

        {/* Steps */}
        <div>
          <label className={labelCls}>Ausführung * (mind. 1 Schritt)</label>
          <div className="space-y-2">
            {form.steps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center shrink-0 mt-2 font-bold">
                  {i + 1}
                </span>
                <input
                  className={`${inputCls} flex-1`}
                  placeholder={`Schritt ${i + 1}...`}
                  value={step}
                  onChange={e => setStep(i, e.target.value)}
                />
                {form.steps.length > 1 && (
                  <button onClick={() => removeStep(i)}
                    className="mt-2 text-gray-600 hover:text-red-400 transition-colors shrink-0">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addStep}
            className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            <Plus size={12} /> Schritt hinzufügen
          </button>
        </div>

        {/* Tips */}
        <div>
          <label className={labelCls}>Profi-Tipp (optional)</label>
          <textarea
            className={`${inputCls} resize-none h-20`}
            placeholder="Häufige Fehler, Hinweise..."
            value={form.tips}
            onChange={e => setField('tips', e.target.value)}
          />
        </div>

        {/* Save */}
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          onClick={save}
          className="w-full py-3.5 rounded-xl bg-indigo-500 text-white font-bold text-sm glow-indigo"
        >
          Übung speichern +80 XP
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ── Haupt-Seite ──────────────────────────────────────────────────────────────
function useCustomExercises() {
  const [custom, setCustom] = useState(() => {
    try { return JSON.parse(localStorage.getItem('custom_exercises') || '[]'); }
    catch { return []; }
  });

  const add = (ex) => {
    const next = [ex, ...custom];
    setCustom(next);
    localStorage.setItem('custom_exercises', JSON.stringify(next));
  };

  const remove = (id) => {
    const next = custom.filter(e => e.id !== id);
    setCustom(next);
    localStorage.setItem('custom_exercises', JSON.stringify(next));
  };

  return { custom, add, remove };
}

export default function Exercises() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Alle');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const { gainXP } = useApp();
  const { custom, add, remove } = useCustomExercises();

  const allExercises = [...custom, ...builtinExercises];
  const customIds = new Set(custom.map(e => e.id));

  const filtered = allExercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.muscle.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Alle' || e.muscle === filter;
    return matchSearch && matchFilter;
  });

  const handleAdd = (ex) => {
    add(ex);
    gainXP(80);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-indigo-400 uppercase tracking-widest font-medium">⚔️ Übungsdatenbank</span>
          </div>
          <h1 className="text-2xl font-black text-white">Alle Übungen</h1>
          <p className="text-gray-400 text-sm">
            {builtinExercises.length} Übungen
            {custom.length > 0 && <span className="text-cyan-400"> + {custom.length} eigene</span>}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 text-white font-semibold text-sm glow-indigo shrink-0"
        >
          <Plus size={16} /> Eigene
        </motion.button>
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
        {filtered.map((ex, i) => {
          const isCustom = customIds.has(ex.id);
          return (
            <motion.button
              key={ex.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              onClick={() => { setSelected(ex); if (!isCustom) gainXP(30); }}
              className={`card-dark rounded-2xl p-4 text-left border transition-all
                ${isCustom
                  ? 'border-cyan-500/25 hover:border-cyan-500/50'
                  : 'border-indigo-500/15 hover:border-indigo-500/40'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ex.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-white text-sm truncate">{ex.name}</div>
                    {isCustom && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 shrink-0">
                        Eigene
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{ex.muscle}</span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs" style={{ color: DIFFICULTY[ex.difficulty].color }}>
                      {DIFFICULTY[ex.difficulty].label}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-neon-amber shrink-0">+{ex.xp} XP</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Keine Übungen gefunden für „{search}"
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selected && (
          <ExerciseDetail
            ex={selected}
            isCustom={customIds.has(selected.id)}
            onClose={() => setSelected(null)}
            onDelete={remove}
          />
        )}
        {showAdd && (
          <AddExerciseModal
            onClose={() => setShowAdd(false)}
            onSave={handleAdd}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
