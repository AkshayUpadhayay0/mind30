import {
  doc,
  getDoc,
  getFirestore,
  runTransaction,
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

export type ChallengeCompletionResult = {
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  rewardEligible: boolean;
  alreadyCompletedToday: boolean;
};

export const completeDailyChallenge = async (
  uid: string
): Promise<ChallengeCompletionResult> => {
  const userRef = doc(db, 'users', uid);

  const today = new Date()
    .toLocaleDateString('en-CA');

  return await runTransaction(
    db,
    async transaction => {
      const userSnapshot =
        await transaction.get(userRef);

      if (!userSnapshot.exists()) {
        throw new Error(
          'User profile does not exist.'
        );
      }

      const userData = userSnapshot.data();

      const currentStreak =
        Number(userData.currentStreak ?? 0);

      const longestStreak =
        Number(userData.longestStreak ?? 0);

      const currentLevel =
        Number(userData.currentLevel ?? 1);

      const lastSuccessfulDate =
        userData.lastSuccessfulDate ?? null;

      /*
       * Prevent multiple successful challenges
       * on the same calendar day.
       */
      if (lastSuccessfulDate === today) {
        return {
          currentLevel,
          currentStreak,
          longestStreak,
          rewardEligible:
            Boolean(userData.rewardEligible),
          alreadyCompletedToday: true,
        };
      }

      /*
       * New successful day.
       */
      const newStreak =
        currentStreak + 1;

      const newLongestStreak =
        Math.max(
          longestStreak,
          newStreak
        );

      /*
       * Increase level after a successful
       * daily challenge.
       *
       * Maximum level = 10.
       */
      const newLevel =
        Math.min(currentLevel + 1, 10);

      /*
       * T-shirt becomes eligible after
       * completing 30 successful days.
       */
      const newRewardEligible =
        newStreak >= 30;

      transaction.update(userRef, {
        currentLevel: newLevel,

        currentStreak: newStreak,

        longestStreak: newLongestStreak,

        lastSuccessfulDate: today,

        rewardEligible: newRewardEligible,

        updatedAt: serverTimestamp(),
      });

      return {
        currentLevel: newLevel,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        rewardEligible: newRewardEligible,
        alreadyCompletedToday: false,
      };
    }
  );
};



export { db };

