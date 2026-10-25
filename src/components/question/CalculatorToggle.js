import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Calculator } from '../../icons';
import AppText from '../ui/AppText';
import { COLORS, tw } from '../../theme';

// A small "Calc" button for a question's header. It only asks the screen to open the calculator, so one calculator
// serves every question and keeps what was typed while the student moves between them.
export default function CalculatorToggle({ onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Open calculator"
      style={[tw`flex-row items-center`, style]}
    >
      <Calculator size={15} color={COLORS.slate500} />
      <AppText variant="semiBold" style={tw`ml-1 text-xs text-slate-500`}>
        Calc
      </AppText>
    </TouchableOpacity>
  );
}
