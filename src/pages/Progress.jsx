import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Ruler, Camera, History, CalendarDays, Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── SVG Weight Chart ────────────────────────────────────────────────────────
function WeightChart({ data, goal }) {
  if (data.length === 0) return (
    <div className="h-32 flex items-center justify-center text-gray-600 text-sm">
      Noch keine Einträge – trag dein erstes Gewicht ein!
    </div>
  );

  const W = 300, H = 110, PX = 24, PY = 16;
  const weights = data.map(d => d.weight);
  const allVals = goal ? [...weights, goal] : weights;
  const minW = Math.min(...allVals) - 2;
  const maxW = Math.max(...allVals) + 2;
  const xs = i => PX + (data.length < 2 ? (W - PX * 2) / 2 : (i / (data.length - 1)) * (W - PX * 2));
  const ys = w => PY + ((maxW - w) / (maxW - minW)) * (H - PY * 2);
  const pathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xs(i).toFixed(1)} ${ys(d.weight).toFixed(1)}`).join(' ');
  const areaD = `${pathD} L ${xs(data.length - 1).toFixed(1)} ${H} L ${xs(0).toFixed(1)} ${H} Z`;
  const latest = data[data.length - 1];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: '110px' }}>
        <defs>
          <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0, 0.33, 0.66, 1].map(t => (
          <line key={t} x1={PX} y1={PY + t * (H - PY * 2)} x2={W - PX} y2={PY + t * (H - PY * 2)}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {/* Goal line */}
        {goal && ys(goal) > PY && ys(goal) < H - PY && (
          <>
            <line x1={PX} y1={ys(goal)} x2={W - PX} y2={ys(goal)}
              stroke="#22d3ee" strokeWidth="1" strokeDasharray="5,4" opacity="0.5" />
            <text x={W - PX + 2} y={ys(goal) + 4} fontSize="7" fill="#22d3ee" opacity="0.7">Ziel</text>
          </>
        )}
        {/* Area */}
        <path d={areaD} fill="url(#wg)" />
        {/* Line */}
        <path d={pathD} fill="none" stroke="url(#lg)" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {data.map((d, i) => (
          <circle key={i} cx={xs(i)} cy={ys(d.weight)} r="3.5"
            fill="#050508" stroke="#6366f1" strokeWidth="2" />
        ))}
        {/* Latest label */}
        {data.length > 0 && (
          <text x={xs(data.length - 1)} y={ys(latest.weight) - 8} textAnchor="middle"
            fontSize="9" fill="#22d3ee" fontWeight="bold">
            {latest.weight} kg
          </text>
        )}
      </svg>
      {data.length > 1 && (
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
          <span>{new Date(data[0].date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}</span>
          <span>{new Date(latest.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}</span>
        </div>
      )}
    </div>
  );
}

// ── Streak Calendar ──────────────────────────────────────────────────────────
function StreakCalendar({ workoutDates }) {
  const dateSet = new Set(workoutDates.map(d => new Date(d).toDateString()));
  const today = new Date();
  const days = Array.from({ length: 70 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (69 - i));
    return d;
  });
  const weeks = Array.from({ length: 10 }, (_, w) => days.slice(w * 7, w * 7 + 7));

  const months = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const m = week[0].getMonth();
    if (m !== lastMonth) { months.push({ wi, label: week[0].toLocaleDateString('de-DE', { month: 'short' }) }); lastMonth = m; }
  });

  return (
    <div>
      <div className="flex gap-1 mb-1 text-xs text-gray-600" style={{ paddingLeft: '0px' }}>
        {months.map(m => (
          <div key={m.wi} style={{ marginLeft: m.wi === 0 ? '0' : `${(m.wi) * 14}px`, position: m.wi === 0 ? 'relative' : 'absolute' }}>
          </div>
        ))}
      </div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 shrink-0">
            {week.map((day, di) => {
              const isFuture = day > today;
              const worked = dateSet.has(day.toDateString());
              return (
                <div key={di} className="w-3 h-3 rounded-sm"
                  style={{ background: isFuture ? 'rgba(255,255,255,0.02)' : worked ? '#34d399' : 'rgba(255,255,255,0.07)' }}
                  title={day.toLocaleDateString('de-DE')}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-gray-700 inline-block" /> Kein Training</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#34d399' }} /> Trainiert</span>
      </div>
    </div>
  );
}

// ── Weight Tab ───────────────────────────────────────────────────────────────
function WeightTab() {
  const { profile, weightHistory, logWeight } = useApp();
  const [showLog, setShowLog] = useState(false);
  const [input, setInput] = useState('');

  const handleLog = () => {
    const w = parseFloat(input.replace(',', '.'));
    if (isNaN(w) || w < 30 || w > 300) return;
    logWeight(w);
    setInput('');
    setShowLog(false);
  };

  const total = weightHistory.length > 1
    ? (weightHistory[weightHistory.length - 1].weight - weightHistory[0].weight).toFixed(1)
    : null;

  return (
    <div className="space-y-4">
      <div className="card-dark rounded-2xl p-4 border border-indigo-500/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Gewichtsverlauf</h3>
          <button onClick={() => setShowLog(v => !v)}
            className="flex items-center gap-1 text-xs text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-lg hover:bg-indigo-500/25 transition-colors">
            <Plus size={12} /> Eintragen
          </button>
        </div>
        <WeightChart data={weightHistory} goal={90} />
        {total !== null && (
          <div className={`mt-3 text-center text-sm font-semibold ${parseFloat(total) < 0 ? 'text-neon-green' : 'text-red-400'}`}>
            {parseFloat(total) < 0 ? '↓' : '↑'} {Math.abs(parseFloat(total))} kg seit Start
          </div>
        )}
      </div>

      <AnimatePresence>
        {showLog && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="card-dark rounded-2xl p-4 border border-cyan-500/20">
            <p className="text-sm text-gray-300 mb-3">Aktuelles Gewicht eingeben</p>
            <div className="flex gap-2">
              <input type="number" step="0.1" placeholder={`${profile.weight}`}
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLog()}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60"
              />
              <span className="flex items-center text-gray-500 text-sm">kg</span>
              <button onClick={handleLog}
                className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-semibold">
                ✓
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {weightHistory.length > 0 && (
        <div className="space-y-2">
          {[...weightHistory].reverse().slice(0, 8).map((e, i) => (
            <div key={i} className="flex justify-between items-center px-3 py-2 rounded-xl bg-white/3 text-sm">
              <span className="text-gray-400">{new Date(e.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
              <span className="font-bold text-white">{e.weight} kg</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Measurements Tab ─────────────────────────────────────────────────────────
function MeasurementsTab() {
  const { measurementHistory, logMeasurements } = useApp();
  const [form, setForm] = useState({ waist: '', chest: '', arms: '' });

  const handleLog = () => {
    const data = {};
    if (form.waist) data.waist = parseFloat(form.waist);
    if (form.chest) data.chest = parseFloat(form.chest);
    if (form.arms)  data.arms  = parseFloat(form.arms);
    if (!Object.keys(data).length) return;
    logMeasurements(data);
    setForm({ waist: '', chest: '', arms: '' });
  };

  const latest = measurementHistory[measurementHistory.length - 1];
  const fields = [
    { key: 'waist', label: 'Taille', emoji: '📏' },
    { key: 'chest', label: 'Brust',  emoji: '💪' },
    { key: 'arms',  label: 'Arme',   emoji: '🦾' },
  ];

  return (
    <div className="space-y-4">
      {latest && (
        <div className="grid grid-cols-3 gap-3">
          {fields.map(f => (
            <div key={f.key} className="card-dark rounded-2xl p-3 text-center border border-gray-700/30">
              <div className="text-lg mb-1">{f.emoji}</div>
              <div className="text-lg font-bold text-white">{latest[f.key] ?? '–'} <span className="text-xs text-gray-500">cm</span></div>
              <div className="text-xs text-gray-500">{f.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="card-dark rounded-2xl p-4 border border-indigo-500/20">
        <h3 className="text-sm font-semibold text-white mb-3">Neue Maße eintragen</h3>
        <div className="space-y-2">
          {fields.map(f => (
            <div key={f.key} className="flex items-center gap-3">
              <span className="text-sm text-gray-400 w-14">{f.label}</span>
              <input type="number" step="0.5" placeholder="cm"
                value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60"
              />
            </div>
          ))}
        </div>
        <button onClick={handleLog}
          className="mt-3 w-full py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-sm font-semibold hover:bg-indigo-500/30 transition-colors">
          Speichern
        </button>
      </div>

      {measurementHistory.length > 1 && (
        <div className="space-y-2">
          {[...measurementHistory].reverse().slice(0, 5).map((e, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/3 text-xs">
              <span className="text-gray-500">{new Date(e.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}</span>
              <div className="flex gap-4">
                {fields.map(f => e[f.key] != null && (
                  <span key={f.key} className="text-gray-300">{f.emoji} {e[f.key]} cm</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Photos Tab ───────────────────────────────────────────────────────────────
function PhotosTab() {
  const { progressPhotos, addPhoto, removePhoto } = useApp();
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const [label, setLabel] = useState('');
  const [preview, setPreview] = useState(null);
  const [compare, setCompare] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = () => {
    if (!preview) return;
    addPhoto(preview, label || new Date().toLocaleDateString('de-DE'));
    setPreview(null);
    setLabel('');
  };

  const toggleCompare = (id) => {
    setCompare(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]);
  };

  const comparePhotos = compare.map(id => progressPhotos.find(p => p.id === id)).filter(Boolean);

  return (
    <div className="space-y-4">
      {/* Upload */}
      <div className="card-dark rounded-2xl p-4 border border-indigo-500/20">
        <h3 className="text-sm font-semibold text-white mb-3">Fortschrittsfoto</h3>

        {/* Two buttons: camera + gallery */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => cameraRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 px-3 py-2.5 rounded-xl hover:bg-indigo-500/25 transition-colors">
            <Camera size={13} /> Kamera
          </button>
          <button onClick={() => galleryRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-2.5 rounded-xl hover:bg-cyan-500/20 transition-colors">
            🖼️ Galerie
          </button>
        </div>

        {/* Hidden inputs */}
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
        <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        {preview && (
          <div className="space-y-2">
            <img src={preview} alt="preview" className="w-full max-h-48 object-cover rounded-xl" />
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Bezeichnung (z.B. Woche 1)"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500/60" />
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex-1 py-2 rounded-xl bg-indigo-500 text-white text-sm font-semibold">Speichern</button>
              <button onClick={() => setPreview(null)} className="px-4 py-2 rounded-xl bg-gray-700 text-gray-300 text-sm">✕</button>
            </div>
          </div>
        )}
      </div>

      {/* Before/After comparison */}
      {comparePhotos.length === 2 && (
        <div className="card-dark rounded-2xl p-4 border border-cyan-500/20">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Vorher / Nachher</h3>
          <div className="grid grid-cols-2 gap-2">
            {comparePhotos.map(p => (
              <div key={p.id}>
                <img src={p.dataUrl} alt={p.label} className="w-full h-36 object-cover rounded-xl" />
                <p className="text-xs text-gray-500 text-center mt-1">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      {progressPhotos.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {[...progressPhotos].reverse().map(p => (
            <motion.div key={p.id} layout className="relative">
              <img src={p.dataUrl} alt={p.label} className={`w-full h-36 object-cover rounded-xl border-2 transition-all cursor-pointer
                ${compare.includes(p.id) ? 'border-cyan-400' : 'border-transparent'}`}
                onClick={() => toggleCompare(p.id)} />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl p-2">
                <p className="text-white text-xs font-semibold truncate">{p.label}</p>
              </div>
              <button onClick={() => removePhoto(p.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-gray-300 hover:text-red-400">
                <X size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-600 text-sm">
          Noch keine Fotos – Halte deinen Fortschritt fest!
        </div>
      )}
      {progressPhotos.length > 0 && (
        <p className="text-xs text-gray-600 text-center">Tippe 2 Fotos an für Vorher/Nachher-Vergleich</p>
      )}
    </div>
  );
}

// ── History Tab ──────────────────────────────────────────────────────────────
function HistoryTab() {
  const { workoutHistory } = useApp();
  if (workoutHistory.length === 0) return (
    <div className="text-center py-12 text-gray-600 text-sm">
      Noch keine Workouts abgeschlossen.<br />Starte dein erstes Training!
    </div>
  );

  const totalXp = workoutHistory.reduce((s, w) => s + (w.xp || 0), 0);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="card-dark rounded-xl p-3 text-center border border-gray-700/30">
          <div className="text-xl font-black text-white">{workoutHistory.length}</div>
          <div className="text-xs text-gray-500">Workouts gesamt</div>
        </div>
        <div className="card-dark rounded-xl p-3 text-center border border-amber-500/20">
          <div className="text-xl font-black text-neon-amber">{totalXp}</div>
          <div className="text-xs text-gray-500">XP verdient</div>
        </div>
      </div>
      {workoutHistory.map((w, i) => (
        <div key={w.id || i} className="flex items-center justify-between px-4 py-3 rounded-2xl card-dark border border-gray-700/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-lg">🏋️</div>
            <div>
              <div className="text-sm font-semibold text-white">{w.day || 'Workout'}</div>
              <div className="text-xs text-gray-500">
                {new Date(w.date).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-neon-amber">+{w.xp} XP</div>
        </div>
      ))}
    </div>
  );
}

// ── Streak Calendar Tab ──────────────────────────────────────────────────────
function CalendarTab() {
  const { workoutHistory } = useApp();
  const dates = workoutHistory.map(w => w.date);
  const total = workoutHistory.length;
  const thisMonth = workoutHistory.filter(w => {
    const d = new Date(w.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="card-dark rounded-xl p-3 text-center border border-green-500/20">
          <div className="text-xl font-black" style={{ color: '#34d399' }}>{thisMonth}</div>
          <div className="text-xs text-gray-500">Trainings diesen Monat</div>
        </div>
        <div className="card-dark rounded-xl p-3 text-center border border-gray-700/30">
          <div className="text-xl font-black text-white">{total}</div>
          <div className="text-xs text-gray-500">Trainings gesamt</div>
        </div>
      </div>
      <div className="card-dark rounded-2xl p-4 border border-gray-700/30">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Letzte 70 Tage</h3>
        <StreakCalendar workoutDates={dates} />
      </div>
    </div>
  );
}

// ── Main Progress Page ───────────────────────────────────────────────────────
const TABS = [
  { id: 'weight',  label: 'Gewicht',  icon: TrendingDown },
  { id: 'body',    label: 'Maße',     icon: Ruler },
  { id: 'photos',  label: 'Fotos',    icon: Camera },
  { id: 'history', label: 'Verlauf',  icon: History },
  { id: 'cal',     label: 'Kalender', icon: CalendarDays },
];

export default function Progress() {
  const [tab, setTab] = useState('weight');

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-2xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown size={18} className="text-cyan-400" />
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Fortschritt</span>
        </div>
        <h1 className="text-2xl font-black text-white">Deine Entwicklung</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all
              ${tab === t.id ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/40' : 'text-gray-500 hover:text-gray-300'}`}>
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}>
          {tab === 'weight'  && <WeightTab />}
          {tab === 'body'    && <MeasurementsTab />}
          {tab === 'photos'  && <PhotosTab />}
          {tab === 'history' && <HistoryTab />}
          {tab === 'cal'     && <CalendarTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
