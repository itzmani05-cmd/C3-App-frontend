import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import Card from '../ui/Card';
import InfoBlock from './InfoBlock';
import { formatDateTime } from '../../utils/format';
import { COLORS } from '../../theme';

function getStatus(challenge) {
  if (challenge.revealed) return 'Completed';
  return challenge.attemptsSubmitted > 0 ? 'In Progress' : 'Not Started';
}

function ChallengeAction({ challenge, onStart, onReview }) {
  if (challenge.revealed) {
    return <AppButton label="Review Answers" tone="brand" onPress={onReview} style={{ marginTop: 20 }} />;
  }
  if (challenge.attemptsRemaining > 0) {
    return (
      <AppButton
        label={challenge.attemptsSubmitted > 0 ? 'Try Again' : 'Start Challenge'}
        tone="brand"
        onPress={onStart}
        style={{ marginTop: 20 }}
      />
    );
  }
  return (
    <AppText style={{ marginTop: 20, color: COLORS.slate500, textAlign: 'center' }}>
      No attempts remaining. Answers will be revealed when this challenge expires.
    </AppText>
  );
}

export default function TodayChallengeCard({ challenge, onStart, onReview }) {
  const bestScore = typeof challenge.bestScore === 'number' ? `${challenge.bestScore} / ${challenge.questionCount}` : '—';

  return (
    <Card elevation="md" style={{ padding: 18 }}>
      <AppText variant="extraBold" style={{ fontSize: 20, color: COLORS.slate900 }}>
        {challenge.title || "Today's Challenge"}
      </AppText>
      <AppText style={{ marginTop: 4, color: COLORS.slate500 }}>{challenge.questionCount} Questions</AppText>

      <View style={rowStyle}>
        <InfoBlock label="Available until" value={formatDateTime(challenge.expiresAt)} />
        <InfoBlock label="Attempts" value={`${challenge.attemptsSubmitted} / ${challenge.maxAttempts}`} />
      </View>

      <View style={rowStyle}>
        <InfoBlock label="Best Score" value={bestScore} />
        <InfoBlock label="Status" value={getStatus(challenge)} />
      </View>

      <ChallengeAction challenge={challenge} onStart={onStart} onReview={onReview} />
    </Card>
  );
}

const rowStyle = {
  flexDirection: 'row',
  marginTop: 18,
};
