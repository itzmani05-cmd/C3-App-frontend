import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../../theme';

export const TONES = {
  brand: { backgroundColor: COLORS.brand50, color: COLORS.brand600 },
  success: { backgroundColor: '#ECFDF5', color: '#059669' },
  warning: { backgroundColor: COLORS.amber50, color: COLORS.amber600 },
  danger: { backgroundColor: COLORS.red50, color: COLORS.red600 },
  accent: { backgroundColor: '#F5F3FF', color: COLORS.accent600 },
  neutral: { backgroundColor: COLORS.slate100, color: COLORS.slate600 },
  dark: { backgroundColor: 'rgba(255,255,255,0.12)', color: COLORS.white },
};

// A rounded square holding a lucide icon: the standard way to give a row, card or stat an icon.
export default function IconTile({ icon: Icon, tone = 'brand', size = 40, iconSize = 20, style }) {
  const palette = TONES[tone] || TONES.brand;
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size > 36 ? 12 : 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.backgroundColor,
        },
        style,
      ]}
    >
      <Icon size={iconSize} color={palette.color} />
    </View>
  );
}
