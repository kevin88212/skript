const API_KEY_STORAGE = 'funke_api_key';
const MODEL_STORAGE = 'funke_model';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function setApiKey(key) {
  if (key) localStorage.setItem(API_KEY_STORAGE, key);
  else localStorage.removeItem(API_KEY_STORAGE);
}

export function getModel() {
  return localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL;
}

export function setModel(model) {
  localStorage.setItem(MODEL_STORAGE, model);
}

export const SCENARIOS = [
  {
    id: 'cafe',
    label: 'Im Café',
    persona: 'Lena',
    setting: 'sitzt allein am Nachbartisch in einem Café und liest ein Buch, als der Nutzer sie anspricht',
  },
  {
    id: 'dating-app',
    label: 'Dating-App-Match',
    persona: 'Mia',
    setting: 'hat gerade mit dem Nutzer auf einer Dating-App gematcht und schreibt die ersten Nachrichten',
  },
  {
    id: 'party',
    label: 'Auf einer Party',
    persona: 'Sarah',
    setting: 'ist über gemeinsame Freunde auf einer Party, an der auch der Nutzer ist',
  },
  {
    id: 'gym',
    label: 'Im Fitnessstudio',
    persona: 'Anna',
    setting: 'macht im Fitnessstudio gerade eine kurze Pause an der Theke, als der Nutzer sie anspricht',
  },
  {
    id: 'free',
    label: 'Freies Gespräch',
    persona: 'Nora',
    setting: 'führt einfach ein freies Gespräch mit dem Nutzer, ohne festgelegten Ort',
  },
];

export function buildSystemPrompt(scenario) {
  return `Du spielst in einem Rollenspiel zum Gesprächstraining die Person "${scenario.persona}". ${scenario.persona} ${scenario.setting}.

Ziel: Der Nutzer ist schüchtern und übt, offener und charismatischer in Gesprächen mit Frauen zu werden. Hilf ihm durch realistische, aber wohlwollende Übung.

Regeln für deine Antworten:
1. Antworte zuerst KOMPLETT in der Rolle von ${scenario.persona} – natürlich, kurz, wie eine echte Chat-/Gesprächsnachricht (1-3 Sätze). Sei freundlich-neutral, nicht übertrieben einfach zu beeindrucken: Wenn die Nachricht des Nutzers wenig Substanz hat, reagiere eher kurz und reserviert; wenn sie originell, neugierig oder humorvoll ist, reagiere wärmer und interessierter.
2. Schreibe danach auf einer neuen Zeile, klar abgesetzt, einen kurzen Coach-Tipp im Format: "🧭 Coach-Tipp: ..." (max. 1-2 Sätze). Der Tipp bezieht sich konkret auf die letzte Nachricht des Nutzers (z.B. Fragequalität, Offenheit, aktives Zuhören, Selbstsicherheit) und ist konstruktiv und ermutigend, nie herablassend.
3. Bleib immer respektvoll und konsensbasiert. Fördere keine manipulativen oder unehrlichen Taktiken ("Pickup-Artist"-Methoden, Negging). Wenn der Nutzer respektlos wird, reagiere als ${scenario.persona} entsprechend ablehnend und weise im Coach-Tipp darauf hin.
4. Antworte ausschließlich auf Deutsch.`;
}

export async function sendChatMessage({ apiKey, model, systemPrompt, history }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      system: systemPrompt,
      messages: history,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (res.status === 401) throw new Error('API-Key ungültig. Bitte in den Einstellungen prüfen.');
    if (res.status === 429) throw new Error('Rate-Limit erreicht. Bitte kurz warten und erneut versuchen.');
    throw new Error(body?.error?.message || `Anfrage fehlgeschlagen (Status ${res.status}).`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? '';
}
