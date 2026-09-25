import React from 'react';
import AppText from '../ui/AppText';
import StreakBadges from './StreakBadges';
import { getMotivationalMessage } from '../../utils/motivationalMessage';
import { COLORS } from '../../theme';

export default function ScoreHero({ caption, captionVariant = 'medium', captionStyle, score, total, currentStreak, overallStreak }) {
  const percentage = total ? (score / total) * 100 : 0;

  return (
    <>
      <AppText variant={captionVariant} style={[{ color: COLORS.slate500, fontSize: 13 }, captionStyle]}>
        {caption}
      </AppText>
      <AppText variant="extraBold" style={{ marginTop: 6, fontSize: 34, color: COLORS.brand600 }}>
        {score}/{total}
      </AppText>
      <AppText variant="semiBold" style={{ marginTop: 10, fontSize: 14, color: COLORS.slate700, textAlign: 'center' }}>
        {getMotivationalMessage(percentage)}
      </AppText>
      <StreakBadges currentStreak={currentStreak} overallStreak={overallStreak} />
    </>
  );
}
