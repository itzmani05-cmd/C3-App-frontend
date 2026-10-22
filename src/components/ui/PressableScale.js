import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import useReduceMotion from '../../hooks/useReduceMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * A pressable that shrinks very slightly while held, so taps feel physical. It takes the same style, accessibility
 * and onPress props as a Pressable; `scaleTo` is how small it gets. Skips the animation when reduce-motion is on.
 */
export default function PressableScale({ style, scaleTo = 0.97, onPressIn, onPressOut, children, ...props }) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReduceMotion();

  const animate = (toValue) => {
    if (reduceMotion) return;
    Animated.spring(scale, { toValue, speed: 60, bounciness: 0, useNativeDriver: true }).start();
  };

  return (
    <AnimatedPressable
      {...props}
      onPressIn={(event) => {
        animate(scaleTo);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animate(1);
        onPressOut?.(event);
      }}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
}
