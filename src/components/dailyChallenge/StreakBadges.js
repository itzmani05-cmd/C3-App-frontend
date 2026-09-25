import React from 'react';
import { View } from 'react-native';
import Pill from '../ui/Pill';
import { COLORS } from '../../theme';

const SIZES = {
  sm: { style: { borderWidth: 1 }, text: { fontSize: 11 }, variant: 'semiBold', day: (n) => `🔥 ${n}`, overall: (n) => `🏆 ${n}` },
  lg: {
    style: { marginTop: 12, paddingHorizontal: 14, paddingVertical: 6 },
    text: { fontSize: 13 },
    variant: 'bold',
    day: (n) => `🔥 ${n} Day Streak`,
    overall: (n) => `🏆 ${n} Overall Streak`,
  },
};

export default function StreakBadges({ currentStreak = 0, overallStreak = 0, size = 'lg', style }) {
  if (!(currentStreak > 0) && !(overallStreak > 0)) return null;
  const s = SIZES[size];

  return (
    <View style={[{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 8 }, style]}>
      {currentStreak > 0 ? (
        <Pill
          label={s.day(currentStreak)}
          tone="warning"
          variant={s.variant}
          style={[s.style, { borderColor: COLORS.warningSoft }]}
          textStyle={s.text}
        />
      ) : null}
      {overallStreak > 0 ? (
        <Pill
          label={s.overall(overallStreak)}
          color={COLORS.brand600}
          backgroundColor={COLORS.slate50}
          variant={s.variant}
          style={[s.style, { borderColor: COLORS.slate200 }]}
          textStyle={s.text}
        />
      ) : null}
    </View>
  );
}
