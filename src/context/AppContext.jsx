import { createContext, useContext, useState, useEffect } from 'react';
import { getTodayChallenge } from '../data/challenges';

const AppContext = createContext(null);

function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
}

const INITIAL_PROFILE = {
  name: 'Kevin', level: 1, xp: 0, xpToNext: 500, streak: 0, lastActivity: null,
};

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(() => loadLS('mut_profile', INITIAL_PROFILE));
  const [levelUpEvent, setLevelUpEvent] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState(() => getTodayChallenge());
  const [challengeHistory, setChallengeHistory] = useState(() => loadLS('mut_challenge_history', []));
  const [completedLessons, setCompletedLessons] = useState(() => loadLS('mut_completed_lessons', []));
  const [completedScenarios, setCompletedScenarios] = useState(() => loadLS('mut_completed_scenarios', []));
  const [completedAiSessions, setCompletedAiSessions] = useState(() => loadLS('mut_ai_sessions', []));
  const [activeScenario, setActiveScenario] = useState(null);

  useEffect(() => { saveLS('mut_profile', profile); }, [profile]);

  const gainXP = (amount) => {
    setProfile(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNext;
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel += 1;
        newXpToNext = Math.floor(newXpToNext * 1.3);
      }
      if (newLevel > prev.level) {
        setTimeout(() => setLevelUpEvent({ level: newLevel }), 100);
      }
      return { ...prev, xp: newXp, level: newLevel, xpToNext: newXpToNext };
    });
  };

  const updateProfile = (updates) => setProfile(prev => ({ ...prev, ...updates }));

  const bumpStreak = () => {
    setProfile(prev => {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let streak = prev.streak;
      if (prev.lastActivity === today) { /* already counted today */ }
      else if (prev.lastActivity === yesterday) streak += 1;
      else streak = 1;
      return { ...prev, streak, lastActivity: today };
    });
  };

  // ── Daily challenge ───────────────────────────────────────────────────────
  const completeChallenge = () => {
    if (dailyChallenge.done) return;
    gainXP(dailyChallenge.xp);
    const updated = { ...dailyChallenge, done: true };
    setDailyChallenge(updated);
    saveLS('mut_daily_challenge', updated);
    setChallengeHistory(prev => {
      const next = [...prev, { date: new Date().toDateString(), challengeId: dailyChallenge.id, title: dailyChallenge.title, xp: dailyChallenge.xp }];
      saveLS('mut_challenge_history', next);
      return next;
    });
    bumpStreak();
  };

  // ── Lektionen ─────────────────────────────────────────────────────────────
  const markLessonRead = (id) => {
    if (completedLessons.includes(id)) return;
    setCompletedLessons(prev => {
      const next = [...prev, id];
      saveLS('mut_completed_lessons', next);
      return next;
    });
    gainXP(15);
  };

  // ── Trainings-Szenarien ───────────────────────────────────────────────────
  const startScenario = (scenario) => setActiveScenario(scenario);
  const closeScenario = () => setActiveScenario(null);

  const completeScenario = (xp, quality, scenarioId) => {
    const alreadyDone = completedScenarios.some(s => s.id === scenarioId);
    if (!alreadyDone) gainXP(xp);
    setCompletedScenarios(prev => {
      const next = [...prev, { id: scenarioId, quality, xp: alreadyDone ? 0 : xp, date: new Date().toISOString() }];
      saveLS('mut_completed_scenarios', next);
      return next;
    });
  };

  // ── KI-Trainer ────────────────────────────────────────────────────────────
  const completeAiSession = ({ scenarioId, title, messages }) => {
    gainXP(50);
    setCompletedAiSessions(prev => {
      const next = [...prev, { scenarioId, title, messages, date: new Date().toISOString() }];
      saveLS('mut_ai_sessions', next);
      return next;
    });
    bumpStreak();
  };

  const resetAll = () => {
    const keys = [
      'mut_profile', 'mut_daily_challenge', 'mut_challenge_history',
      'mut_completed_lessons', 'mut_completed_scenarios', 'mut_ai_sessions',
      'notification_reminder_time',
    ];
    keys.forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  return (
    <AppContext.Provider value={{
      profile, updateProfile, gainXP,
      levelUpEvent, setLevelUpEvent,
      dailyChallenge, completeChallenge,
      challengeHistory,
      completedLessons, markLessonRead,
      completedScenarios, activeScenario, startScenario, closeScenario, completeScenario,
      completedAiSessions, completeAiSession,
      resetAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- context + hook live together by convention
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
