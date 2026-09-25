import React from 'react';
import { View } from 'react-native';
import AppText from '../ui/AppText';
import AppButton from '../ui/AppButton';
import Card from '../ui/Card';
import LoadingView from '../ui/LoadingView';
import Pill from '../ui/Pill';
import StreakBadges from './StreakBadges';
import useFetch from '../../hooks/useFetch';
import { getTodayChallenge } from '../../api/dailyChallenge';
import { formatTimeRemaining } from '../../utils/format';
import { COLORS } from '../../theme';

function describe(challenge) {
  const { revealed, attemptsSubmitted, questionCount, maxAttempts } = challenge;
  if (revealed) return { status: 'Challenge completed', action: 'Review Answers' };
  if (attemptsSubmitted > 0) return { status: `Attempts: ${attemptsSubmitted}/${maxAttempts}`, action: 'Continue Challenge' };
  return { status: `${questionCount} Questions • ${maxAttempts} Attempts`, action: 'Start Challenge' };
}

export default function DailyChallengeCard({ navigation }) {
  const { data: challenge, loading } = useFetch(getTodayChallenge, [], { refetchOnFocus: true });
  const openChallenge = () => navigation.navigate('DailyChallengeScreen');

  if (loading) {
    return (
      <Card elevation="md" style={[cardStyle, { minHeight: 90 }]}>
        <LoadingView size="small" />
      </Card>
    );
  }

  if (!challenge) return null;

  const { status, action } = describe(challenge);

  return (
    <Card elevation="md" onPress={openChallenge} activeOpacity={0.85} style={cardStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="bold" style={{ fontSize: 15, color: COLORS.slate900 }}>
          🔥 C3 Daily Challenge
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <StreakBadges currentStreak={challenge.currentStreak} overallStreak={challenge.overallStreak} size="sm" />
          {!challenge.revealed ? (
            <Pill label={formatTimeRemaining(challenge.expiresAt)} color={COLORS.danger700} backgroundColor={COLORS.dangerSoft} variant="semiBold" />
          ) : null}
        </View>
      </View>

      <AppText variant="medium" style={{ marginTop: 8, fontSize: 13, color: COLORS.slate500 }}>
        {status}
      </AppText>

      {typeof challenge.bestScore === 'number' ? (
        <AppText variant="semiBold" style={{ marginTop: 4, fontSize: 13, color: COLORS.brand600 }}>
          Best Score: {challenge.bestScore}/{challenge.questionCount}
        </AppText>
      ) : null}

      <AppButton label={action} tone="brand" onPress={openChallenge} style={{ marginTop: 12 }} />
    </Card>
  );
}

const cardStyle = {
  marginTop: 14,
  marginHorizontal: 16,
};
