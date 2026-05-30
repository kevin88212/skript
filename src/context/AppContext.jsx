import { createContext, useContext, useState, useEffect } from 'react';
import { getDailyMeals } from '../data/meals';
import { getTodayChallenge } from '../data/challenges';

const AppContext = createContext(null);

function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const INITIAL_PROFILE = {
  name: 'Kevin', age: 24, weight: 109, height: 182,
  level: 1, xp: 0, xpToNext: 500, streak: 0, totalWorkouts: 0,
  completedExercises: [], lastWorkout: null,
};

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(() => loadLS('fitness_profile', INITIAL_PROFILE));
  const [dailyMeals, setDailyMeals] = useState(() => getDailyMeals());
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [levelUpEvent, setLevelUpEvent] = useState(null);
  const [completedWorkoutToday, setCompletedWorkoutToday] = useState(() => {
    return localStorage.getItem('last_workout_date') === new Date().toDateString();
  });

  // ── New feature state ─────────────────────────────────────────────────────
  const [weightHistory, setWeightHistory] = useState(() => loadLS('fitness_weight_history', []));
  const [measurementHistory, setMeasurementHistory] = useState(() => loadLS('fitness_measurements', []));
  const [workoutHistory, setWorkoutHistory] = useState(() => loadLS('fitness_workout_history', []));
  const [waterGlasses, setWaterGlasses] = useState(() => {
    const saved = loadLS('fitness_water', { date: '', count: 0 });
    return saved.date === new Date().toDateString() ? saved.count : 0;
  });
  const [dailyChallenge, setDailyChallenge] = useState(() => getTodayChallenge());
  const [progressPhotos, setProgressPhotos] = useState(() => loadLS('fitness_photos', []));
  const [activeBoss, setActiveBoss] = useState(() => loadLS('fitness_active_boss', null));
  const [customMeals, setCustomMeals] = useState(() => loadLS('fitness_custom_meals', []));

  useEffect(() => { saveLS('fitness_profile', profile); }, [profile]);

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

  const completeWorkout = (dayLabel = '') => {
    setCompletedWorkoutToday(true);
    setFocusModeActive(false);
    localStorage.setItem('last_workout_date', new Date().toDateString());
    gainXP(200);
    const entry = { id: Date.now(), date: new Date().toISOString(), day: dayLabel, xp: 200 };
    setWorkoutHistory(prev => {
      const next = [entry, ...prev].slice(0, 60);
      saveLS('fitness_workout_history', next);
      return next;
    });
    setProfile(prev => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
      lastWorkout: new Date().toISOString(),
      streak: prev.streak + 1,
    }));
  };

  const refreshMeals = () => setDailyMeals(getDailyMeals(Math.floor(Math.random() * 100)));
  const updateProfile = (updates) => setProfile(prev => ({ ...prev, ...updates }));

  // ── Weight logging ────────────────────────────────────────────────────────
  const logWeight = (weight) => {
    const entry = { date: new Date().toISOString(), weight };
    setWeightHistory(prev => {
      const next = [...prev, entry];
      saveLS('fitness_weight_history', next);
      return next;
    });
    updateProfile({ weight });
  };

  // ── Measurements logging ──────────────────────────────────────────────────
  const logMeasurements = (data) => {
    const entry = { date: new Date().toISOString(), ...data };
    setMeasurementHistory(prev => {
      const next = [...prev, entry];
      saveLS('fitness_measurements', next);
      return next;
    });
  };

  // ── Water tracking ────────────────────────────────────────────────────────
  const drinkWater = () => {
    const next = Math.min(waterGlasses + 1, 12);
    setWaterGlasses(next);
    saveLS('fitness_water', { date: new Date().toDateString(), count: next });
  };

  const resetWater = () => {
    setWaterGlasses(0);
    saveLS('fitness_water', { date: new Date().toDateString(), count: 0 });
  };

  // ── Daily challenge ───────────────────────────────────────────────────────
  const completeChallenge = () => {
    if (dailyChallenge.done) return;
    gainXP(dailyChallenge.xp);
    const updated = { ...dailyChallenge, done: true };
    setDailyChallenge(updated);
    saveLS('fitness_daily_challenge', updated);
  };

  // ── Progress photos ───────────────────────────────────────────────────────
  const addPhoto = (dataUrl, label = '') => {
    const photo = { id: Date.now(), date: new Date().toISOString(), dataUrl, label };
    setProgressPhotos(prev => {
      const next = [...prev, photo];
      saveLS('fitness_photos', next);
      return next;
    });
  };

  const removePhoto = (id) => {
    setProgressPhotos(prev => {
      const next = prev.filter(p => p.id !== id);
      saveLS('fitness_photos', next);
      return next;
    });
  };

  // ── Boss fight ────────────────────────────────────────────────────────────
  const startBoss = (boss) => {
    const state = { ...boss, currentHp: boss.maxHp, defeatedAttacks: [] };
    setActiveBoss(state);
    saveLS('fitness_active_boss', state);
  };

  const defeatBoss = (xp) => {
    gainXP(xp);
    setActiveBoss(null);
    saveLS('fitness_active_boss', null);
  };

  const closeBoss = () => {
    setActiveBoss(null);
    saveLS('fitness_active_boss', null);
  };

  // ── Custom meals ──────────────────────────────────────────────────────────
  const addCustomMeal = (meal) => {
    const entry = { ...meal, id: `custom_${Date.now()}`, isCustom: true };
    setCustomMeals(prev => {
      const next = [...prev, entry];
      saveLS('fitness_custom_meals', next);
      return next;
    });
  };

  const removeCustomMeal = (id) => {
    setCustomMeals(prev => {
      const next = prev.filter(m => m.id !== id);
      saveLS('fitness_custom_meals', next);
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      profile, updateProfile, gainXP, completeWorkout,
      dailyMeals, refreshMeals,
      focusModeActive, setFocusModeActive,
      completedWorkoutToday,
      levelUpEvent, setLevelUpEvent,
      calendarEvents, setCalendarEvents,
      googleConnected, setGoogleConnected,
      // New
      weightHistory, logWeight,
      measurementHistory, logMeasurements,
      workoutHistory,
      waterGlasses, drinkWater, resetWater,
      dailyChallenge, completeChallenge,
      progressPhotos, addPhoto, removePhoto,
      activeBoss, startBoss, defeatBoss, closeBoss,
      customMeals, addCustomMeal, removeCustomMeal,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
