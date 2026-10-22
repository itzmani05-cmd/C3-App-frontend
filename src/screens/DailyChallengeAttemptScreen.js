import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import Screen from '../components/ui/Screen';
import { QuestionSkeleton } from '../components/ui/Skeletons';
import AppButton from '../components/ui/AppButton';
import AttemptQuestionCard from '../components/dailyChallenge/AttemptQuestionCard';
import CalculatorButton from '../components/question/CalculatorButton';
import { startAttempt, submitAttempt } from '../api/dailyChallenge';

const ERROR_TITLES = { 410: 'Challenge expired', 403: 'No attempts remaining' };

function toResponses(answers) {
  return Object.keys(answers).map((questionId) => ({ questionId, ...answers[questionId] }));
}

export default function DailyChallengeAttemptScreen({ route, navigation }) {
  const { challengeId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  const allowLeaveRef = useRef(false);

  useEffect(() => {
    startAttempt(challengeId)
      .then((attempt) => {
        setAttemptId(attempt.attemptId);
        setQuestions(attempt.questions);
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Could not start the challenge.';
        Alert.alert('Unable to start', message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
      })
      .finally(() => setLoading(false));
  }, [challengeId, navigation]);

  // Answers in a daily challenge are not saved between visits, so confirm before throwing them away.
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event) => {
        if (allowLeaveRef.current || loading || submitting || Object.keys(answersRef.current).length === 0) return;
        event.preventDefault();
        Alert.alert('Leave this attempt?', 'Your answers for this attempt will be lost.', [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              allowLeaveRef.current = true;
              navigation.dispatch(event.data.action);
            },
          },
        ]);
      }),
    [navigation, loading, submitting]
  );

  const updateAnswer = (questionId, update) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: update(prev[questionId]) };
      answersRef.current = next;
      return next;
    });
  };

  const handlers = {
    onSelect: (id, index) => updateAnswer(id, () => ({ selectedOptionIndex: index })),
    onToggle: (id, index) =>
      updateAnswer(id, (current) => {
        const selected = current?.selectedOptionIndexes || [];
        return {
          selectedOptionIndexes: selected.includes(index) ? selected.filter((i) => i !== index) : [...selected, index],
        };
      }),
    onNumericalChange: (id, text) => updateAnswer(id, () => ({ selectedNumericalAnswer: text })),
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const result = await submitAttempt(challengeId, attemptId, toResponses(answersRef.current));
      allowLeaveRef.current = true;
      navigation.replace(result.revealed ? 'DailyChallengeReviewScreen' : 'DailyChallengeResultScreen', {
        challengeId,
        data: result,
      });
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Submit failed. Please try again.';
      const title = ERROR_TITLES[status];
      if (title) {
        Alert.alert(title, message, [
          {
            text: 'OK',
            onPress: () => {
              allowLeaveRef.current = true;
              navigation.goBack();
            },
          },
        ]);
      }
      else Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitPress = () => {
    const pending = questions.length - Object.keys(answersRef.current).length;
    if (pending <= 0) {
      submit();
      return;
    }
    Alert.alert('Incomplete Challenge', `You have ${pending} unanswered question(s). Submit anyway?`, [
      { text: 'Go Back', style: 'cancel' },
      { text: 'Submit Anyway', onPress: submit },
    ]);
  };

  return (
    <Screen
      title="Daily Challenge"
      onBack={navigation.goBack}
      loading={loading}
      skeleton={<QuestionSkeleton />}
      top={<CalculatorButton />}
    >
      {questions.map((question, index) => (
        <AttemptQuestionCard
          key={question.questionId}
          question={question}
          index={index}
          total={questions.length}
          answer={answers[question.questionId]}
          {...handlers}
        />
      ))}

      <AppButton
        label={submitting ? 'Submitting...' : 'Submit Challenge'}
        onPress={handleSubmitPress}
        loading={submitting}
        style={{ marginTop: 8, paddingVertical: 16 }}
        textStyle={{ fontSize: 16 }}
      />
    </Screen>
  );
}
