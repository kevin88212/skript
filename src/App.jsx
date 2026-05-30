import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LevelUpModal from './components/LevelUpModal';
import BossFight from './components/BossFight';
import LoginScreen from './pages/LoginScreen';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Meals from './pages/Meals';
import Calendar from './pages/Calendar';
import Exercises from './pages/Exercises';
import Profile from './pages/Profile';
import Progress from './pages/Progress';
import FocusMode from './pages/FocusMode';
import { isSetup, isUnlocked } from './services/auth';

function AppShell({ onLock }) {
  const { focusModeActive, levelUpEvent, setLevelUpEvent, activeBoss, defeatBoss, setActiveBoss } = useApp();

  if (focusModeActive) return <FocusMode />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-6 overflow-y-auto">
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/workout"   element={<Workout />} />
          <Route path="/meals"     element={<Meals />} />
          <Route path="/calendar"  element={<Calendar />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/progress"  element={<Progress />} />
          <Route path="/profile"   element={<Profile onLock={onLock} />} />
        </Routes>
      </main>

      <AnimatePresence>
        {levelUpEvent && (
          <LevelUpModal level={levelUpEvent.level} onClose={() => setLevelUpEvent(null)} />
        )}
        {activeBoss && (
          <BossFight
            key={activeBoss.id}
            boss={activeBoss}
            onClose={() => { setActiveBoss(null); }}
            onVictory={(xp) => defeatBoss(xp)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => !isSetup() || isUnlocked());
  const handleLock = () => setAuthed(false);

  if (!authed) return <LoginScreen onAuthenticated={() => setAuthed(true)} />;

  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell onLock={handleLock} />
      </AppProvider>
    </BrowserRouter>
  );
}
