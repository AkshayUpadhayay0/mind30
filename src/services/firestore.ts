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

/* -------------------------------- */
/* Types                            */
/* -------------------------------- */

export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;

  currentLevel: number;

  currentStreak: number;
  longestStreak: number;

  lastSuccessfulDate: string | null;

  createdAt: Date | null;
  updatedAt: Date | null;

  rewardEligible: boolean;
};

export type ChallengeCompletionResult = {
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  rewardEligible: boolean;
  alreadyCompletedToday: boolean;
};

/* -------------------------------- */
/* Date Helpers                      */
/* -------------------------------- */

export const getDateString = (
  date = new Date()
): string => {
  return date.toLocaleDateString('en-CA');
};

const getYesterdayDateString = (): string => {
  const yesterday = new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  return getDateString(yesterday);
};

/* -------------------------------- */
/* Create User Profile               */
/* -------------------------------- */

export const createUserProfile = async (
  uid: string,
  name: string,
  email: string
) => {
  const userRef = doc(db, 'users', uid);

  await setDoc(userRef, {
    displayName: name.trim(),

    email: email
      .trim()
      .toLowerCase(),

    currentLevel: 1,

    currentStreak: 0,

    longestStreak: 0,

    lastSuccessfulDate: null,

    rewardEligible: false,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  });
};

/* -------------------------------- */
/* Get User Profile                  */
/* -------------------------------- */

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);

  const snapshot = await getDoc(
    userRef
  );

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    uid: snapshot.id,

    displayName:
      data.displayName ?? '',

    email:
      data.email ?? '',

    currentLevel:
      Number(data.currentLevel ?? 1),

    currentStreak:
      Number(data.currentStreak ?? 0),

    longestStreak:
      Number(data.longestStreak ?? 0),

    lastSuccessfulDate:
      typeof data.lastSuccessfulDate ===
      'string'
        ? data.lastSuccessfulDate
        : null,

    createdAt:
      data.createdAt?.toDate?.() ?? null,

    updatedAt:
      data.updatedAt?.toDate?.() ?? null,

    rewardEligible:
      Boolean(data.rewardEligible),
  };
};

/* -------------------------------- */
/* Check Missed Day                  */
/* -------------------------------- */

export const resetStreakIfMissedDay =
  async (uid: string) => {
    const userRef = doc(db, 'users', uid);

    await runTransaction(
      db,
      async transaction => {
        const snapshot =
          await transaction.get(
            userRef
          );

        if (!snapshot.exists()) {
          return;
        }

        const data =
          snapshot.data();

        const currentStreak =
          Number(
            data.currentStreak ?? 0
          );

        const lastSuccessfulDate =
          data.lastSuccessfulDate ??
          null;

        /*
         * Nothing to reset if:
         * - user has no streak
         * - user has never completed a challenge
         */
        if (
          currentStreak === 0 ||
          !lastSuccessfulDate
        ) {
          return;
        }

        const today =
          getDateString();

        /*
         * Already played today.
         */
        if (
          lastSuccessfulDate ===
          today
        ) {
          return;
        }

        const yesterday =
          getYesterdayDateString();

        /*
         * User played yesterday.
         * Streak is still active.
         */
        if (
          lastSuccessfulDate ===
          yesterday
        ) {
          return;
        }

        /*
         * User missed at least one day.
         * Reset CURRENT streak only.
         *
         * Longest streak remains untouched.
         */
        transaction.update(
          userRef,
          {
            currentStreak: 0,
            updatedAt:
              serverTimestamp(),
          }
        );
      }
    );
  };

/* -------------------------------- */
/* Complete Daily Challenge          */
/* -------------------------------- */

export const completeDailyChallenge =
  async (
    uid: string
  ): Promise<ChallengeCompletionResult> => {
    const userRef = doc(
      db,
      'users',
      uid
    );

    const today =
      getDateString();

    const yesterday =
      getYesterdayDateString();

    return await runTransaction(
      db,
      async transaction => {
        const userSnapshot =
          await transaction.get(
            userRef
          );

        if (
          !userSnapshot.exists()
        ) {
          throw new Error(
            'User profile does not exist.'
          );
        }

        const userData =
          userSnapshot.data();

        const currentStreak =
          Number(
            userData.currentStreak ?? 0
          );

        const longestStreak =
          Number(
            userData.longestStreak ?? 0
          );

        const currentLevel =
          Number(
            userData.currentLevel ?? 1
          );

        const lastSuccessfulDate =
          userData.lastSuccessfulDate ??
          null;

        const rewardEligible =
          Boolean(
            userData.rewardEligible
          );

        /*
         * Already completed today's
         * challenge.
         */
        if (
          lastSuccessfulDate ===
          today
        ) {
          return {
            currentLevel,
            currentStreak,
            longestStreak,
            rewardEligible,
            alreadyCompletedToday: true,
          };
        }

        /*
         * Determine the new streak.
         *
         * First challenge:
         *     0 → 1
         *
         * Played yesterday:
         *     2 → 3
         *
         * Missed yesterday:
         *     2 → 1
         */
        let newStreak = 1;

        if (
          lastSuccessfulDate ===
          yesterday
        ) {
          newStreak =
            currentStreak + 1;
        }

        /*
         * Level does NOT reset after
         * a missed day.
         */
        const newLevel =
          Math.min(
            currentLevel + 1,
            10
          );

        const newLongestStreak =
          Math.max(
            longestStreak,
            newStreak
          );

        const newRewardEligible =
          rewardEligible ||
          newStreak >= 30;

        transaction.update(
          userRef,
          {
            currentLevel:
              newLevel,

            currentStreak:
              newStreak,

            longestStreak:
              newLongestStreak,

            lastSuccessfulDate:
              today,

            rewardEligible:
              newRewardEligible,

            updatedAt:
              serverTimestamp(),
          }
        );

        return {
          currentLevel:
            newLevel,

          currentStreak:
            newStreak,

          longestStreak:
            newLongestStreak,

          rewardEligible:
            newRewardEligible,

          alreadyCompletedToday:
            false,
        };
      }
    );
  };

export { db };
