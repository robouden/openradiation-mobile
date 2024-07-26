import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.openradiation',
  appName: 'OpenRadiation',
  webDir: 'www',
  android: {
    useLegacyBridge: true
  },
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '19',
      BackupWebStorage: 'none',
      SplashMaintainAspectRatio: 'true',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      AutoHideSplashScreen: 'false',
      FadeSplashScreen: 'false',
      ShowSplashScreenSpinner: 'false',
      WKWebViewOnly: 'true'
    }
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#045cb8"
    }
  }
};

export default config;
