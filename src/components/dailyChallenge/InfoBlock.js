import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import { COLORS } from '../../theme';

export default function InfoBlock({ label, value }) {
  return (
    <View style={{ flex: 1 }}>
      <AppText variant="medium" style={{ fontSize: 12, color: COLORS.slate500 }}>
        {label}
      </AppText>
      <AppText variant="bold" style={{ marginTop: 4, fontSize: 15, color: COLORS.slate900 }}>
        {value}
      </AppText>
    </View>
  );
}
