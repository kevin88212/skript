import { NavLink } from 'react-router-dom';
import { Home, Eye, BookOpen, MessageCircle, Settings } from 'lucide-react';
import { getAuthName } from '../services/auth';

const links = [
  { to: '/',              icon: Home,         label: 'Start'        },
  { to: '/augenkontakt',  icon: Eye,          label: 'Augenkontakt' },
  { to: '/bibliothek',    icon: BookOpen,     label: 'Bibliothek'   },
  { to: '/uebungspartner', icon: MessageCircle, label: 'Üben'       },
  { to: '/einstellungen', icon: Settings,     label: 'Einstellungen' },
];

export default function Navbar() {
  const name = getAuthName();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:static md:flex md:flex-col md:w-64 md:min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-screen sticky top-0 card-dark border-r border-rose-500/20 p-4">
        <div className="mb-8 text-center">
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-400 tracking-wider">
            FUNKE
          </div>
          <div className="text-xs text-gray-500 mt-1 tracking-widest uppercase">Charisma-Training</div>
        </div>

        <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center text-lg font-bold">
              {name[0]?.toUpperCase()}
            </div>
            <div className="text-sm font-bold text-white">{name}</div>
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                ${isActive ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 glow-rose' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`
              }>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto text-center text-xs text-gray-600 py-2">Funke</div>
      </div>

      {/* Mobile bottom bar */}
      <div className="md:hidden flex bg-gray-950/95 backdrop-blur-xl border-t border-rose-500/20 overflow-x-auto px-1 py-2 scrollbar-hide">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all duration-200 shrink-0 min-w-[60px]
              ${isActive ? 'text-rose-400' : 'text-gray-500'}`
            }>
            <Icon size={20} />
            <span className="text-[10px] leading-tight">{label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
