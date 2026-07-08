import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Zap, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/lessons';
import { AI_SCENARIOS } from '../data/aiScenarios';
import { hasAiKey, sendChat } from '../services/ai';
import { offlineReply } from '../services/offlineCoach';

// ── Szenario-Auswahl ─────────────────────────────────────────────────────────
function ScenarioPicker({ onPick, aiActive }) {
  const navigate = useNavigate();
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-3xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bot size={18} className="text-emerald-400" />
          <span className="text-xs text-emerald-400 uppercase tracking-widest font-medium">KI-Trainer</span>
        </div>
        <h1 className="text-2xl font-black text-white">Übe im Gespräch</h1>
        <p className="text-gray-400 text-sm mt-1">
          Wähle eine Situation und trainiere ein echtes Gespräch – mit Feedback vom Coach.
        </p>
      </div>

      {/* Modus-Badge */}
      <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border text-xs
        ${aiActive ? 'border-green-500/30 bg-green-500/10 text-neon-green' : 'border-amber-500/30 bg-amber-500/10 text-neon-amber'}`}>
        {aiActive ? <Sparkles size={14} /> : <Zap size={14} />}
        {aiActive ? (
          <span><strong>KI-Modus aktiv</strong> – echte, freie Gespräche über Gemini.</span>
        ) : (
          <span className="flex-1">
            <strong>Offline-Coach</strong> – läuft kostenlos ohne Schlüssel. Für echte KI einen
            {' '}
            <button onClick={() => navigate('/profile')} className="underline hover:text-amber-200">Gemini-Schlüssel im Profil</button>
            {' '}hinterlegen.
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {AI_SCENARIOS.map(scenario => {
          const color = CATEGORIES[scenario.category]?.color ?? '#34d399';
          return (
            <motion.button
              key={scenario.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPick(scenario)}
              className="card-dark rounded-2xl p-4 border text-left transition-all hover:opacity-90"
              style={{ borderColor: `${color}30` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{scenario.emoji}</span>
                <span className="text-xs font-semibold ml-auto" style={{ color }}>
                  {CATEGORIES[scenario.category]?.label}
                </span>
              </div>
              <div className="text-sm font-semibold text-white">{scenario.title}</div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Chat-Blase ───────────────────────────────────────────────────────────────
function Bubble({ msg }) {
  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 bg-indigo-500/90 text-white text-sm">
          {msg.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 card-dark border border-gray-700/40 text-sm text-gray-100">
        {msg.text}
      </div>
      {msg.tip && (
        <div className="max-w-[85%] flex items-start gap-2 rounded-xl px-3 py-2 bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
          <span className="shrink-0">💡</span>
          <span><span className="font-semibold">Coach:</span> {msg.tip}</span>
        </div>
      )}
    </div>
  );
}

// ── Chat-Ansicht ─────────────────────────────────────────────────────────────
function Chat({ scenario, onExit }) {
  const { completeAiSession } = useApp();
  const aiActive = hasAiKey();
  const color = CATEGORIES[scenario.category]?.color ?? '#34d399';

  const [messages, setMessages] = useState([{ role: 'ai', text: scenario.opening, tip: '' }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  const userTurns = messages.filter(m => m.role === 'user').length;

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setError('');
    const nextMessages = [...messages, { role: 'user', text }];
    setMessages(nextMessages);
    setInput('');
    setBusy(true);

    // Verlauf ohne Coach-Tipps für die KI
    const history = nextMessages.map(m => ({ role: m.role, text: m.text }));

    try {
      let result;
      if (aiActive) {
        result = await sendChat({ scenario, history });
      } else {
        // kurze künstliche Verzögerung für natürlicheres Gefühl
        await new Promise(r => setTimeout(r, 500));
        result = offlineReply(scenario, history, text);
      }
      setMessages(prev => [...prev, { role: 'ai', text: result.reply, tip: result.tip }]);
    } catch (e) {
      setError(e.message || 'Etwas ist schiefgelaufen.');
    } finally {
      setBusy(false);
    }
  };

  const endSession = () => {
    if (userTurns > 0 && !finished) {
      completeAiSession({ scenarioId: scenario.id, title: scenario.title, messages: userTurns });
    }
    setFinished(true);
  };

  return (
    <div className="flex flex-col h-[calc(100svh-1px)] md:h-screen max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800 shrink-0">
        <button onClick={onExit} className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></button>
        <span className="text-xl">{scenario.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate">{scenario.title}</div>
          <div className="text-xs flex items-center gap-1" style={{ color }}>
            {aiActive ? <><Sparkles size={11} /> KI-Modus</> : <><Zap size={11} /> Offline-Coach</>}
          </div>
        </div>
        <button
          onClick={endSession}
          disabled={userTurns === 0}
          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold hover:bg-emerald-500/30 transition-all disabled:opacity-40"
        >
          Beenden
        </button>
      </div>

      {/* Nachrichten */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => <Bubble key={i} msg={m} />)}
        {busy && (
          <div className="flex items-center gap-1.5 text-gray-500 text-sm pl-1">
            <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.15s' }} />
            <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
            <span className="ml-1 text-xs">tippt…</span>
          </div>
        )}
        {error && (
          <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {/* Eingabe */}
      <div className="p-3 border-t border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            disabled={busy}
            placeholder="Deine Antwort…"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/60 disabled:opacity-50"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={send}
            disabled={busy || !input.trim()}
            className="w-11 h-11 shrink-0 rounded-2xl bg-indigo-500 text-white flex items-center justify-center disabled:opacity-40"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>

      {/* Abschluss-Overlay */}
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6"
            style={{ background: 'rgba(5,5,8,0.96)' }}
          >
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 1 }} className="mb-4">
              <Sparkles size={64} style={{ color }} />
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-2">Stark geübt!</h2>
            <p className="text-gray-400 mb-2 text-center">Du hast das Gespräch „{scenario.title}" trainiert.</p>
            {userTurns > 0 && <div className="text-2xl font-black text-neon-amber mb-6">+50 XP</div>}
            <button
              onClick={onExit}
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg"
              style={{ background: `linear-gradient(135deg, ${color}, #22d3ee)`, boxShadow: `0 0 30px ${color}60` }}
            >
              Weiter so! 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function KITrainer() {
  const [scenario, setScenario] = useState(null);
  const aiActive = hasAiKey();

  if (scenario) {
    return <Chat scenario={scenario} onExit={() => setScenario(null)} />;
  }
  return <ScenarioPicker onPick={setScenario} aiActive={aiActive} />;
}
