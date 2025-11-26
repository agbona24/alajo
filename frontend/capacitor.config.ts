import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alajo.app',
  appName: 'Alajo',
  webDir: 'out',
  server: {
    // For testing: Point to your live URL or local dev server
    // Production: Remove url property and use static files
    url: 'https://alajo.ng', // Change to your actual domain
    androidScheme: 'https',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#9333ea",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#9333ea'
    }
  }
};

export default config;
