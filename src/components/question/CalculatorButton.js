import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calculator } from '../../icons';
import ScientificCalculator from './ScientificCalculator';
import { COLORS, SHADOWS } from '../../theme';

export default function CalculatorButton() {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Open calculator"
        style={[buttonStyle, { top: insets.top + 56 + 12 }]}
      >
        <Calculator size={20} color={COLORS.white} />
      </TouchableOpacity>
      <ScientificCalculator visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

const buttonStyle = {
  position: 'absolute',
  right: 16,
  width: 44,
  height: 44,
  borderRadius: 12,
  backgroundColor: COLORS.brand600,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 20,
  ...SHADOWS.md,
};
