import { theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTabBar from '../components/CustomTabBar';
import { FichaAnimal, obtenerDetalleLoteConPesos, obtenerMisFichas, probarEndpointPesos, recalcularPesosLote } from '../src/services/animal.service';

// Función para formatear el peso en kg o toneladas
const formatWeight = (kg: number): string => {
    if (kg >= 1000) {
        const tons = kg / 1000;
        // Redondea a 2 decimales si es necesario
        return `${Math.round(tons * 100) / 100} t`;
    }
    return `${kg} kg`;
};

export default function Ganado() {
  const [activeTab, setActiveTab] = useState('Ganado');
  const [fichas, setFichas] = useState<FichaAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTabBarTransparent, setIsTabBarTransparent] = useState(false);
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const fetchFichasConPesos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Iniciando fetchFichasConPesos...');
      
      // 1. Obtenemos la lista de fichas base
      const fichasBase = await obtenerMisFichas();
      console.log('📋 Fichas base obtenidas:', fichasBase);
      console.log('📊 Cantidad de fichas base:', fichasBase.length);

      // 2. Para cada ficha, obtenemos el detalle completo con pesos
      const fichasConPesos = await Promise.all(
        fichasBase.map(async (ficha) => {
          try {
            // Verificar que la ficha tenga un ID válido
            if (!ficha.id) {
              console.warn('⚠️ Ficha sin ID válido:', ficha);
              return {
                ...ficha,
                peso_general_lote: undefined,
                peso_individual_estimado: undefined,
              };
            }
            
            console.log(`🔍 Obteniendo detalle completo para lote ${ficha.id}...`);
            const detalleLote = await obtenerDetalleLoteConPesos(ficha.id);
            
            if (detalleLote) {
              console.log(`📊 Detalle completo para lote ${ficha.id}:`, detalleLote);
              return {
                ...ficha,
                nombre_lote: detalleLote.nombre_lote,
                genero: detalleLote.genero,
                raza: detalleLote.raza,
                cantidad: detalleLote.cantidad,
                proposito: detalleLote.proposito,
                peso_general_lote: detalleLote.peso_total_lote,
                peso_individual_estimado: detalleLote.peso_promedio_individual,
              };
            } else {
              console.warn(`⚠️ No se pudo obtener detalle para lote ${ficha.id}, usando datos básicos`);
              return ficha;
            }
          } catch (error) {
            console.warn(`⚠️ Error al obtener detalle para lote ${ficha.id}:`, error);
            return ficha;
          }
        })
      );
      
      console.log('🎉 Fichas con pesos procesadas:', fichasConPesos);
      console.log('📊 Total final de fichas:', fichasConPesos.length);
      
      // 3. Actualizamos el estado con los datos completos
      setFichas(fichasConPesos);
    } catch (err: any) {
      console.error('❌ Error al cargar las fichas:', err);
      setError(err.message || 'Error al cargar las fichas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFichasConPesos();
  }, []);

  // Recargar datos cuando la pantalla vuelve a estar en foco (ej. al regresar del formulario)
  useFocusEffect(
    useCallback(() => {
      fetchFichasConPesos();
    }, [])
  );

  // Función para recargar datos (útil cuando se regresa del formulario)
  const handleRefresh = () => {
    fetchFichasConPesos();
  };

  // Función para probar el endpoint de pesos
  const handleTestPesos = async () => {
    console.log('🧪 Iniciando prueba del endpoint de pesos...');
    // Probar con el primer lote que tengamos, o con un ID fijo
    if (fichas.length > 0) {
      const primerLoteId = fichas[0].id;
      console.log(`🧪 Probando con lote ID: ${primerLoteId}`);
      await probarEndpointPesos(primerLoteId);
    } else {
      console.log('🧪 No hay fichas disponibles para probar');
      // Probar con un ID fijo (cambia este número por uno que exista en tu backend)
      await probarEndpointPesos(1);
    }
  };

  // Función para recalcular pesos de un lote específico
  const handleRecalcularPesos = async (loteId: number) => {
    try {
      console.log(`🔄 Recalculando pesos para lote ${loteId}...`);
      await recalcularPesosLote(loteId);
      // Recargar los datos después de recalcular
      await fetchFichasConPesos();
    } catch (error) {
      console.error('❌ Error al recalcular pesos:', error);
    }
  };

  // Función para detectar el scroll y ajustar la transparencia de la barra
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const contentHeight = contentSize.height;
    const screenHeight = layoutMeasurement.height;
    
    // Calcular si estamos cerca del final de la lista
    const distanceFromBottom = contentHeight - scrollY - screenHeight;
    const threshold = 150; // Distancia en píxeles desde el final
    
    // Hacer transparente si estamos cerca del final o si hay poco contenido
    const shouldBeTransparent = distanceFromBottom < threshold || contentHeight < screenHeight;
    
    setIsTabBarTransparent(shouldBeTransparent);
  };

  const handleTabPress = (tab: string) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    if (tab === 'Inicio' || tab === 'Formulario' || tab === 'Perfil') {
      router.replace(`/${tab.toLowerCase()}` as any);
    }
  };

  const renderFicha = ({ item, index }: { item: FichaAnimal; index: number }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{`${index + 1}. ${item.nombre_lote}`}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.cardText}><Ionicons name="male-female-outline" size={16} /> {item.genero}</Text>
        <Text style={styles.cardText}><Ionicons name="paw-outline" size={16} /> {item.raza}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.cardText}><Ionicons name="logo-stackoverflow" size={16} /> {item.cantidad} animales</Text>
        {item.proposito && (
          <Text style={styles.cardText}><Ionicons name="information-circle-outline" size={16} /> {item.proposito}</Text>
        )}
      </View>
      
      {/* Sección de Pesos */}
      <View style={styles.weightSection}>
        {/* Mostrar peso total */}
        {item.peso_general_lote !== undefined ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.weightTitle}>Peso Total del Lote:</Text>
              <Text style={styles.weightValue}>{formatWeight(item.peso_general_lote)}</Text>
            </View>
            {/* Mostrar SIEMPRE el peso individual estimado si está definido */}
            <View style={styles.infoRow}>
              <Text style={styles.weightTitle}>Peso promedio individual:</Text>
              <Text style={styles.weightValue}>
                {item.peso_individual_estimado !== undefined
                  ? formatWeight(item.peso_individual_estimado)
                  : 'No disponible'}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.noPesoContainer}>
            <Text style={styles.noPesoText}>No hay datos de peso disponibles</Text>
            <TouchableOpacity 
              style={styles.recalcularButton}
              onPress={() => handleRecalcularPesos(item.id)}
            >
              <Text style={styles.recalcularButtonText}>Recalcular Pesos</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
  
  const ListContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={theme.primary.text} style={styles.centered} />;
    }
    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubtext}>
            {error.includes('conectar') || error.includes('disponible') 
              ? 'Verifica tu conexión a internet o contacta al administrador.'
              : 'Intenta recargar la página más tarde.'}
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={fichas}
        renderItem={renderFicha}
        keyExtractor={(item) => (item.id ? item.id.toString() : `ficha-${Math.random()}`)}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={[styles.centered, styles.emptyText]}>No tienes fichas registradas.</Text>}
        ref={flatListRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="always"
        nestedScrollEnabled={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fichas de Ganado</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.testButton} onPress={handleTestPesos}>
            <Ionicons name="flask-outline" size={20} color={theme.primary.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Ionicons name="refresh-outline" size={24} color={theme.primary.text} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <ListContent />
      </View>
      <CustomTabBar 
        activeTab={activeTab} 
        onTabPress={handleTabPress}
        isTransparent={isTabBarTransparent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondary.card_2,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.primary.main,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.primary.text,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: theme.primary.main,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: theme.primary.text,
    lineHeight: 24,
    flexShrink: 1, // Para que el texto se ajuste
  },
  weightSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: theme.primary.text,
  },
  weightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primary.text,
  },
  weightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primary.text,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSubtext: {
    color: theme.primary.text,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  emptyText: {
    color: theme.primary.text,
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary.text,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPesoContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  noPesoText: {
    color: theme.primary.text,
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  recalcularButton: {
    backgroundColor: theme.primary.button,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recalcularButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.primary.text,
  },
});
