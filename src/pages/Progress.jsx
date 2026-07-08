import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Zap, Target, BookOpen, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, LESSONS } from '../data/lessons';
import { SCENARIOS } from '../data/scenarios';

// ── Streak Calendar ──────────────────────────────────────────────────────────
function StreakCalendar({ activeDates }) {
  const dateSet = new Set(activeDates);
  const today = new Date();
  const days = Array.from({ length: 70 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (69 - i));
    return d;
  });
  const weeks = Array.from({ length: 10 }, (_, w) => days.slice(w * 7, w * 7 + 7));

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 shrink-0">
            {week.map((day, di) => {
              const isFuture = day > today;
              const active = dateSet.has(day.toDateString());
              return (
                <div key={di} className="w-3 h-3 rounded-sm"
                  style={{ background: isFuture ? 'rgba(255,255,255,0.02)' : active ? '#34d399' : 'rgba(255,255,255,0.07)' }}
                  title={day.toLocaleDateString('de-DE')}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gray-700 inline-block" /> Kein Mut-Tag</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#34d399' }} /> Challenge erledigt</span>
      </div>
    </div>
  );
}

// ── Kalender Tab ─────────────────────────────────────────────────────────────
function CalendarTab() {
  const { challengeHistory, profile } = useApp();
  const dates = challengeHistory.map(h => h.date);
  const thisMonth = challengeHistory.filter(h => {
    const d = new Date(h.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="card-dark rounded-xl p-3 text-center border border-amber-500/20">
          <div className="text-xl font-black text-neon-amber">{profile.streak}</div>
          <div className="text-xs text-gray-500">Tage Streak</div>
        </div>
        <div className="card-dark rounded-xl p-3 text-center border border-green-500/20">
          <div className="text-xl font-black" style={{ color: '#34d399' }}>{thisMonth}</div>
          <div className="text-xs text-gray-500">Diesen Monat</div>
        </div>
      </div>
      <div className="card-dark rounded-2xl p-4 border border-gray-700/30">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Letzte 70 Tage</h3>
        <StreakCalendar activeDates={dates} />
      </div>
    </div>
  );
}

// ── Challenges Tab ───────────────────────────────────────────────────────────
function ChallengesTab() {
  const { challengeHistory } = useApp();
  if (challengeHistory.length === 0) return (
    <div className="text-center py-12 text-gray-600 text-sm">
      Noch keine Challenge abgeschlossen.<br />Starte auf dem Dashboard!
    </div>
  );

  const totalXp = challengeHistory.reduce((s, h) => s + (h.xp || 0), 0);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="card-dark rounded-xl p-3 text-center border border-gray-700/30">
          <div className="text-xl font-black text-white">{challengeHistory.length}</div>
          <div className="text-xs text-gray-500">Challenges gesamt</div>
        </div>
        <div className="card-dark rounded-xl p-3 text-center border border-amber-500/20">
          <div className="text-xl font-black text-neon-amber">{totalXp}</div>
          <div className="text-xs text-gray-500">XP verdient</div>
        </div>
      </div>
      {[...challengeHistory].reverse().map((h, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3 rounded-2xl card-dark border border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-lg">⚡</div>
            <div>
              <div className="text-sm font-semibold text-white">{h.title || 'Challenge'}</div>
              <div className="text-xs text-gray-500">{new Date(h.date).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
            </div>
          </div>
          <div className="text-xs font-bold text-neon-amber">+{h.xp} XP</div>
        </div>
      ))}
    </div>
  );
}

// ── Training Tab ─────────────────────────────────────────────────────────────
const QUALITY_COLOR = { schwach: 'text-neon-red', gut: 'text-neon-amber', stark: 'text-neon-green' };
const QUALITY_LABEL = { schwach: 'Schwach', gut: 'Gut', stark: 'Stark' };

function TrainingTab() {
  const { completedScenarios, completedAiSessions } = useApp();
  if (completedScenarios.length === 0 && completedAiSessions.length === 0) return (
    <div className="text-center py-12 text-gray-600 text-sm">
      Noch kein Training absolviert.<br />Starte dein erstes Szenario oder KI-Gespräch!
    </div>
  );

  const counts = { schwach: 0, gut: 0, stark: 0 };
  completedScenarios.forEach(s => { counts[s.quality] = (counts[s.quality] || 0) + 1; });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {['schwach', 'gut', 'stark'].map(q => (
          <div key={q} className="card-dark rounded-xl p-3 text-center border border-gray-700/30">
            <div className={`text-xl font-black ${QUALITY_COLOR[q]}`}>{counts[q]}</div>
            <div className="text-xs text-gray-500">{QUALITY_LABEL[q]}</div>
          </div>
        ))}
      </div>

      {completedAiSessions.length > 0 && (
        <div className="card-dark rounded-2xl p-4 border border-emerald-500/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-lg">🤖</div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">KI-Gespräche</div>
            <div className="text-xs text-gray-500">Mit dem KI-Trainer geübt</div>
          </div>
          <div className="text-xl font-black text-neon-green">{completedAiSessions.length}</div>
        </div>
      )}
      {[...completedScenarios].reverse().map((s, i) => {
        const scenario = SCENARIOS.find(sc => sc.id === s.id);
        return (
          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-2xl card-dark border border-gray-700/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-lg">🎯</div>
              <div>
                <div className="text-sm font-semibold text-white">{scenario?.title || 'Szenario'}</div>
                <div className="text-xs text-gray-500">{new Date(s.date).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-bold ${QUALITY_COLOR[s.quality]}`}>{QUALITY_LABEL[s.quality]}</div>
              <div className="text-xs text-gray-500">+{s.xp} XP</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Lektionen Tab ────────────────────────────────────────────────────────────
function LessonsTab() {
  const { completedLessons } = useApp();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const total = LESSONS.filter(l => l.category === key).length;
          const done = LESSONS.filter(l => l.category === key && completedLessons.includes(l.id)).length;
          return (
            <div key={key} className="card-dark rounded-xl p-3 text-center border border-gray-700/30">
              <div className="text-lg mb-1">{cat.emoji}</div>
              <div className="text-lg font-bold text-white">{done}/{total}</div>
              <div className="text-xs text-gray-500">{cat.label}</div>
            </div>
          );
        })}
      </div>
      <div className="card-dark rounded-2xl p-4 border border-cyan-500/20 text-center">
        <div className="text-2xl font-black text-neon-cyan">{completedLessons.length} / {LESSONS.length}</div>
        <div className="text-xs text-gray-500 mt-1">Lektionen insgesamt gelesen</div>
      </div>
    </div>
  );
}

// ── Main Progress Page ───────────────────────────────────────────────────────
const TABS = [
  { id: 'cal',        label: 'Kalender',   icon: CalendarDays },
  { id: 'challenges', label: 'Challenges', icon: Zap },
  { id: 'training',   label: 'Training',   icon: Target },
  { id: 'lessons',    label: 'Lektionen',  icon: BookOpen },
];

export default function Progress() {
  const [tab, setTab] = useState('cal');

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} className="text-cyan-400" />
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Fortschritt</span>
        </div>
        <h1 className="text-2xl font-black text-white">Deine Entwicklung</h1>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all
              ${tab === t.id ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40' : 'text-gray-500 hover:text-gray-300'}`}>
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
          {tab === 'cal'        && <CalendarTab />}
          {tab === 'challenges' && <ChallengesTab />}
          {tab === 'training'   && <TrainingTab />}
          {tab === 'lessons'    && <LessonsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
