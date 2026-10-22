import React from 'react';
import { View } from 'react-native';
import { CircleCheck, ListChecks, Percent, Target } from '../icons';
import Screen from '../components/ui/Screen';
import { StatsSkeleton } from '../components/ui/Skeletons';
import StatCard from '../components/ui/StatCard';
import StreakSummaryCard from '../components/dailyChallenge/StreakSummaryCard';
import TopicPerformanceCard from '../components/dailyChallenge/TopicPerformanceCard';
import useFetch from '../hooks/useFetch';
import { getProgressOverview } from '../api/dailyChallenge';
import { COLORS, tw } from '../theme';

function buildStats(summary) {
  return [
    { label: 'Challenges completed', value: summary?.challengesCompleted || 0, accent: COLORS.brand700, icon: CircleCheck, tone: 'brand' },
    { label: 'Questions answered', value: summary?.questionsAnswered || 0, accent: COLORS.accent700, icon: ListChecks, tone: 'accent' },
    { label: 'Accuracy', value: `${Math.round(summary?.accuracy || 0)}%`, accent: COLORS.success600, icon: Percent, tone: 'success' },
    {
      label: 'Average score',
      value: `${(summary?.averageScore || 0).toFixed(1)}/${summary?.questionsPerChallenge || 5}`,
      accent: COLORS.slate900,
      icon: Target,
      tone: 'warning',
    },
  ];
}

export default function DailyChallengeProgressScreen({ navigation }) {
  const { data, loading } = useFetch(getProgressOverview, [], {
    initialData: { summary: null, topics: [], weakArea: null, streakHistory: [] },
    cacheKey: 'progress-overview',
  });

  return (
    <Screen title="My Progress" onBack={navigation.goBack} loading={loading} skeleton={<StatsSkeleton />}>
      <StreakSummaryCard summary={data.summary} history={data.streakHistory} />

      <View style={tw`flex-row flex-wrap -mx-1 mt-3`}>
        {buildStats(data.summary).map((stat) => (
          <View key={stat.label} style={tw`w-1/2 p-1`}>
            <StatCard {...stat} />
          </View>
        ))}
      </View>

      <TopicPerformanceCard topics={data.topics} weakArea={data.weakArea} />
    </Screen>
  );
}
