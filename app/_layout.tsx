import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '../src/context/AuthContext';
import { UserProvider } from '../src/context/UserContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <StatusBar style="light" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#0A0D10',
            },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </UserProvider>
    </AuthProvider>
  );
}