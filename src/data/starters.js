export const CATEGORIES = [
  'Eisbrecher',
  'Komplimente',
  'Vertiefende Fragen',
  'Körpersprache & Augenkontakt',
  'Flirt-Eskalation',
];

export const STARTERS = [
  // ── Eisbrecher ──────────────────────────────────────────────────────────
  { id: 1, category: 'Eisbrecher', context: 'Café / Warteschlange', text: 'Hast du schon probiert, was die hier am besten können? Ich kann mich nie entscheiden.', why: 'Knüpft an die gemeinsame Situation an, ist leicht zu beantworten und öffnet ein Gespräch ohne Druck.' },
  { id: 2, category: 'Eisbrecher', context: 'Bibliothek / Buchladen', text: 'Ist das Buch gut? Ich überlege schon die ganze Zeit, ob ich es mir auch holen soll.', why: 'Zeigt echtes Interesse an etwas, das die Person gerade tut, statt eine generische Anmache zu bringen.' },
  { id: 3, category: 'Eisbrecher', context: 'Party / gemeinsame Freunde', text: 'Wir kennen uns noch nicht, oder? Ich bin [Name] – wie kennst du die Gastgeber?', why: 'Direkt, freundlich, und gibt sofort einen Gesprächsfaden über die gemeinsame Verbindung.' },
  { id: 4, category: 'Eisbrecher', context: 'Fitnessstudio', text: 'Machst du das öfter so, oder testest du gerade ein neues Programm? Sieht anstrengend aus.', why: 'Beobachtung statt Floskel – wirkt aufmerksam und nicht einstudiert.' },
  { id: 5, category: 'Eisbrecher', context: 'Hund / Park', text: 'Darf ich kurz fragen, wie dein Hund heißt? Der ist mir aufgefallen.', why: 'Über ein neutrales drittes Element (Hund, Kind, Gegenstand) zu sprechen nimmt Druck aus dem ersten Satz.' },
  { id: 6, category: 'Eisbrecher', context: 'Dating-App – erste Nachricht', text: 'Dein Foto am [Ort/Aktivität aus dem Profil] hat mich neugierig gemacht – was war das für ein Tag?', why: 'Bezieht sich konkret auf das Profil statt auf ein Standard-"Hey", zeigt dass du wirklich hingeschaut hast.' },
  { id: 7, category: 'Eisbrecher', context: 'Smalltalk allgemein', text: 'Ehrlich gesagt fällt es mir gerade ein bisschen schwer, ein Gespräch anzufangen – aber ich wollte unbedingt Hallo sagen.', why: 'Ehrlichkeit über die eigene Nervosität wirkt sympathisch und authentisch statt cool-distanziert.' },

  // ── Komplimente ─────────────────────────────────────────────────────────
  { id: 8, category: 'Komplimente', context: 'Allgemein', text: 'Mir ist aufgefallen, wie du das gerade erklärt hast – das war wirklich klar und einleuchtend.', why: 'Bezieht sich auf eine Eigenschaft oder Handlung statt nur aufs Äußere – wirkt durchdachter und ehrlicher.' },
  { id: 9, category: 'Komplimente', context: 'Allgemein', text: 'Du hast eine angenehme Art, zuzuhören. Man merkt, dass es dich wirklich interessiert.', why: 'Charakter-Komplimente bleiben länger im Kopf als rein optische und wirken weniger aufgesetzt.' },
  { id: 10, category: 'Komplimente', context: 'Stil', text: 'Diese Farbkombination steht dir richtig gut – hast du ein Auge für sowas oder einfach Glück gehabt?', why: 'Konkretes, spezifisches Kompliment statt pauschal "du siehst gut aus" – fühlt sich persönlicher an.' },
  { id: 11, category: 'Komplimente', context: 'Nach einer guten Geschichte', text: 'Du erzählst das richtig lebendig, ich konnte mir die ganze Szene vorstellen.', why: 'Würdigt eine Fähigkeit (Erzählen) statt nur das Aussehen – baut Verbindung über den Moment auf.' },
  { id: 12, category: 'Komplimente', context: 'Allgemein', text: 'Dein Lachen eben war richtig ehrlich – das sieht man selten.', why: 'Spontane, im Moment beobachtete Komplimente wirken glaubwürdiger als vorbereitete Sprüche.' },
  { id: 13, category: 'Komplimente', context: 'Dating-App', text: 'Du wirkst in deinen Fotos sehr entspannt und echt – das findet man nicht oft.', why: 'Hebt sich von "hübsches Lächeln"-Standardkommentaren ab und spricht eine Qualität an.' },

  // ── Vertiefende Fragen ──────────────────────────────────────────────────
  { id: 14, category: 'Vertiefende Fragen', context: 'Allgemein', text: 'Was machst du eigentlich, wenn du mal komplett abschalten willst?', why: 'Offene Frage (keine Ja/Nein-Antwort möglich) – gibt der anderen Person Raum, mehr von sich zu erzählen.' },
  { id: 15, category: 'Vertiefende Fragen', context: 'Nach dem Job', text: 'Und – würdest du das nochmal so wählen, oder hättest du im Nachhinein was anders gemacht?', why: 'Geht über die Standard-Job-Frage hinaus und zeigt echtes Interesse an der Person, nicht nur am Titel.' },
  { id: 16, category: 'Vertiefende Fragen', context: 'Allgemein', text: 'Worauf freust du dich gerade am meisten?', why: 'Positive Zukunftsfrage – Menschen erzählen gerne von Dingen, auf die sie sich freuen, das hebt die Stimmung.' },
  { id: 17, category: 'Vertiefende Fragen', context: 'Reisen', text: 'Was war der Ort, der dich am meisten überrascht hat – im positiven oder negativen Sinne?', why: 'Konkreter als "Wo warst du schon mal" und lädt zu einer richtigen Geschichte ein.' },
  { id: 18, category: 'Vertiefende Fragen', context: 'Aktives Zuhören', text: 'Warte, das fand ich spannend – wie kam es genau dazu?', why: 'Statt selbst sofort zu antworten, zeigst du, dass du wirklich zugehört hast und mehr wissen willst.' },
  { id: 19, category: 'Vertiefende Fragen', context: 'Allgemein', text: 'Was war das Beste, das dir diese Woche passiert ist?', why: 'Konkrete Zeitspanne macht es leichter zu beantworten als ein vages "Wie geht\'s dir so allgemein".' },
  { id: 20, category: 'Vertiefende Fragen', context: 'Dating', text: 'Was schätzt du an guten Freunden besonders – gibt es da etwas, das dir wichtig ist?', why: 'Tiefere Werte-Frage, die zeigt, dass du an der Person und nicht nur an Oberflächlichem interessiert bist.' },

  // ── Körpersprache & Augenkontakt ───────────────────────────────────────
  { id: 21, category: 'Körpersprache & Augenkontakt', context: 'Allgemein', text: 'Wenn direkter Augenkontakt unangenehm wird: kurz auf einen Punkt zwischen den Augenbrauen schauen – wirkt für das Gegenüber identisch.', why: 'Praktischer Trick, um Augenkontakt zu halten, ohne dass es sich überfordernd anfühlt.' },
  { id: 22, category: 'Körpersprache & Augenkontakt', context: 'Allgemein', text: 'Blinzeln und kurz wegschauen ist völlig normal – wichtig ist, danach bewusst zurückzukommen, statt ganz wegzuschauen.', why: 'Nimmt Druck raus: Augenkontakt muss nicht durchgehend sein, sondern bewusst gehalten.' },
  { id: 23, category: 'Körpersprache & Augenkontakt', context: 'Beim Zuhören', text: 'Beim Zuhören leicht nach vorne lehnen und nicken zeigt Interesse, ohne ein Wort zu sagen.', why: 'Offene, zugewandte Körpersprache verstärkt jede verbale Aussage und wirkt einladend.' },
  { id: 24, category: 'Körpersprache & Augenkontakt', context: 'Vor einem Gespräch', text: 'Schultern bewusst nach hinten/unten ziehen und einmal tief durchatmen, bevor du jemanden ansprichst.', why: 'Offene Haltung wird unbewusst als selbstsicherer wahrgenommen und beeinflusst auch dein eigenes Gefühl.' },
  { id: 25, category: 'Körpersprache & Augenkontakt', context: 'Lächeln', text: 'Ein kurzes, echtes Lächeln beim ersten Blickkontakt – lieber kurz und echt als lang und einstudiert.', why: 'Signalisiert Offenheit, bevor überhaupt ein Wort gefallen ist, und macht den ersten Satz leichter.' },
  { id: 26, category: 'Körpersprache & Augenkontakt', context: 'Übung', text: 'Augenkontakt lässt sich trainieren: erst vor dem Spiegel, dann mit engen Freunden, erst danach mit Fremden.', why: 'Eine stufenweise Gewöhnung ist deutlich nachhaltiger als der Versuch, sofort bei Fremden anzufangen.' },

  // ── Flirt-Eskalation ────────────────────────────────────────────────────
  { id: 27, category: 'Flirt-Eskalation', context: 'Leichtes Necken', text: 'Du tust so, als wäre das hier alles ganz normal für dich – bist du sicher, dass du nicht heimlich nervös bist?', why: 'Spielerisches, freundliches Necken erzeugt Spannung, ohne unhöflich zu sein – wichtig: Tonfall warm halten.' },
  { id: 28, category: 'Flirt-Eskalation', context: 'Gespräch vertiefen', text: 'Ich glaube, wir sollten das Gespräch bei einem Kaffee fortsetzen – was meinst du?', why: 'Klarer, ehrlicher nächster Schritt statt vager Andeutungen – Eindeutigkeit wird meist mehr respektiert als Zögern.' },
  { id: 29, category: 'Flirt-Eskalation', context: 'Dating-App', text: 'Ich merke, ich schreibe lieber persönlich als hin und her zu tippen – hast du Lust, das bei einem Kaffee weiterzuführen?', why: 'Verlagert das Gespräch bewusst vom Chat ins echte Treffen, statt endlos online zu schreiben.' },
  { id: 30, category: 'Flirt-Eskalation', context: 'Allgemein', text: 'Ich mag, wie offen du gerade redest – das macht es leicht, mit dir zu reden.', why: 'Direktes, ehrliches Feedback zur Verbindung im Moment ist ein starkes, undramatisches Flirt-Signal.' },
  { id: 31, category: 'Flirt-Eskalation', context: 'Abschied', text: 'Ich würde dich gerne nochmal treffen – darf ich deine Nummer haben?', why: 'Klar und respektvoll formuliert: kein Druck, aber ein eindeutiges Angebot statt vager Andeutung.' },
];

export function getStartersByCategory(category) {
  return STARTERS.filter(s => s.category === category);
}

export function getDailyTip() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return STARTERS[dayIndex % STARTERS.length];
}
