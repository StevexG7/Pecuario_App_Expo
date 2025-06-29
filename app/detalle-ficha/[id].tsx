import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../constants/Theme';
import { FichaAnimal, obtenerDetalleLoteConPesos, obtenerDietaLote, obtenerMisFichas } from '../../src/services/animal.service';
import { eliminarLote } from '../../src/services/lote.service';

export default function DetalleFicha() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [ficha, setFicha] = useState<FichaAnimal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dieta, setDieta] = useState<any>(null);
  const [loadingDieta, setLoadingDieta] = useState(false);
  const [errorDieta, setErrorDieta] = useState<string | null>(null);

  useEffect(() => {
    const fetchFicha = async () => {
      setLoading(true);
      setError(null);
      try {
        // Buscar primero en los lotes del usuario
        const fichas = await obtenerMisFichas();
        let found = fichas.find((f: any) => String(f.id) === String(id)) || null;
        if (!found) {
          const detalle = await obtenerDetalleLoteConPesos(Number(id));
          if (detalle) {
            found = {
              id: detalle.lote_id,
              nombre_lote: detalle.nombre_lote,
              genero: detalle.genero,
              raza: detalle.raza,
              cantidad: detalle.cantidad,
              proposito: detalle.proposito,
              peso_general_lote: detalle.peso_total_lote,
              peso_individual_estimado: detalle.peso_promedio_individual,
            };
          }
        }
        setFicha(found);
        console.log('Ficha encontrada:', found);
        // Si es un lote válido, buscar dieta
        if (found && found.id) {
          setLoadingDieta(true);
          setErrorDieta(null);
          try {
            console.log('ID usado para dieta:', found.id);
            const dietaData = await obtenerDietaLote(found.id);
            console.log('Respuesta de obtenerDietaLote:', dietaData, typeof dietaData);
            setDieta(dietaData);
            setTimeout(() => {
              console.log('Estado dieta después de setDieta:', dieta);
            }, 1000);
          } catch (e) {
            setErrorDieta('No se pudo obtener la dieta recomendada.');
            console.error('Error al obtener dieta:', e);
          } finally {
            setLoadingDieta(false);
          }
        } else {
          setDieta(null);
        }
      } catch (err: any) {
        setError('No se pudo cargar la ficha.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFicha();
    // FORZAR UN VALOR DE DIETA PARA DESCARTAR PROBLEMAS DE RENDER
    // setDieta({
    //   peso_promedio_individual: 100,
    //   peso_promedio_individual_unidad: 'kg',
    //   rango: '90-110',
    //   mensaje: 'Dieta de prueba',
    //   cantidad_animales: 10,
    //   materia_seca_recomendada_por_bovino: 10,
    //   materia_seca_recomendada_por_bovino_unidad: 'kg',
    //   materia_seca_recomendada_total: 100,
    //   materia_seca_recomendada_total_unidad: 'kg',
    //   peso_total_lote: 1000,
    //   peso_total_lote_unidad: 'kg',
    //   nombre_lote: 'Lote Prueba',
    //   lote_id: 1,
    //   proposito: 'Engorde',
    //   dieta: [
    //     { alimento: 'Pasto', cantidad_recomendada_por_bovino: 10, cantidad_recomendada_por_bovino_unidad: 'kg', cantidad_recomendada_total: 100, cantidad_recomendada_total_unidad: 'kg', frecuencia: 'diaria' }
    //   ]
    // });
  }, [id]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.primary.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Ficha</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && <Text style={styles.loading}>Cargando...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
        {errorDieta && <Text style={{ color: 'red' }}>{errorDieta}</Text>}
        {dieta && (
          <View style={styles.dietaBox}>
            <Text style={styles.dietaTitle}>Dieta generada</Text>
            <Text style={styles.dietaDato}>Peso promedio: {dieta.peso_promedio_individual} {dieta.peso_promedio_individual_unidad}</Text>
            <Text style={styles.dietaDato}>Rango: {dieta.rango}</Text>
            <Text style={styles.dietaDato}>Mensaje: {dieta.mensaje}</Text>
            <Text style={styles.dietaDato}>Cantidad de animales: {dieta.cantidad_animales}</Text>
            <Text style={styles.dietaDato}>Materia seca por bovino: {dieta.materia_seca_recomendada_por_bovino} {dieta.materia_seca_recomendada_por_bovino_unidad}</Text>
            <Text style={styles.dietaDato}>Materia seca total: {dieta.materia_seca_recomendada_total} {dieta.materia_seca_recomendada_total_unidad}</Text>
            <Text style={styles.dietaDato}>Peso total del lote: {dieta.peso_total_lote} {dieta.peso_total_lote_unidad}</Text>
            <Text style={styles.dietaDato}>Lote: {dieta.nombre_lote} (ID: {dieta.lote_id})</Text>
            <Text style={styles.dietaDato}>Propósito: {dieta.proposito}</Text>
            <Text style={styles.dietaSubTitle}>Alimentos recomendados:</Text>
            {Array.isArray(dieta.dieta) && dieta.dieta.length > 0 ? (
              dieta.dieta.map((item: any, idx: number) => (
                <View key={idx} style={styles.dietaAlimento}>
                  <Text style={styles.dietaAlimentoNombre}>Alimento: {item.alimento}</Text>
                  <Text style={styles.dietaAlimentoDetalle}>Cantidad por bovino: {item.cantidad_recomendada_por_bovino} {item.cantidad_recomendada_por_bovino_unidad}</Text>
                  <Text style={styles.dietaAlimentoDetalle}>Cantidad total: {item.cantidad_recomendada_total} {item.cantidad_recomendada_total_unidad}</Text>
                  <Text style={styles.dietaAlimentoDetalle}>Frecuencia: {item.frecuencia}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.dietaAlimentoDetalle}>No hay alimentos recomendados.</Text>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                padding: 16,
                borderRadius: 8,
                marginTop: 32,
                alignItems: 'center',
              }}
              onPress={() => {
                Alert.alert(
                  'Eliminar lote',
                  '¿Estás seguro de que deseas eliminar este lote?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Eliminar',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await eliminarLote(dieta.lote_id);
                          Alert.alert('Lote eliminado', 'El lote ha sido eliminado correctamente.');
                          router.replace('/ganado');
                        } catch (err) {
                          Alert.alert('Error', 'No se pudo eliminar el lote.');
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Eliminar lote</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondary.card_2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: theme.primary.main,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary.text,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 0,
    paddingBottom: 20,
    alignItems: 'stretch',
  },
  loading: {
    fontSize: 16,
    color: theme.primary.text,
    marginTop: 40,
  },
  error: {
    fontSize: 16,
    color: 'red',
    marginTop: 40,
  },
  dietaContainer: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  dietaTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.primary.text,
    marginBottom: 12,
    marginTop: -10,
  },
  dietaBox: {
    backgroundColor: theme.primary.main,
    borderRadius: 0,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: '100%',
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dietaMensaje: {
    color: theme.primary.text,
    marginBottom: 8,
    fontSize: 15,
  },
  dietaDato: {
    color: theme.primary.text,
    fontSize: 20,
    marginBottom: 8,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  dietaSubTitle: {
    color: theme.primary.text,
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  dietaAlimento: {
    marginTop: 4,
    marginBottom: 2,
  },
  dietaAlimentoNombre: {
    color: theme.primary.text,
    fontWeight: 'bold',
    fontSize: 18,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  dietaAlimentoDetalle: {
    color: theme.primary.text,
    fontSize: 17,
    opacity: 0.85,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  cardFullWidth: {
    width: '100%',
    alignItems: 'center',
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: theme.primary.main,
    marginVertical: 24,
  },
}); 