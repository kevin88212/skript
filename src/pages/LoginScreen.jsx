import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, AlertTriangle } from 'lucide-react';
import { setupAuth, verifyPin, isSetup, unlock, resetAuth } from '../services/auth';

const PIN_LENGTH = 4;

function PinDots({ value, maxLen, shake }) {
  return (
    <motion.div
      animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="flex gap-3 justify-center my-6"
    >
      {Array.from({ length: maxLen }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-all duration-200 ${
            i < value.length
              ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]'
              : 'bg-gray-700 border border-gray-600'
          }`}
        />
      ))}
    </motion.div>
  );
}

function Numpad({ onPress, onDelete, disabled }) {
  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
      {keys.map((k, i) => {
        if (k === '') return <div key={i} />;
        const isDelete = k === '⌫';
        return (
          <motion.button
            key={k}
            whileTap={{ scale: 0.88 }}
            disabled={disabled}
            onClick={() => isDelete ? onDelete() : onPress(k)}
            className={`h-14 rounded-2xl text-xl font-bold transition-all
              ${isDelete
                ? 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400'
                : 'bg-gray-800/80 border border-gray-700/60 text-white hover:bg-indigo-500/20 hover:border-indigo-500/40'
              } disabled:opacity-40`}
          >
            {k}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ── Setup flow: choose name + PIN ──────────────────────────────────── */
function SetupFlow({ onDone }) {
  const [step, setStep] = useState('name'); // 'name' | 'pin' | 'confirm'
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { if (step === 'name') inputRef.current?.focus(); }, [step]);

  const handleNameNext = () => {
    if (name.trim().length < 2) { setError('Mindestens 2 Zeichen'); return; }
    setError('');
    setStep('pin');
  };

  const pressDigit = (d) => {
    if (step === 'pin' && pin.length < PIN_LENGTH) {
      const next = pin + d;
      setPin(next);
      if (next.length === PIN_LENGTH) setTimeout(() => setStep('confirm'), 200);
    } else if (step === 'confirm' && confirm.length < PIN_LENGTH) {
      const next = confirm + d;
      setConfirm(next);
      if (next.length === PIN_LENGTH) {
        if (next === pin) {
          setupAuth(name.trim(), pin).then(onDone);
        } else {
          setShake(true);
          setTimeout(() => { setShake(false); setConfirm(''); setError('PINs stimmen nicht überein'); }, 500);
        }
      }
    }
  };

  const pressDelete = () => {
    if (step === 'pin') setPin(p => p.slice(0, -1));
    else setConfirm(c => c.slice(0, -1));
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'name' && (
        <motion.div key="name" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="w-full flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Wie lautet dein Krieger-Name?</p>
          </div>
          <input
            ref={inputRef}
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleNameNext()}
            placeholder="z.B. Kevin"
            className="w-full max-w-xs text-center text-xl font-bold bg-transparent border-b-2 border-indigo-500/50 focus:border-indigo-400 text-white placeholder-gray-600 focus:outline-none py-2"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNameNext}
            className="mt-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all"
          >
            Weiter →
          </motion.button>
        </motion.div>
      )}

      {(step === 'pin' || step === 'confirm') && (
        <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="w-full flex flex-col items-center">
          <p className="text-gray-400 text-sm text-center">
            {step === 'pin' ? 'Wähle deinen 4-stelligen PIN' : 'PIN bestätigen'}
          </p>
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          <PinDots value={step === 'pin' ? pin : confirm} maxLen={PIN_LENGTH} shake={shake} />
          <Numpad onPress={pressDigit} onDelete={pressDelete} />
          {step === 'confirm' && (
            <button onClick={() => { setStep('pin'); setPin(''); setConfirm(''); setError(''); }} className="mt-4 text-xs text-gray-500 hover:text-gray-300 transition-colors">
              ← PIN neu eingeben
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Unlock flow: enter existing PIN ────────────────────────────────── */
function UnlockFlow({ onDone }) {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showReset, setShowReset] = useState(false);

  const pressDigit = (d) => {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + d;
    setPin(next);
    if (next.length === PIN_LENGTH) {
      verifyPin(next).then(ok => {
        if (ok) {
          unlock();
          onDone();
        } else {
          setShake(true);
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (newAttempts >= 3) setShowReset(true);
          setTimeout(() => { setShake(false); setPin(''); }, 500);
        }
      });
    }
  };

  const pressDelete = () => setPin(p => p.slice(0, -1));

  const handleReset = () => {
    if (window.confirm('Alle App-Daten zurücksetzen? Das kann nicht rückgängig gemacht werden.')) {
      resetAuth();
      window.location.reload();
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <p className="text-gray-400 text-sm">PIN eingeben</p>
      {attempts > 0 && attempts < 3 && (
        <p className="text-red-400 text-xs mt-1">Falscher PIN ({3 - attempts} Versuche verbleibend)</p>
      )}
      <PinDots value={pin} maxLen={PIN_LENGTH} shake={shake} />
      <Numpad onPress={pressDigit} onDelete={pressDelete} />

      <AnimatePresence>
        {showReset && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-center max-w-xs">
            <div className="flex items-center justify-center gap-2 text-red-400 mb-2 text-sm font-semibold">
              <AlertTriangle size={14} /> Zu viele Fehlversuche
            </div>
            <p className="text-xs text-gray-400 mb-3">Hast du deinen PIN vergessen?</p>
            <button
              onClick={handleReset}
              className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              App zurücksetzen
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main LoginScreen ────────────────────────────────────────────────── */
export default function LoginScreen({ onAuthenticated }) {
  const setup = isSetup();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: '#050508' }}
    >
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)' }} />

      {/* Logo / hero */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', boxShadow: '0 0 40px rgba(99,102,241,0.5)' }}
        >
          <Sword size={36} className="text-white" />
        </motion.div>
        <h1 className="text-4xl font-black text-white tracking-tight">FitQuest</h1>
        <p className="text-indigo-400 text-sm font-medium mt-1 uppercase tracking-widest">
          {setup ? 'Willkommen zurück, Krieger' : 'Dein Abenteuer beginnt'}
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="w-full max-w-sm rounded-3xl p-6 border"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderColor: 'rgba(99,102,241,0.25)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 60px rgba(99,102,241,0.1)',
        }}
      >
        {/* Step label */}
        <div className="flex items-center gap-2 mb-4 justify-center">
          <Shield size={14} className="text-indigo-400" />
          <span className="text-xs text-indigo-400 uppercase tracking-widest font-semibold">
            {setup ? 'Sicherheit' : 'Registrierung'}
          </span>
        </div>

        {setup
          ? <UnlockFlow onDone={onAuthenticated} />
          : <SetupFlow onDone={onAuthenticated} />
        }
      </motion.div>

      <p className="text-gray-700 text-xs mt-8 text-center max-w-xs">
        Dein PIN wird lokal verschlüsselt gespeichert – niemals im Klartext.
      </p>
    </div>
  );
}
