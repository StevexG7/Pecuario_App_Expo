import { theme } from '@/constants/Theme';
import { AuthProvider, useAuthContext } from '@/src/context/AuthContext';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check if the user is inside a protected route group.
    const inProtectedArea = segments.length > 0;

    if (!isAuthenticated && inProtectedArea) {
      // User is not authenticated and trying to access a protected screen, so redirect to login.
      router.replace('/');
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.primary.main} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="inicio"
        options={{
          headerShown: false,
          animation: 'none',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="ganado"
        options={{
          headerShown: false,
          animation: 'none',
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="formulario"
        options={{
          headerShown: false,
          animation: 'none',
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add any custom fonts here if needed
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar backgroundColor={theme.primary.main} barStyle="light-content" translucent={true} />
        <RootLayoutNav />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
