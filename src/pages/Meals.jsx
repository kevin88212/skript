import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, RefreshCw, ChevronDown, ChevronUp, ExternalLink, Zap, Lock, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTotalMacros, MEAL_TAGS } from '../data/meals';

function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span style={{ color }}>{value}g</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8 }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </div>
  );
}

function MealCard({ meal, label, emoji, userLevel }) {
  const [open, setOpen] = useState(false);
  const reqLevel = meal.unlockLevel ?? 1;
  const isLocked = reqLevel > userLevel;

  if (isLocked) {
    return (
      <div className="card-dark rounded-2xl p-4 border border-gray-700/30 opacity-50 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl shrink-0">
          {meal.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 uppercase tracking-wide">{emoji} {label}</div>
          <div className="font-bold text-gray-500 text-sm mt-0.5">{meal.name}</div>
          <div className="text-xs text-gray-600 mt-1">{meal.kcal} kcal · {meal.protein}g Protein</div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700/60 shrink-0">
          <Lock size={12} className="text-gray-500" />
          <span className="text-xs text-gray-500 font-semibold">Level {reqLevel}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="card-dark rounded-2xl overflow-hidden border border-indigo-500/20 hover:border-indigo-500/35 transition-all"
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full p-4 text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{meal.emoji}</span>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">{emoji} {label}</div>
            <div className="font-bold text-white text-sm mt-0.5">{meal.name}</div>
            <div className="flex gap-3 mt-1 text-xs text-gray-400">
              <span>🔥 {meal.kcal} kcal</span>
              <span>💪 {meal.protein}g</span>
              <span>⏱ {meal.time}</span>
            </div>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {meal.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: `${MEAL_TAGS[tag]?.color}20`,
                      color: MEAL_TAGS[tag]?.color,
                      border: `1px solid ${MEAL_TAGS[tag]?.color}40`,
                    }}
                  >
                    {MEAL_TAGS[tag]?.label}
                  </span>
                ))}
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { l: 'Protein', v: meal.protein, c: '#f87171' },
                  { l: 'Kohlenhydrate', v: meal.carbs, c: '#fbbf24' },
                  { l: 'Fett', v: meal.fat, c: '#34d399' },
                ].map(({ l, v, c }) => (
                  <div key={l} className="rounded-xl p-2" style={{ background: `${c}10` }}>
                    <div className="text-lg font-bold" style={{ color: c }}>{v}g</div>
                    <div className="text-xs text-gray-500">{l}</div>
                  </div>
                ))}
              </div>

              {/* Ingredients */}
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Zutaten</div>
                <div className="space-y-1">
                  {meal.ingredients.map((ing, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                      {ing}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Zubereitung</div>
                <div className="space-y-2">
                  {meal.instructions.map((step, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cokidoo link */}
              <a
                href={`https://www.cokidoo.de/search?q=${encodeURIComponent(meal.cokidoo_search)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ExternalLink size={12} />
                Auf Cokidoo suchen: „{meal.cokidoo_search}"
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Custom Meal Card ─────────────────────────────────────────────────────────
function CustomMealCard({ meal, onDelete }) {
  return (
    <div className="card-dark rounded-2xl p-4 border border-cyan-500/20 flex items-start gap-3">
      <span className="text-2xl shrink-0">{meal.emoji || '🍽️'}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{meal.mealType || 'Eigenes Rezept'}</div>
        <div className="font-bold text-white text-sm">{meal.name}</div>
        <div className="text-xs text-gray-400 mt-0.5">{meal.kcal} kcal · {meal.protein}g P · {meal.carbs}g K · {meal.fat}g F</div>
        {meal.notes && <div className="text-xs text-gray-500 mt-1">{meal.notes}</div>}
      </div>
      <button onClick={() => onDelete(meal.id)} className="text-gray-600 hover:text-red-400 transition-colors shrink-0">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ── Add Custom Meal Form ─────────────────────────────────────────────────────
function AddMealForm({ onSave, onCancel }) {
  const EMOJIS = ['🍳','🥗','🥩','🍝','🥘','🍲','🥙','🌮','🍱','🥪','🍜','🫕'];
  const [form, setForm] = useState({ name: '', emoji: '🍳', mealType: 'Frühstück', kcal: '', protein: '', carbs: '', fat: '', notes: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.kcal) return;
    onSave({ ...form, kcal: Number(form.kcal), protein: Number(form.protein) || 0, carbs: Number(form.carbs) || 0, fat: Number(form.fat) || 0 });
  };

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="card-dark rounded-2xl p-4 border border-indigo-500/30 space-y-3">
      <h3 className="text-sm font-semibold text-white">Eigenes Rezept hinzufügen</h3>

      {/* Emoji picker */}
      <div className="flex flex-wrap gap-2">
        {EMOJIS.map(e => (
          <button key={e} onClick={() => set('emoji', e)}
            className={`w-9 h-9 rounded-xl text-xl transition-all ${form.emoji === e ? 'bg-indigo-500/30 border border-indigo-500/60 scale-110' : 'bg-gray-800 border border-gray-700/50'}`}>
            {e}
          </button>
        ))}
      </div>

      <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Rezeptname *"
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60" />

      <select value={form.mealType} onChange={e => set('mealType', e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60">
        {['Frühstück','Mittagessen','Abendessen','Snack'].map(t => <option key={t}>{t}</option>)}
      </select>

      <div className="grid grid-cols-2 gap-2">
        {[['kcal','Kalorien *'],['protein','Protein g'],['carbs','Kohlenhydrate g'],['fat','Fett g']].map(([k,l]) => (
          <input key={k} type="number" value={form[k]} onChange={e => set(k, e.target.value)} placeholder={l}
            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60" />
        ))}
      </div>

      <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Notizen (optional)"
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60" />

      <div className="flex gap-2">
        <button onClick={handleSave}
          className="flex-1 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold">Speichern</button>
        <button onClick={onCancel}
          className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-400 text-sm">Abbrechen</button>
      </div>
    </motion.div>
  );
}

export default function Meals() {
  const { dailyMeals, refreshMeals, profile, customMeals, addCustomMeal, removeCustomMeal } = useApp();
  const totals = getTotalMacros(dailyMeals);
  const userLevel = profile.level;
  const KCAL_GOAL = 2200;
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Utensils size={18} className="text-cyan-400" />
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Ernährung</span>
          </div>
          <h1 className="text-2xl font-black text-white">Tagesplan</h1>
          <p className="text-gray-400 text-sm">Personalisiert für dein Gewichtsziel</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95, rotate: 180 }}
          onClick={refreshMeals}
          className="p-3 rounded-xl card-dark border border-cyan-500/30 text-cyan-400 hover:border-cyan-500/60 transition-all">
          <RefreshCw size={18} />
        </motion.button>
      </div>

      {/* Daily summary */}
      <div className="card-dark rounded-2xl p-5 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white">Tageszusammenfassung</h2>
          <div className="text-right">
            <div className="text-xl font-black text-white">{totals.kcal}</div>
            <div className="text-xs text-gray-500">von {KCAL_GOAL} kcal</div>
          </div>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (totals.kcal / KCAL_GOAL) * 100)}%` }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #22d3ee, #6366f1)', boxShadow: '0 0 10px rgba(34,211,238,0.4)' }} />
        </div>
        <div className="space-y-2">
          <MacroBar label="Protein" value={totals.protein} max={180} color="#f87171" />
          <MacroBar label="Kohlenhydrate" value={totals.carbs} max={220} color="#fbbf24" />
          <MacroBar label="Fett" value={totals.fat} max={80} color="#34d399" />
        </div>
        <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
          <Zap size={14} className="shrink-0 mt-0.5 text-indigo-400" />
          <span>Ziel: ~2200 kcal/Tag = ca. 500 kcal Defizit für ~0.5 kg Gewichtsverlust pro Woche. Mind. <strong>150g Protein</strong> für Muskelerhalt.</span>
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-4">
        <MealCard meal={dailyMeals.breakfast} label="Frühstück"   emoji="🌅" userLevel={userLevel} />
        <MealCard meal={dailyMeals.lunch}     label="Mittagessen" emoji="☀️" userLevel={userLevel} />
        <MealCard meal={dailyMeals.dinner}    label="Abendessen"  emoji="🌙" userLevel={userLevel} />
      </div>

      {/* Custom Meals */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Eigene Rezepte</h2>
          <button onClick={() => setShowAddForm(v => !v)}
            className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-lg hover:bg-indigo-500/25 transition-colors">
            <Plus size={12} /> Hinzufügen
          </button>
        </div>

        <AnimatePresence>
          {showAddForm && (
            <AddMealForm
              onSave={(meal) => { addCustomMeal(meal); setShowAddForm(false); }}
              onCancel={() => setShowAddForm(false)}
            />
          )}
        </AnimatePresence>

        <div className="space-y-3 mt-3">
          {customMeals.length === 0 && !showAddForm && (
            <p className="text-xs text-gray-600 text-center py-4">Noch keine eigenen Rezepte. Füge dein erstes hinzu!</p>
          )}
          {customMeals.map(meal => (
            <CustomMealCard key={meal.id} meal={meal} onDelete={removeCustomMeal} />
          ))}
        </div>
      </div>

      {/* Cokidoo Info */}
      <div className="card-dark rounded-2xl p-4 border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🍳</span>
          <h3 className="font-semibold text-white text-sm">Cokidoo Integration</h3>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          Jedes Rezept ist mit Cokidoo verknüpft. Klicke auf „Auf Cokidoo suchen" um das vollständige Rezept zu öffnen.
        </p>
        <a href="https://www.cokidoo.de" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
          <ExternalLink size={12} /> Cokidoo öffnen
        </a>
      </div>
    </div>
  );
}
