import {
    doc,
    getFirestore,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';

import firebaseApp from '../config/firebase';

const db = getFirestore(firebaseApp);

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

export { db };
