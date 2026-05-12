import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '../constants';

/**
 * Minimal animated background with luxury colors
 */
export const AnimatedBackground = () => {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;
  const anim4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animValue, duration, delay = 0) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createAnimation(anim1, 4000, 0),
      createAnimation(anim2, 5000, 800),
      createAnimation(anim3, 4500, 1600),
      createAnimation(anim4, 5500, 2400),
    ]).start();
  }, []);

  const translateY1 = anim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const translateY2 = anim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const translateY3 = anim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -28],
  });

  const translateY4 = anim4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -32],
  });

  const opacity1 = anim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.03, 0.08, 0.03],
  });

  const opacity2 = anim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.03, 0.06, 0.03],
  });

  const opacity3 = anim3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.03, 0.05, 0.03],
  });

  const opacity4 = anim4.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.03, 0.07, 0.03],
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Floating Circle 1 - Gold */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '18%',
          left: '12%',
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: Colors.accent,
          opacity: opacity1,
          transform: [{ translateY: translateY1 }],
        }}
      />

      {/* Floating Circle 2 - Primary */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '28%',
          right: '18%',
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: Colors.primary,
          opacity: opacity2,
          transform: [{ translateY: translateY2 }],
        }}
      />

      {/* Floating Circle 3 - Accent Light */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '55%',
          left: '8%',
          width: 85,
          height: 85,
          borderRadius: 42.5,
          backgroundColor: Colors.accentLight,
          opacity: opacity3,
          transform: [{ translateY: translateY3 }],
        }}
      />

      {/* Floating Circle 4 - Primary */}
      <Animated.View
        style={{
          position: 'absolute',
          top: '65%',
          right: '15%',
          width: 75,
          height: 75,
          borderRadius: 37.5,
          backgroundColor: Colors.primary,
          opacity: opacity4,
          transform: [{ translateY: translateY4 }],
        }}
      />
    </View>
  );
};
