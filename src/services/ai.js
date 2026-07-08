// KI-Trainer über die kostenlose Google-Gemini-Stufe.
// Der API-Schlüssel wird ausschließlich lokal (localStorage) gespeichert und
// nur direkt an Googles API geschickt – kein eigenes Backend.

const KEY_STORAGE = 'mut_gemini_key';
export const GEMINI_MODEL = 'gemini-2.5-flash';
const ENDPOINT = (model, key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

// Marker, mit dem die KI ihren Coach-Tipp vom Rollenspiel trennt.
const TIP_MARKER = '💡';

export function getAiKey() {
  try { return localStorage.getItem(KEY_STORAGE) || ''; } catch { return ''; }
}
export function setAiKey(key) {
  try {
    if (key) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch { /* storage unavailable */ }
}
export function hasAiKey() {
  return !!getAiKey();
}

function buildSystemPrompt(scenario) {
  return [
    scenario.persona,
    '',
    'Du bist Teil einer Übungs-App, in der jemand soziale Situationen, Smalltalk, Flirten und Schlagfertigkeit trainiert.',
    'Bleibe durchgehend in deiner Rolle und antworte natürlich, locker und kurz (1–3 Sätze), wie in einem echten Gespräch – kein Roman.',
    'Sei realistisch: reagiere positiv auf gute, selbstbewusste Antworten und zeige dezent weniger Interesse bei unhöflichem, langweiligem oder aufdringlichem Verhalten. Bleibe aber immer respektvoll und jugendfrei.',
    '',
    `Nach deiner Rollen-Antwort, gib – nur wenn es wirklich hilft – einen kurzen Coach-Tipp aus der Perspektive eines freundlichen Trainers (Fokus: ${scenario.coachFocus}).`,
    `Formatiere den Tipp IMMER in einer neuen Zeile, die genau mit "${TIP_MARKER} " beginnt, maximal ein Satz. Wenn die Antwort des Nutzers schon gut war, lass den Tipp weg.`,
    'Der Coach-Tipp ist Deutsch, wohlwollend und konkret.',
  ].join('\n');
}

// history: [{ role: 'ai' | 'user', text }]  (ohne Coach-Tipps)
function toGeminiContents(history) {
  return history.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));
}

function splitReplyAndTip(text) {
  const idx = text.indexOf(TIP_MARKER);
  if (idx === -1) return { reply: text.trim(), tip: '' };
  return {
    reply: text.slice(0, idx).trim(),
    tip: text.slice(idx + TIP_MARKER.length).trim(),
  };
}

// Ruft Gemini auf. Gibt { reply, tip } zurück oder wirft einen Error mit
// nutzerfreundlicher Nachricht.
export async function sendChat({ scenario, history }) {
  const key = getAiKey();
  if (!key) throw new Error('Kein KI-Schlüssel hinterlegt.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  let res;
  try {
    res = await fetch(ENDPOINT(GEMINI_MODEL, key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: buildSystemPrompt(scenario) }] },
        contents: toGeminiContents(history),
        generationConfig: { temperature: 0.9, maxOutputTokens: 400 },
      }),
      signal: controller.signal,
    });
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('Die KI antwortet gerade nicht. Versuch es nochmal.', { cause: e });
    throw new Error('Keine Verbindung zur KI. Bist du online?', { cause: e });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    if (res.status === 400 || res.status === 403) {
      throw new Error('Der KI-Schlüssel scheint ungültig zu sein. Prüf ihn in den Einstellungen.');
    }
    if (res.status === 429) {
      throw new Error('Das kostenlose KI-Limit ist gerade erreicht. Versuch es später nochmal.');
    }
    throw new Error('Die KI ist gerade nicht erreichbar. Versuch es später nochmal.');
  }

  let data;
  try { data = await res.json(); } catch { throw new Error('Unerwartete Antwort der KI.'); }

  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  if (!text) {
    // z.B. durch Safety-Filter blockiert
    throw new Error('Die KI konnte darauf nicht antworten. Formulier es etwas anders.');
  }
  return splitReplyAndTip(text);
}
