import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import { formatDayLabel } from '../../utils/format';
import { COLORS, RADII, SHADOWS } from '../../theme';

function StreakStat({ icon, value, label, color }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <AppText style={{ fontSize: 28 }}>{icon}</AppText>
      <AppText variant="extraBold" style={{ marginTop: 6, fontSize: 28, color }}>
        {value || 0} Day{value === 1 ? '' : 's'}
      </AppText>
      <AppText style={{ marginTop: 2, color: COLORS.slate600 }}>{label}</AppText>
    </View>
  );
}

function StreakGraph({ history }) {
  if (!history.length) {
    return (
      <AppText style={{ marginTop: 10, color: COLORS.slate500 }}>
        Complete a Daily Challenge to start building your streak graph.
      </AppText>
    );
  }

  return (
    <View style={{ width: '100%', marginTop: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      {history.map((day, index) => (
        <View key={day.dateKey || index} style={{ alignItems: 'center', flex: 1 }}>
          <View style={[barStyle, { backgroundColor: day.completed ? COLORS.success500 : COLORS.slate100 }]}>
            {day.completed ? <AppText style={{ fontSize: 12 }}>🔥</AppText> : null}
          </View>
          <AppText style={{ marginTop: 6, fontSize: 9, color: COLORS.slate500 }}>{formatDayLabel(day.dateKey)}</AppText>
        </View>
      ))}
    </View>
  );
}

export default function StreakSummaryCard({ summary, history }) {
  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
        <StreakStat icon="🔥" value={summary?.currentStreak} label="Day Streak" color={COLORS.warningText} />
        <View style={{ width: 1, backgroundColor: COLORS.slate200, marginHorizontal: 8 }} />
        <StreakStat icon="🏆" value={summary?.overallStreak} label="Overall Streak" color={COLORS.brand600} />
      </View>
      <AppText style={{ marginTop: 8, fontSize: 12, color: COLORS.slate500 }}>
        Best Streak: {summary?.longestStreak || 0} days
      </AppText>
      <StreakGraph history={history} />
    </View>
  );
}

const cardStyle = {
  alignItems: 'center',
  backgroundColor: COLORS.warningSoft,
  borderRadius: RADII.xxxl,
  padding: 22,
  borderWidth: 1,
  borderColor: COLORS.warningSoft,
  ...SHADOWS.md,
};

const barStyle = {
  width: '70%',
  height: 36,
  borderRadius: RADII.pill,
  justifyContent: 'center',
  alignItems: 'center',
};
