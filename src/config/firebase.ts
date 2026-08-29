import { getApp, getApps, initializeApp } from 'firebase/app';

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

export default app;