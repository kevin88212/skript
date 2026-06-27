import { useState, useMemo } from 'react';
import { BookOpen, Search, Heart } from 'lucide-react';
import { CATEGORIES, STARTERS } from '../data/starters';
import { useApp } from '../context/AppContext';

export default function StarterLibrary() {
  const { favorites, toggleFavorite, isFavorite } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filtered = useMemo(() => {
    return STARTERS.filter(s => {
      if (category && s.category !== category) return false;
      if (onlyFavorites && !favorites.includes(s.id)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!s.text.toLowerCase().includes(q) && !s.context.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [query, category, onlyFavorites, favorites]);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={18} className="text-rose-400" />
          <span className="text-xs text-rose-400 uppercase tracking-widest font-medium">Bibliothek</span>
        </div>
        <h1 className="text-2xl font-black text-white">Gesprächsstarter & Flirt-Tipps</h1>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Suchen..."
          className="w-full bg-gray-800/80 border border-gray-700/60 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-rose-500/60"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setCategory(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            category === null ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'border-gray-700/60 text-gray-400'
          }`}
        >
          Alle
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              category === c ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'border-gray-700/60 text-gray-400'
            }`}
          >
            {c}
          </button>
        ))}
        <button
          onClick={() => setOnlyFavorites(v => !v)}
          className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            onlyFavorites ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'border-gray-700/60 text-gray-400'
          }`}
        >
          <Heart size={12} /> Favoriten
        </button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">Keine Treffer.</p>
        )}
        {filtered.map(s => (
          <div key={s.id} className="card-dark rounded-2xl p-4 border border-gray-700/30">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-violet-400 font-semibold">{s.category}</span>
                  <span className="text-[10px] text-gray-500">· {s.context}</span>
                </div>
                <p className="text-white text-sm leading-relaxed">„{s.text}"</p>
              </div>
              <button
                onClick={() => toggleFavorite(s.id)}
                className="shrink-0 text-gray-500 hover:text-rose-400 transition-colors"
              >
                <Heart size={18} fill={isFavorite(s.id) ? '#fb7185' : 'none'} className={isFavorite(s.id) ? 'text-rose-400' : ''} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">{s.why}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
