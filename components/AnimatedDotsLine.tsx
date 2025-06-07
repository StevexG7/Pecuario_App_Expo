import { theme } from '@/constants/Theme';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

interface AnimatedDotsLineProps {
  dotCount?: number;
  duration?: number;
  dotColor?: string;
  lineColor?: string;
  style?: any;
}

const DOT_SIZE = 12;

const AnimatedDotsLine: React.FC<AnimatedDotsLineProps> = ({
  dotCount = 3,
  duration = 2000,
  dotColor = theme.primary.button,
  lineColor = '#23263B',
  style = {},
}) => {
  const dotAnims = useRef(Array.from({ length: dotCount }, () => new Animated.Value(0))).current;
  const [lineW, setLineW] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const animate = () => {
      if (!isMounted) return;
      dotAnims.forEach((anim, i) => {
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration,
          delay: i * (duration / dotCount / 1.5),
          useNativeDriver: true,
        }).start(() => {
          if (i === dotCount - 1 && isMounted) animate();
        });
      });
    };
    animate();
    return () => { isMounted = false; };
  }, [dotAnims, duration, dotCount]);

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', width: '100%' }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative', flex: 1 }}>
        {/* Línea */}
        <View
          style={{
            flex: 1,
            height: 4,
            backgroundColor: lineColor,
            borderRadius: 2,
            marginHorizontal: 2,
            position: 'relative',
            overflow: 'visible',
          }}
          onLayout={e => setLineW(e.nativeEvent.layout.width)}
        >
          {/* Puntos animados */}
          {lineW > 0 && dotAnims.map((anim, i) => {
            const translateX = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, lineW - DOT_SIZE],
            });
            const opacity = anim.interpolate({
              inputRange: [0, 0.85, 1],
              outputRange: [1, 1, 0],
            });
            return (
              <Animated.View
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: -4,
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  borderRadius: DOT_SIZE / 2,
                  backgroundColor: dotColor,
                  transform: [{ translateX }],
                  opacity,
                }}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default AnimatedDotsLine; 