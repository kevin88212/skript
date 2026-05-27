// HealthKit integration via @capacitor-community/health-kit
// On web/PWA: returns mock/empty data
// On native iOS (Capacitor build): reads real Apple Health data

const isNative = () => typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

async function getPlugin() {
  if (!isNative()) return null;
  try {
    // Dynamic import at runtime only – not bundled by Vite
    const mod = await new Function('return import("@capacitor-community/health-kit")')();
    return mod.CapacitorHealthkit;
  } catch {
    return null;
  }
}

export const HEALTH_PERMISSIONS = {
  read: ['weight', 'stepCount', 'heartRate', 'activeEnergyBurned', 'distanceWalkingRunning'],
  write: ['weight'],
};

export async function requestHealthPermissions() {
  const plugin = await getPlugin();
  if (!plugin) return { granted: false, reason: 'PWA – Apple Health nur in nativer App verfügbar' };
  await plugin.requestAuthorization(HEALTH_PERMISSIONS);
  return { granted: true };
}

export async function getLatestWeight() {
  const plugin = await getPlugin();
  if (!plugin) return null;
  const result = await plugin.queryHKitSampleType({
    sampleName: 'weight',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
    limit: 1,
  });
  if (!result?.resultData?.length) return null;
  const kg = result.resultData[0].quantity * 0.453592; // lbs → kg
  return Math.round(kg * 10) / 10;
}

export async function getTodaySteps() {
  const plugin = await getPlugin();
  if (!plugin) return null;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const result = await plugin.queryHKitSampleType({
    sampleName: 'stepCount',
    startDate: start.toISOString(),
    endDate: new Date().toISOString(),
    limit: 0,
  });
  return result?.resultData?.reduce((sum, s) => sum + (s.quantity ?? 0), 0) ?? 0;
}

export async function getTodayCalories() {
  const plugin = await getPlugin();
  if (!plugin) return null;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const result = await plugin.queryHKitSampleType({
    sampleName: 'activeEnergyBurned',
    startDate: start.toISOString(),
    endDate: new Date().toISOString(),
    limit: 0,
  });
  return Math.round(result?.resultData?.reduce((sum, s) => sum + (s.quantity ?? 0), 0) ?? 0);
}

export async function getRestingHeartRate() {
  const plugin = await getPlugin();
  if (!plugin) return null;
  const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const result = await plugin.queryHKitSampleType({
    sampleName: 'heartRate',
    startDate: start.toISOString(),
    endDate: new Date().toISOString(),
    limit: 5,
  });
  if (!result?.resultData?.length) return null;
  const avg = result.resultData.reduce((s, r) => s + r.quantity, 0) / result.resultData.length;
  return Math.round(avg);
}
