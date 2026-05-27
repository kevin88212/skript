import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.fitquest.app',
  appName: 'FitQuest',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
  },
  plugins: {
    CapacitorHealthkit: {
      // HealthKit permissions are declared in Info.plist
    },
  },
};

export default config;
