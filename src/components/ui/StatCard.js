import React from 'react';
import AppText from './AppText';
import Card from './Card';
import { COLORS } from '../../theme';

export default function StatCard({ label, value, accent = COLORS.brand600, style }) {
  return (
    <Card style={[{ padding: 14 }, style]}>
      <AppText variant="medium" style={{ fontSize: 12, color: COLORS.slate500 }}>
        {label}
      </AppText>
      <AppText variant="extraBold" style={{ marginTop: 8, fontSize: 22, color: accent }}>
        {value}
      </AppText>
    </Card>
  );
}
