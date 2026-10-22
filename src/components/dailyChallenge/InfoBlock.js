import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import { COLORS } from '../../theme';

// A labelled value in a small tile. `dark` is for the navy hero card.
export default function InfoBlock({ label, value, dark = false }) {
  return (
    <View
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 10,
        backgroundColor: dark ? 'rgba(255,255,255,0.07)' : COLORS.slate50,
        borderWidth: 1,
        borderColor: dark ? 'rgba(255,255,255,0.08)' : COLORS.slate200,
      }}
    >
      <AppText variant="medium" style={{ fontSize: 11, color: dark ? COLORS.slate400 : COLORS.slate500 }}>
        {label}
      </AppText>
      <AppText variant="bold" style={{ marginTop: 4, fontSize: 14, color: dark ? COLORS.white : COLORS.slate900 }} numberOfLines={2}>
        {value}
      </AppText>
    </View>
  );
}
