import React from 'react';
import { View } from 'react-native';
import { Flame, Trophy } from '../../icons';
import AppText from '../ui/AppText';
import { COLORS } from '../../theme';

const KINDS = {
  day: { icon: Flame, color: COLORS.amber600, backgroundColor: COLORS.amber50, borderColor: COLORS.amber100, suffix: 'day streak' },
  overall: { icon: Trophy, color: COLORS.brand700, backgroundColor: COLORS.brand50, borderColor: COLORS.brand100, suffix: 'overall' },
};

// `dark` is for use on the navy hero cards.
export default function StreakChip({ kind = 'day', value, size = 'md', dark = false, style }) {
  const palette = KINDS[kind];
  const Icon = palette.icon;
  const small = size === 'sm';
  const colors = dark
    ? { color: kind === 'day' ? '#FCD34D' : '#BFDBFE', backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.14)' }
    : palette;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 999,
          borderWidth: 1,
          paddingHorizontal: small ? 8 : 12,
          paddingVertical: small ? 3 : 6,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        },
        style,
      ]}
    >
      <Icon size={small ? 12 : 14} color={colors.color} />
      <AppText variant="bold" style={{ marginLeft: 5, fontSize: small ? 11 : 12.5, color: colors.color }}>
        {small ? value : `${value} ${palette.suffix}`}
      </AppText>
    </View>
  );
}
