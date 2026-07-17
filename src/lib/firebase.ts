import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';

const getEnvVar = (val: string | undefined, fallback: string): string => {
  if (!val || val === 'your_api_key_here' || val === 'your_project_id' || val.trim() === '') {
    return fallback;
  }
  return val;
};

// Replace these with your Firebase project credentials from Firebase Console
const firebaseConfig = {
  apiKey: getEnvVar(import.meta.env.VITE_FIREBASE_API_KEY, 'AIzaSyMockKeyForLocalTestingOnly12345'),
  authDomain: getEnvVar(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, 'mock-project.firebaseapp.com'),
  projectId: getEnvVar(import.meta.env.VITE_FIREBASE_PROJECT_ID, 'mock-project-id'),
  storageBucket: getEnvVar(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, 'mock-project.appspot.com'),
  messagingSenderId: getEnvVar(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, '1234567890'),
  appId: getEnvVar(import.meta.env.VITE_FIREBASE_APP_ID, '1:1234567890:web:mockappid'),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Set persistence to LOCAL (survives page refresh)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting persistence:', error);
});

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export default app;
