import { getApp, getApps, initializeApp } from 'firebase/app';

import {
  getAuth,
  initializeAuth,
  type Auth,
} from 'firebase/auth';

// Firebase 12.18.0 has the RN export at runtime,
// but its TypeScript declarations don't expose it correctly.
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyAYtnd5S8uKIfiX2iubyAN9qxlJlRJ0LZE",
  authDomain: "mind30-ccfcf.firebaseapp.com",
  projectId: "mind30-ccfcf",
  storageBucket: "mind30-ccfcf.firebasestorage.app",
  messagingSenderId: "90660244282",
  appId: "1:90660244282:web:ef4d3c39c5833c55a3de03",
  measurementId: "G-317CL5140M"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

  let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(
      AsyncStorage
    ),
  });
} catch (error: any) {
  if (error?.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

export { app, auth };

export default app;