import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalIcon, Lock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

const DAYS_DE = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONTHS_DE = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

// Demo calendar events
const DEMO_EVENTS = [
  { id: 1, date: new Date().toDateString(), title: 'Gym', isGym: true, time: '18:00' },
  { id: 2, date: new Date(Date.now() + 2 * 86400000).toDateString(), title: 'Gym', isGym: true, time: '07:00' },
  { id: 3, date: new Date(Date.now() + 4 * 86400000).toDateString(), title: 'Gym', isGym: true, time: '18:00' },
  { id: 4, date: new Date(Date.now() + 86400000).toDateString(), title: 'Meeting', isGym: false, time: '10:00' },
];

function CalendarGrid({ events }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const gymDays = new Set(
    events.filter(e => e.isGym).map(e => new Date(e.date).getDate())
  );

  return (
    <div className="card-dark rounded-2xl p-4 border border-indigo-500/20">
      <div className="text-center font-bold text-white mb-4">
        {MONTHS_DE[month]} {year}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_DE.map(d => (
          <div key={d} className="text-center text-xs text-gray-500 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const isToday = day === today.getDate();
          const hasGym = day && gymDays.has(day);
          return (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs relative
                ${!day ? '' : isToday
                  ? 'bg-indigo-500 text-white font-bold glow-indigo'
                  : hasGym
                  ? 'bg-green-500/20 text-neon-green border border-green-500/30'
                  : 'text-gray-400 hover:bg-white/5'
                }`}
            >
              {day}
              {hasGym && !isToday && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-400" />}
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3 text-xs text-gray-500 justify-center">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-500 inline-block" /> Heute</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500/50 inline-block" /> Gym</span>
      </div>
    </div>
  );
}

export default function Calendar() {
  const { googleConnected, setGoogleConnected, setFocusModeActive, calendarEvents, setCalendarEvents } = useApp();
  const [demoMode, setDemoMode] = useState(false);

  const events = demoMode ? DEMO_EVENTS : calendarEvents;
  const todayGym = events.find(e => e.isGym && e.date === new Date().toDateString());

  const connectDemo = () => {
    setDemoMode(true);
    setCalendarEvents(DEMO_EVENTS);
  };

  const connectGoogle = () => {
    // In a real app this would trigger Google OAuth
    // For now we show a guide
    alert('Google Calendar Integration:\n\n1. Gehe zu Google Cloud Console\n2. Erstelle ein Projekt\n3. Aktiviere Calendar API\n4. Erstelle OAuth 2.0 Credentials\n5. Trage die Client-ID in die App-Einstellungen ein\n\nFür Demo: Nutze den Demo-Modus!');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CalIcon size={18} className="text-cyan-400" />
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Kalender</span>
        </div>
        <h1 className="text-2xl font-black text-white">Training Planer</h1>
        <p className="text-gray-400 text-sm">Google Calendar erkennt Gym-Termine automatisch</p>
      </div>

      {/* Connection Status */}
      {!demoMode && !googleConnected ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-dark rounded-2xl p-5 border border-indigo-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-400" />
            </div>
            <div>
              <div className="font-bold text-white">Google Calendar nicht verbunden</div>
              <div className="text-xs text-gray-400">Verbinde deinen Kalender für automatische Gym-Erkennung</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/3 border border-gray-700/50 text-xs text-gray-300 space-y-1">
              <div className="font-semibold text-white mb-2">So funktioniert die Integration:</div>
              <div>✓ App liest deine Kalender-Ereignisse</div>
              <div>✓ Erkennt Termine mit "Gym", "Training", "Sport"</div>
              <div>✓ Aktiviert automatisch den Focus Mode</div>
              <div>✓ Benachrichtigt dich vor dem Training</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={connectGoogle}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                <ExternalLink size={14} />
                Google verbinden
              </button>
              <button
                onClick={connectDemo}
                className="flex-1 py-3 rounded-xl border border-indigo-500/40 text-indigo-300 font-semibold text-sm hover:bg-indigo-500/10 transition-colors"
              >
                Demo-Modus
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30">
          <CheckCircle size={18} className="text-neon-green" />
          <div>
            <div className="text-sm font-semibold text-neon-green">
              {demoMode ? 'Demo-Modus aktiv' : 'Google Calendar verbunden'}
            </div>
            <div className="text-xs text-gray-400">{events.length} Termine geladen</div>
          </div>
        </div>
      )}

      {/* Today's gym alert */}
      {todayGym && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-dark rounded-2xl p-5 border border-indigo-500/40 glow-indigo"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs text-indigo-400 uppercase tracking-widest">Heute · {todayGym.time} Uhr</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">🏋️ Gym-Tag erkannt!</h2>
          <p className="text-gray-400 text-sm mb-4">
            Dein Kalender zeigt ein Gym-Training für heute. Bereit?
          </p>
          <button
            onClick={() => setFocusModeActive(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 text-white font-semibold glow-indigo"
          >
            <Lock size={16} /> Focus Mode aktivieren
          </button>
        </motion.div>
      )}

      {/* Calendar grid */}
      <CalendarGrid events={events} />

      {/* Upcoming events */}
      {events.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Nächste Trainings</h2>
          <div className="space-y-2">
            {events
              .filter(e => e.isGym)
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 4)
              .map(event => {
                const d = new Date(event.date);
                const isToday = event.date === new Date().toDateString();
                return (
                  <div key={event.id} className="card-dark rounded-xl p-3 flex items-center justify-between border border-green-500/15">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center text-lg">
                        🏋️
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{event.title}</div>
                        <div className="text-xs text-gray-500">
                          {isToday ? 'Heute' : d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })} · {event.time}
                        </div>
                      </div>
                    </div>
                    {isToday && (
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Heute
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="card-dark rounded-2xl p-4 border border-gray-700/30">
        <h3 className="text-sm font-semibold text-white mb-3">🔧 Wie die Gym-Erkennung funktioniert</h3>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex gap-2">
            <span className="text-indigo-400">1.</span>
            <span>App scannt täglich um 06:00 Uhr deinen Google Kalender</span>
          </div>
          <div className="flex gap-2">
            <span className="text-indigo-400">2.</span>
            <span>Ereignisse mit "Gym", "Training", "Workout", "Sport" werden erkannt</span>
          </div>
          <div className="flex gap-2">
            <span className="text-indigo-400">3.</span>
            <span>1 Stunde vor dem Training: Push-Benachrichtigung + Focus Mode Angebot</span>
          </div>
          <div className="flex gap-2">
            <span className="text-indigo-400">4.</span>
            <span>Focus Mode blockiert Social Media bis Training bestätigt ist</span>
          </div>
        </div>
      </div>
    </div>
  );
}
