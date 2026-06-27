// PIN wird mit SHA-256 gehasht – nie im Klartext gespeichert
async function hashPin(pin) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin + 'funke_salt'));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

export async function setupAuth(name, pin) {
  const hash = await hashPin(pin);
  localStorage.setItem('auth_hash', hash);
  localStorage.setItem('auth_name', name);
  sessionStorage.setItem('auth_unlocked', '1');
}

export async function verifyPin(pin) {
  const stored = localStorage.getItem('auth_hash');
  if (!stored) return false;
  const hash = await hashPin(pin);
  return hash === stored;
}

export function isSetup() {
  return !!localStorage.getItem('auth_hash');
}

export function isUnlocked() {
  return sessionStorage.getItem('auth_unlocked') === '1';
}

export function lock() {
  sessionStorage.removeItem('auth_unlocked');
}

export function unlock() {
  sessionStorage.setItem('auth_unlocked', '1');
}

export function resetAuth() {
  localStorage.removeItem('auth_hash');
  localStorage.removeItem('auth_name');
  sessionStorage.removeItem('auth_unlocked');
}

export function getAuthName() {
  return localStorage.getItem('auth_name') || 'du';
}

export function setAuthName(name) {
  localStorage.setItem('auth_name', name);
}
