import { theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import { getMisFichas } from '../src/services/lote.service';

export default function Ganado() {
  const [activeTab, setActiveTab] = useState('Ganado');
  const [fichas, setFichas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  

  useEffect(() => {
    const fetchFichas = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: any = await getMisFichas();
        setFichas(data.fichas || data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar las fichas');
      } finally {
        setLoading(false);
      }
    };
    fetchFichas();
  }, []);

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
        <StatusBar backgroundColor={theme.secondary.card_1} />
        <Text style={styles.text}>Fichas de Ganado</Text>
        {loading ? (
          <Text>Cargando...</Text>
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : fichas.length === 0 ? (
          <Text>No tienes fichas registradas.</Text>
        ) : (
          fichas.map((ficha, index) => (
            <View key={ficha.lote_id} style={{ marginVertical: 8, padding: 12, backgroundColor: theme.primary.main, borderRadius: 8, width: '90%' }}>
              <Text style={{ color: theme.primary.text, fontWeight: 'bold' }}>Lote #{index + 1}</Text>
              <Text style={{ color: theme.primary.text }}>Género: {ficha.genero}</Text>
              <Text style={{ color: theme.primary.text }}>Raza: {ficha.raza}</Text>
              <Text style={{ color: theme.primary.text }}>Propósito: {ficha.proposito || 'No especificado'}</Text>
              <Text style={{ color: theme.primary.text }}>Cantidad: {ficha.cantidad} animales</Text>
            </View>
          ))
        )}
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
