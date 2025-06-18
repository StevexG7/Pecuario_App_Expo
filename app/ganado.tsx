import { theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

export default function Ganado() {
  const [activeTab, setActiveTab] = useState('Ganado');
  const router = useRouter();
  

  const handleTabPress = (tab: string) => {
    if (tab === activeTab) return; // Si ya estamos en esa pestaña, no hacer nada
    setActiveTab(tab);
    switch (tab) {
      case 'Ganado':
        router.replace('/ganado');
        break;
      case 'Inicio':
        router.replace('/inicio');
        break;
      case 'Formulario':
        router.replace('/formulario' as any);
        break;
      case 'Perfil':
        // Aquí puedes agregar la navegación al perfil cuando lo implementes
        break;
    }
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
