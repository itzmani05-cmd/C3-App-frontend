import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ListChecks, Target } from '../icons';
import AppButton from '../components/ui/AppButton';
import Screen from '../components/ui/Screen';
import SectionTitle from '../components/ui/SectionTitle';
import StatCard from '../components/ui/StatCard';
import ResultSummaryCard from '../components/result/ResultSummaryCard';
import ResultReviewCard from '../components/result/ResultReviewCard';
import LockedReviewCard from '../components/result/LockedReviewCard';
import useFetch from '../hooks/useFetch';
import { getNextLesson } from '../api/content';
import { normalizeQuestionData } from '../utils/questionFormat';
import { COLORS } from '../theme';

const PASS_PERCENTAGE = 80;

export default function ResultScreen({ route, navigation }) {
  const { answers = [], questions = [], result = {}, topicId, subtopicId, topicName, subtopicName, unitName } = route.params || {};

  // The quiz itself carries no answers; the submit response includes the full questions once review is unlocked.
  const reviewSource = Array.isArray(result?.review) && result.review.length > 0 ? result.review : questions;
  const normalizedQuestions = useMemo(() => (Array.isArray(reviewSource) ? reviewSource.map(normalizeQuestionData) : []), [reviewSource]);
  const answersByQuestionId = useMemo(() => Object.fromEntries(answers.map((a) => [a.questionId, a])), [answers]);

  const score = Number(result?.score) || 0;
  const percentage = Number(result?.percentage) || 0;
  const passed = typeof result?.passed === 'boolean' ? result.passed : percentage >= PASS_PERCENTAGE;
  const reviewUnlocked = typeof result?.reviewUnlocked === 'boolean' ? result.reviewUnlocked : passed;
  const quizLabel = subtopicName || topicName || 'Quiz';
  const pathLabel = unitName ? `${unitName} > ${topicName || quizLabel}` : quizLabel;

  const { data: nextLesson, loading: loadingNextLesson } = useFetch(() => getNextLesson(topicId, subtopicId), [topicId, subtopicId], {
    enabled: passed && !!topicId,
  });

  const goBack = () => navigation.goBack();
  const retryQuiz = () => navigation.replace('QuestionsScreen', { topicId, subtopicId, topicName, subtopicName, unitName });
  const openNextLesson = () =>
    navigation.replace('QuestionsScreen', {
      topicId: nextLesson.topicId,
      subtopicId: nextLesson.subtopicId || undefined,
      subtopicName: nextLesson.subtopicName || undefined,
      topicName: nextLesson.topicName || topicName,
      unitName: nextLesson.unitName || unitName,
    });

  let primary;
  let secondary = { label: 'Go Back', onPress: goBack };
  if (!passed) primary = { label: 'Retry Quiz', onPress: retryQuiz };
  else if (loadingNextLesson) primary = { label: 'Loading Next Lesson...', disabled: true };
  else if (nextLesson) primary = { label: 'Next Lesson', onPress: openNextLesson };
  else {
    primary = { label: 'Go Back', onPress: goBack };
    secondary = { label: 'Retry Quiz', onPress: retryQuiz };
  }

  return (
    <Screen title="Quiz Result" onBack={goBack} background={COLORS.appBackground}>
      <ResultSummaryCard pathLabel={pathLabel} quizLabel={quizLabel} passed={passed} percentage={percentage} previousBest={result?.previousBest} />

      <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
        <StatCard label="Score" value={`${score}/${questions.length}`} accent={COLORS.brand700} icon={Target} tone="brand" style={statStyle} />
        <StatCard label="Attempted" value={`${answers.length}`} icon={ListChecks} tone="accent" style={statStyle} />
      </View>

      {reviewUnlocked ? (
        <View style={{ marginTop: 8 }}>
          <SectionTitle>Answer Review</SectionTitle>
          {normalizedQuestions.map((question, index) => (
            <ResultReviewCard key={question?._id || index} question={question} index={index} answer={answersByQuestionId[question?._id]} />
          ))}
        </View>
      ) : (
        <LockedReviewCard attemptNumber={result?.attemptNumber} maxAttempts={result?.maxAttempts} />
      )}

      <View style={{ marginTop: 32 }}>
        <AppButton label={primary.label} onPress={primary.onPress} disabled={primary.disabled} />
        <AppButton label={secondary.label} tone="secondary" onPress={secondary.onPress} style={{ marginTop: 12 }} />
      </View>
    </Screen>
  );
}

const statStyle = {
  width: '48.5%',
};
