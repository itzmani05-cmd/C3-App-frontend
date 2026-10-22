import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import AppText from '../ui/AppText';
import useReduceMotion from '../../hooks/useReduceMotion';
import { COLORS } from '../../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// A circular gauge that fills up to `value` (0-100) while the number in the middle counts up with it.
export default function ScoreRing({ value = 0, color = COLORS.brand600, size = 124, strokeWidth = 11 }) {
  const target = Math.max(0, Math.min(100, Number(value) || 0));
  const reduceMotion = useReduceMotion();
  const progress = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const id = progress.addListener(({ value: v }) => setShown(Math.round(v)));
    if (reduceMotion) {
      progress.setValue(target);
      setShown(Math.round(target));
    } else {
      Animated.timing(progress, { toValue: target, duration: 1000, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    }
    return () => progress.removeListener(id);
  }, [target, reduceMotion]);

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessibilityRole="progressbar"
      accessibilityLabel={`Score ${Math.round(target)} percent`}
    >
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={COLORS.slate200} strokeWidth={strokeWidth} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progress.interpolate({ inputRange: [0, 100], outputRange: [circumference, 0] })}
        />
      </Svg>
      <AppText variant="extraBold" style={{ fontSize: size * 0.27, color: COLORS.slate900, letterSpacing: -0.8 }}>
        {shown}%
      </AppText>
    </View>
  );
}
