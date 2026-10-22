import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import ProgressBar from '../ui/ProgressBar';
import StreakBadges from './StreakBadges';
import { getMotivationalMessage } from '../../utils/motivationalMessage';
import { COLORS, tw } from '../../theme';

function barColor(percentage) {
  if (percentage >= 80) return COLORS.success500;
  return percentage >= 50 ? COLORS.warning500 : COLORS.danger500;
}

export default function ScoreHero({ caption, captionVariant = 'medium', captionStyle, score, total, currentStreak, overallStreak }) {
  const percentage = total ? (score / total) * 100 : 0;

  return (
    <View style={tw`items-center self-stretch`}>
      <AppText variant={captionVariant} style={[tw`text-[13px] text-slate-500`, captionStyle]}>
        {caption}
      </AppText>
      <AppText variant="extraBold" style={[tw`mt-1 text-[44px] text-slate-900`, { letterSpacing: -1 }]}>
        {score}
        <AppText variant="bold" style={tw`text-2xl text-slate-500`}>
          /{total}
        </AppText>
      </AppText>
      <ProgressBar value={percentage} color={barColor(percentage)} height={8} style={tw`mt-3 self-stretch`} />
      <AppText variant="semiBold" style={tw`mt-4 text-sm text-slate-700 text-center`}>
        {getMotivationalMessage(percentage)}
      </AppText>
      <StreakBadges currentStreak={currentStreak} overallStreak={overallStreak} />
    </View>
  );
}
