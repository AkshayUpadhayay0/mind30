import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import firebaseApp from '../config/firebase';

const db = getFirestore(firebaseApp);

export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;

  currentLevel: number;

  currentStreak: number;
  longestStreak: number;

  lastSuccessfulDate: Date | null;

  rewardEligible: boolean;

  createdAt: Date | null;
  updatedAt: Date | null;
};

export const createUserProfile = async (
  uid: string,
  name: string,
  email: string
) => {
  const userRef = doc(db, 'users', uid);

  await setDoc(userRef, {
    displayName: name.trim(),
    email: email.trim().toLowerCase(),

    currentLevel: 1,

    currentStreak: 0,
    longestStreak: 0,

    lastSuccessfulDate: null,

    rewardEligible: false,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    uid: snapshot.id,

    displayName: data.displayName ?? '',
    email: data.email ?? '',

    currentLevel: data.currentLevel ?? 1,

    currentStreak: data.currentStreak ?? 0,
    longestStreak: data.longestStreak ?? 0,

    lastSuccessfulDate: data.lastSuccessfulDate?.toDate?.() ?? null,

    rewardEligible: data.rewardEligible ?? false,

    createdAt: data.createdAt?.toDate?.() ?? null,
    updatedAt: data.updatedAt?.toDate?.() ?? null,
  };
};

export { db };
