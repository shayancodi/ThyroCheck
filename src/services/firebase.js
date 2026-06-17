import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAflA_-9Qk3pIUFI62enn0elnvo21qN4VE",
  authDomain: "thyrocheck-bd5c4.firebaseapp.com",
  projectId: "thyrocheck-bd5c4",
  storageBucket: "thyrocheck-bd5c4.firebasestorage.app",
  messagingSenderId: "115297128360",
  appId: "1:115297128360:web:f8aa130ad6774dfe53179d"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

export default app;
