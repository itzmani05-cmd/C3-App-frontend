import React from 'react';
import { View } from 'react-native';
import StreakChip from './StreakChip';

export default function StreakBadges({ currentStreak = 0, overallStreak = 0, size = 'lg', dark = false, style }) {
  if (!(currentStreak > 0) && !(overallStreak > 0)) return null;
  const chipSize = size === 'sm' ? 'sm' : 'md';

  return (
    <View
      style={[
        { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: size === 'sm' ? 0 : 12 },
        style,
      ]}
    >
      {currentStreak > 0 ? <StreakChip kind="day" value={currentStreak} size={chipSize} dark={dark} /> : null}
      {overallStreak > 0 ? <StreakChip kind="overall" value={overallStreak} size={chipSize} dark={dark} /> : null}
    </View>
  );
}
