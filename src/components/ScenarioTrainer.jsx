import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/lessons';

const QUALITY_XP = { schwach: 0.4, gut: 0.75, stark: 1 };
const QUALITY_LABEL = { schwach: 'Schwach', gut: 'Gut', stark: 'Stark' };
const QUALITY_CLASS = {
  schwach: 'text-neon-red border-red-500/40 bg-red-500/10',
  gut:     'text-neon-amber border-amber-500/40 bg-amber-500/10',
  stark:   'text-neon-green border-green-500/40 bg-green-500/10',
};

export default function ScenarioTrainer({ scenario, onClose, onComplete }) {
  const [picked, setPicked] = useState(null);
  const [finished, setFinished] = useState(false);
  const color = CATEGORIES[scenario.category]?.color ?? '#a855f7';
  const earnedXp = picked ? Math.round(scenario.xp * QUALITY_XP[picked.quality]) : 0;

  const handlePick = (choice) => {
    if (picked) return;
    setPicked(choice);
  };

  const handleFinish = () => {
    onComplete(earnedXp, picked.quality);
    setFinished(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: '#050508' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} style={{ color }} />
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color }}>
            {CATEGORIES[scenario.category]?.label ?? 'Training'}
          </span>
        </div>
        <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-lg mx-auto w-full">
        {/* Situation */}
        <div className="text-center">
          <div className="text-5xl mb-3">💬</div>
          <h1 className="text-2xl font-black text-white">{scenario.title}</h1>
          <p className="text-gray-300 text-sm mt-3 leading-relaxed">{scenario.setup}</p>
        </div>

        {/* Choices */}
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
            Wie reagierst du?
          </div>
          <div className="space-y-2">
            {scenario.choices.map((choice, idx) => {
              const isPicked = picked === choice;
              const disabled = !!picked && !isPicked;
              return (
                <motion.button
                  key={idx}
                  whileTap={!picked ? { scale: 0.98 } : {}}
                  onClick={() => handlePick(choice)}
                  disabled={!!picked}
                  className={`w-full p-4 rounded-2xl border text-left transition-all
                    ${isPicked
                      ? QUALITY_CLASS[choice.quality]
                      : disabled
                        ? 'border-gray-800/50 bg-gray-900/30 opacity-40'
                        : 'border-gray-700/50 bg-gray-800/40 hover:border-gray-600'
                    }`}
                >
                  <div className="text-sm font-medium text-white">{choice.text}</div>
                  {isPicked && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 pt-3 border-t border-white/10"
                    >
                      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border mb-1.5 ${QUALITY_CLASS[choice.quality]}`}>
                        {QUALITY_LABEL[choice.quality]}
                      </span>
                      <p className="text-xs text-gray-300">{choice.feedback}</p>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {picked && !finished && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleFinish}
            className="w-full py-3.5 rounded-2xl text-white font-bold"
            style={{ background: `linear-gradient(135deg, ${color}, #22d3ee)`, boxShadow: `0 0 25px ${color}50` }}
          >
            Weiter · +{earnedXp} XP
          </motion.button>
        )}
      </div>

      {/* Completion overlay */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: 'rgba(5,5,8,0.96)' }}
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 2 }} className="text-6xl mb-4">
              <Sparkles size={64} style={{ color }} />
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-2">Geschafft!</h2>
            <p className="text-gray-400 mb-2">Szenario „{scenario.title}" trainiert.</p>
            <div className="text-2xl font-black text-neon-amber mb-6">+{earnedXp} XP</div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg"
              style={{ background: `linear-gradient(135deg, ${color}, #22d3ee)`, boxShadow: `0 0 30px ${color}60` }}
            >
              Weiter so! 🚀
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
