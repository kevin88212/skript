import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sword, Shield } from 'lucide-react';

export default function BossFight({ boss, onClose, onVictory }) {
  const [checkedAttacks, setCheckedAttacks] = useState([]);
  const [showVictory, setShowVictory] = useState(false);

  const totalDamage = checkedAttacks.reduce((sum, idx) => sum + boss.attacks[idx].damage, 0);
  const currentHp = Math.max(0, boss.maxHp - totalDamage);
  const hpPct = (currentHp / boss.maxHp) * 100;

  const toggleAttack = (idx) => {
    if (showVictory) return;
    setCheckedAttacks(prev => {
      const next = prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx];
      // Check for victory
      const dmg = next.reduce((s, i) => s + boss.attacks[i].damage, 0);
      if (dmg >= boss.maxHp) {
        setTimeout(() => setShowVictory(true), 400);
      }
      return next;
    });
  };

  const handleVictory = () => {
    onVictory(boss.reward.xp);
    onClose();
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
          <Sword size={18} style={{ color: boss.color }} />
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: boss.color }}>Bosskampf</span>
        </div>
        <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-lg mx-auto w-full">
        {/* Boss */}
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-3"
          >{boss.emoji}</motion.div>
          <h1 className="text-2xl font-black text-white">{boss.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{boss.desc}</p>
        </div>

        {/* HP Bar */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Boss HP</span>
            <span className="font-bold" style={{ color: boss.color }}>{currentHp} / {boss.maxHp}</span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${hpPct}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${boss.color}, ${boss.color}99)`, boxShadow: `0 0 12px ${boss.color}60` }}
            />
          </div>
        </div>

        {/* Attacks */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-gray-400" />
            <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Deine Angriffe</span>
          </div>
          <div className="space-y-2">
            {boss.attacks.map((atk, idx) => {
              const checked = checkedAttacks.includes(idx);
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleAttack(idx)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all
                    ${checked
                      ? 'border-green-500/40 bg-green-500/10'
                      : 'border-gray-700/50 bg-gray-800/40 hover:border-gray-600'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 text-xs
                    ${checked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-600'}`}>
                    {checked ? '✓' : ''}
                  </div>
                  <span className="text-2xl">{atk.emoji}</span>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${checked ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {atk.name}
                    </div>
                  </div>
                  <div className="text-xs font-bold" style={{ color: boss.color }}>-{atk.damage} HP</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Victory overlay */}
      <AnimatePresence>
        {showVictory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: 'rgba(5,5,8,0.96)' }}
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 2 }} className="text-6xl mb-4">
              🏆
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-2">SIEG!</h2>
            <p className="text-gray-400 mb-2">{boss.name} wurde besiegt!</p>
            <div className="text-2xl font-black text-neon-amber mb-6">+{boss.reward.xp} XP</div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleVictory}
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg"
              style={{ background: `linear-gradient(135deg, ${boss.color}, #22d3ee)`, boxShadow: `0 0 30px ${boss.color}60` }}
            >
              Beute einsammeln ⚔️
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
