import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Send, RotateCcw, Settings as SettingsIcon } from 'lucide-react';
import { SCENARIOS, buildSystemPrompt, sendChatMessage, getApiKey, getModel } from '../services/claudeApi';

function splitCoachTip(text) {
  const idx = text.indexOf('🧭');
  if (idx === -1) return { reply: text, tip: null };
  return { reply: text.slice(0, idx).trim(), tip: text.slice(idx).trim() };
}

export default function ChatPractice() {
  const [scenario, setScenario] = useState(null);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', reply, tip }
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);
  const apiKey = getApiKey();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const startScenario = (s) => {
    setScenario(s);
    setMessages([]);
    setError('');
  };

  const reset = () => {
    setScenario(null);
    setMessages([]);
    setError('');
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    setError('');

    const history = [...messages.map(m => ({ role: m.role, content: m.role === 'user' ? m.content : m.raw })), { role: 'user', content: userText }];
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    try {
      const raw = await sendChatMessage({
        apiKey,
        model: getModel(),
        systemPrompt: buildSystemPrompt(scenario),
        history,
      });
      const { reply, tip } = splitCoachTip(raw);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, tip, raw }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="p-4 md:p-6 max-w-2xl">
        <div className="card-dark rounded-2xl p-6 border border-rose-500/20 text-center">
          <MessageCircle size={28} className="text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">Kein API-Key hinterlegt</h2>
          <p className="text-sm text-gray-400 mb-4">
            Für den KI-Übungspartner brauchst du einen eigenen Anthropic-API-Key. Trag ihn in den Einstellungen ein.
          </p>
          <Link to="/einstellungen" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-semibold hover:bg-rose-500/30 transition-all">
            <SettingsIcon size={14} /> Zu den Einstellungen
          </Link>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="p-4 md:p-6 space-y-5 max-w-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle size={18} className="text-rose-400" />
            <span className="text-xs text-rose-400 uppercase tracking-widest font-medium">Übungspartner</span>
          </div>
          <h1 className="text-2xl font-black text-white">Szenario wählen</h1>
          <p className="text-sm text-gray-400 mt-1">Übe ein Gespräch – die KI reagiert realistisch und gibt dir nach jeder Nachricht einen Coach-Tipp.</p>
        </div>
        <div className="grid gap-3">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => startScenario(s)}
              className="card-dark rounded-2xl p-4 border border-rose-500/20 text-left hover:border-rose-500/40 transition-all"
            >
              <div className="font-bold text-white">{s.label}</div>
              <div className="text-xs text-gray-500 mt-1">mit {s.persona}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 flex flex-col h-[calc(100svh-2rem)] md:h-[calc(100svh-3rem)] max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-rose-400 uppercase tracking-widest font-medium">{scenario.label}</div>
          <h1 className="text-xl font-black text-white">Gespräch mit {scenario.persona}</h1>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700/60 text-gray-400 text-xs hover:text-white transition-all">
          <RotateCcw size={12} /> Neu
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pb-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${m.role === 'user' ? '' : 'space-y-1.5'}`}>
              <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                m.role === 'user' ? 'bg-rose-500/20 border border-rose-500/40 text-white' : 'card-dark border border-gray-700/40 text-gray-200'
              }`}>
                {m.content}
              </div>
              {m.tip && (
                <div className="rounded-xl px-3 py-2 text-xs bg-violet-500/10 border border-violet-500/25 text-violet-300">
                  {m.tip}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="card-dark border border-gray-700/40 rounded-2xl px-4 py-2.5 text-sm text-gray-500">…</div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Schreib etwas..."
          disabled={loading}
          className="flex-1 bg-gray-800/80 border border-gray-700/60 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-rose-500/60 disabled:opacity-50"
        />
        <motion.button whileTap={{ scale: 0.92 }} onClick={send} disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-rose-500 text-white disabled:opacity-40">
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
}
