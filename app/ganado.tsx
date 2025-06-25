import { theme } from '@/constants/Theme';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Image as RNImage,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import FichaCard from '../components/FichaCard';
import { FichaAnimal, obtenerDetalleLoteConPesos, obtenerMisFichas, probarEndpointPesos, recalcularPesosLote } from '../src/services/animal.service';
import { eliminarLote } from '../src/services/lote.service';

// Función para formatear el peso en kg o toneladas
const formatWeight = (kg: number): string => {
    if (kg >= 1000) {
        const tons = kg / 1000;
        // Redondea a 2 decimales si es necesario
        return `${Math.round(tons * 100) / 100} t`;
    }
    return `${kg} kg`;
};

const AppAlert = ({ message, onClose }: { message: string; onClose: () => void }) => {
  if (!message) return null;
  return (
    <Modal
      transparent
      visible={!!message}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>{message}</Text>
          <TouchableOpacity style={styles.alertButton} onPress={onClose}>
            <Text style={styles.alertButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function Ganado() {
  const [activeTab, setActiveTab] = useState('Ganado');
  const [fichas, setFichas] = useState<FichaAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alert, setAlert] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const fetchFichasConPesos = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFichasConPesos();
  }, []);

  // Función para recargar datos (útil cuando se regresa del formulario)
  const handleRefresh = () => {
    fetchFichasConPesos(true);
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
      await fetchFichasConPesos(true);
    } catch (error) {
      console.error('❌ Error al recalcular pesos:', error);
    }
  };

  const handleDeleteLote = (loteId: number) => {
    setConfirmDeleteId(loteId);
    setShowConfirm(true);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
        case 'Inicio':
            router.replace('/inicio');
            break;
        case 'Ganado':
            router.replace('/ganado');
            break;
        case 'Formulario':
            router.replace('/formulario');
            break;
        case 'Perfil':
            router.replace('/perfil');
            break;
    }
  };

  const renderFicha = useCallback(({ item, index }: { item: FichaAnimal; index: number }) => (
    <FichaCard
      ficha={item}
      index={index}
      onPress={() => router.push({ pathname: '/detalle-ficha/[id]', params: { id: item.id } })}
      onDelete={handleDeleteLote}
    />
  ), [router]);

  const keyExtractor = useCallback((item: FichaAnimal) => {
    return item.id ? item.id.toString() : `ficha-${item.nombre_lote}-${item.cantidad}`;
  }, []);
  
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
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={[styles.centered, styles.emptyText]}>No tienes fichas registradas.</Text>}
        ref={flatListRef}
        showsVerticalScrollIndicator={true}
        bounces={true}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        scrollEnabled={true}
        nestedScrollEnabled={false}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AppAlert message={alert ?? ''} onClose={() => setAlert(null)} />
      {showConfirm && (
        <Modal
          transparent
          visible={showConfirm}
          animationType="fade"
          onRequestClose={() => setShowConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.alertContainer}>
              <Text style={[styles.alertText, { fontWeight: 'bold', fontSize: 20, marginBottom: 8 }]}>Eliminar lote</Text>
              <Text style={styles.alertText}>¿Estás seguro de que deseas eliminar este lote?</Text>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TouchableOpacity
                  style={[styles.alertButton, { backgroundColor: '#ff4444', marginRight: 8 }]}
                  onPress={async () => {
                    if (typeof confirmDeleteId === 'number') {
                      try {
                        await eliminarLote(confirmDeleteId);
                        setAlert('Lote eliminado correctamente.');
                        setShowConfirm(false);
                        setConfirmDeleteId(null);
                        fetchFichasConPesos(true);
                      } catch (err) {
                        setAlert('No se pudo eliminar el lote.');
                        setShowConfirm(false);
                        setConfirmDeleteId(null);
                      }
                    }
                  }}
                >
                  <Text style={styles.alertButtonText}>Eliminar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.alertButton}
                  onPress={() => {
                    setShowConfirm(false);
                    setConfirmDeleteId(null);
                  }}
                >
                  <Text style={styles.alertButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      <View style={styles.headerContainer}>
        <RNImage source={require('../assets/images/Header.png')} style={styles.headerBg} resizeMode="cover" />
        <View style={styles.headerContentCentered}>
          <RNImage source={require('../assets/icons/Book.png')} style={styles.headerUserIcon} resizeMode="contain" />
          <Text style={styles.headerName}>Fichas de ganado</Text>
        </View>
      </View>
      <View style={styles.content}>
        <ListContent />
      </View>
      <CustomTabBar activeTab={activeTab} onTabPress={handleTabPress} backgroundColor="#F0E8C9" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondary.card_2,
  },
  headerContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
    backgroundColor: '#F0E8C9',
    borderBottomRightRadius: 120,
    borderBottomLeftRadius: 0,
    overflow: 'hidden',
    marginBottom: 12,
  },
  headerBg: {
    position: 'absolute',
    width: '130%',
    height: '100%',
    top: 0,
    left: '-15%',
    zIndex: 2,
  },
  headerContentCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    zIndex: 3,
    marginTop: 10,
    marginLeft: 25,
  },
  headerUserIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerName: {
    color: '#23263B',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    backgroundColor: theme.primary.main,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  alertText: {
    color: theme.primary.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 18,
  },
  alertButton: {
    backgroundColor: theme.primary.button,
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  alertButtonText: {
    color: theme.primary.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
