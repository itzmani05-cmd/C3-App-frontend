import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import { COLORS } from '../../theme';

function tone(attempts) {
  if (attempts >= 3) return { backgroundColor: COLORS.green50, borderColor: COLORS.green300, color: COLORS.green600 };
  if (attempts === 2) return { backgroundColor: COLORS.red50, borderColor: COLORS.red200, color: COLORS.red600 };
  return { backgroundColor: COLORS.slate50, borderColor: COLORS.gray200, color: COLORS.gray500 };
}

export default function AttemptStatus({ attempts, revealed }) {
  if (!attempts) return null;
  const { color, ...boxColors } = tone(attempts);

  return (
    <View style={[boxStyle, boxColors]}>
      <AppText variant="semiBold" style={{ fontSize: 12, color }}>
        Attempts: {attempts}/3
      </AppText>
      {revealed ? (
        <AppText variant="semiBold" style={{ fontSize: 12, color: COLORS.green600, marginTop: 4 }}>
          ✓ Correct answer revealed
        </AppText>
      ) : null}
    </View>
  );
}

const boxStyle = {
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  borderWidth: 1,
};
