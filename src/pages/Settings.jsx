import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, LogOut, Key, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { lock, getAuthName, setAuthName } from '../services/auth';
import { getApiKey, setApiKey, getModel, setModel } from '../services/claudeApi';

const MODELS = [
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5 – schnell & günstig' },
  { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6 – höhere Qualität, teurer' },
];

export default function Settings({ onLock }) {
  const { resetAll } = useApp();
  const [name, setName] = useState(getAuthName());
  const [editingName, setEditingName] = useState(false);
  const [apiKey, setApiKeyInput] = useState(getApiKey());
  const [showKey, setShowKey] = useState(false);
  const [model, setModelInput] = useState(getModel());
  const [saved, setSaved] = useState(false);

  const saveName = () => {
    setAuthName(name.trim() || 'du');
    setEditingName(false);
  };

  const saveApiSettings = () => {
    setApiKey(apiKey.trim());
    setModel(model);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User size={18} className="text-rose-400" />
            <span className="text-xs text-rose-400 uppercase tracking-widest font-medium">Einstellungen</span>
          </div>
          <h1 className="text-2xl font-black text-white">Profil & Einstellungen</h1>
        </div>
        <button
          onClick={() => { lock(); onLock?.(); }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700/60 text-gray-400 text-sm hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
          title="App sperren"
        >
          <LogOut size={14} />
        </button>
      </div>

      {/* Name */}
      <div className="card-dark rounded-2xl p-5 border border-rose-500/20">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-3">Name</h2>
        {editingName ? (
          <div className="flex gap-2">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-rose-500/60"
            />
            <button onClick={saveName} className="px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300">
              <Save size={14} />
            </button>
          </div>
        ) : (
          <button onClick={() => setEditingName(true)} className="text-white text-lg font-bold hover:text-rose-300 transition-colors">
            {name} <span className="text-xs text-gray-500 font-normal">(bearbeiten)</span>
          </button>
        )}
      </div>

      {/* AI settings */}
      <div className="card-dark rounded-2xl p-5 border border-violet-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Key size={16} className="text-violet-400" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">KI-Übungspartner</h2>
        </div>
        <label className="text-xs text-gray-400 mb-1.5 block">Anthropic API-Key</label>
        <div className="flex gap-2 mb-3">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKeyInput(e.target.value)}
            placeholder="sk-ant-..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
          />
          <button onClick={() => setShowKey(v => !v)} className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-400">
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <label className="text-xs text-gray-400 mb-1.5 block">Modell</label>
        <select
          value={model}
          onChange={e => setModelInput(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-violet-500/60"
        >
          {MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>

        <motion.button whileTap={{ scale: 0.97 }} onClick={saveApiSettings}
          className="px-4 py-2 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-300 text-sm font-semibold hover:bg-violet-500/30 transition-all">
          {saved ? 'Gespeichert ✓' : 'Speichern'}
        </motion.button>

        <p className="text-xs text-gray-500 mt-3 flex gap-2">
          <ShieldAlert size={26} className="shrink-0 text-amber-400" />
          Dein API-Key wird nur lokal auf diesem Gerät gespeichert und bei jeder Nachricht direkt an Anthropic gesendet – nutze diese Funktion daher nur auf einem privaten Gerät. Du erhältst einen Key in deinem Anthropic-Console-Account; die Nutzung verursacht laufende Kosten gemäß deinem Anthropic-Plan.
        </p>
      </div>

      {/* Danger Zone */}
      <div className="card-dark rounded-2xl p-5 border border-red-500/20">
        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-widest mb-3">⚠️ Daten zurücksetzen</h2>
        <p className="text-xs text-gray-400 mb-4">
          Löscht Favoriten und den gespeicherten API-Key. Der PIN-Schutz bleibt erhalten. Diese Aktion kann <strong className="text-red-400">nicht</strong> rückgängig gemacht werden.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (window.confirm('Wirklich alle Daten zurücksetzen?')) {
              resetAll();
              setApiKeyInput('');
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all"
        >
          🔄 Zurücksetzen
        </motion.button>
      </div>
    </div>
  );
}
