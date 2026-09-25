import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../../theme';

export default function LoadingView({ color = COLORS.brand600, size = 'large', style }) {
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
