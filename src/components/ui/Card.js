import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { COLORS, RADII, SHADOWS } from '../../theme';

export default function Card({ onPress, elevation = 'sm', style, activeOpacity = 0.8, children }) {
  const cardStyle = [baseStyle, SHADOWS[elevation], style];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={activeOpacity} onPress={onPress} style={cardStyle}>
        {children}
      </TouchableOpacity>
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
