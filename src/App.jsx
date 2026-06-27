import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import LoginScreen from './pages/LoginScreen';
import Dashboard from './pages/Dashboard';
import EyeContactTrainer from './pages/EyeContactTrainer';
import StarterLibrary from './pages/StarterLibrary';
import ChatPractice from './pages/ChatPractice';
import Settings from './pages/Settings';
import { isSetup, isUnlocked } from './services/auth';

function AppShell({ onLock }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-6 overflow-y-auto">
        <Routes>
          <Route path="/"              element={<Dashboard />} />
          <Route path="/augenkontakt"  element={<EyeContactTrainer />} />
          <Route path="/bibliothek"    element={<StarterLibrary />} />
          <Route path="/uebungspartner" element={<ChatPractice />} />
          <Route path="/einstellungen" element={<Settings onLock={onLock} />} />
        </Routes>
      </main>
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
