import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../constants/Theme';

// Props: ficha (objeto), onPress (función opcional), onDelete (función opcional)
export default function FichaCard({ ficha, index, onPress, onDelete }: { ficha: any, index?: number, onPress?: () => void, onDelete?: (id: number) => void }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress} disabled={!onPress}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.cardTitle}>{index !== undefined ? `${index + 1}. ` : ''}{ficha.nombre_lote || ficha.nombre || ficha.id}</Text>
        {onDelete && (
          <TouchableOpacity
            onPress={() => onDelete(ficha.id)}
            style={{ marginLeft: 12 }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash" size={22} color="red" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.cardText}><Ionicons name="male-female-outline" size={16} /> {ficha.genero}</Text>
        <Text style={styles.cardText}><Ionicons name="paw-outline" size={16} /> {ficha.raza}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.cardText}><Ionicons name="logo-stackoverflow" size={16} /> {ficha.cantidad} animales</Text>
        {ficha.proposito && (
          <Text style={styles.cardText}><Ionicons name="information-circle-outline" size={16} /> {ficha.proposito}</Text>
        )}
      </View>
      <View style={styles.weightSection}>
        {ficha.peso_general_lote !== undefined ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.weightTitle}>Peso Total del Lote:</Text>
              <Text style={styles.weightValue}>{ficha.peso_general_lote} kg</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.weightTitle}>Peso promedio individual:</Text>
              <Text style={styles.weightValue}>
                {ficha.peso_individual_estimado !== undefined
                  ? `${ficha.peso_individual_estimado} kg`
                  : 'No disponible'}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.noPesoContainer}>
            <Text style={styles.noPesoText}>No hay datos de peso disponibles</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    flexShrink: 1,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
}); 