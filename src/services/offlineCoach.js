// Regelbasierter Offline-Coach – funktioniert ohne KI-Schlüssel, komplett lokal.
// Liefert eine in-character-Antwort plus (optional) einen Coach-Tipp.

// In-character-Antwortpools je Szenario. Reagiert grob auf Frage vs. Aussage.
const REPLIES = {
  'ai-bus': {
    question: [
      'Gute Frage – meistens klappt der Bus hier ganz gut, heute ist wohl der Wurm drin.',
      'Ka, ehrlich gesagt. Ich nehm die Linie sonst selten. Und du, oft hier unterwegs?',
      'Hehe, keine Ahnung. Aber schön, dass die Wartezeit wenigstens nicht langweilig ist.',
    ],
    statement: [
      'Ja total, so ein Timing … Wo willst du denn hin, wenn ich fragen darf?',
      'Kenn ich, an manchen Tagen läuft einfach nichts rund. Was hast du heute noch vor?',
      'Stimmt. Immerhin ist das Wetter halbwegs okay zum Warten. Was machst du so, wenn du nicht an Haltestellen festhängst?',
    ],
  },
  'ai-party': {
    question: [
      'Haha, gute Frage – die Hälfte kenn ich auch nur vom Sehen. Woher kennst du die Gastgeberin?',
      'Ehrlich? Kaum jemanden. Ich bin eher zufällig hier gelandet. Und du so?',
      'Oh, direkt neugierig – gefällt mir. Erzähl erstmal, was dich hierher verschlagen hat.',
    ],
    statement: [
      'Sympathisch, dass du einfach mal Hallo sagst. Was trinkst du da eigentlich?',
      'Okay, du hast meine Aufmerksamkeit. Was ist deine Geschichte?',
      'Nicht schlecht für den Einstieg. Und was macht man so, wenn man nicht auf Partys fremde Leute anquatscht?',
    ],
  },
  'ai-date': {
    question: [
      'Guter Punkt! Bei mir war der Tag ganz entspannt – und deiner? Erzähl mal.',
      'Oh, direkt eine Frage zurück, mag ich. Lief soweit gut. Was machst du eigentlich, wenn du nicht auf Dates bist?',
      'Ehrlich gesagt war ich auch ein bisschen aufgeregt. Aber jetzt passt es. Was reizt dich gerade so im Leben?',
    ],
    statement: [
      'Schön gesagt. Erzähl mir mehr – was begeistert dich gerade so richtig?',
      'Das klingt spannend. Und wie bist du dazu gekommen?',
      'Mag ich, dass du offen bist. Was war dein Highlight diese Woche?',
    ],
  },
  'ai-tease': {
    question: [
      'Haha, gut gekontert! Aber ernsthaft, was geht bei dir?',
      'Touché. Okay, du bist heute in Form. Respekt.',
      'Ha, damit hab ich nicht gerechnet. Eins zu null für dich.',
    ],
    statement: [
      'Oha, der Ruhige beißt zurück – gefällt mir!',
      'Nicht schlecht, nicht schlecht. Da muss ich mir was Besseres einfallen lassen.',
      'Okay, das lasse ich gelten. Guter Konter.',
    ],
  },
  'ai-colleague': {
    question: [
      'Gute Frage! Ganz okay soweit, viel zu tun. Und bei dir, alles im Griff?',
      'Puh, wechselhaft. Frag mich das nochmal nach dem Kaffee. Was steht bei dir heute an?',
      'Läuft. Nett, dass du fragst! Wie lange bist du eigentlich schon im Team?',
    ],
    statement: [
      'Total, ohne Koffein läuft hier nichts. Was machst du eigentlich genau im Team?',
      'Kenn ich gut. Schön, dass wir mal quatschen – was ist dein Bereich?',
      'Ha, sehe ich genauso. Was hast du am Wochenende Schönes gemacht?',
    ],
  },
  'ai-text': {
    question: [
      'Alles gut heimgekommen, danke der Nachfrage 😄 Und du – schon wieder wach genug für den Tag?',
      'Haha ja, alles heil überstanden. War echt ein cooler Abend. Was machst du gerade so?',
      'Bin gut angekommen 🙌 Und, hattest du heute schon Zeit für was Schönes?',
    ],
    statement: [
      'Schön, dass du dich meldest! 😊 Der Abend gestern war echt nett. Was steht bei dir heute an?',
      'Hehe, freut mich zu lesen. Erzähl – wie ist dein Tag bisher?',
      'Nett von dir! Ich musste heute schon an unser Gespräch von gestern denken. Was machst du gerade?',
    ],
  },
};

const FILLER = ['ähm', 'keine ahnung', 'weiß nicht', 'kp', 'joa', 'halt', 'irgendwie'];

function pick(arr, seed) {
  return arr[seed % arr.length];
}

function isQuestion(text) {
  return text.includes('?');
}

// history nur zum Bestimmen der Rotation (Anzahl bisheriger User-Nachrichten)
export function offlineReply(scenario, history, userMessage) {
  const turn = history.filter((m) => m.role === 'user').length;
  const pool = REPLIES[scenario.id] || REPLIES['ai-bus'];
  const bucket = isQuestion(userMessage) ? pool.question : pool.statement;
  const reply = pick(bucket, turn);

  const msg = userMessage.trim().toLowerCase();
  let tip = '';
  if (msg.length > 0 && msg.length < 12) {
    tip = 'Trau dich, etwas mehr zu sagen – ein kurzer Zusatz oder eine Rückfrage hält das Gespräch am Laufen.';
  } else if (FILLER.some((f) => msg.includes(f))) {
    tip = 'Antworte ruhig etwas selbstbewusster – du darfst eine klare Meinung oder ein konkretes Beispiel bringen.';
  } else if (!isQuestion(userMessage) && turn >= 1) {
    tip = 'Stell auch mal eine offene Rückfrage („Wie…?", „Was…?") – das zeigt Interesse und nimmt dir den Druck.';
  } else if (turn === 2) {
    tip = 'Läuft gut! Achte darauf, dass ihr euch abwechselt – Aussage von dir, dann eine Frage zurück.';
  }

  return { reply, tip };
}
