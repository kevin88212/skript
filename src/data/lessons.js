export const CATEGORIES = {
  selbstbewusstsein: { label: 'Selbstbewusstsein', color: '#22d3ee', emoji: '🧠', desc: 'Schüchternheit überwinden, offener werden' },
  schlagfertigkeit:  { label: 'Schlagfertigkeit',  color: '#a855f7', emoji: '⚡', desc: 'Schnell und witzig kontern' },
  flirten:           { label: 'Flirten',           color: '#f472b6', emoji: '💫', desc: 'Respektvoll Interesse zeigen' },
};

export const LESSONS = [
  // ── SELBSTBEWUSSTSEIN ──────────────────────────────────────────────
  {
    id: 'sb-1', category: 'selbstbewusstsein', emoji: '🧍',
    title: 'Körpersprache: groß statt klein',
    summary: 'Wie du stehst und dich bewegst, verändert, wie du dich fühlst — und wie andere dich wahrnehmen.',
    tips: [
      'Schultern zurück, Brust leicht raus — keine verschränkten Arme, die machen dich unbewusst kleiner.',
      'Blick auf Augenhöhe statt zum Boden. Wenn das schwerfällt, schau auf die Stirn oder Nasenwurzel der Person.',
      'Langsamere, bewusste Bewegungen wirken souveräner als hektische.',
      '2 Minuten „Power Pose" vor dem Rausgehen (aufrecht, Hände in die Hüften) senkt nachweislich das Stresslevel.',
      'Übe es zuerst allein zuhause vor dem Spiegel, bevor du es im echten Gespräch einsetzt.',
    ],
  },
  {
    id: 'sb-2', category: 'selbstbewusstsein', emoji: '🚪',
    title: 'Ins Gespräch einsteigen',
    summary: 'Der erste Satz ist oft die größte Hürde — mit ein paar einfachen Formeln wird er leicht.',
    tips: [
      'Beobachtung + Frage: „Krasse Schlange hier, oder? Warst du schonmal hier?"',
      'Situativer Anknüpfungspunkt: alles, was gerade im Raum passiert, ist ein gültiger Gesprächseinstieg.',
      'Du brauchst keine geniale Eröffnung — ein simples „Hey, darf ich kurz was fragen?" reicht fast immer.',
      'Erwarte keine perfekte Reaktion. Die meisten Menschen freuen sich einfach, angesprochen zu werden.',
      'Übe kleine Alltags-Ansprachen (Kassiererin, Nachbar) bevor du dich an „wichtige" Gespräche traust.',
    ],
  },
  {
    id: 'sb-3', category: 'selbstbewusstsein', emoji: '🤫',
    title: 'Stille aushalten',
    summary: 'Pausen im Gespräch sind normal — du musst sie nicht sofort füllen.',
    tips: [
      'Eine 3–5 Sekunden Pause fühlt sich für dich ewig an, für dein Gegenüber meist völlig normal.',
      'Nutze Stille aktiv: ein Schluck vom Getränk, ein entspanntes Lächeln — kein hektisches Nachschieben von Fragen.',
      'Wenn du unbedingt etwas sagen willst, greif auf, was zuletzt gesagt wurde, statt ein neues Thema aus dem Nichts zu holen.',
      'Stille kann auch Nähe zeigen — nicht jedes Schweigen ist unangenehm für die andere Person.',
    ],
  },
  {
    id: 'sb-4', category: 'selbstbewusstsein', emoji: '🛡️',
    title: 'Mit Ablehnung umgehen',
    summary: 'Ablehnung tut kurz weh, ist aber selten das Drama, das dein Kopf daraus macht.',
    tips: [
      'Eine Absage ist eine Information, kein Urteil über deinen Wert als Mensch.',
      'Die „Ich könnte in 5 Jahren zurückblicken"-Frage hilft: Wird mich das dann noch belasten? Meistens nein.',
      'Reframing: Jedes „Nein" bringt dich näher an das nächste „Ja" — du trainierst gerade eine Fähigkeit.',
      'Nach einer Absage: kurz höflich bleiben, dann sauber loslassen. Kein Nachbetteln, keine Rechtfertigung.',
      'Führe ein „Mut-Log": jede Ablehnung, die du überstanden hast, ist ein Beweis, dass du sie überleben kannst.',
    ],
  },
  {
    id: 'sb-5', category: 'selbstbewusstsein', emoji: '🗯️',
    title: 'Dein innerer Kritiker',
    summary: 'Die Stimme, die dir sagt „sag lieber nichts", ist meist lauter als nötig — sie lässt sich leiser drehen.',
    tips: [
      'Erkenne den Automatismus: „Was, wenn ich blöd wirke?" ist ein Gedanke, keine Tatsache.',
      'Frag dich: Würde ich einem Freund das Gleiche über sich selbst sagen? Meistens nicht.',
      'Ersetze „Ich darf keinen Fehler machen" durch „Ich darf lernen, auch wenn es unperfekt ist".',
      'Handle trotz des Gedankens, nicht erst wenn er weg ist — Mut heißt nicht, keine Angst zu haben.',
      'Kleine Erfolge bewusst feiern (auch „hab mich getraut zu fragen") trainiert dein Gehirn auf neue Beweise um.',
    ],
  },
  {
    id: 'sb-6', category: 'selbstbewusstsein', emoji: '🎯',
    title: 'Kleine Schritte, große Wirkung',
    summary: 'Die Komfortzone wächst nicht durch einen Sprung, sondern durch viele kleine Schritte über die Grenze.',
    tips: [
      'Bau dir eine persönliche „Mut-Leiter": von leicht (Fremden zulächeln) bis schwer (jemanden nach der Nummer fragen).',
      'Steig nicht mehrere Stufen auf einmal — das führt meist zu Rückzug statt Fortschritt.',
      'Wiederhole jede Stufe, bis sie sich fast normal anfühlt, bevor du zur nächsten gehst.',
      'Rückschritte sind Teil des Prozesses, nicht das Ende davon.',
    ],
  },

  // ── SCHLAGFERTIGKEIT ───────────────────────────────────────────────
  {
    id: 'sf-1', category: 'schlagfertigkeit', emoji: '🔄',
    title: 'Die Frage zurückspielen',
    summary: 'Statt dich zu rechtfertigen, gib die Frage einfach zurück — das nimmt jedem Spruch die Spitze.',
    tips: [
      'Auf „Bist du immer so schüchtern?" antworte mit „Bist du immer so direkt?" — freundlich, nicht aggressiv.',
      'Die Zurückspiel-Technik funktioniert bei fast jeder Neckerei: Frage → Gegenfrage in ähnlichem Ton.',
      'Wichtig ist der Tonfall: locker und lächelnd, nicht verteidigend — sonst wirkt es getroffen statt witzig.',
      'Übe es an harmlosen Sprüchen von Freunden, bevor du es bei Fremden einsetzt.',
    ],
  },
  {
    id: 'sf-2', category: 'schlagfertigkeit', emoji: '📈',
    title: 'Zustimmen und übertreiben',
    summary: 'Eine der stärksten Comedy-Techniken: dem Spruch zustimmen, aber ins Absurde steigern.',
    tips: [
      'Auf „Du redest ja nie was" antworte: „Stimmt, ich spare mir die Worte für die wirklich wichtigen Momente — wie jetzt gerade."',
      'Übertreibung entwaffnet, weil du den Spruch nicht abwehrst, sondern ihn dir zu eigen machst.',
      'Je größer und offensichtlicher absurd die Übertreibung, desto weniger wirkt sie beleidigt.',
      'Diese Technik funktioniert besonders gut bei liebevollen Neckereien unter Freunden.',
    ],
  },
  {
    id: 'sf-3', category: 'schlagfertigkeit', emoji: '😌',
    title: 'Ruhig bleiben bei einem fiesen Spruch',
    summary: 'Die stärkste Reaktion ist oft die, bei der du gar nicht emotional reagierst.',
    tips: [
      'Atme kurz durch, bevor du antwortest — schnelle, gereizte Antworten wirken meist schwächer.',
      'Ein trockenes „Interessante Meinung" oder ein einfaches Lächeln kann mehr Wirkung haben als ein Konter.',
      'Du musst nicht auf jeden Spruch reagieren — Nicht-Reagieren ist auch eine starke Option.',
      'Unterscheide zwischen liebevoller Neckerei (mitspielen) und echter Respektlosigkeit (klar Grenze setzen, ruhig und bestimmt).',
    ],
  },
  {
    id: 'sf-4', category: 'schlagfertigkeit', emoji: '🎭',
    title: 'One-Liner für den Alltag',
    summary: 'Ein kleines Repertoire an Sätzen, die in vielen Situationen funktionieren.',
    tips: [
      'Bei Angeberei: „Respekt, dass du das jedem erzählst, der zuhört."',
      'Bei Small-Talk-Stille: „Okay, offizieller Themenwechsel — was ist deine unpopulärste Meinung?"',
      'Bei Neckerei über dein Aussehen/Verhalten: „Danke, ich übe das seit Jahren."',
      'Bei Überraschung/Kompliment: „Ich weiß, ich überrasche mich manchmal selbst."',
      'Diese Sätze sind Werkzeuge, keine Skripte — passe Ton und Timing an die Situation an.',
    ],
  },
  {
    id: 'sf-5', category: 'schlagfertigkeit', emoji: '🪞',
    title: 'Selbstironie als Waffe',
    summary: 'Über dich selbst lachen zu können nimmt anderen den Wind aus den Segeln.',
    tips: [
      'Wer sich selbst nicht so ernst nimmt, kann von außen kaum getroffen werden.',
      'Bei einem Fehler: statt zu erklären, einfach „Klassiker von mir" sagen und weitermachen.',
      'Selbstironie zeigt Souveränität — der Unterschied zu Selbstabwertung ist der Tonfall: locker, nicht kleinlaut.',
      'Übertreib deine eigenen „Schwächen" bewusst ins Komische, statt sie zu verstecken.',
    ],
  },
  {
    id: 'sf-6', category: 'schlagfertigkeit', emoji: '⏱️',
    title: 'Timing lernen',
    summary: 'Schlagfertigkeit ist zu 50% Inhalt und zu 50% Timing.',
    tips: [
      'Eine kurze Pause vor der Antwort wirkt souveräner als eine sofortige, hastige Reaktion.',
      'Kürzer ist fast immer besser — ein knapper Konter schlägt einen langen Vortrag.',
      'Wenn dir spontan nichts einfällt, ist ein einfaches „Guter Versuch" oder Lachen völlig ausreichend.',
      'Übe mit Verzögerung: Dir muss nicht sofort etwas einfallen — auch später im Gespräch darauf zurückkommen wirkt gut.',
    ],
  },

  // ── FLIRTEN ─────────────────────────────────────────────────────────
  {
    id: 'fl-1', category: 'flirten', emoji: '👋',
    title: 'Jemanden ansprechen',
    summary: 'Der respektvolle erste Kontakt: neugierig statt aufdringlich.',
    tips: [
      'Öffne mit etwas Situativem oder einer ehrlichen Beobachtung, nicht mit einem einstudierten Anmachspruch.',
      'Lies die Situation: Kopfhörer drin, in Eile, mit anderen beschäftigt = eher nicht der Moment.',
      'Halte die erste Ansprache kurz und locker — kein Verhör, kein Frage-Feuerwerk.',
      'Beobachte die Reaktion: offene Körpersprache und Rückfragen = weitermachen, knappe Antworten + Rückzug = höflich beenden.',
      'Sei bereit, dass die Person kein Interesse zeigt — das ist okay und keine persönliche Niederlage.',
    ],
  },
  {
    id: 'fl-2', category: 'flirten', emoji: '🔍',
    title: 'Interesse erkennen',
    summary: 'Körpersprache verrät oft mehr als Worte, wenn du weißt, worauf du achten musst.',
    tips: [
      'Zugewandter Oberkörper, offene Haltung, Blickkontakt der gehalten statt vermieden wird — positive Zeichen.',
      'Sie/er lacht bei deinen Aussagen mit, stellt Rückfragen, hält das Gespräch aktiv am Laufen — gutes Zeichen.',
      'Kurze Antworten, Blick zum Handy, Körper zeigt weg von dir — eher desinteressiert, respektiere das.',
      'Ein einzelnes Signal ist kein Beweis — schau auf das Gesamtbild über mehrere Minuten.',
      'Im Zweifel: einfach freundlich und direkt fragen, statt zu raten. Klarheit ist immer besser als Rätselraten.',
    ],
  },
  {
    id: 'fl-3', category: 'flirten', emoji: '💬',
    title: 'Schreiben nach dem ersten Treffen',
    summary: 'Die ersten Nachrichten entscheiden oft, ob es weitergeht.',
    tips: [
      'Schreib zeitnah, aber nicht sofort verzweifelt — ein Tag später ist völlig normal.',
      'Nimm Bezug auf etwas aus eurem Gespräch — das zeigt, dass du wirklich zugehört hast.',
      'Stelle eine offene Frage, damit die andere Person leicht antworten kann.',
      'Vermeide reine Ja/Nein-Fragen und lange Textwände — locker und kurz wirkt entspannter.',
      'Wenn keine Antwort kommt: eine Erinnerung reicht, dann loslassen. Kein Nachhaken.',
    ],
  },
  {
    id: 'fl-4', category: 'flirten', emoji: '📆',
    title: 'Ein Date vorschlagen',
    summary: 'Konkret und entspannt fragen wirkt sicherer als vage Andeutungen.',
    tips: [
      'Sei konkret: „Lust auf Kaffee am Donnerstag?" statt „Wir sollten mal was machen".',
      'Ein konkreter Vorschlag ist leichter zu beantworten als eine offene Frage — das nimmt Druck von beiden Seiten.',
      'Wähle einen entspannten Ort für ein erstes Treffen (Café, Spaziergang) statt gleich etwas sehr Aufwändiges.',
      'Wenn die Antwort zögerlich ist, gib der Person Raum, ohne nachzudrängen.',
    ],
  },
  {
    id: 'fl-5', category: 'flirten', emoji: '🙏',
    title: 'Ein „Nein" respektvoll akzeptieren',
    summary: 'Wie du mit Absagen umgehst, sagt viel über deinen Charakter aus.',
    tips: [
      'Ein klares „Danke, das ehrt mich, aber ich bin nicht interessiert" verdient ein einfaches „Alles gut, danke für die Ehrlichkeit."',
      'Kein Nachfragen nach dem „Warum", kein Verhandeln, kein Drängen.',
      'Absagen sind über die Situation, nicht über deinen Wert als Person.',
      'Ein souveräner Umgang mit einem Nein hinterlässt oft einen besseren Eindruck als ein aufdringliches Insistieren.',
    ],
  },
  {
    id: 'fl-6', category: 'flirten', emoji: '🎈',
    title: 'Banter am Laufen halten',
    summary: 'Lockeres Necken erzeugt Spannung und macht Gespräche lebendig.',
    tips: [
      'Übertreibe spielerisch: kleine, freundliche Übertreibungen statt ernster Aussagen.',
      'Necke leicht, aber nie über wunde Punkte — Banter soll Spaß machen, nicht verletzen.',
      'Beobachte die Reaktion: lacht die Person mit, kannst du weitermachen; wirkt sie unwohl, wechsle den Ton.',
      'Frag nach, statt nur Fakten abzufragen — echtes Interesse macht Banter erst lebendig.',
    ],
  },
];

export function getLessonsByCategory(category) {
  return category ? LESSONS.filter(l => l.category === category) : LESSONS;
}
