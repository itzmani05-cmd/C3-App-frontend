import React from 'react';
import AppButton from '../components/ui/AppButton';
import Card from '../components/ui/Card';
import Screen from '../components/ui/Screen';
import ScoreHero from '../components/dailyChallenge/ScoreHero';
import ReviewQuestionCard from '../components/dailyChallenge/ReviewQuestionCard';
import useFetch from '../hooks/useFetch';
import { getAttempt, getProgressSummary } from '../api/dailyChallenge';
import { COLORS } from '../theme';

export default function DailyChallengeReviewScreen({ route, navigation }) {
  const { challengeId, attemptId, data: initialData } = route.params || {};
  const { data, loading } = useFetch(() => getAttempt(challengeId, attemptId), [challengeId, attemptId], {
    enabled: !initialData,
    initialData: initialData || null,
  });
  const { data: summary } = useFetch(getProgressSummary);

  const goHome = () => navigation.navigate('MainApp');
  const questions = Array.isArray(data?.questions) ? data.questions : [];

  return (
    <Screen title="C3 Daily Challenge" onBack={loading ? navigation.goBack : goHome} loading={loading}>
      <Card elevation="md" style={{ alignItems: 'center', marginBottom: 16 }}>
        <ScoreHero
          caption="🎉 Final Score"
          captionVariant="bold"
          captionStyle={{ fontSize: 16, color: COLORS.slate900 }}
          score={data?.score ?? data?.bestScore ?? 0}
          total={data?.totalQuestions ?? questions.length}
          currentStreak={summary?.currentStreak}
          overallStreak={summary?.overallStreak}
        />
      </Card>

      {questions.map((question, index) => (
        <ReviewQuestionCard key={question.questionId || index} question={question} index={index} />
      ))}

      <AppButton label="Back to Home" tone="brand" onPress={goHome} style={{ marginTop: 8 }} />
    </Screen>
  );
}
