import React from 'react';
import { View } from 'react-native';
import Screen from '../components/ui/Screen';
import EmptyState from '../components/ui/EmptyState';
import TodayChallengeCard from '../components/dailyChallenge/TodayChallengeCard';
import QuickLinkCard from '../components/dailyChallenge/QuickLinkCard';
import useExamGate from '../hooks/useExamGate';
import useFetch from '../hooks/useFetch';
import { getTodayChallenge } from '../api/dailyChallenge';

const QUICK_LINKS = [
  { icon: '📊', label: 'My Progress', screen: 'DailyChallengeProgressScreen' },
  { icon: '🗓', label: 'History', screen: 'DailyChallengeHistoryScreen' },
  { icon: '🏆', label: 'Leaderboard', screen: 'DailyChallengeLeaderboardScreen' },
];

export default function DailyChallengeScreen({ navigation }) {
  const exam = useExamGate();
  const { data: challenge, loading, refreshing, error, refresh } = useFetch(
    () => getTodayChallenge(exam.selectedExamId),
    [exam.selectedExamId],
    { enabled: exam.ready, refetchOnFocus: true }
  );

  if (exam.gate) return exam.gate;

  return (
    <Screen
      title="C3 Daily Challenge"
      onBack={navigation.canGoBack() ? navigation.goBack : undefined}
      loading={exam.loading || loading}
      top={exam.switchChip}
      refreshing={refreshing}
      onRefresh={refresh}
    >
      {error ? (
        <EmptyState message="Could not load today’s challenge." error />
      ) : !challenge ? (
        <EmptyState title="No Daily Challenge yet" message="Check back soon — a new challenge is published regularly." />
      ) : (
        <TodayChallengeCard
          challenge={challenge}
          onStart={() => navigation.navigate('DailyChallengeAttemptScreen', { challengeId: challenge.challengeId })}
          onReview={() => navigation.navigate('DailyChallengeReviewScreen', { challengeId: challenge.challengeId, data: challenge })}
        />
      )}

      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        {QUICK_LINKS.map((link) => (
          <QuickLinkCard key={link.screen} icon={link.icon} label={link.label} onPress={() => navigation.navigate(link.screen)} />
        ))}
      </View>
    </Screen>
  );
}
