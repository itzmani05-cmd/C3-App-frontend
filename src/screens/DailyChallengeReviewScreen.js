import React from 'react';
import AppButton from '../components/ui/AppButton';
import Card from '../components/ui/Card';
import Screen from '../components/ui/Screen';
import { QuestionSkeleton } from '../components/ui/Skeletons';
import ScoreHero from '../components/dailyChallenge/ScoreHero';
import ReviewQuestionCard from '../components/dailyChallenge/ReviewQuestionCard';
import useFetch from '../hooks/useFetch';
import { getAttempt, getProgressSummary } from '../api/dailyChallenge';
import { tw } from '../theme';

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
    <Screen title="Challenge Review" onBack={loading ? navigation.goBack : goHome} loading={loading} skeleton={<QuestionSkeleton />}>
      <Card elevation="md" style={tw`mb-4 p-5`}>
        <ScoreHero
          caption="Final score"
          captionVariant="semiBold"
          score={data?.score ?? data?.bestScore ?? 0}
          total={data?.totalQuestions ?? questions.length}
          currentStreak={summary?.currentStreak}
          overallStreak={summary?.overallStreak}
        />
      </Card>

      {questions.map((question, index) => (
        <ReviewQuestionCard key={question.questionId || index} question={question} index={index} />
      ))}

      <AppButton label="Back to Home" onPress={goHome} style={tw`mt-2`} />
    </Screen>
  );
}
