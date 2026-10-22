import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from './AppText';
import { COLORS } from '../../theme';

// Section heading with an optional node on the right (e.g. a "See all" link).
export default function SectionTitle({ children, right, style }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }, style]}>
      <AppText type="section" style={{ color: COLORS.slate900 }}>
        {children}
      </AppText>
      {right || null}
    </View>
  );
}

// "See all" style link for the right side of a SectionTitle.
export function SectionLink({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityRole="button" accessibilityLabel={label}>
      <AppText variant="bold" style={{ color: COLORS.brand600, fontSize: 13 }}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
}
