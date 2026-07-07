import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/lessons';
import { SCENARIOS, getScenariosByCategory } from '../data/scenarios';

const TRAINING_CATEGORIES = ['schlagfertigkeit', 'flirten'];

export default function Training() {
  const { completedScenarios, startScenario } = useApp();
  const [filter, setFilter] = useState('alle');

  const scenarios = filter === 'alle' ? SCENARIOS : getScenariosByCategory(filter);
  const doneIds = new Set(completedScenarios.map(s => s.id));

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-3xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Target size={18} className="text-purple-400" />
          <span className="text-xs text-purple-400 uppercase tracking-widest font-medium">Training</span>
        </div>
        <h1 className="text-2xl font-black text-white">Situationen üben</h1>
        <p className="text-gray-400 text-sm mt-1">
          Triff eine Entscheidung, bekomm direktes Feedback – {doneIds.size} / {SCENARIOS.length} trainiert
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilter('alle')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all
            ${filter === 'alle' ? 'bg-white/15 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
        >
          Alle
        </button>
        {TRAINING_CATEGORIES.map(key => {
          const cat = CATEGORIES[key];
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all border"
              style={filter === key
                ? { background: `${cat.color}25`, color: cat.color, borderColor: `${cat.color}50` }
                : { color: '#6b7280', borderColor: 'transparent' }}
            >
              {cat.emoji} {cat.label}
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {scenarios.map(scenario => {
          const color = CATEGORIES[scenario.category]?.color ?? '#a855f7';
          const done = doneIds.has(scenario.id);
          return (
            <motion.button
              key={scenario.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => startScenario(scenario)}
              className="card-dark rounded-2xl p-4 border text-left transition-all hover:opacity-90"
              style={{ borderColor: `${color}30` }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold" style={{ color }}>+{scenario.xp} XP</span>
                {done && <Check size={14} className="text-neon-green" />}
              </div>
              <div className="text-sm font-semibold text-white mb-1">{scenario.title}</div>
              <div className="text-xs text-gray-500 line-clamp-2">{scenario.setup}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
