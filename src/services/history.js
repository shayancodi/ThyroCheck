import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';

/**
 * Save a prediction result to the current user's history in Firestore.
 * Path: users/{uid}/history/{docId}
 */
export const saveHistory = async (patientData, results) => {
  const user = auth.currentUser;
  if (!user) return;

  const historyRef = collection(db, 'users', user.uid, 'history');
  await addDoc(historyRef, {
    createdAt: serverTimestamp(),
    age: patientData.age,
    gender: patientData.gender,
    TSH: patientData.TSH,
    TT3: patientData.TT3,
    TT4: patientData.TT4,
    FT3: patientData.FT3 ?? null,
    FT4: patientData.FT4 ?? null,
    heart_failure: {
      risk_percent: results.heart_failure.risk_percent,
      risk_level: results.heart_failure.risk_level,
    },
    coronary_heart_disease: {
      risk_percent: results.coronary_heart_disease.risk_percent,
      risk_level: results.coronary_heart_disease.risk_level,
    },
  });
};

/**
 * Fetch all history records for the current user, newest first.
 * Returns an array of { id, ...data } objects.
 */
export const getHistory = async () => {
  const user = auth.currentUser;
  if (!user) return [];

  const historyRef = collection(db, 'users', user.uid, 'history');
  const q = query(historyRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
