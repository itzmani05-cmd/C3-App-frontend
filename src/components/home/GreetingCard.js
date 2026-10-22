import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import StreakBadges from '../dailyChallenge/StreakBadges';
import { getGreeting } from '../../utils/format';
import { tw } from '../../theme';

// Navy hero at the top of Home: greeting, name and the student's current streaks.
export default function GreetingCard({ name, challenge }) {
  const hasStreak = challenge && (challenge.currentStreak > 0 || challenge.overallStreak > 0);

  return (
    <View style={tw`mx-4 mt-4 rounded-2xl bg-ink-900 p-5 overflow-hidden`}>
      <View style={tw`absolute -right-14 -top-14 w-48 h-48 rounded-full bg-brand-600 opacity-30`} />
      <View style={tw`absolute -right-4 -bottom-16 w-36 h-36 rounded-full bg-brand-500 opacity-10`} />

      <AppText variant="medium" style={tw`text-[13px] text-slate-400`}>
        {getGreeting()}
      </AppText>
      <AppText variant="extraBold" style={tw`mt-1 text-[26px] text-white`} numberOfLines={1}>
        {name || 'Learner'}
      </AppText>
      <AppText style={tw`mt-1 text-sm text-slate-300`}>Ready for today's practice?</AppText>

      {hasStreak ? (
        <StreakBadges currentStreak={challenge.currentStreak} overallStreak={challenge.overallStreak} dark style={{ justifyContent: 'flex-start', marginTop: 16 }} />
      ) : (
        <AppText style={tw`mt-4 text-xs text-slate-400`}>Complete today's challenge to start a streak.</AppText>
      )}
    </View>
  );
}
