export const CHALLENGES = [
  { id: 1,  title: '100 Kniebeugen',      desc: 'Absolviere 100 Kniebeugen – aufgeteilt ist ok',         emoji: '🦵', xp: 75 },
  { id: 2,  title: '50 Liegestütze',       desc: 'Schaffe 50 Liegestütze in beliebig vielen Sätzen',      emoji: '💪', xp: 75 },
  { id: 3,  title: '30 Min Spaziergang',   desc: 'Geh heute mindestens 30 Minuten zu Fuß',                emoji: '🚶', xp: 60 },
  { id: 4,  title: '3 Liter Wasser',       desc: 'Trinke heute mindestens 3 Liter Wasser',                emoji: '💧', xp: 50 },
  { id: 5,  title: 'Kein Zucker',          desc: 'Verzichte heute komplett auf Süßigkeiten & Zucker',     emoji: '🚫', xp: 80 },
  { id: 6,  title: '20 Burpees',           desc: 'Führe heute 20 Burpees aus',                            emoji: '🔥', xp: 90 },
  { id: 7,  title: 'Dehnen 15 Min',        desc: 'Dehne dich heute mindestens 15 Minuten',                emoji: '🧘', xp: 40 },
  { id: 8,  title: '200 Crunches',         desc: 'Schaffe heute 200 Bauchübungen gesamt',                 emoji: '🏋️', xp: 70 },
  { id: 9,  title: 'Treppe statt Lift',    desc: 'Nutze heute ausschließlich Treppen',                    emoji: '🏃', xp: 45 },
  { id: 10, title: '10.000 Schritte',      desc: 'Erreiche heute 10.000 Schritte',                       emoji: '👟', xp: 65 },
  { id: 11, title: 'Kein Fast Food',       desc: 'Iss heute nichts aus dem Fast Food',                   emoji: '🥗', xp: 55 },
  { id: 12, title: '1 Min Plank',          desc: 'Halte heute mindestens 1 Minute Plank',                emoji: '🧱', xp: 60 },
  { id: 13, title: '30 Dips',              desc: 'Führe 30 Dips an Stuhl oder Bench aus',                emoji: '💺', xp: 70 },
  { id: 14, title: 'Protein-Tag',          desc: 'Esse heute mindestens 150g Protein',                   emoji: '🥩', xp: 55 },
  { id: 15, title: 'Früh aufstehen',       desc: 'Steh heute vor 7:00 Uhr auf',                         emoji: '🌅', xp: 50 },
  { id: 16, title: '50 Jumping Jacks',     desc: 'Mach heute 50 Jumping Jacks',                         emoji: '⚡', xp: 40 },
  { id: 17, title: 'Kalt duschen',         desc: 'Dusch heute 2 Minuten kalt für Recovery',              emoji: '🚿', xp: 45 },
  { id: 18, title: '15 Klimmzüge',         desc: 'Schaffe heute 15 Klimmzüge gesamt',                   emoji: '🏗️', xp: 85 },
  { id: 19, title: 'Kein Alkohol',         desc: 'Verzichte heute auf Alkohol',                         emoji: '🍃', xp: 50 },
  { id: 20, title: 'Meal Prep',            desc: 'Bereite deine Mahlzeiten für morgen vor',             emoji: '🍱', xp: 60 },
];

export function getTodayChallenge() {
  const todayStr = new Date().toDateString();
  try {
    const saved = JSON.parse(localStorage.getItem('fitness_daily_challenge'));
    if (saved?.date === todayStr) return saved;
  } catch {}
  const dayIndex = Math.floor(Date.now() / 86400000) % CHALLENGES.length;
  const challenge = { ...CHALLENGES[dayIndex], date: todayStr, done: false };
  localStorage.setItem('fitness_daily_challenge', JSON.stringify(challenge));
  return challenge;
}
