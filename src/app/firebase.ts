import { initializeApp, getApps } from 'firebase/app';
//import { getAuth } from 'firebase/auth';
//import { getFirestore } from 'firebase/firestore';
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Environment configuration
const getEnvironmentConfig = () => {
  if (typeof window === 'undefined') {
    return {
      environment: 'server',
      traffic_type: 'server',
      shouldTrack: false
    };
  }

  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Check for specific testing environment
  if (hostname === 'localhost' && port === '9002') {
    return {
      environment: 'testing',
      traffic_type: 'testing',
      shouldTrack: false // Don't track localhost:9002
    };
  }
  
  // Check for other local development
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('local')) {
    return {
      environment: 'staging',
      traffic_type: 'staging',
      shouldTrack: true // Track other local environments for testing
    };
  }
  
  // Production environment
  return {
    environment: 'production',
    traffic_type: 'production',
    shouldTrack: true
  };
};

// Export environment config for use in analytics
export const environmentConfig = getEnvironmentConfig();

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
//const auth = getAuth(app);
//const db = getFirestore(app);

// Initialize Analytics with promise-based approach
let analytics: Analytics | undefined;
let analyticsPromise: Promise<Analytics | undefined>;

if (typeof window !== 'undefined') {
    analyticsPromise = isSupported().then((supported) => {
        if (supported && environmentConfig.shouldTrack) {
          analytics = getAnalytics(app);
          console.log('Firebase Analytics initialized successfully');
          console.log('Environment config:', environmentConfig);
          console.log('Config check:', {
            hasApiKey: !!firebaseConfig.apiKey,
            hasProjectId: !!firebaseConfig.projectId,
            hasMeasurementId: !!firebaseConfig.measurementId,
          });
          return analytics;
        } else if (!supported) {
          console.log('Firebase Analytics not supported in this environment');
          return undefined;
        } else {
          console.log(`Firebase Analytics disabled for ${environmentConfig.environment} environment`);
          return undefined;
        }
    }).catch((error) => {
        console.error('Failed to initialize Firebase Analytics:', error);
        return undefined;
    });
} else {
    analyticsPromise = Promise.resolve(undefined);
}

// Export both the analytics instance and the promise
export { app, analytics };
export const getAnalyticsInstance = () => analyticsPromise; 