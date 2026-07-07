export const CHALLENGES = [
  { id: 1,  title: 'Lächle 3 Fremde an',           desc: 'Lächle heute bewusst 3 fremde Menschen an – ganz ohne Grund.',                              emoji: '🙂', xp: 40 },
  { id: 2,  title: 'Frag nach der Uhrzeit',        desc: 'Frag jemanden nach der Uhrzeit, obwohl du dein Handy dabei hast.',                           emoji: '⏰', xp: 50 },
  { id: 3,  title: '3 Sekunden länger',            desc: 'Halte in einem Gespräch heute 3 Sekunden länger Augenkontakt als sonst.',                    emoji: '👀', xp: 45 },
  { id: 4,  title: 'Ehrliches Kompliment',         desc: 'Gib heute einer Person ein ehrliches, konkretes Kompliment.',                                emoji: '💬', xp: 45 },
  { id: 5,  title: 'Ohne Ähm bestellen',           desc: 'Bestelle im Café oder Restaurant heute, ohne ein einziges „ähm" zu benutzen.',                emoji: '☕', xp: 55 },
  { id: 6,  title: 'Erste Meinung',                desc: 'Sprich in einer Gruppe heute als Erstes deine Meinung aus.',                                 emoji: '🗣️', xp: 60 },
  { id: 7,  title: 'Interesse zeigen',             desc: 'Frag einen Kollegen oder Kommilitonen aktiv nach seinem Wochenende.',                        emoji: '📅', xp: 40 },
  { id: 8,  title: 'Bewusst Nein sagen',           desc: 'Sag heute bewusst „Nein" zu etwas, das du eigentlich nicht willst.',                          emoji: '🚫', xp: 60 },
  { id: 9,  title: 'Setz dich dazu',               desc: 'Setz dich beim Essen zu Menschen, die du nicht gut kennst.',                                 emoji: '🍽️', xp: 55 },
  { id: 10, title: 'Um Rat fragen',                desc: 'Frag im Laden jemanden um Rat, auch wenn du die Antwort eigentlich schon kennst.',            emoji: '🛍️', xp: 45 },
  { id: 11, title: 'Gespräch mit Fremden starten',  desc: 'Starte ein kurzes Gespräch mit jemandem, der allein wartet (Bus, Schlange, Pause).',          emoji: '🚌', xp: 65 },
  { id: 12, title: 'Andere Meinung teilen',        desc: 'Teile heute eine Meinung, die vom Rest der Gruppe abweicht.',                                 emoji: '💭', xp: 55 },
  { id: 13, title: 'Anrufen statt schreiben',      desc: 'Ruf heute jemanden an, dem du sonst nur schreiben würdest.',                                  emoji: '📞', xp: 50 },
  { id: 14, title: 'Spontaner Scherz',             desc: 'Mach heute jemandem gegenüber einen kleinen, spontanen Scherz.',                              emoji: '😄', xp: 45 },
  { id: 15, title: 'Person ansprechen',            desc: 'Sprich jemanden an, den du attraktiv findest – z.B. mit einer Wegbeschreibung oder Frage.',   emoji: '✨', xp: 80 },
  { id: 16, title: 'Höflich widersprechen',        desc: 'Widersprich heute höflich, wenn du wirklich anderer Meinung bist.',                           emoji: '⚖️', xp: 50 },
  { id: 17, title: 'Aktiv vorstellen',             desc: 'Stell dich einer neuen Bekanntschaft aktiv mit deinem Namen vor.',                            emoji: '🤝', xp: 40 },
  { id: 18, title: 'Zwei Rückfragen',              desc: 'Stell in einem Gespräch mindestens 2 Rückfragen, statt nur zu antworten.',                    emoji: '❓', xp: 45 },
  { id: 19, title: 'Stille aushalten',             desc: 'Halte heute eine 10-Sekunden-Pause im Gespräch aus, ohne sie krampfhaft zu füllen.',           emoji: '🤫', xp: 60 },
  { id: 20, title: 'Kleine Alltagshilfe',          desc: 'Hilf einem Fremden spontan (Tür aufhalten, Weg zeigen) und rede kurz dabei.',                  emoji: '🚪', xp: 40 },
  { id: 21, title: 'Laut und deutlich',            desc: 'Sprich heute beim Bestellen oder Fragen bewusst lauter und deutlicher als sonst.',             emoji: '📢', xp: 45 },
  { id: 22, title: 'In ein Gespräch einsteigen',   desc: 'Steig heute in ein laufendes Gruppengespräch ein, ohne eingeladen worden zu sein.',            emoji: '👥', xp: 65 },
  { id: 23, title: 'Nach Kontakt fragen',          desc: 'Frag bei einem guten Gespräch nach der Nummer oder einem Social-Media-Kontakt.',               emoji: '📱', xp: 85 },
  { id: 24, title: 'Tagesreflexion',               desc: 'Notiere abends: Was ist dir heute schwergefallen – und was hast du trotzdem gemacht?',        emoji: '📝', xp: 30 },
  { id: 25, title: 'Der erste Schritt',            desc: 'Sprich heute jemanden an, bevor er oder sie dich anspricht.',                                 emoji: '🚀', xp: 70 },
];

export function getTodayChallenge() {
  const todayStr = new Date().toDateString();
  try {
    const saved = JSON.parse(localStorage.getItem('mut_daily_challenge'));
    if (saved?.date === todayStr) return saved;
  } catch { /* ignore malformed cache */ }
  const dayIndex = Math.floor(Date.now() / 86400000) % CHALLENGES.length;
  const challenge = { ...CHALLENGES[dayIndex], date: todayStr, done: false };
  localStorage.setItem('mut_daily_challenge', JSON.stringify(challenge));
  return challenge;
}
