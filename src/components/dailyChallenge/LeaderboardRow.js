import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import { plural } from '../../utils/format';
import { COLORS, RADII } from '../../theme';

const RANK_MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

function describe(entry) {
  const parts = [`${plural(entry.challengesCompleted, 'challenge')} completed`];
  if (entry.currentStreak > 0) parts.push(`🔥 ${entry.currentStreak} day streak`);
  if (entry.overallStreak > 0) parts.push(`🏆 ${entry.overallStreak} overall`);
  return parts.join(' • ');
}

export default function LeaderboardRow({ entry }) {
  return (
    <View style={[rowStyle, entry.isMe ? { backgroundColor: COLORS.brand50 } : null]}>
      <View style={{ width: 32, alignItems: 'center' }}>
        <AppText variant="extraBold" style={{ fontSize: 14, color: entry.isMe ? COLORS.brand600 : COLORS.slate600 }}>
          {RANK_MEDAL[entry.rank] || entry.rank}
        </AppText>
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <AppText variant="bold" style={{ fontSize: 14, color: COLORS.slate900 }} numberOfLines={1}>
          {entry.name}
          {entry.isMe ? ' (You)' : ''}
        </AppText>
        <AppText style={{ marginTop: 2, fontSize: 12, color: COLORS.slate500 }}>{describe(entry)}</AppText>
      </View>

      <AppText variant="extraBold" style={{ fontSize: 16, color: entry.totalScore < 0 ? COLORS.danger600 : COLORS.brand600 }}>
        {entry.totalScore}
      </AppText>
    </View>
  );
}

const rowStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderRadius: RADII.xl,
};
