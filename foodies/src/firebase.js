import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC9mMB6KQ-zpCM8Iyju31xY62fsyP3QlK0",
  authDomain: "foodies-1.firebaseapp.com",
  projectId: "foodies-1",
  storageBucket: "foodies-1.firebasestorage.app",
  messagingSenderId: "621404797724",
  appId: "1:621404797724:web:be9a36dbe49a1ee1ca58d9",
  measurementId: "G-K03W7E93LN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, analytics, googleProvider }; 