import React from 'react';
import { View } from 'react-native';
import Screen from '../components/ui/Screen';
import StatCard from '../components/ui/StatCard';
import StreakSummaryCard from '../components/dailyChallenge/StreakSummaryCard';
import TopicPerformanceCard from '../components/dailyChallenge/TopicPerformanceCard';
import useFetch from '../hooks/useFetch';
import { getProgressOverview } from '../api/dailyChallenge';
import { COLORS } from '../theme';

function buildStats(summary) {
  return [
    { label: 'Challenges Completed', value: summary?.challengesCompleted || 0, accent: COLORS.brand600 },
    { label: 'Questions Answered', value: summary?.questionsAnswered || 0, accent: COLORS.accent600 },
    { label: 'Accuracy', value: `${Math.round(summary?.accuracy || 0)}%`, accent: COLORS.success600 },
    {
      label: 'Average Score',
      value: `${(summary?.averageScore || 0).toFixed(1)}/${summary?.questionsPerChallenge || 5}`,
      accent: COLORS.info600,
    },
  ];
}

export default function DailyChallengeProgressScreen({ navigation }) {
  const { data, loading } = useFetch(getProgressOverview, [], {
    initialData: { summary: null, topics: [], weakArea: null, streakHistory: [] },
  });

  return (
    <Screen title="Daily Challenge Progress" onBack={navigation.goBack} loading={loading}>
      <StreakSummaryCard summary={data.summary} history={data.streakHistory} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, marginHorizontal: -6 }}>
        {buildStats(data.summary).map((stat) => (
          <StatCard key={stat.label} {...stat} style={{ width: '48%', marginHorizontal: '1%', marginTop: 8 }} />
        ))}
      </View>

      <TopicPerformanceCard topics={data.topics} weakArea={data.weakArea} />
    </Screen>
  );
}
