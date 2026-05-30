import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Trophy, Flame, Dumbbell, LogOut, Bell, Share2, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { lock } from '../services/auth';
import { requestNotificationPermission, isNotificationsGranted, scheduleWorkoutReminder } from '../services/notifications';

const ACHIEVEMENTS = [
  { id: 1, name: 'Erster Schritt', desc: 'App das erste Mal geöffnet', emoji: '👟', unlocked: true },
  { id: 2, name: 'Warrior Level 2', desc: 'Level 2 erreichen', emoji: '⚔️', unlocked: false },
  { id: 3, name: '3-Tage Streak', desc: '3 Tage in Folge trainieren', emoji: '🔥', unlocked: false },
  { id: 4, name: '5 Workouts', desc: '5 Workouts abschließen', emoji: '💪', unlocked: false },
  { id: 5, name: 'Küchenmeister', desc: 'Alle 3 Mahlzeiten angeklickt', emoji: '🍳', unlocked: false },
  { id: 6, name: 'Wissensdurst', desc: '10 Übungen in der DB angeschaut', emoji: '📚', unlocked: false },
];

const LEVEL_TITLES = [
  'Newcomer', 'Krieger', 'Kämpfer', 'Veteran', 'Held', 'Champion', 'Legende', 'Unsterblich'
];

export default function Profile({ onLock }) {
  const { profile, updateProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: profile.name, weight: profile.weight, height: profile.height, age: profile.age });
  const [notifGranted, setNotifGranted] = useState(isNotificationsGranted());
  const [reminderTime, setReminderTime] = useState(localStorage.getItem('notification_reminder_time') || '18:00');
  const [copied, setCopied] = useState(false);

  const bmi = (profile.weight / (profile.height / 100) ** 2).toFixed(1);
  const bmiCategory = bmi < 18.5 ? 'Untergewicht' : bmi < 25 ? 'Normalgewicht' : bmi < 30 ? 'Übergewicht' : 'Adipositas';
  const bmiColor = bmi < 18.5 ? '#22d3ee' : bmi < 25 ? '#34d399' : bmi < 30 ? '#fbbf24' : '#f87171';
  const xpPct = Math.round((profile.xp / profile.xpToNext) * 100);
  const title = LEVEL_TITLES[Math.min(profile.level - 1, LEVEL_TITLES.length - 1)];

  const save = () => {
    updateProfile({ name: form.name, weight: Number(form.weight), height: Number(form.height), age: Number(form.age) });
    setEditing(false);
  };

  const handleNotif = async () => {
    const granted = await requestNotificationPermission();
    setNotifGranted(granted);
    if (granted) scheduleWorkoutReminder(reminderTime);
  };

  const handleDuel = () => {
    const data = { name: profile.name, level: profile.level, workouts: profile.totalWorkouts, streak: profile.streak, weight: profile.weight };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}#duel=${encoded}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  const tdee = Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5);
  const deficit = tdee - 500;

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
            <div className="text-indigo-400 font-bold flex items-center gap-1"><Dumbbell size={14} /> {profile.totalWorkouts}</div>
            <div className="text-xs text-gray-500">Workouts</div>
          </div>
          <div className="text-center">
            <div className="text-neon-green font-bold flex items-center gap-1"><Trophy size={14} /> {ACHIEVEMENTS.filter(a => a.unlocked).length}</div>
            <div className="text-xs text-gray-500">Achievements</div>
          </div>
        </div>
      </div>

      {/* Body stats */}
      <div className="card-dark rounded-2xl p-5 border border-gray-700/30">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">Körperdaten</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Gewicht', key: 'weight', unit: 'kg', type: 'number' },
            { label: 'Größe', key: 'height', unit: 'cm', type: 'number' },
            { label: 'Alter', key: 'age', unit: 'Jahre', type: 'number' },
          ].map(({ label, key, unit }) => (
            <div key={key} className="bg-white/3 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              {editing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    className="bg-transparent text-lg font-bold text-white w-16 focus:outline-none border-b border-indigo-500/50"
                    value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                  <span className="text-xs text-gray-500">{unit}</span>
                </div>
              ) : (
                <div className="text-lg font-bold text-white">{profile[key]} <span className="text-xs text-gray-500">{unit}</span></div>
              )}
            </div>
          ))}

          <div className="bg-white/3 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">BMI</div>
            <div className="text-lg font-bold" style={{ color: bmiColor }}>{bmi}</div>
            <div className="text-xs" style={{ color: bmiColor }}>{bmiCategory}</div>
          </div>
        </div>
      </div>

      {/* Calorie calculator */}
      <div className="card-dark rounded-2xl p-5 border border-cyan-500/20">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-4">🔢 Kalorienrechner</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Grundumsatz (BMR)</span>
            <span className="text-white font-semibold">{Math.round(tdee * 0.72)} kcal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Gesamtumsatz (TDEE)</span>
            <span className="text-white font-semibold">{tdee} kcal</span>
          </div>
          <div className="h-px bg-gray-700 my-2" />
          <div className="flex justify-between">
            <span className="text-neon-cyan">Ziel (−500 kcal/Tag)</span>
            <span className="text-neon-cyan font-bold">{deficit} kcal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Gewichtsverlust/Woche</span>
            <span className="text-neon-green font-semibold">~0.5 kg</span>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-xl bg-indigo-500/10 text-xs text-indigo-200">
          💡 Bei 3× Training/Woche + {deficit} kcal täglich kannst du in 12 Monaten ~19 kg abnehmen.
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
                onChange={e => { setReminderTime(e.target.value); scheduleWorkoutReminder(e.target.value); }}
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500/60"
              />
            </div>
            <p className="text-xs text-neon-green">✓ Benachrichtigungen aktiv</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-400 mb-3">Aktiviere tägliche Erinnerungen damit du kein Training verpasst.</p>
            <button onClick={handleNotif}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-sm font-semibold hover:bg-indigo-500/30 transition-all">
              <Bell size={14} /> Benachrichtigungen aktivieren
            </button>
          </div>
        )}
      </div>

      {/* Friend Duel */}
      <div className="card-dark rounded-2xl p-5 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Share2 size={16} className="text-purple-400" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Freundes-Duell</h2>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Teile deinen Krieger-Link mit Freunden und vergleicht eure Stats!
        </p>
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 mb-3 space-y-1">
          <div className="flex justify-between"><span className="text-gray-400">Level</span><span className="font-bold">{profile.level}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Workouts</span><span className="font-bold">{profile.totalWorkouts}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Streak</span><span className="font-bold">{profile.streak} Tage</span></div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleDuel}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm font-semibold hover:bg-purple-500/30 transition-all">
          {copied ? <><Check size={14} /> Link kopiert!</> : <><Copy size={14} /> Link kopieren</>}
        </motion.button>
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
    </div>
  );
}
