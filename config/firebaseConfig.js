import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyByKlFE5DvdjsmDN11nV0OZdJeICxd90nY',
  authDomain: 'chatmessage-ca725.firebaseapp.com',
  projectId: 'chatmessage-ca725',
  storageBucket: 'chatmessage-ca725.appspot.com',
  messagingSenderId: '259942320035',
  appId: '1:259942320035:web:54747e053e8d6d2a7a7c16',
  measurementId: 'G-XK88T0KN92',
};

console.log(`--->`, firebaseConfig);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
