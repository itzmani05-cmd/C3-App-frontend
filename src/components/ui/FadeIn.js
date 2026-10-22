import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import useReduceMotion from '../../hooks/useReduceMotion';

// Fades and lifts its children into place once on mount. Give list items a `delay` that grows with their index (capped
// by the caller) for a gentle stagger.
export default function FadeIn({ delay = 0, duration = 320, distance = 10, style, children }) {
  const reduceMotion = useReduceMotion();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(progress, { toValue: 1, duration, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    animation.start();
    return () => animation.stop();
    // Plays once when the item first appears.
  }, [reduceMotion]);

  return (
    <Animated.View
      style={[
        style,
        { opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }) }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Stagger helper: the first few items cascade in, later ones (scrolled into view) appear straight away.
export const staggerDelay = (index) => (index < 8 ? index * 45 : 0);
