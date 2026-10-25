import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import { COLORS, RADII } from '../../theme';

const PILL_TONES = {
  neutral: { backgroundColor: COLORS.slate100, color: COLORS.slate500 },
  brand: { backgroundColor: COLORS.brand50, color: COLORS.brand600 },
  success: { backgroundColor: COLORS.successSoft, color: COLORS.success600 },
  danger: { backgroundColor: COLORS.dangerSoft, color: COLORS.danger600 },
  warning: { backgroundColor: COLORS.warningSoft, color: COLORS.warningText },
};

export default function Pill({ label, tone = 'neutral', color, backgroundColor, variant = 'bold', style, textStyle }) {
  const palette = PILL_TONES[tone] || PILL_TONES.neutral;

  return (
    <View style={[baseStyle, { backgroundColor: backgroundColor || palette.backgroundColor }, style]}>
      <AppText variant={variant} style={[{ fontSize: 11, color: color || palette.color }, textStyle]}>
        {label}
      </AppText>
    </View>
  );
}

const baseStyle = {
  borderRadius: RADII.sm,
  paddingHorizontal: 8,
  paddingVertical: 3,
};
