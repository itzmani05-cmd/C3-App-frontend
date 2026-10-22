import React from 'react';
import { View } from 'react-native';
import { Lock } from '../../icons';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import IconTile from '../ui/IconTile';
import { plural } from '../../utils/format';
import { tw } from '../../theme';

function lockedMessage(attemptNumber, maxAttempts) {
  const attemptsLeft =
    typeof attemptNumber === 'number' && typeof maxAttempts === 'number' ? Math.max(0, maxAttempts - attemptNumber) : 0;

  if (attemptsLeft > 0) {
    return `Pass this quiz (80%+) to unlock the full answer review now, or it unlocks automatically after ${plural(attemptsLeft, 'more attempt')}.`;
  }
  return 'Pass this quiz to unlock the full answer review and explanations. Current pass mark: 80%.';
}

export default function LockedReviewCard({ attemptNumber, maxAttempts }) {
  return (
    <Card elevation="sm" style={tw`mt-2 flex-row items-start`}>
      <IconTile icon={Lock} tone="neutral" />
      <View style={tw`flex-1 ml-3`}>
        <AppText variant="bold" style={tw`text-base text-slate-900`}>
          Detailed review is locked
        </AppText>
        <AppText style={tw`mt-1.5 text-[13px] leading-5 text-slate-500`}>{lockedMessage(attemptNumber, maxAttempts)}</AppText>
      </View>
    </Card>
  );
}
