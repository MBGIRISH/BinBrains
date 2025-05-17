import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
 apiKey: "AIzaSyCo9d9a4nwv_48M49CDo3RS6CwYyM1KTOQ",
  authDomain: "binbrains-3b9a8.firebaseapp.com",
  projectId: "binbrains-3b9a8",
  storageBucket: "binbrains-3b9a8.firebasestorage.app",
  messagingSenderId: "466211738622",
  appId: "1:466211738622:web:92a6a9f8a37528a0dba6af",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 