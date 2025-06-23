import { Ionicons } from '@expo/vector-icons';
import { darken } from 'polished';
import React, { useState } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import { responsiveHeight as rh } from 'react-native-responsive-dimensions';
import { theme } from '../constants/Theme';

const tabs = [
  { name: 'Inicio', icon: 'home-outline' },
  { name: 'Ganado', icon: 'stats-chart-outline' },
  { name: 'Formulario', icon: 'add-circle-outline' },
  { name: 'Perfil', icon: 'person-outline' },
];

type CustomTabBarProps = {
  activeTab: string;
  onTabPress: (tab: string) => void;
  isTransparent?: boolean;
  backgroundColor?: string;
};

interface TabLayout {
  x: number;
  width: number;
  height: number;
}

const CustomTabBar = ({ 
  activeTab, 
  onTabPress, 
  isTransparent = false,
  backgroundColor = theme.primary.main 
}: CustomTabBarProps) => {
  const [tabLayouts, setTabLayouts] = useState<Record<number, { x: number; width: number }>>({});
  const [contentWidths, setContentWidths] = useState<Record<number, number>>({});
  const activeColor = darken(0.1, backgroundColor);

  const activeIndex = tabs.findIndex(tab => tab.name === activeTab);
  
  const handleButtonLayout = (event: LayoutChangeEvent, index: number) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => ({ ...prev, [index]: { x, width } }));
  };

  const handleContentLayout = (event: LayoutChangeEvent, index: number) => {
    const { width } = event.nativeEvent.layout;
    setContentWidths(prev => ({ ...prev, [index]: width }));
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.tabBar,
        {
          backgroundColor: isTransparent ? 'rgba(240, 232, 201, 0.95)' : backgroundColor,
          shadowOpacity: isTransparent ? 0.4 : 0.15,
          elevation: isTransparent ? 20 : 10,
        }
      ]}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => onTabPress(tab.name)}
              onLayout={(e) => handleButtonLayout(e, index)}
            >
              <View 
                style={styles.tabContent}
                onLayout={(e) => handleContentLayout(e, index)}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={isActive ? 24 : 26}
                  color={theme.primary.text}
                />
                {isActive && (
                  <Animated.Text style={styles.tabLabel} numberOfLines={1} adjustsFontSizeToFit>
                    {tab.name}
                  </Animated.Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: rh(2.5),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    width: '90%',
    maxWidth: 400,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 22,
  },
  tabLabel: {
    color: theme.primary.text,
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 13,
  },
});

export default CustomTabBar; 