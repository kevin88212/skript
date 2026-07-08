import { NavLink } from 'react-router-dom';
import { Shield, BookOpen, Target, Bot, TrendingUp, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const links = [
  { to: '/',           icon: Shield,     label: 'Dashboard'   },
  { to: '/lektionen',  icon: BookOpen,   label: 'Lektionen'   },
  { to: '/training',   icon: Target,     label: 'Training'    },
  { to: '/ki',         icon: Bot,        label: 'KI-Trainer'  },
  { to: '/progress',   icon: TrendingUp, label: 'Fortschritt' },
  { to: '/profile',    icon: User,       label: 'Profil'      },
];

export default function Navbar() {
  const { profile, completedScenarios } = useApp();
  const xpPct = Math.round((profile.xp / profile.xpToNext) * 100);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:static md:flex md:flex-col md:w-64 md:min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-screen sticky top-0 card-dark border-r border-indigo-500/20 p-4">
        <div className="mb-8 text-center">
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-wider">
            MUT
          </div>
          <div className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Mehr Mut. Jeden Tag.</div>
        </div>

        <div className="mb-6 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold">
              {profile.name[0]}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{profile.name}</div>
              <div className="text-xs text-neon-amber">⭐ Level {profile.level}</div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mb-1 flex justify-between">
            <span>XP</span>
            <span>{profile.xp} / {profile.xpToNext}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full xp-bar rounded-full transition-all duration-500" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="flex gap-3 mt-2 text-xs text-gray-400">
            <span>🔥 {profile.streak} Streak</span>
            <span>🎯 {completedScenarios.length} Trainings</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                ${isActive ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 glow-indigo' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`
              }>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto text-center text-xs text-gray-600 py-2">v1.0 · Mut</div>
      </div>

      {/* Mobile bottom bar */}
      <div className="md:hidden flex bg-gray-950/95 backdrop-blur-xl border-t border-indigo-500/20 overflow-x-auto px-1 py-2 scrollbar-hide">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all duration-200 shrink-0 min-w-[52px]
              ${isActive ? 'text-indigo-400' : 'text-gray-500'}`
            }>
            <Icon size={20} />
            <span className="text-[10px] leading-tight">{label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
