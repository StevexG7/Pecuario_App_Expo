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

    // Un área protegida es cualquier ruta que NO sea la de inicio o la de recuperar contraseña.
    const isProtectedRoute = segments.length > 0 && segments[0] !== 'recoverpass';

    if (!isAuthenticated && isProtectedRoute) {
      // Si el usuario no está autenticado y trata de acceder a una ruta protegida,
      // lo redirigimos al login.
      router.replace('/');
    }
    // Opcional: si el usuario YA está autenticado y visita el login/recuperar, redirigirlo a 'inicio'.
    else if (isAuthenticated && !isProtectedRoute) {
        router.replace('/inicio');
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
      <Stack.Screen name="index" options={{ title: 'Login' }} />
      <Stack.Screen name="recoverpass" options={{ title: 'Recuperar Contraseña' }} />
      <Stack.Screen name="transition" options={{ title: 'Transición' }} />

      {/* Pantallas principales de la app */}
      <Stack.Screen name="inicio" />
      <Stack.Screen name="ganado" />
      <Stack.Screen name="formulario" />
      <Stack.Screen name="perfil" />
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
