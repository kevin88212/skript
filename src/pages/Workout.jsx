import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Play, Check, ChevronDown, ChevronUp, Zap, Timer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exercises, WORKOUT_PLANS } from '../data/exercises';
import WorkoutTimer from '../components/WorkoutTimer';

function ExerciseCard({ ex, onComplete, isCompleted, onTimerOpen }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout
      className={`card-dark rounded-2xl overflow-hidden border transition-all duration-300
        ${isCompleted ? 'border-green-500/40 opacity-60' : 'border-indigo-500/20 hover:border-indigo-500/40'}`}>
      <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{ex.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{ex.name}</span>
              {isCompleted && <span className="text-xs text-neon-green">✓ Fertig</span>}
            </div>
            <div className="flex gap-2 mt-1">
              <span className="text-xs text-gray-500">{ex.sets}</span>
              <span className="text-xs text-gray-600">·</span>
              <span className="text-xs text-gray-500">{ex.equipment}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-neon-amber">+{ex.xp} XP</span>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3">
              <div className="space-y-2">
                {ex.steps.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-gray-300">{step}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                💡 {ex.tips}
              </div>
              <div className="flex gap-2">
                {!isCompleted && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => onComplete(ex)}
                    className="flex-1 py-3 rounded-xl bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 glow-indigo">
                    <Check size={16} /> Fertig +{ex.xp} XP
                  </motion.button>
                )}
                <button onClick={onTimerOpen}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-700/60 text-gray-400 text-xs hover:border-cyan-500/40 hover:text-cyan-400 transition-all">
                  <Timer size={14} /> Pause
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Workout() {
  const { gainXP, completeWorkout, completedWorkoutToday } = useApp();
  const [completedIds, setCompletedIds] = useState([]);
  const [activeDay, setActiveDay] = useState(0);
  const [timerOpen, setTimerOpen] = useState(false);

  const plan = WORKOUT_PLANS.beginner_3x;
  const day = plan.days[activeDay];
  const dayExercises = day.exercises.map(id => exercises.find(e => e.id === id)).filter(Boolean);
  const allDone = dayExercises.every(e => completedIds.includes(e.id));
  const progress = dayExercises.filter(e => completedIds.includes(e.id)).length;

  const handleComplete = (ex) => {
    if (completedIds.includes(ex.id)) return;
    setCompletedIds(prev => [...prev, ex.id]);
    gainXP(ex.xp);
  };

  const handleFinishWorkout = () => {
    completeWorkout(day.day);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Dumbbell size={20} className="text-indigo-400" />
          <span className="text-xs text-indigo-400 uppercase tracking-widest font-medium">Trainingsplan</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-white">{plan.name}</h1>
          <button onClick={() => setTimerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/10 transition-all">
            <Timer size={14} /> Pausentimer
          </button>
        </div>
        <p className="text-gray-400 text-sm">{plan.description}</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2">
        {plan.days.map((d, i) => (
          <button key={i} onClick={() => setActiveDay(i)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all
              ${activeDay === i ? 'bg-indigo-500 text-white glow-indigo' : 'card-dark text-gray-400 hover:text-gray-200 border border-gray-700/50'}`}>
            {d.day.split('–')[0].trim()}
          </button>
        ))}
      </div>

      {/* Active day header */}
      <div className="card-dark rounded-2xl p-4 border border-indigo-500/25">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-white">{day.day}</h2>
          <span className="text-xs text-neon-amber">{progress}/{dayExercises.length} Übungen</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${(progress / dayExercises.length) * 100}%` }} className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366f1, #22d3ee)' }} />
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        {dayExercises.map(ex => (
          <ExerciseCard key={ex.id} ex={ex}
            onComplete={handleComplete}
            isCompleted={completedIds.includes(ex.id)}
            onTimerOpen={() => setTimerOpen(true)}
          />
        ))}
      </div>

      {/* Complete workout button */}
      <AnimatePresence>
        {allDone && !completedWorkoutToday && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sticky bottom-24 md:bottom-4">
            <button onClick={handleFinishWorkout}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg flex items-center justify-center gap-2 glow-green">
              <Zap size={20} /> Workout abschließen! +200 XP
            </button>
          </motion.div>
        )}
        {completedWorkoutToday && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-xl font-bold text-neon-green">Heute geschafft!</div>
            <div className="text-gray-400 text-sm">Komm morgen wieder.</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer overlay */}
      <AnimatePresence>
        {timerOpen && <WorkoutTimer onClose={() => setTimerOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
