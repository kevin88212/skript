import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Eye, Play } from 'lucide-react';
import EyeContactTimer from '../components/EyeContactTimer';

const PRESETS = [
  { id: 'beginner', label: 'Einsteiger', desc: '4 Runden à 10 Sekunden', rounds: [10, 10, 10, 10] },
  { id: 'advanced', label: 'Fortgeschritten', desc: '4 Runden, ansteigend bis 35s', rounds: [20, 25, 30, 35] },
  { id: 'custom', label: 'Frei einstellbar', desc: 'Eigene Dauer & Rundenzahl', rounds: null },
];

const TIPS = [
  'Schau zu Beginn lieber 5–10 Sekunden, statt dich zu überfordern – Steigerung kommt mit der Zeit.',
  'Wenn es zu intensiv wird: kurz auf einen Punkt zwischen den Augenbrauen schauen, das wirkt identisch.',
  'Blinzeln und kurzes Wegschauen ist normal – wichtig ist, danach bewusst zurückzukommen.',
  'Übe zuerst vor dem Spiegel oder mit der Frontkamera, dann mit Freunden, erst danach mit Fremden.',
  'Ein kurzes, echtes Lächeln beim Augenkontakt nimmt die Anspannung aus der Situation.',
];

export default function EyeContactTrainer() {
  const [customDuration, setCustomDuration] = useState(15);
  const [customRounds, setCustomRounds] = useState(4);
  const [activeRounds, setActiveRounds] = useState(null);

  const startPreset = (preset) => {
    if (preset.id === 'custom') {
      setActiveRounds(Array.from({ length: customRounds }, () => customDuration));
    } else {
      setActiveRounds(preset.rounds);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Eye size={18} className="text-rose-400" />
          <span className="text-xs text-rose-400 uppercase tracking-widest font-medium">Training</span>
        </div>
        <h1 className="text-2xl font-black text-white">Augenkontakt-Trainer</h1>
        <p className="text-sm text-gray-400 mt-1">
          Geführte Intervall-Übung, um Augenkontakt schrittweise angenehmer zu machen.
        </p>
      </div>

      <div className="grid gap-3">
        {PRESETS.map(preset => (
          <div key={preset.id} className="card-dark rounded-2xl p-4 border border-rose-500/20">
            <div className="flex items-center justify-between mb-1">
              <div className="font-bold text-white">{preset.label}</div>
              <button
                onClick={() => startPreset(preset)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition-all"
              >
                <Play size={12} /> Starten
              </button>
            </div>
            <div className="text-xs text-gray-500">{preset.desc}</div>

            {preset.id === 'custom' && (
              <div className="flex gap-4 mt-3">
                <label className="text-xs text-gray-400 flex items-center gap-2">
                  Dauer
                  <input
                    type="number" min={5} max={60} value={customDuration}
                    onChange={e => setCustomDuration(Math.max(5, Math.min(60, Number(e.target.value))))}
                    className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-rose-500/60"
                  /> s
                </label>
                <label className="text-xs text-gray-400 flex items-center gap-2">
                  Runden
                  <input
                    type="number" min={1} max={10} value={customRounds}
                    onChange={e => setCustomRounds(Math.max(1, Math.min(10, Number(e.target.value))))}
                    className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-rose-500/60"
                  />
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card-dark rounded-2xl p-5 border border-violet-500/20">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-3">Tipps</h2>
        <ul className="space-y-2 text-sm text-gray-400">
          {TIPS.map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-rose-400">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {activeRounds && (
          <EyeContactTimer rounds={activeRounds} onClose={() => setActiveRounds(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
