import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from 'react';

import {
    getUserProfile,
    UserProfile,
} from '../services/firestore';
import { useAuth } from './AuthContext';

type UserContextType = {
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
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
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const userProfile = await getUserProfile(user.uid);

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
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadProfile();
  }, [user, authLoading]);

  return (
    <UserContext.Provider
      value={{
        profile,
        loading: authLoading || loading,
        refreshProfile: loadProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
