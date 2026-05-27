import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Workout from './pages/Workout';
import Meals from './pages/Meals';
import Calendar from './pages/Calendar';
import Exercises from './pages/Exercises';
import Profile from './pages/Profile';
import FocusMode from './pages/FocusMode';

function AppShell() {
  const { focusModeActive } = useApp();

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
          <Route path="/profile"   element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}
