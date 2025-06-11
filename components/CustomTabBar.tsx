import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const tabs = [
  { label: 'Inicio', icon: <Ionicons name="bookmark-outline" size={28} />, key: 'Inicio' },
  { label: 'Ganado', icon: <MaterialCommunityIcons name="cow" size={28} />, key: 'Ganado' },
  { label: 'Inventario', icon: <Ionicons name="list-outline" size={28} />, key: 'Inventario' },
  { label: 'Perfil', icon: <Ionicons name="person-outline" size={28} />, key: 'Perfil' },
];

type CustomTabBarProps = {
  activeTab: string;
  onTabPress: (tab: string) => void;
};

export default function CustomTabBar({ activeTab, onTabPress }: CustomTabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            activeTab === tab.key && styles.activeTab
          ]}
          onPress={() => onTabPress(tab.key)}
        >
          {tab.icon}
          <Text style={styles.label}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F6EFCB',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#F3ECC7',
    transform: [{ scale: 1.15 }],
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#3B3640',
    marginTop: 2,
  },
}); 