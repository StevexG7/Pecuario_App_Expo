import { theme } from '@/constants/Theme';
import { Ionicons } from '@expo/vector-icons';
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
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CustomTabBar from '../components/CustomTabBar';
import FichaCard from '../components/FichaCard';
import { FichaAnimal, obtenerDetalleLoteConPesos, obtenerDietaLote, obtenerMisFichas, probarEndpointPesos, recalcularPesosLote } from '../src/services/animal.service';
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
  const [search, setSearch] = useState('');
  const [selectedFicha, setSelectedFicha] = useState<FichaAnimal | null>(null);
  const [showFichaModal, setShowFichaModal] = useState(false);
  const [dieta, setDieta] = useState<any>(null);
  const [loadingDieta, setLoadingDieta] = useState(false);
  const [errorDieta, setErrorDieta] = useState<string | null>(null);
  
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

  // Cuando se selecciona una ficha, obtener la dieta
  useEffect(() => {
    const fetchDieta = async () => {
      if (selectedFicha && showFichaModal) {
        setLoadingDieta(true);
        setErrorDieta(null);
        try {
          const dietaData = await obtenerDietaLote(selectedFicha.id);
          setDieta(dietaData);
        } catch (e) {
          setErrorDieta('No se pudo obtener la dieta recomendada.');
          setDieta(null);
        } finally {
          setLoadingDieta(false);
        }
      } else {
        setDieta(null);
      }
    };
    fetchDieta();
  }, [selectedFicha, showFichaModal]);

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
  
  // Filtrado por nombre o id de lote
  const filteredFichas = fichas.filter(f => {
    const searchLower = search.toLowerCase();
    return (
      (f.nombre_lote && f.nombre_lote.toLowerCase().includes(searchLower)) ||
      (f.id && f.id.toString().includes(searchLower))
    );
  });

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
        data={filteredFichas}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <View style={styles.cardFicha}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.nombre_lote || `Lote ${item.id}`}</Text>
                <Text style={styles.cardText}>Sexo del animal: {item.genero}</Text>
                <Text style={styles.cardText}>Raza: {item.raza}</Text>
                <Text style={styles.cardText}>Cantidad: {item.cantidad}</Text>
              </View>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => {
                  setSelectedFicha(item);
                  setShowFichaModal(true);
                }}
              >
                <Ionicons name="arrow-forward" size={22} color="#23263B" />
              </TouchableOpacity>
            </View>
          </View>
        )}
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

  // Función para cerrar el modal de ficha y limpiar estados
  const closeFichaModal = () => {
    setShowFichaModal(false);
    setTimeout(() => {
      setSelectedFicha(null);
      setDieta(null);
      setErrorDieta(null);
    }, 300); // Espera a que termine la animación del modal
  };

  // Modal de detalle de ficha
  const FichaModal = () => (
    <Modal
      visible={showFichaModal}
      transparent
      animationType="fade"
      onRequestClose={closeFichaModal}
    >
      <View style={styles.modalOverlayFicha}>
        <View style={styles.fichaModalContainer}>
          <Text style={styles.fichaModalTitle}>{selectedFicha?.nombre_lote || `Lote ${selectedFicha?.id}`}</Text>
          <View style={styles.fichaModalList}>
            {selectedFicha && (
              <>
                <Text style={styles.fichaModalItem}>{'• Sexo del animal: '}{selectedFicha.genero}</Text>
                <Text style={styles.fichaModalItem}>{'• Raza: '}{selectedFicha.raza}</Text>
                <Text style={styles.fichaModalItem}>{'• Cantidad: '}{selectedFicha.cantidad}</Text>
                {selectedFicha.proposito && <Text style={styles.fichaModalItem}>{'• Propósito: '}{selectedFicha.proposito}</Text>}
                {selectedFicha.peso_general_lote !== undefined && <Text style={styles.fichaModalItem}>{'• Peso total del lote: '}{selectedFicha.peso_general_lote} kg</Text>}
                {selectedFicha.peso_individual_estimado !== undefined && <Text style={styles.fichaModalItem}>{'• Peso promedio individual: '}{selectedFicha.peso_individual_estimado} kg</Text>}
              </>
            )}
          </View>
          {/* Mostrar dieta */}
          <View style={styles.fichaModalList}>
            {loadingDieta && <Text style={styles.fichaModalItem}>Cargando dieta...</Text>}
            {errorDieta && <Text style={[styles.fichaModalItem, { color: 'red' }]}>{errorDieta}</Text>}
            {dieta && (
              <>
                <Text style={styles.fichaModalDietaTitle}>Dieta generada</Text>
                <Text style={styles.fichaModalItem}>{'• Peso promedio: '}{dieta.peso_promedio_individual} {dieta.peso_promedio_individual_unidad}</Text>
                <Text style={styles.fichaModalItem}>{'• Rango: '}{dieta.rango}</Text>
                <Text style={styles.fichaModalItem}>{'• Mensaje: '}{dieta.mensaje}</Text>
                <Text style={styles.fichaModalItem}>{'• Cantidad de animales: '}{dieta.cantidad_animales}</Text>
                <Text style={styles.fichaModalItem}>{'• Materia seca por bovino: '}{dieta.materia_seca_recomendada_por_bovino} {dieta.materia_seca_recomendada_por_bovino_unidad}</Text>
                <Text style={styles.fichaModalItem}>{'• Materia seca total: '}{dieta.materia_seca_recomendada_total} {dieta.materia_seca_recomendada_total_unidad}</Text>
                <Text style={styles.fichaModalItem}>{'• Peso total del lote: '}{dieta.peso_total_lote} {dieta.peso_total_lote_unidad}</Text>
                <Text style={styles.fichaModalItem}>{'• Lote: '}{dieta.nombre_lote} (ID: {dieta.lote_id})</Text>
                <Text style={styles.fichaModalItem}>{'• Propósito: '}{dieta.proposito}</Text>
                <Text style={styles.fichaModalDietaSubTitle}>Alimentos recomendados:</Text>
                {Array.isArray(dieta.dieta) && dieta.dieta.length > 0 ? (
                  dieta.dieta.map((item: any, idx: number) => (
                    <View key={idx} style={styles.fichaModalAlimento}>
                      <Text style={styles.fichaModalAlimentoNombre}>{'• Alimento: '}{item.alimento}</Text>
                      <Text style={styles.fichaModalAlimentoDetalle}>{'  - Cantidad por bovino: '}{item.cantidad_recomendada_por_bovino} {item.cantidad_recomendada_por_bovino_unidad}</Text>
                      <Text style={styles.fichaModalAlimentoDetalle}>{'  - Cantidad total: '}{item.cantidad_recomendada_total} {item.cantidad_recomendada_total_unidad}</Text>
                      <Text style={styles.fichaModalAlimentoDetalle}>{'  - Frecuencia: '}{item.frecuencia}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.fichaModalAlimentoDetalle}>No hay alimentos recomendados.</Text>
                )}
              </>
            )}
          </View>
          <View style={styles.fichaModalButtonsRow}>
            <TouchableOpacity onPress={closeFichaModal} style={styles.fichaModalCancelBtn}>
              <Text style={styles.fichaModalCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (selectedFicha?.id) {
                  await handleDeleteLote(selectedFicha.id);
                  closeFichaModal();
                }
              }}
              style={styles.fichaModalDeleteBtn}
            >
              <Text style={styles.fichaModalDeleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
      <FichaModal />
      <View style={styles.headerContainer}>
        <RNImage source={require('../assets/images/Header.png')} style={styles.headerBg} resizeMode="cover" />
        <View style={styles.headerContentCentered}>
          <RNImage source={require('../assets/icons/Book.png')} style={styles.headerUserIcon} resizeMode="contain" />
          <Text style={styles.headerName}>Fichas de ganado</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Text style={styles.searchLabel}>Buscar por lote</Text>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={18} color="#23263B" style={{ marginLeft: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ej. 4524"
            placeholderTextColor="#A3A6B7"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 0,
    backgroundColor: 'transparent',
  },
  searchLabel: {
    color: '#23263B',
    fontSize: 14,
    marginBottom: 4,
    marginLeft: 4,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A3A6B7',
    marginBottom: 8,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#23263B',
    paddingHorizontal: 8,
    height: 40,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    marginBottom: 16,
  },
  cardFicha: {
    backgroundColor: '#FCF8EA',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  arrowButton: {
    backgroundColor: '#FFD24A',
    borderRadius: 8,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  modalOverlayFicha: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fichaModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 6,
  },
  fichaModalTitle: {
    color: '#23263B',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 18,
    textAlign: 'center',
  },
  fichaModalList: {
    width: '100%',
    marginBottom: 24,
  },
  fichaModalItem: {
    color: '#23263B',
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'left',
  },
  fichaModalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  fichaModalCancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
  },
  fichaModalCancelText: {
    color: '#23263B',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fichaModalDeleteBtn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: '#F8D7DA',
    paddingVertical: 12,
    marginLeft: 8,
  },
  fichaModalDeleteText: {
    color: '#C82333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fichaModalDietaTitle: {
    color: '#23263B',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  fichaModalDietaSubTitle: {
    color: '#23263B',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  fichaModalAlimento: {
    marginTop: 4,
    marginBottom: 2,
  },
  fichaModalAlimentoNombre: {
    color: '#23263B',
    fontWeight: 'bold',
    fontSize: 16,
    flexWrap: 'wrap',
    textAlign: 'left',
  },
  fichaModalAlimentoDetalle: {
    color: '#23263B',
    fontSize: 15,
    opacity: 0.85,
    flexWrap: 'wrap',
    textAlign: 'left',
  },
});
