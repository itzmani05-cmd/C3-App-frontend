import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../../theme';

export default function ProgressBar({ value = 0, color = COLORS.brand600, trackColor = COLORS.slate200, height = 6, style }) {
  const percent = Math.max(0, Math.min(100, value));
  return (
    <View style={[{ height, borderRadius: height, backgroundColor: trackColor, overflow: 'hidden' }, style]}>
      <View style={{ width: `${percent}%`, height, borderRadius: height, backgroundColor: color }} />
    </View>
  );
}
