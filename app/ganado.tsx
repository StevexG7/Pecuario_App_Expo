import { theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, StatusBar } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

export default function Ganado() {
  const [activeTab, setActiveTab] = useState('Ganado');
  const router = useRouter();
  

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'Inicio') {
      router.push('/inicio');
    } else if (tab === 'Ganado') {
      router.push('/ganado');
    }
    // Puedes agregar más rutas según tus tabs
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        <Text style={styles.text}>Esta es la vista del ganado</Text>
        <StatusBar backgroundColor={theme.secondary.card_1} />
      </View>
      <CustomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondary.card_2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.primary.text,
  },
});
