import React from 'react';
import { View } from 'react-native';
import { Flame, Trophy } from '../../icons';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import { formatDayLabel } from '../../utils/format';
import { COLORS, tw } from '../../theme';

function StreakStat({ icon, tone, value, label, color }) {
  return (
    <View style={tw`flex-1 items-center`}>
      <IconTile icon={icon} tone={tone} size={40} iconSize={20} />
      <AppText variant="extraBold" style={[tw`mt-3 text-[26px]`, { color, letterSpacing: -0.5 }]}>
        {value || 0}
      </AppText>
      <AppText style={tw`mt-0.5 text-xs text-slate-500`}>
        {label}
      </AppText>
    </View>
  );
}

function StreakGraph({ history }) {
  if (!history.length) {
    return (
      <AppText style={tw`mt-4 text-[13px] leading-5 text-slate-500 text-center`}>
        Complete a Daily Challenge to start building your streak graph.
      </AppText>
    );
  }

  return (
    <View style={tw`mt-5 flex-row items-end justify-between`}>
      {history.map((day, index) => (
        <View key={day.dateKey || index} style={tw`flex-1 items-center`}>
          <View
            style={[
              tw`w-7 h-9 rounded-lg items-center justify-center`,
              { backgroundColor: day.completed ? COLORS.amber50 : COLORS.slate100, borderWidth: 1, borderColor: day.completed ? COLORS.amber100 : COLORS.slate200 },
            ]}
          >
            {day.completed ? <Flame size={15} color={COLORS.amber600} /> : null}
          </View>
          <AppText style={tw`mt-1.5 text-[9px] text-slate-500`}>{formatDayLabel(day.dateKey)}</AppText>
        </View>
      ))}
    </View>
  );
}

export default function StreakSummaryCard({ summary, history }) {
  return (
    <Card elevation="sm" style={tw`p-5`}>
      <View style={tw`flex-row`}>
        <StreakStat icon={Flame} tone="warning" value={summary?.currentStreak} label="Day streak" color={COLORS.amber800} />
        <View style={tw`w-px bg-slate-200 mx-2`} />
        <StreakStat icon={Trophy} tone="brand" value={summary?.overallStreak} label="Overall streak" color={COLORS.brand700} />
      </View>
      <AppText style={tw`mt-4 text-center text-xs text-slate-500`}>Best streak: {summary?.longestStreak || 0} days</AppText>
      <StreakGraph history={history} />
    </Card>
  );
}
