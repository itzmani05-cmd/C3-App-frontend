import React from 'react';
import { View } from 'react-native';
import { ChartColumn, History, Trophy } from '../icons';
import Screen from '../components/ui/Screen';
import { ChallengeSkeleton } from '../components/ui/Skeletons';
import EmptyState from '../components/ui/EmptyState';
import SectionTitle from '../components/ui/SectionTitle';
import TodayChallengeCard from '../components/dailyChallenge/TodayChallengeCard';
import QuickLinkCard from '../components/dailyChallenge/QuickLinkCard';
import useExamGate from '../hooks/useExamGate';
import useFeaturesMenu from '../hooks/useFeaturesMenu';
import useFetch from '../hooks/useFetch';
import { getTodayChallenge } from '../api/dailyChallenge';
import { tw } from '../theme';

const QUICK_LINKS = [
  { icon: ChartColumn, tone: 'accent', label: 'My Progress', screen: 'DailyChallengeProgressScreen' },
  { icon: History, tone: 'neutral', label: 'History', screen: 'DailyChallengeHistoryScreen' },
  { icon: Trophy, tone: 'warning', label: 'Leaderboard', screen: 'DailyChallengeLeaderboardScreen' },
];

export default function DailyChallengeScreen({ navigation, route }) {
  const exam = useExamGate();
  const menu = useFeaturesMenu(navigation);
  const { data: challenge, loading, refreshing, error, refresh } = useFetch(
    () => getTodayChallenge(exam.selectedExamId),
    [exam.selectedExamId],
    { enabled: exam.ready, refetchOnFocus: true, cacheKey: `today:${exam.selectedExamId || 'all'}` }
  );

  if (exam.gate) return exam.gate;

  return (
    <Screen
      title="Daily Challenge"
      headerProps={route?.name === 'Today' ? { onMenuPress: menu.open } : undefined}
      largeTitle={route?.name === 'Today' ? 'Daily Challenge' : null}
      onBack={navigation.canGoBack() ? navigation.goBack : undefined}
      loading={exam.loading || loading}
      skeleton={<ChallengeSkeleton />}
      top={exam.switchChip}
      refreshing={refreshing}
      onRefresh={refresh}
    >
      {error ? (
        <EmptyState message="Could not load today's challenge." error />
      ) : !challenge ? (
        <EmptyState title="No Daily Challenge yet" message="Check back soon. A new challenge is published regularly." />
      ) : (
        <TodayChallengeCard
          challenge={challenge}
          onStart={() => navigation.navigate('DailyChallengeAttemptScreen', { challengeId: challenge.challengeId })}
          onReview={() => navigation.navigate('DailyChallengeReviewScreen', { challengeId: challenge.challengeId, data: challenge })}
        />
      )}

      <View style={tw`mt-6`}>
        <SectionTitle>Explore</SectionTitle>
        {QUICK_LINKS.map((link) => (
          <View key={link.screen} style={tw`mb-2`}>
            <QuickLinkCard icon={link.icon} tone={link.tone} label={link.label} onPress={() => navigation.navigate(link.screen)} />
          </View>
        ))}
      </View>
      {menu.sheet}
    </Screen>
  );
}
