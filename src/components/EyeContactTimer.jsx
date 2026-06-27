import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, Camera, CameraOff } from 'lucide-react';

const ENCOURAGEMENTS = [
  'Stark gemacht – kurz verschnaufen.',
  'Genau richtig, weiter so.',
  'Du bleibst dran – das zählt.',
  'Gleich geht die nächste Runde los.',
];

export default function EyeContactTimer({ rounds, restSeconds = 5, onClose }) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [phase, setPhase] = useState('active'); // 'active' | 'rest' | 'done'
  const [remaining, setRemaining] = useState(rounds[0]);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (phase === 'done' || remaining <= 0) return;
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, phase]);

  useEffect(() => {
    if (remaining !== 0 || phase === 'done') return;
    const t = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(phase === 'active' ? [200] : [200, 80, 200]);
      if (phase === 'active') {
        const isLastRound = roundIndex === rounds.length - 1;
        if (isLastRound) {
          setPhase('done');
        } else {
          setPhase('rest');
          setRemaining(restSeconds);
        }
      } else if (phase === 'rest') {
        const nextIndex = roundIndex + 1;
        setRoundIndex(nextIndex);
        setPhase('active');
        setRemaining(rounds[nextIndex]);
      }
    }, 0);
    return () => clearTimeout(t);
  }, [remaining, phase, roundIndex, rounds, restSeconds]);

  useEffect(() => {
    if (!cameraOn) {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      return;
    }
    let cancelled = false;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraError(false);
      })
      .catch(() => setCameraError(true));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [cameraOn]);

  const duration = phase === 'active' ? rounds[roundIndex] : restSeconds;
  const pct = duration ? remaining / duration : 0;
  const R = 54;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - pct);
  const color = phase === 'active' ? '#fb7185' : '#a78bfa';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{ background: 'rgba(5,5,8,0.94)', backdropFilter: 'blur(20px)' }}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
        <X size={24} />
      </button>

      <button
        onClick={() => setCameraOn(c => !c)}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700/60"
      >
        {cameraOn ? <CameraOff size={14} /> : <Camera size={14} />}
        {cameraOn ? 'Kamera aus' : 'Mit Kamera üben'}
      </button>

      {phase !== 'done' && (
        <div className="flex items-center gap-2 mb-6">
          <Eye size={18} className="text-rose-400" />
          <span className="text-xs text-rose-400 uppercase tracking-widest font-semibold">
            Runde {roundIndex + 1} / {rounds.length} {phase === 'rest' && '· Pause'}
          </span>
        </div>
      )}

      {cameraOn && (
        <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 border-2 border-rose-500/40">
          {cameraError ? (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 text-center px-3">
              Kamera nicht verfügbar
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          )}
        </div>
      )}

      <div className="relative mb-8">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          {phase !== 'done' && (
            <circle
              cx="70" cy="70" r={R}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s', filter: `drop-shadow(0 0 10px ${color})` }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {phase === 'done' ? (
            <span className="text-3xl">✨</span>
          ) : (
            <>
              <span className="text-4xl font-black text-white">{remaining}</span>
              <span className="text-xs text-gray-500">{phase === 'rest' ? 'Pause' : 'Sekunden'}</span>
            </>
          )}
        </div>
      </div>

      {phase === 'done' ? (
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-xl font-bold text-rose-300 mb-2">Geschafft! 🎉</div>
          <p className="text-sm text-gray-400 mb-4 max-w-xs">
            {rounds.length} Runden Augenkontakt-Training abgeschlossen. Übung macht den Unterschied.
          </p>
          <button onClick={onClose} className="px-6 py-3 rounded-xl bg-rose-500 text-white font-bold">
            Fertig
          </button>
        </motion.div>
      ) : phase === 'rest' ? (
        <p className="text-sm text-gray-400 text-center max-w-xs">
          {ENCOURAGEMENTS[roundIndex % ENCOURAGEMENTS.length]}
        </p>
      ) : !cameraOn ? (
        <p className="text-sm text-gray-400 text-center max-w-xs">
          Stell dir vor, du schaust jemandem in die Augen – oder nutze einen Spiegel.
        </p>
      ) : null}

      {phase !== 'done' && (
        <button
          onClick={onClose}
          className="mt-6 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Abbrechen
        </button>
      )}
    </motion.div>
  );
}
