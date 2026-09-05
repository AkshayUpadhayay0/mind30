import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getUserProfile,
  resetStreakIfMissedDay,
  UserProfile,
} from '../services/firestore';

import { useAuth } from './AuthContext';

type UserContextType = {
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const UserContext =
  createContext<UserContextType>({
    profile: null,
    loading: true,
    refreshProfile: async () => {},
  });

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({
  children,
}: UserProviderProps) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const loadProfile =
    useCallback(async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        /*
         * First check whether the user
         * missed a day.
         *
         * If they did, this updates
         * currentStreak to 0 in Firebase.
         */
        await resetStreakIfMissedDay(
          user.uid
        );

        /*
         * Now read the latest profile
         * from Firebase.
         */
        const userProfile =
          await getUserProfile(
            user.uid
          );

        setProfile(userProfile);
      } catch (error) {
        console.error(
          'Failed to load user profile:',
          error
        );

        setProfile(null);
      } finally {
        setLoading(false);
      }
    }, [user]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadProfile();
  }, [
    authLoading,
    loadProfile,
  ]);

  return (
    <UserContext.Provider
      value={{
        profile,
        loading:
          authLoading || loading,
        refreshProfile:
          loadProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}