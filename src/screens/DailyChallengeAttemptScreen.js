import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import Screen from '../components/ui/Screen';
import AppButton from '../components/ui/AppButton';
import AttemptQuestionCard from '../components/dailyChallenge/AttemptQuestionCard';
import CalculatorButton from '../components/question/CalculatorButton';
import { startAttempt, submitAttempt } from '../api/dailyChallenge';
import { COLORS } from '../theme';

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
      navigation.replace(result.revealed ? 'DailyChallengeReviewScreen' : 'DailyChallengeResultScreen', {
        challengeId,
        data: result,
      });
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || 'Submit failed. Please try again.';
      const title = ERROR_TITLES[status];
      if (title) Alert.alert(title, message, [{ text: 'OK', onPress: () => navigation.goBack() }]);
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
      title="C3 Daily Challenge"
      onBack={navigation.goBack}
      loading={loading}
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
        tone="brand"
        onPress={handleSubmitPress}
        disabled={submitting}
        style={{ marginTop: 8, paddingVertical: 16, backgroundColor: submitting ? COLORS.slate400 : COLORS.brand600 }}
        textStyle={{ fontSize: 16 }}
      />
    </Screen>
  );
}
