import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LevelUpModal from './components/LevelUpModal';
import ScenarioTrainer from './components/ScenarioTrainer';
import LoginScreen from './pages/LoginScreen';
import Dashboard from './pages/Dashboard';
import Lektionen from './pages/Lektionen';
import Training from './pages/Training';
import KITrainer from './pages/KITrainer';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import { isSetup, isUnlocked } from './services/auth';

function AppShell({ onLock }) {
  const { levelUpEvent, setLevelUpEvent, activeScenario, closeScenario, completeScenario } = useApp();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-6 overflow-y-auto">
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/lektionen" element={<Lektionen />} />
          <Route path="/training"  element={<Training />} />
          <Route path="/ki"        element={<KITrainer />} />
          <Route path="/progress"  element={<Progress />} />
          <Route path="/profile"   element={<Profile onLock={onLock} />} />
        </Routes>
      </main>

      <AnimatePresence>
        {levelUpEvent && (
          <LevelUpModal level={levelUpEvent.level} onClose={() => setLevelUpEvent(null)} />
        )}
        {activeScenario && (
          <ScenarioTrainer
            key={activeScenario.id}
            scenario={activeScenario}
            onClose={closeScenario}
            onComplete={(xp, quality) => completeScenario(xp, quality, activeScenario.id)}
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
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
        <AppShell onLock={handleLock} />
      </AppProvider>
    </BrowserRouter>
  );
}
