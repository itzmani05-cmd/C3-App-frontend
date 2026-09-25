import React from 'react';
import Screen from '../components/ui/Screen';
import EmptyState from '../components/ui/EmptyState';
import ReviewQuestionCard from '../components/dailyChallenge/ReviewQuestionCard';
import useFetch from '../hooks/useFetch';
import { getUnitArchive } from '../api/dailyChallenge';
import { formatDate } from '../utils/format';

export default function DailyChallengeUnitHistoryScreen({ route, navigation }) {
  const { unitId, unitName, topicId, topicName } = route.params || {};
  const { data: questions, loading } = useFetch(() => getUnitArchive(unitId, topicId), [unitId, topicId], {
    initialData: [],
  });

  return (
    <Screen
      title={topicName || unitName || 'Daily Challenge'}
      onBack={navigation.canGoBack() ? navigation.goBack : undefined}
      loading={loading}
    >
      {questions.length === 0 ? (
        <EmptyState message="No completed daily challenges here yet — finish Today's Challenge to start building this up." />
      ) : (
        questions.map((question, index) => (
          <ReviewQuestionCard
            key={`${question.challengeId}_${question.questionId}`}
            question={question}
            index={index}
            dateLabel={formatDate(question.publishedAt)}
          />
        ))
      )}
    </Screen>
  );
}
