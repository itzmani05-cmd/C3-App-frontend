import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import Card from '../ui/Card';
import Pill from '../ui/Pill';
import { formatDate } from '../../utils/format';
import { COLORS } from '../../theme';

export default function ChallengeHistoryItem({ item, onOpen }) {
  const canOpen = item.revealed && item.latestAttemptId;
  const attempted = item.attemptsSubmitted > 0;
  const score = typeof item.bestScore === 'number' ? `${item.bestScore}/${item.questionCount}` : '—';

  return (
    <Card onPress={() => canOpen && onOpen(item)} activeOpacity={canOpen ? 0.8 : 1} style={{ marginTop: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <AppText variant="bold" style={{ flex: 1, marginRight: 12, fontSize: 15, color: COLORS.slate900 }}>
          {item.title || `Challenge — ${formatDate(item.publishedAt)}`}
        </AppText>
        <Pill label={attempted ? 'Attempted' : 'Missed'} tone={attempted ? 'success' : 'neutral'} />
      </View>

      <AppText style={{ marginTop: 6, fontSize: 12, color: COLORS.slate500 }}>
        {formatDate(item.publishedAt)} • {item.questionCount} Questions
      </AppText>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <AppText style={{ color: COLORS.slate600, fontSize: 13 }}>Score: {score}</AppText>
        <AppText style={{ marginLeft: 16, color: COLORS.slate600, fontSize: 13 }}>Attempts: {item.attemptsSubmitted}/3</AppText>
      </View>

      {canOpen ? (
        <AppText variant="bold" style={{ marginTop: 10, fontSize: 12, color: COLORS.brand600 }}>
          Review Answers →
        </AppText>
      ) : null}
    </Card>
  );
}
