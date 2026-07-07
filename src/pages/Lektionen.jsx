import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Check, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, LESSONS, getLessonsByCategory } from '../data/lessons';

function LessonCard({ lesson, isRead, onRead }) {
  const [open, setOpen] = useState(false);
  const color = CATEGORIES[lesson.category].color;

  return (
    <motion.div layout className="card-dark rounded-2xl border overflow-hidden" style={{ borderColor: `${color}30` }}>
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center gap-3 p-4 text-left">
        <span className="text-2xl shrink-0">{lesson.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            {lesson.title}
            {isRead && <Check size={14} className="text-neon-green shrink-0" />}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{lesson.summary}</div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} className="shrink-0">
          <ChevronDown size={16} className="text-gray-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              <ul className="space-y-2">
                {lesson.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
                    <span className="shrink-0" style={{ color }}>●</span>
                    {tip}
                  </li>
                ))}
              </ul>
              {!isRead ? (
                <button
                  onClick={() => onRead(lesson.id)}
                  className="mt-2 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
                  style={{ background: `${color}20`, border: `1px solid ${color}50`, color }}
                >
                  Als gelesen markieren (+15 XP)
                </button>
              ) : (
                <span className="mt-2 inline-block text-xs text-neon-green font-semibold">✓ Gelesen</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Lektionen() {
  const { completedLessons, markLessonRead } = useApp();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const [filter, setFilter] = useState(CATEGORIES[initialCategory] ? initialCategory : 'alle');

  const lessons = filter === 'alle' ? LESSONS : getLessonsByCategory(filter);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-3xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={18} className="text-cyan-400" />
          <span className="text-xs text-cyan-400 uppercase tracking-widest font-medium">Lektionen</span>
        </div>
        <h1 className="text-2xl font-black text-white">Lernen &amp; Verstehen</h1>
        <p className="text-gray-400 text-sm mt-1">
          {completedLessons.length} / {LESSONS.length} gelesen
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilter('alle')}
          className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all
            ${filter === 'alle' ? 'bg-white/15 text-white border border-white/20' : 'text-gray-500 hover:text-gray-300 border border-transparent'}`}
        >
          Alle
        </button>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all border"
            style={filter === key
              ? { background: `${cat.color}25`, color: cat.color, borderColor: `${cat.color}50` }
              : { color: '#6b7280', borderColor: 'transparent' }}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isRead={completedLessons.includes(lesson.id)}
            onRead={markLessonRead}
          />
        ))}
      </div>
    </div>
  );
}
