// Apple HealthKit via @capacitor-community/health-kit
// Web/PWA  → gibt null zurück (kein Zugriff)
// Native iOS (Capacitor) → echte Daten aus Apple Health

const isNative = () =>
  typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

async function getPlugin() {
  if (!isNative()) return null;
  try {
    const mod = await new Function('return import("@capacitor-community/health-kit")')();
    return mod.CapacitorHealthkit ?? mod.default;
  } catch {
    return null;
  }
}

// Berechtigungen die die App anfragt
export const HEALTH_PERMISSIONS = {
  all: [],
  read: [
    'stepCount',
    'distanceWalkingRunning',
    'activeEnergyBurned',
    'restingHeartRate',
    'heartRate',
    'bodyMass',           // Gewicht
    'bodyMassIndex',
    'height',
  ],
  write: ['bodyMass'],
};

export async function isHealthAvailable() {
  const plugin = await getPlugin();
  if (!plugin) return false;
  const { value } = await plugin.isAvailable();
  return value;
}

export async function requestHealthPermissions() {
  const plugin = await getPlugin();
  if (!plugin) return { granted: false };
  await plugin.requestAuthorization(HEALTH_PERMISSIONS);
  return { granted: true };
}

// ── Hilfsfunktion ────────────────────────────────────────────────────────────
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function daysAgo(n) {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}

async function query(sampleName, startDate, endDate, limit = 0) {
  const plugin = await getPlugin();
  if (!plugin) return null;
  return plugin.queryHKitSampleType({ sampleName, startDate, endDate, limit });
}

// ── Öffentliche Funktionen ───────────────────────────────────────────────────

export async function getLatestWeight() {
  const res = await query('bodyMass', daysAgo(30), new Date().toISOString(), 1);
  if (!res?.resultData?.length) return null;
  // Plugin liefert in kg (metrisch)
  return Math.round(res.resultData[0].quantity * 10) / 10;
}

export async function getTodaySteps() {
  const res = await query('stepCount', startOfToday(), new Date().toISOString());
  if (!res?.resultData) return null;
  return res.resultData.reduce((sum, s) => sum + (s.quantity ?? 0), 0);
}

export async function getTodayCalories() {
  const res = await query('activeEnergyBurned', startOfToday(), new Date().toISOString());
  if (!res?.resultData) return null;
  return Math.round(res.resultData.reduce((sum, s) => sum + (s.quantity ?? 0), 0));
}

export async function getRestingHeartRate() {
  const res = await query('restingHeartRate', daysAgo(7), new Date().toISOString(), 7);
  if (!res?.resultData?.length) return null;
  const avg = res.resultData.reduce((s, r) => s + r.quantity, 0) / res.resultData.length;
  return Math.round(avg);
}

export async function getTodayDistance() {
  const res = await query('distanceWalkingRunning', startOfToday(), new Date().toISOString());
  if (!res?.resultData) return null;
  const meters = res.resultData.reduce((sum, s) => sum + (s.quantity ?? 0), 0);
  return Math.round(meters / 100) / 10; // → km mit 1 Dezimalstelle
}

// Lädt alle relevanten Werte auf einmal
export async function getAllHealthData() {
  const [weight, steps, calories, hr, distance] = await Promise.all([
    getLatestWeight(),
    getTodaySteps(),
    getTodayCalories(),
    getRestingHeartRate(),
    getTodayDistance(),
  ]);
  return { weight, steps, calories, hr, distance };
}
