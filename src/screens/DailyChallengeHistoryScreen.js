import React from 'react';
import Screen from '../components/ui/Screen';
import EmptyState from '../components/ui/EmptyState';
import ChallengeHistoryItem from '../components/dailyChallenge/ChallengeHistoryItem';
import useFetch from '../hooks/useFetch';
import { getChallengeHistory } from '../api/dailyChallenge';

export default function DailyChallengeHistoryScreen({ navigation }) {
  const { data: challenges, loading } = useFetch(getChallengeHistory, [], { initialData: [] });

  const openReview = (item) =>
    navigation.navigate('DailyChallengeReviewScreen', { challengeId: item.challengeId, attemptId: item.latestAttemptId });

  return (
    <Screen title="Challenge History" onBack={navigation.goBack} loading={loading}>
      {challenges.length === 0 ? (
        <EmptyState message="No past challenges yet." />
      ) : (
        challenges.map((item) => <ChallengeHistoryItem key={item.challengeId} item={item} onOpen={openReview} />)
      )}
    </Screen>
  );
}
