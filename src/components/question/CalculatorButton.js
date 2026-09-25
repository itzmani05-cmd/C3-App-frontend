import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Calculator } from 'lucide-react-native';
import ScientificCalculator from './ScientificCalculator';
import { COLORS, SHADOWS } from '../../theme';

export default function CalculatorButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.85} style={buttonStyle}>
        <Calculator size={20} color={COLORS.white} />
      </TouchableOpacity>
      <ScientificCalculator visible={open} onClose={() => setOpen(false)} />
    </>
  );
}

const buttonStyle = {
  position: 'absolute',
  top: 112,
  right: 16,
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: COLORS.brand600,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 20,
  ...SHADOWS.md,
};
