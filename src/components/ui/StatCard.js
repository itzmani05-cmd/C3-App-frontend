import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import Card from './Card';
import IconTile from './IconTile';
import { COLORS } from '../../theme';

// `icon` (a lucide component) and `tone` are optional; `accent` colours the value.
export default function StatCard({ label, value, accent = COLORS.slate900, icon, tone = 'brand', style }) {
  return (
    <Card elevation="sm" style={[{ padding: 14 }, style]}>
      {icon ? <IconTile icon={icon} tone={tone} size={34} iconSize={17} style={{ marginBottom: 12 }} /> : null}
      <AppText variant="extraBold" style={{ fontSize: 24, color: accent, letterSpacing: -0.4 }}>
        {value}
      </AppText>
      <View style={{ marginTop: 2 }}>
        <AppText variant="medium" style={{ fontSize: 12, color: COLORS.slate500 }}>
          {label}
        </AppText>
      </View>
    </Card>
  );
}
