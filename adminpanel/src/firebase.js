import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC9mMB6KQ-zpCM8Iyju31xY62fsyP3QlK0",
  authDomain: "foodies-1.firebaseapp.com",
  projectId: "foodies-1",
  storageBucket: "foodies-1.firebasestorage.app",
  messagingSenderId: "621404797724",
  appId: "1:621404797724:web:7bd6f2a269140871ca58d9",
  measurementId: "G-15BWR4315G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});

export { auth, db, analytics, storage }; 