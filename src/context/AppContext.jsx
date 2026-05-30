import { createContext, useContext, useState, useEffect } from 'react';
import { getDailyMeals } from '../data/meals';

const AppContext = createContext(null);

const INITIAL_PROFILE = {
  name: 'Kevin',
  age: 24,
  weight: 109,
  height: 182,
  level: 1,
  xp: 0,
  xpToNext: 500,
  streak: 0,
  totalWorkouts: 0,
  completedExercises: [],
  lastWorkout: null,
};

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('fitness_profile');
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [dailyMeals, setDailyMeals] = useState(() => getDailyMeals());
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [levelUpEvent, setLevelUpEvent] = useState(null); // { level }
  const [completedWorkoutToday, setCompletedWorkoutToday] = useState(() => {
    const last = localStorage.getItem('last_workout_date');
    return last === new Date().toDateString();
  });

  useEffect(() => {
    localStorage.setItem('fitness_profile', JSON.stringify(profile));
  }, [profile]);

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
        // Kurz verzögern damit State-Update durch ist
        setTimeout(() => setLevelUpEvent({ level: newLevel }), 100);
      }
      return { ...prev, xp: newXp, level: newLevel, xpToNext: newXpToNext };
    });
  };

  const completeWorkout = () => {
    setCompletedWorkoutToday(true);
    setFocusModeActive(false);
    localStorage.setItem('last_workout_date', new Date().toDateString());
    gainXP(200);
    setProfile(prev => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
      lastWorkout: new Date().toISOString(),
      streak: prev.streak + 1,
    }));
  };

  const refreshMeals = () => setDailyMeals(getDailyMeals(Math.floor(Math.random() * 100)));

  const updateProfile = (updates) => setProfile(prev => ({ ...prev, ...updates }));

  return (
    <AppContext.Provider value={{
      profile, updateProfile, gainXP, completeWorkout,
      dailyMeals, refreshMeals,
      focusModeActive, setFocusModeActive,
      completedWorkoutToday,
      levelUpEvent, setLevelUpEvent,
      calendarEvents, setCalendarEvents,
      googleConnected, setGoogleConnected,
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
