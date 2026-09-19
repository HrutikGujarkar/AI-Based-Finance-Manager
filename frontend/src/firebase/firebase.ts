import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1vER661fS_fc8-Odx2KBXqsPmSgUe5Yc",
  authDomain: "ai-finance-manager-e072f.firebaseapp.com",
  projectId: "ai-finance-manager-e072f",
  storageBucket: "ai-finance-manager-e072f.firebasestorage.app",
  messagingSenderId: "975441677835",
  appId: "1:975441677835:web:fcfa727b979cbb9a94410e",
  measurementId: "G-RTL1FBN6E4"
};

// Initialize Firebase with error handling
let app: any;
let auth: any;
let db: any;
let storage: any;
let firebaseError: string | null = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Connect to emulators in development
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('Connected to Firebase emulators');
    } catch {
      console.log('Emulators not available, using production Firebase');
    }
  }
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  firebaseError = error instanceof Error ? error.message : 'Unknown error';
  
  // Create mock objects to prevent app from crashing
  app = null;
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage, firebaseError };
export default app;
