import React from 'react';
import { View } from 'react-native';
import PressableScale from './PressableScale';
import { COLORS, RADII, SHADOWS } from '../../theme';

export default function Card({ onPress, elevation = 'sm', style, accessibilityLabel, children }) {
  const cardStyle = [baseStyle, SHADOWS[elevation], style];

  if (onPress) {
    return (
      <PressableScale onPress={onPress} scaleTo={0.985} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={cardStyle}>
        {children}
      </PressableScale>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const baseStyle = {
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 16,
  borderWidth: 1,
  borderColor: COLORS.slate200,
};
