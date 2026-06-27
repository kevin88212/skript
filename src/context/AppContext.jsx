import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* localStorage unavailable */ }
}

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => loadLS('funke_favorites', []));

  useEffect(() => { saveLS('funke_favorites', favorites); }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const isFavorite = (id) => favorites.includes(id);

  const resetAll = () => {
    localStorage.removeItem('funke_favorites');
    localStorage.removeItem('funke_api_key');
    localStorage.removeItem('funke_model');
    setFavorites([]);
  };

  return (
    <AppContext.Provider value={{ favorites, toggleFavorite, isFavorite, resetAll }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
