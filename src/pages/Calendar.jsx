import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalIcon, Lock, CheckCircle, AlertCircle, RefreshCw, LogOut, ExternalLink, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getClientId, saveClientId, isTokenValid, startOAuthFlow,
  fetchCalendarEvents, clearToken,
} from '../services/googleCalendar';

const DAYS_DE = ['So','Mo','Di','Mi','Do','Fr','Sa'];
const MONTHS_DE = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

// ── Kalender-Grid ─────────────────────────────────────────────────────────────
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
            <div key={i} className={`aspect-square flex items-center justify-center rounded-lg text-xs relative
              ${!day ? '' : isToday
                ? 'bg-indigo-500 text-white font-bold glow-indigo'
                : hasGym
                ? 'bg-green-500/20 text-neon-green border border-green-500/30'
                : 'text-gray-400 hover:bg-white/5'}`}>
              {day}
              {hasGym && !isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-400" />
              )}
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

// ── Client-ID Setup Modal ─────────────────────────────────────────────────────
function SetupModal({ onClose, onSave }) {
  const [clientId, setClientId] = useState(getClientId());

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="card-dark rounded-2xl w-full max-w-lg p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">Google Client-ID einrichten</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>

        {/* Schritt-für-Schritt */}
        <div className="space-y-3 text-sm">
          {[
            { n: 1, text: 'Öffne', link: 'https://console.cloud.google.com', label: 'Google Cloud Console' },
            { n: 2, text: 'Neues Projekt erstellen (z.B. „FitQuest")' },
            { n: 3, text: 'APIs & Dienste → Bibliothek → „Google Calendar API" aktivieren' },
            { n: 4, text: 'APIs & Dienste → Anmeldedaten → + Anmeldedaten erstellen → OAuth-Client-ID' },
            { n: 5, text: 'Typ: „Webanwendung" • Autorisierte Redirect-URIs:' },
          ].map(({ n, text, link, label }) => (
            <div key={n} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-500/25 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                {n}
              </span>
              <span className="text-gray-300">
                {text}{' '}
                {link && (
                  <a href={link} target="_blank" rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">
                    {label} <ExternalLink size={11} />
                  </a>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Redirect URI */}
        <div className="p-3 rounded-xl bg-gray-900 border border-gray-700 font-mono text-xs text-cyan-300 break-all select-all">
          {window.location.origin + window.location.pathname.replace(/\/$/, '')}
        </div>
        <p className="text-xs text-gray-500">
          Tippe auf die URL oben um sie zu kopieren, dann in Google Cloud einfügen.
        </p>

        {/* Client-ID Eingabe */}
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
            6. Deine Client-ID einfügen
          </label>
          <input
            className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700/60 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/70"
            placeholder="1234567890-abc...apps.googleusercontent.com"
            value={clientId}
            onChange={e => setClientId(e.target.value)}
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!clientId.trim()}
          onClick={() => { saveClientId(clientId); onSave(); onClose(); }}
          className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed glow-indigo"
        >
          Speichern & mit Google verbinden
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ── Haupt-Seite ───────────────────────────────────────────────────────────────
export default function Calendar() {
  const { setFocusModeActive, calendarEvents, setCalendarEvents } = useApp();
  const [connected, setConnected] = useState(isTokenValid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const events = await fetchCalendarEvents();
      setCalendarEvents(events);
      setConnected(true);
    } catch (e) {
      setError(e.message);
      if (e.message.includes('abgelaufen')) setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [setCalendarEvents]);

  // Beim ersten Laden: wenn Token vorhanden → Events holen
  useEffect(() => {
    if (isTokenValid()) loadEvents();
  }, [loadEvents]);

  const handleConnect = () => {
    if (!getClientId()) { setShowSetup(true); return; }
    startOAuthFlow();
  };

  const handleSetupSaved = () => {
    startOAuthFlow();
  };

  const handleDisconnect = () => {
    clearToken();
    setCalendarEvents([]);
    setConnected(false);
  };

  const todayGym = calendarEvents.find(
    e => e.isGym && e.date === new Date().toDateString()
  );

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalIcon size={18} className="text-cyan-400" />
            <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Kalender</span>
          </div>
          <h1 className="text-2xl font-black text-white">Training Planer</h1>
          <p className="text-gray-400 text-sm">Google Calendar erkennt Gym-Termine automatisch</p>
        </div>

        {connected && (
          <div className="flex gap-2">
            <button onClick={loadEvents} disabled={loading}
              className="p-2.5 rounded-xl card-dark border border-gray-700/50 text-gray-400 hover:text-white transition-colors">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={handleDisconnect}
              className="p-2.5 rounded-xl card-dark border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Status / Connect */}
      {!connected ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card-dark rounded-2xl p-5 border border-indigo-500/30 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <AlertCircle size={20} className="text-indigo-400" />
            </div>
            <div>
              <div className="font-bold text-white">Google Calendar verbinden</div>
              <div className="text-xs text-gray-400">Erkennt Gym-Termine und aktiviert Focus Mode</div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="p-3 rounded-xl bg-white/3 border border-gray-700/40 text-xs text-gray-300 space-y-1.5">
            <div className="font-semibold text-white mb-2">Was passiert nach der Verbindung:</div>
            <div>✓ App liest deinen Google Kalender</div>
            <div>✓ Erkennt Termine mit: Gym, Training, Workout, Sport, Fitness ...</div>
            <div>✓ Zeigt die nächsten 14 Tage in der Kalenderansicht</div>
            <div>✓ Aktiviert Focus Mode wenn heute ein Gym-Tag ist</div>
          </div>

          <motion.button whileTap={{ scale: 0.97 }} onClick={handleConnect}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-gray-900 font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Mit Google verbinden
          </motion.button>

          {getClientId() && (
            <button onClick={() => setShowSetup(true)}
              className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors text-center">
              Client-ID ändern
            </button>
          )}
        </motion.div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/15 border border-green-500/30">
          <CheckCircle size={18} className="text-neon-green" />
          <div>
            <div className="text-sm font-semibold text-neon-green">Google Calendar verbunden</div>
            <div className="text-xs text-gray-400">{calendarEvents.length} Termine · nächste 14 Tage</div>
          </div>
        </div>
      )}

      {/* Heute Gym? */}
      <AnimatePresence>
        {todayGym && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card-dark rounded-2xl p-5 border border-indigo-500/40 glow-indigo"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs text-indigo-400 uppercase tracking-widest">Heute · {todayGym.time}</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">🏋️ Gym-Tag erkannt!</h2>
            <p className="text-gray-400 text-sm mb-4">
              „{todayGym.title}" steht in deinem Kalender. Bereit?
            </p>
            <button onClick={() => setFocusModeActive(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 text-white font-semibold glow-indigo"
            >
              <Lock size={16} /> Focus Mode aktivieren
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kalender-Grid */}
      {calendarEvents.length > 0 && <CalendarGrid events={calendarEvents} />}

      {/* Nächste Gym-Termine */}
      {calendarEvents.filter(e => e.isGym).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Nächste Trainings
          </h2>
          <div className="space-y-2">
            {calendarEvents
              .filter(e => e.isGym)
              .slice(0, 5)
              .map(event => {
                const isToday = event.date === new Date().toDateString();
                const d = new Date(event.date);
                return (
                  <div key={event.id}
                    className="card-dark rounded-xl p-3 flex items-center justify-between border border-green-500/15">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center text-lg">🏋️</div>
                      <div>
                        <div className="font-medium text-white text-sm">{event.title}</div>
                        <div className="text-xs text-gray-500">
                          {isToday ? 'Heute' : d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}
                          {' · '}{event.time}
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

      {/* Alle anderen Events (nicht Gym) */}
      {connected && calendarEvents.filter(e => !e.isGym).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Andere Termine
          </h2>
          <div className="space-y-2">
            {calendarEvents.filter(e => !e.isGym).slice(0, 3).map(event => {
              const d = new Date(event.date);
              return (
                <div key={event.id}
                  className="card-dark rounded-xl p-3 flex items-center gap-3 border border-gray-700/30">
                  <div className="w-10 h-10 rounded-xl bg-gray-700/30 flex items-center justify-center text-sm">📅</div>
                  <div>
                    <div className="font-medium text-gray-300 text-sm">{event.title}</div>
                    <div className="text-xs text-gray-500">
                      {d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })} · {event.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Setup Modal */}
      <AnimatePresence>
        {showSetup && (
          <SetupModal onClose={() => setShowSetup(false)} onSave={handleSetupSaved} />
        )}
      </AnimatePresence>
    </div>
  );
}
