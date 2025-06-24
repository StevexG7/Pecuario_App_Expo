import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../constants/Theme';

export default function EstabloMiniCard({ lote, onPress }: { lote: any, onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <MaterialCommunityIcons name="cow" size={44} color={theme.primary.text} style={{ marginBottom: 8 }} />
      <Text style={styles.loteNumber}>{lote.nombre_lote || lote.nombre || lote.id}</Text>
    </TouchableOpacity>
  );
}

const CARD_SIZE = 100;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.primary.main,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: CARD_SIZE,
    height: CARD_SIZE,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  loteNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.primary.text,
    letterSpacing: 1,
    marginTop: 2,
    textAlign: 'center',
    width: '100%',
  },
}); 