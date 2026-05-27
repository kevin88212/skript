// Google Calendar OAuth 2.0 – Implicit Flow (funktioniert auf GitHub Pages ohne Backend)

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
const REDIRECT_URI = window.location.origin + window.location.pathname.replace(/\/$/, '');

const GYM_KEYWORDS = [
  'gym', 'training', 'workout', 'sport', 'fitness', 'krafttraining',
  'laufen', 'joggen', 'schwimmen', 'radfahren', 'crossfit', 'yoga',
  'pilates', 'boxen', 'kampfsport', 'fußball', 'basketball',
];

export function getClientId() {
  return localStorage.getItem('google_client_id') || '';
}

export function saveClientId(id) {
  localStorage.setItem('google_client_id', id.trim());
}

export function getAccessToken() {
  return localStorage.getItem('google_access_token') || null;
}

function saveToken(token, expiresIn) {
  localStorage.setItem('google_access_token', token);
  localStorage.setItem('google_token_expiry', Date.now() + expiresIn * 1000);
}

export function clearToken() {
  localStorage.removeItem('google_access_token');
  localStorage.removeItem('google_token_expiry');
}

export function isTokenValid() {
  const token = getAccessToken();
  const expiry = Number(localStorage.getItem('google_token_expiry') || 0);
  return !!token && Date.now() < expiry;
}

// Startet den OAuth-Flow – öffnet Google Login
export function startOAuthFlow() {
  const clientId = getClientId();
  if (!clientId) throw new Error('Keine Client-ID gesetzt');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: 'token',
    scope: SCOPES,
    include_granted_scopes: 'true',
    prompt: 'consent',
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

// Liest Token aus URL-Hash nach Redirect zurück
export function handleOAuthCallback() {
  const hash = window.location.hash.substring(1);
  if (!hash) return false;
  const params = new URLSearchParams(hash);
  const token = params.get('access_token');
  const expiresIn = params.get('expires_in');
  if (!token) return false;
  saveToken(token, Number(expiresIn) || 3600);
  // Hash aus URL entfernen
  window.history.replaceState(null, '', window.location.pathname);
  return true;
}

// Holt Kalender-Events der nächsten 14 Tage
export async function fetchCalendarEvents() {
  const token = getAccessToken();
  if (!token) throw new Error('Nicht authentifiziert');

  const now = new Date();
  const future = new Date(now.getTime() + 14 * 86_400_000);

  const params = new URLSearchParams({
    timeMin: now.toISOString(),
    timeMax: future.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '50',
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (res.status === 401) {
    clearToken();
    throw new Error('Token abgelaufen – bitte neu verbinden');
  }
  if (!res.ok) throw new Error(`Google API Fehler: ${res.status}`);

  const data = await res.json();
  return (data.items || []).map(parseEvent);
}

function parseEvent(item) {
  const title = item.summary || '';
  const isGym = GYM_KEYWORDS.some(kw =>
    title.toLowerCase().includes(kw)
  );

  const startRaw = item.start?.dateTime || item.start?.date || '';
  const startDate = new Date(startRaw);

  return {
    id: item.id,
    title,
    isGym,
    date: startDate.toDateString(),
    time: item.start?.dateTime
      ? startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      : 'Ganztag',
    raw: item,
  };
}
