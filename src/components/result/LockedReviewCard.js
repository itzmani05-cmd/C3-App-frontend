import React from 'react';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import { plural } from '../../utils/format';
import { COLORS } from '../../theme';

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
    <Card elevation="card" style={{ marginTop: 8, borderRadius: 18, padding: 18, borderColor: COLORS.gray200 }}>
      <AppText variant="bold" style={{ color: COLORS.black, fontSize: 17 }}>
        Detailed review is locked
      </AppText>
      <AppText style={{ marginTop: 8, color: COLORS.gray500, lineHeight: 21 }}>{lockedMessage(attemptNumber, maxAttempts)}</AppText>
    </Card>
  );
}
