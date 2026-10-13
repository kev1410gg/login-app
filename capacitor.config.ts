import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ejemplo.loginapp',
  appName: 'login-app',
  webDir: 'www',
  plugins: {
    CapacitorHttp: { enabled: true },
  },
};

export default config;