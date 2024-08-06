export const environment = {
  production: false,
  APP_NAME_VERSION: 'OpenRadiation app 2.3.5 mockDevice',
  API_KEY: '50adef3bdec466edc25f40c8fedccbce',
  API_URI: 'https://submit.openradiation.preprod.ul2i.fr/measurements',
  IN_APP_BROWSER_URI: {
    base: 'https://request.openradiation.preprod.ul2i.fr',
    suffix: 'openradiation'
  },
  mockDevice: true,
  isTestEnvironment: false,
  // FIXE : use test configuration here
  firebase: {
    pushNotificationsConfigured: false,
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "org.openradiation"
  }
};
