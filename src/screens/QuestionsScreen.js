import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import AppText from '../components/ui/AppText';
import AppButton from '../components/ui/AppButton';
import LoadingView from '../components/ui/LoadingView';
import QuizHeader from '../components/quiz/QuizHeader';
import QuizQuestionCard from '../components/quiz/QuizQuestionCard';
import { getQuiz, submitQuiz } from '../api/content';
import { getCorrectOptionIndex, normalizeQuestionData } from '../utils/questionFormat';
import { clearQuizSession, getElapsedSeconds, loadAnswers, saveAnswers } from '../utils/quizSession';
import { COLORS } from '../theme';

const QUIZ_DURATION_SECONDS = 1350;
const MAX_ATTEMPTS = 3;

function isPending(question, answer) {
  if (question.answerType === 'multiple') return !(answer?.selectedOptionIndexes || []).length;
  if (question.answerType === 'numerical') return !answer?.selectedNumericalAnswer;
  return answer?.selectedOptionIndex === undefined;
}

function nextSingleChoiceAnswer(question, previous, optionIndex) {
  if (!previous) return { questionId: question._id, selectedOptionIndex: optionIndex, attempts: 1 };
  const attempts = (previous.attempts || 0) + 1;
  if (attempts === MAX_ATTEMPTS) {
    return { ...previous, selectedOptionIndex: getCorrectOptionIndex(question), attempts, revealedAfterAttempts: true };
  }
  return { ...previous, selectedOptionIndex: optionIndex, attempts };
}

export default function QuestionsScreen({ route, navigation }) {
  const { topicId, subtopicId, topicName, subtopicName, unitName } = route.params || {};
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const answersRef = useRef([]);
  const timeoutHandledRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getQuiz({ topicId, subtopicId });
        const sid = data.sessionId;

        setQuestions((Array.isArray(data?.questions) ? data.questions : []).map(normalizeQuestionData));

        if (sid) {
          setSessionId(sid);
          const savedAnswers = await loadAnswers(sid);
          setAnswers(savedAnswers);
          answersRef.current = savedAnswers;
          setTimeLeft(Math.max(QUIZ_DURATION_SECONDS - (await getElapsedSeconds(sid)), 0));
        }
      } catch (err) {
        console.log('Load quiz error:', err?.message || err);
        Alert.alert('Error', 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [topicId, subtopicId]);

  useEffect(() => {
    if (loading || questions.length === 0) return undefined;
    const timer = setInterval(() => setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [loading, questions.length]);

  const updateAnswer = (questionId, build) => {
    setAnswers((prev) => {
      const previous = prev.find((a) => a.questionId === questionId);
      const nextAnswer = build(previous);
      const updated = previous ? prev.map((a) => (a.questionId === questionId ? nextAnswer : a)) : [...prev, nextAnswer];
      answersRef.current = updated;
      saveAnswers(sessionId, updated);
      return updated;
    });
  };

  const handlers = {
    onSelect: (questionId, optionIndex) => {
      const question = questions.find((q) => q._id === questionId);
      updateAnswer(questionId, (previous) => nextSingleChoiceAnswer(question, previous, optionIndex));
    },
    onToggle: (questionId, optionIndex) =>
      updateAnswer(questionId, (previous) => {
        const selected = previous?.selectedOptionIndexes || [];
        const next = selected.includes(optionIndex) ? selected.filter((i) => i !== optionIndex) : [...selected, optionIndex];
        return { ...(previous || { questionId }), selectedOptionIndexes: next };
      }),
    onNumericalChange: (questionId, text) =>
      updateAnswer(questionId, (previous) => ({ ...(previous || { questionId }), selectedNumericalAnswer: text })),
  };

  const submit = async (finalAnswers, isTimedOut = false) => {
    setSubmitting(true);
    try {
      const result = await submitQuiz({ sessionId, answers: finalAnswers, isTimedOut, topicId, subtopicId });
      await clearQuizSession(sessionId);
      navigation.replace('ResultScreen', {
        result,
        questions,
        answers: finalAnswers.map(({ questionId, selectedOptionIndex, selectedOptionIndexes, selectedNumericalAnswer }) => ({
          questionId,
          selectedOptionIndex,
          selectedOptionIndexes,
          selectedNumericalAnswer,
        })),
        topicId,
        subtopicId,
        topicName,
        subtopicName,
        unitName,
      });
    } catch (err) {
      const message = err.response?.data?.message || '';
      if (err.response?.status === 400 && message.toLowerCase().includes('corrupted')) {
        await clearQuizSession(sessionId);
        Alert.alert('Session Expired', 'Your quiz session was out of date. We have cleared it. Please try again.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', message || 'Submit failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (loading || submitting || timeLeft !== 0 || timeoutHandledRef.current) return;
    timeoutHandledRef.current = true;
    submit(answersRef.current, true);
  }, [timeLeft]);

  if (loading) return <LoadingView color={COLORS.blue600} style={{ backgroundColor: COLORS.appBackground }} />;

  const answerById = Object.fromEntries(answers.map((a) => [a.questionId, a]));
  const pendingCount = questions.filter((q) => isPending(q, answerById[q._id])).length;

  const handleSubmitPress = () => {
    if (pendingCount === 0) {
      submit(answersRef.current);
      return;
    }
    Alert.alert('Incomplete Quiz', `You have ${pendingCount} unanswered question(s).\n\nDo you want to submit anyway?`, [
      { text: 'Go Back', style: 'cancel' },
      { text: 'Submit Anyway', onPress: () => submit(answersRef.current) },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.appBackground }}>
      <QuizHeader
        title={subtopicName || topicName || 'Quiz'}
        timeLeft={timeLeft}
        answeredCount={questions.length - pendingCount}
        pendingCount={pendingCount}
      />

      <ScrollView style={{ padding: 16 }}>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <QuizQuestionCard key={question._id} question={question} index={index} answer={answerById[question._id]} {...handlers} />
          ))
        ) : (
          <AppText style={{ textAlign: 'center', marginTop: 50, fontSize: 16, color: COLORS.gray500 }}>No questions available</AppText>
        )}

        <AppButton
          label={submitting ? 'Submitting...' : 'Submit Quiz'}
          onPress={handleSubmitPress}
          disabled={submitting}
          style={[submitStyle, submitting ? { backgroundColor: COLORS.gray400, opacity: 1, elevation: 0, shadowOpacity: 0 } : null]}
          textStyle={{ fontSize: 16 }}
        />
      </ScrollView>
    </View>
  );
}

const submitStyle = {
  paddingVertical: 16,
  borderRadius: 14,
  marginVertical: 20,
  shadowColor: COLORS.blue600,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 4,
};
