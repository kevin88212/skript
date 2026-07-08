import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Trophy, Flame, Target, LogOut, Bell, Bot, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { lock } from '../services/auth';
import { requestNotificationPermission, isNotificationsGranted, scheduleChallengeReminder } from '../services/notifications';
import { getAiKey, setAiKey } from '../services/ai';

const LEVEL_TITLES = [
  'Anfänger', 'Mutig', 'Selbstsicher', 'Furchtlos', 'Charismatisch', 'Legende'
];

export default function Profile({ onLock }) {
  const { profile, updateProfile, resetAll, completedLessons, completedScenarios, completedAiSessions } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: profile.name });
  const [notifGranted, setNotifGranted] = useState(isNotificationsGranted());
  const [reminderTime, setReminderTime] = useState(localStorage.getItem('notification_reminder_time') || '18:00');
  const [keyInput, setKeyInput] = useState(getAiKey());
  const [keySaved, setKeySaved] = useState(false);

  const xpPct = Math.round((profile.xp / profile.xpToNext) * 100);
  const title = LEVEL_TITLES[Math.min(profile.level - 1, LEVEL_TITLES.length - 1)];

  const ACHIEVEMENTS = [
    { id: 1, name: 'Erster Schritt', desc: 'App zum ersten Mal geöffnet', emoji: '🚀', unlocked: true },
    { id: 2, name: 'Mutig', desc: '3 Tage Streak erreicht', emoji: '🔥', unlocked: profile.streak >= 3 },
    { id: 3, name: 'Bücherwurm', desc: '5 Lektionen gelesen', emoji: '📚', unlocked: completedLessons.length >= 5 },
    { id: 4, name: 'Geübt', desc: '5 Trainingsszenarien abgeschlossen', emoji: '🎯', unlocked: completedScenarios.length >= 5 },
    { id: 5, name: 'Schlagfertig', desc: 'Eine Antwort mit „stark" abgeschlossen', emoji: '⚡', unlocked: completedScenarios.some(s => s.quality === 'stark') },
    { id: 6, name: 'Gesprächsprofi', desc: 'Ein KI-Gespräch trainiert', emoji: '🤖', unlocked: completedAiSessions.length >= 1 },
    { id: 7, name: 'Level 5', desc: 'Level 5 erreichen', emoji: '🏆', unlocked: profile.level >= 5 },
  ];

  const save = () => {
    updateProfile({ name: form.name });
    setEditing(false);
  };

  const handleNotif = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
    if (granted) scheduleChallengeReminder(reminderTime);
  };

  const saveKey = () => {
    setAiKey(keyInput);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };
  const clearKey = () => {
    setAiKey('');
    setKeyInput('');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User size={18} className="text-indigo-400" />
            <span className="text-xs text-indigo-400 uppercase tracking-widest font-medium">Profil</span>
          </div>
          <h1 className="text-2xl font-black text-white">Dein Charakter</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => editing ? save() : setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-sm font-semibold hover:bg-indigo-500/30 transition-all"
          >
            {editing ? <><Save size={14} /> Speichern</> : '✏️ Bearbeiten'}
          </button>
          <button
            onClick={() => { lock(); onLock?.(); }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700/60 text-gray-400 text-sm hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
            title="App sperren"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Character card */}
      <div className="card-dark rounded-2xl p-6 border border-indigo-500/30 glow-indigo text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white mx-auto mb-3"
        >
          {profile.name[0].toUpperCase()}
        </motion.div>

        {editing ? (
          <input
            className="bg-transparent border-b border-indigo-500/50 text-center text-xl font-black text-white focus:outline-none mb-1 w-40"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
        ) : (
          <div className="text-xl font-black text-white">{profile.name}</div>
        )}

        <div className="text-neon-amber text-sm font-semibold mt-1">Level {profile.level} · {title}</div>

        {/* XP */}
        <div className="mt-3 mb-1 flex justify-between text-xs text-gray-500">
          <span>{profile.xp} XP</span>
          <span>{profile.xpToNext} XP</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full xp-bar rounded-full transition-all duration-500" style={{ width: `${xpPct}%` }} />
        </div>
        <div className="text-xs text-gray-500 mt-1">{profile.xpToNext - profile.xp} XP bis Level {profile.level + 1}</div>

        {/* Stats row */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div className="text-center">
            <div className="text-neon-amber font-bold flex items-center gap-1"><Flame size={14} /> {profile.streak}</div>
            <div className="text-xs text-gray-500">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold flex items-center gap-1"><Target size={14} /> {completedScenarios.length}</div>
            <div className="text-xs text-gray-500">Trainings</div>
          </div>
          <div className="text-center">
            <div className="text-neon-green font-bold flex items-center gap-1"><Trophy size={14} /> {ACHIEVEMENTS.filter(a => a.unlocked).length}</div>
            <div className="text-xs text-gray-500">Achievements</div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card-dark rounded-2xl p-5 border border-indigo-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-indigo-400" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Benachrichtigungen</h2>
        </div>
        {notifGranted ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-300 flex-1">Tägliche Erinnerung</label>
              <input type="time" value={reminderTime}
                onChange={e => { setReminderTime(e.target.value); scheduleChallengeReminder(e.target.value); }}
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500/60"
              />
            </div>
            <p className="text-xs text-neon-green">✓ Benachrichtigungen aktiv</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 mb-3">Aktiviere tägliche Erinnerungen, damit du keine Mut-Challenge verpasst.</p>
            <button onClick={handleNotif}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-sm font-semibold hover:bg-indigo-500/30 transition-all">
              <Bell size={14} /> Benachrichtigungen aktivieren
            </button>
          </div>
        )}
      </div>

      {/* KI-Einstellungen */}
      <div className="card-dark rounded-2xl p-5 border border-emerald-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Bot size={16} className="text-emerald-400" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">KI-Trainer</h2>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          Für echte, freie Gespräche mit dem KI-Trainer kannst du einen kostenlosen Google-Gemini-Schlüssel hinterlegen.
          Ohne Schlüssel läuft der Offline-Coach. Der Schlüssel wird <strong className="text-gray-300">nur lokal auf diesem Gerät</strong> gespeichert.
        </p>
        <div className="flex gap-2 mb-2">
          <input
            type="password"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            placeholder="Gemini API-Schlüssel"
            className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/60"
          />
          <button onClick={saveKey}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/30 transition-all flex items-center gap-1">
            {keySaved ? <><Check size={14} /> Ok</> : 'Speichern'}
          </button>
          {getAiKey() && (
            <button onClick={clearKey}
              className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700/60 text-gray-400 text-sm hover:text-red-400 hover:border-red-500/30 transition-all">
              Löschen
            </button>
          )}
        </div>
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer"
          className="text-xs text-emerald-400 hover:text-emerald-300 underline">
          Kostenlosen Schlüssel bei Google AI Studio holen →
        </a>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Trophy size={14} className="text-amber-400" /> Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map(ach => (
            <div
              key={ach.id}
              className={`card-dark rounded-xl p-3 border text-center transition-all
                ${ach.unlocked ? 'border-amber-500/30 bg-amber-500/5' : 'border-gray-700/30 opacity-40'}`}
            >
              <div className="text-2xl mb-1">{ach.emoji}</div>
              <div className={`text-xs font-semibold ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>
                {ach.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{ach.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card-dark rounded-2xl p-5 border border-red-500/20">
        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-widest mb-3">⚠️ Neu anfangen</h2>
        <p className="text-xs text-gray-400 mb-4">
          Setzt alle Challenges, Lektionen, Trainings, Streak und XP zurück.
          Der PIN-Schutz bleibt erhalten. Diese Aktion kann <strong className="text-red-400">nicht</strong> rückgängig gemacht werden.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (window.confirm('Wirklich alles zurücksetzen? Alle Daten gehen verloren!')) {
              resetAll();
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all"
        >
          🔄 App neu starten
        </motion.button>
      </div>
    </div>
  );
}
