import React from 'react';
import { View } from 'react-native';
import { Flame, Trophy } from '../../icons';
import AppText from '../ui/AppText';
import { plural } from '../../utils/format';
import { COLORS, tw } from '../../theme';

// Top three get a coloured rank badge; everyone else a plain number.
const PODIUM = {
  1: { backgroundColor: '#FEF3C7', color: '#B45309', borderColor: '#FCD34D' },
  2: { backgroundColor: '#F1F5F9', color: '#475569', borderColor: '#CBD5E1' },
  3: { backgroundColor: '#FFEDD5', color: '#9A3412', borderColor: '#FDBA74' },
};

function RankBadge({ rank, isMe }) {
  const podium = PODIUM[rank];
  const palette = podium || { backgroundColor: isMe ? COLORS.brand100 : COLORS.slate100, color: isMe ? COLORS.brand700 : COLORS.slate600, borderColor: 'transparent' };

  return (
    <View
      style={[
        tw`w-8 h-8 rounded-full items-center justify-center`,
        { backgroundColor: palette.backgroundColor, borderWidth: 1, borderColor: palette.borderColor },
      ]}
    >
      <AppText variant="extraBold" style={{ fontSize: 13, color: palette.color }}>
        {rank}
      </AppText>
    </View>
  );
}

export default function LeaderboardRow({ entry }) {
  return (
    <View style={[tw`flex-row items-center py-3 px-2.5 rounded-xl`, entry.isMe ? { backgroundColor: COLORS.brand50 } : null]}>
      <RankBadge rank={entry.rank} isMe={entry.isMe} />

      <View style={tw`flex-1 ml-3`}>
        <AppText variant="bold" style={tw`text-sm text-slate-900`} numberOfLines={1}>
          {entry.name}
          {entry.isMe ? ' (You)' : ''}
        </AppText>
        <View style={tw`mt-0.5 flex-row items-center flex-wrap`}>
          <AppText style={tw`text-xs text-slate-500`}>{plural(entry.challengesCompleted, 'challenge')}</AppText>
          {entry.currentStreak > 0 ? (
            <View style={tw`flex-row items-center ml-2.5`}>
              <Flame size={12} color={COLORS.amber600} />
              <AppText style={tw`ml-0.5 text-xs text-slate-500`}>{entry.currentStreak}</AppText>
            </View>
          ) : null}
          {entry.overallStreak > 0 ? (
            <View style={tw`flex-row items-center ml-2.5`}>
              <Trophy size={12} color={COLORS.brand600} />
              <AppText style={tw`ml-0.5 text-xs text-slate-500`}>{entry.overallStreak}</AppText>
            </View>
          ) : null}
        </View>
      </View>

      <AppText variant="extraBold" style={{ fontSize: 16, color: entry.totalScore < 0 ? COLORS.red600 : COLORS.brand700 }}>
        {entry.totalScore}
      </AppText>
    </View>
  );
}
