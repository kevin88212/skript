import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.mut.app',
  appName: 'Mut',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#050508',
    allowsLinkPreview: false,
    scrollEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#050508',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
  },
};

export default config;
