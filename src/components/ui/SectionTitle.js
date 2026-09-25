import React from 'react';
import AppText from './AppText';
import { COLORS } from '../../theme';

export default function SectionTitle({ children, style }) {
  return (
    <AppText variant="bold" style={[{ color: COLORS.black, fontSize: 18 }, style]}>
      {children}
    </AppText>
  );
}
