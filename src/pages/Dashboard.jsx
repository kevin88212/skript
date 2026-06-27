import { Link } from 'react-router-dom';
import { Eye, BookOpen, MessageCircle, Sparkles } from 'lucide-react';
import { getAuthName } from '../services/auth';
import { getDailyTip } from '../data/starters';

const CARDS = [
  {
    to: '/augenkontakt',
    icon: Eye,
    title: 'Augenkontakt-Trainer',
    desc: 'Geführte Intervall-Übung, um Blickkontakt schrittweise angenehmer zu machen.',
    color: 'rose',
  },
  {
    to: '/bibliothek',
    icon: BookOpen,
    title: 'Gesprächsstarter & Flirt-Tipps',
    desc: 'Eisbrecher, Komplimente, vertiefende Fragen und Körpersprache-Tipps zum Nachschlagen.',
    color: 'violet',
  },
  {
    to: '/uebungspartner',
    icon: MessageCircle,
    title: 'KI-Übungspartner',
    desc: 'Übe ein Gespräch in einem Szenario deiner Wahl und bekomm direktes Feedback.',
    color: 'amber',
  },
];

const COLOR_CLASSES = {
  rose: { border: 'border-rose-500/20 hover:border-rose-500/40', icon: 'text-rose-400' },
  violet: { border: 'border-violet-500/20 hover:border-violet-500/40', icon: 'text-violet-400' },
  amber: { border: 'border-amber-500/20 hover:border-amber-500/40', icon: 'text-amber-400' },
};

export default function Dashboard() {
  const name = getAuthName();
  const tip = getDailyTip();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={18} className="text-rose-400" />
          <span className="text-xs text-rose-400 uppercase tracking-widest font-medium">Willkommen zurück</span>
        </div>
        <h1 className="text-2xl font-black text-white">Hey {name} 👋</h1>
        <p className="text-sm text-gray-400 mt-1">Wähl ein Tool zum Üben.</p>
      </div>

      <div className="grid gap-3">
        {CARDS.map(({ to, icon: Icon, title, desc, color }) => (
          <Link
            key={to}
            to={to}
            className={`card-dark rounded-2xl p-5 border ${COLOR_CLASSES[color].border} transition-all flex items-start gap-4`}
          >
            <Icon size={24} className={`shrink-0 mt-0.5 ${COLOR_CLASSES[color].icon}`} />
            <div>
              <div className="font-bold text-white mb-1">{title}</div>
              <div className="text-xs text-gray-400">{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card-dark rounded-2xl p-5 border border-gray-700/30">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-2">💡 Tipp des Tages</h2>
        <p className="text-sm text-white mb-1">„{tip.text}"</p>
        <p className="text-xs text-gray-500">{tip.context} · {tip.category}</p>
      </div>
    </div>
  );
}
