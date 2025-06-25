import { Ionicons } from '@expo/vector-icons';
import { darken } from 'polished';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
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
  
  // Animación para el círculo y el icono
  const anim = useRef(new Animated.Value(activeIndex)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: activeIndex,
      duration: 250,
      useNativeDriver: false,
      easing: Easing.out(Easing.exp),
    }).start();
  }, [activeIndex]);

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
          // Animación de escala para el icono y el fondo
          const scale = anim.interpolate({
            inputRange: tabs.map((_, i) => i),
            outputRange: tabs.map((_, i) => (i === index ? 1.05 : 1)),
          });
          const circleOpacity = anim.interpolate({
            inputRange: tabs.map((_, i) => i),
            outputRange: tabs.map((_, i) => (i === index ? 1 : 0)),
          });
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabButton}
              onPress={() => onTabPress(tab.name)}
              onLayout={(e) => handleButtonLayout(e, index)}
              activeOpacity={0.8}
            >
              <View style={styles.tabContent} onLayout={(e) => handleContentLayout(e, index)}>
                <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <Animated.View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: -150,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: circleOpacity,
                    transform: [{ scale }],
                    zIndex: 0,
                  }}>
                    <View style={styles.activeTabBg} />
                  </Animated.View>
                  <Animated.View style={{ zIndex: 1, transform: [{ scale }] }}>
                    <Ionicons
                      name={tab.icon as any}
                      size={isActive ? 23 : 25}
                      color={theme.primary.text}
                    />
                  </Animated.View>
                </View>
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
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F0E8C9',
    shadowColor: 'transparent',
    elevation: 0,
    width: '100%',
    minHeight: 62,
    paddingVertical: 0,
    margin: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    paddingVertical: 8,
  },
  tabContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  tabLabel: {
    color: theme.primary.text,
    marginTop: 2,
    fontWeight: '600',
    fontSize: 15,
  },
  activeTabBg: {
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 20,
    width: 40,
    height: 40,
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    alignSelf: 'center',
  },
});

export default CustomTabBar; 