import { theme } from '@/constants/Theme';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
    <SafeAreaProvider>
      <StatusBar backgroundColor={theme.primary.main} barStyle="light-content" translucent={true} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#151718' : '#fff',
          },
          headerTintColor: colorScheme === 'dark' ? '#ECEDEE' : '#11181C',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
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
    </SafeAreaProvider>
  );
}
