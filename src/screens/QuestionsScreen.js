import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/ui/AppText';
import AppButton from '../components/ui/AppButton';
import PressableScale from '../components/ui/PressableScale';
import { QuestionSkeleton } from '../components/ui/Skeletons';
import QuizHeader from '../components/quiz/QuizHeader';
import QuizQuestionCard from '../components/quiz/QuizQuestionCard';
import ReviewSheet from '../components/quiz/ReviewSheet';
import useReduceMotion from '../hooks/useReduceMotion';
import { Flag } from '../icons';
import { getQuiz, recordTry, submitQuiz } from '../api/content';
import { normalizeQuestionData } from '../utils/questionFormat';
import { clearQuizSession, getElapsedSeconds, loadAnswers, saveAnswers } from '../utils/quizSession';
import { COLORS, contentColumn, tw } from '../theme';

const QUIZ_DURATION_SECONDS = 1350;
const MAX_ATTEMPTS = 3;

function isPending(question, answer) {
  if (question.answerType === 'multiple') return !(answer?.selectedOptionIndexes || []).length;
  if (question.answerType === 'numerical') return !answer?.selectedNumericalAnswer;
  return answer?.selectedOptionIndex === undefined;
}

// The correct answer is not sent to the phone. Each tap is counted locally for instant feedback and reported to the
// server, which reveals the correct option on the third try (see applyTryResult).
function nextSingleChoiceAnswer(questionId, previous, optionIndex) {
  const attempts = Math.min((previous?.attempts || 0) + 1, MAX_ATTEMPTS - 1);
  return { ...(previous || { questionId }), selectedOptionIndex: optionIndex, attempts };
}

function applyTryResult(previous, result) {
  if (!previous || previous.revealedAfterAttempts || !result) return previous;
  if (typeof result.revealedOptionIndex === 'number') {
    return { ...previous, selectedOptionIndex: result.revealedOptionIndex, attempts: MAX_ATTEMPTS, revealedAfterAttempts: true };
  }
  return { ...previous, attempts: Math.max(previous.attempts || 0, Math.min(result.attempts || 0, MAX_ATTEMPTS - 1)) };
}

export default function QuestionsScreen({ route, navigation }) {
  const { topicId, subtopicId, topicName, subtopicName, unitName } = route.params || {};
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  // When the quiz runs out. The countdown itself lives in QuizHeader, so this screen does not re-render every second.
  const [deadline, setDeadline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState(0);
  const [flagged, setFlagged] = useState({});
  const [reviewOpen, setReviewOpen] = useState(false);
  const slide = useRef(new Animated.Value(1)).current;
  const slideDirection = useRef(1);
  const reduceMotion = useReduceMotion();
  const insets = useSafeAreaInsets();
  const answersRef = useRef([]);
  const timeoutHandledRef = useRef(false);
  const submittingRef = useRef(false);
  const submitRef = useRef(null);
  // Set just before the app itself leaves the screen (submit, expired session) so the confirmation below stays out of the way.
  const allowLeaveRef = useRef(false);

  // Moving between questions slides the new one in from the side it was reached from.
  useEffect(() => {
    if (reduceMotion) {
      slide.setValue(1);
      return undefined;
    }
    slide.setValue(0);
    const animation = Animated.timing(slide, { toValue: 1, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [current, reduceMotion]);

  const goTo = (index) => {
    slideDirection.current = index >= current ? 1 : -1;
    setCurrent(index);
  };

  const toggleFlag = (questionId) => setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));

  useEffect(() => {
    const load = async () => {
      let remainingSeconds = QUIZ_DURATION_SECONDS;
      try {
        const data = await getQuiz({ topicId, subtopicId });
        const sid = data.sessionId;

        setQuestions((Array.isArray(data?.questions) ? data.questions : []).map(normalizeQuestionData));

        if (sid) {
          setSessionId(sid);
          const savedAnswers = await loadAnswers(sid);
          setAnswers(savedAnswers);
          answersRef.current = savedAnswers;
          remainingSeconds = Math.max(QUIZ_DURATION_SECONDS - (await getElapsedSeconds(sid)), 0);
        }
        setDeadline(Date.now() + remainingSeconds * 1000);
      } catch (err) {
        console.log('Load quiz error:', err?.message || err);
        Alert.alert('Error', 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [topicId, subtopicId]);

  // Back button, header arrow and swipe-back all end up here: ask before abandoning a quiz in progress.
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event) => {
        if (allowLeaveRef.current || loading || submitting || questions.length === 0) return;
        event.preventDefault();
        Alert.alert('Leave this quiz?', 'Your answers are saved, but the timer keeps running. You can pick the quiz up again from the same lesson.', [
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
    [navigation, loading, submitting, questions.length]
  );

  const updateAnswer = (questionId, build) => {
    setAnswers((prev) => {
      const previous = prev.find((a) => a.questionId === questionId);
      const nextAnswer = build(previous);
      if (!nextAnswer || nextAnswer === previous) return prev;
      const updated = previous ? prev.map((a) => (a.questionId === questionId ? nextAnswer : a)) : [...prev, nextAnswer];
      answersRef.current = updated;
      saveAnswers(sessionId, updated);
      return updated;
    });
  };

  const handlers = {
    onSelect: (questionId, optionIndex) => {
      updateAnswer(questionId, (previous) => nextSingleChoiceAnswer(questionId, previous, optionIndex));
      recordTry({ sessionId, questionId })
        .then((result) => updateAnswer(questionId, (previous) => applyTryResult(previous, result)))
        .catch((err) => console.log('Record try error:', err?.message || err));
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
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const result = await submitQuiz({ sessionId, answers: finalAnswers, isTimedOut, topicId, subtopicId });
      await clearQuizSession(sessionId);
      allowLeaveRef.current = true;
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
          {
            text: 'OK',
            onPress: () => {
              allowLeaveRef.current = true;
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', message || 'Submit failed');
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };
  submitRef.current = submit;

  // Called by the header's countdown when time runs out: submit whatever has been answered, once.
  const handleExpire = useCallback(() => {
    if (submittingRef.current || timeoutHandledRef.current) return;
    timeoutHandledRef.current = true;
    submitRef.current?.(answersRef.current, true);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.appBackground, paddingTop: insets.top + 16 }}>
        <QuestionSkeleton style={tw`mx-4`} />
      </View>
    );
  }

  const answerById = Object.fromEntries(answers.map((a) => [a.questionId, a]));
  const pendingCount = questions.filter((q) => isPending(q, answerById[q._id])).length;

  const reviewItems = questions.map((q) => ({ id: q._id, answered: !isPending(q, answerById[q._id]), flagged: !!flagged[q._id] }));
  const currentQuestion = questions[current];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.appBackground }}>
      <QuizHeader
        onBack={() => navigation.goBack()}
        title={subtopicName || topicName || 'Quiz'}
        deadline={deadline}
        onExpire={handleExpire}
        answeredCount={questions.length - pendingCount}
        pendingCount={pendingCount}
      />

      {questions.length > 0 ? (
        <>
          <View style={tw`bg-white border-b border-slate-200`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-3 py-2.5`}>
              {questions.map((q, i) => {
                const answered = !isPending(q, answerById[q._id]);
                const isFlagged = !!flagged[q._id];
                const active = i === current;
                return (
                  <PressableScale
                    key={q._id}
                    onPress={() => goTo(i)}
                    scaleTo={0.92}
                    hitSlop={{ top: 4, bottom: 4, left: 2, right: 2 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Question ${i + 1}, ${answered ? 'answered' : 'not answered'}${isFlagged ? ', flagged' : ''}`}
                    style={tw.style(
                      'w-9 h-9 mr-2 rounded-lg items-center justify-center border',
                      answered ? 'bg-brand-600 border-brand-600' : 'bg-white border-slate-300',
                      isFlagged && 'border-2 border-amber-600',
                      active && 'border-2 border-ink-900'
                    )}
                  >
                    <AppText variant="bold" style={tw.style('text-[13px]', answered ? 'text-white' : 'text-slate-600')}>
                      {i + 1}
                    </AppText>
                    {isFlagged ? <View style={tw`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-600 border border-white`} /> : null}
                  </PressableScale>
                );
              })}
              <PressableScale
                onPress={() => setReviewOpen(true)}
                scaleTo={0.94}
                accessibilityRole="button"
                accessibilityLabel="Review all questions"
                style={tw`h-9 px-3 rounded-lg items-center justify-center bg-ink-900`}
              >
                <AppText variant="bold" style={tw`text-[13px] text-white`}>
                  Review
                </AppText>
              </PressableScale>
            </ScrollView>
          </View>

          <ScrollView style={tw`flex-1`} contentContainerStyle={[tw`p-4`, contentColumn]} key={currentQuestion._id}>
            <Animated.View
              style={{
                opacity: slide,
                transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [slideDirection.current * 28, 0] }) }],
              }}
            >
              <View style={tw`flex-row justify-end mb-2`}>
                <PressableScale
                  onPress={() => toggleFlag(currentQuestion._id)}
                  scaleTo={0.95}
                  accessibilityRole="button"
                  accessibilityState={{ selected: !!flagged[currentQuestion._id] }}
                  accessibilityLabel={flagged[currentQuestion._id] ? 'Remove flag from this question' : 'Flag this question for review'}
                  style={[
                    tw`flex-row items-center rounded-lg border px-3 py-1.5`,
                    flagged[currentQuestion._id]
                      ? { backgroundColor: COLORS.amber50, borderColor: COLORS.amber600 }
                      : { backgroundColor: COLORS.white, borderColor: COLORS.slate200 },
                  ]}
                >
                  <Flag size={14} color={flagged[currentQuestion._id] ? COLORS.amber600 : COLORS.slate500} />
                  <AppText variant="semiBold" style={[tw`ml-1.5 text-xs`, { color: flagged[currentQuestion._id] ? COLORS.amber800 : COLORS.slate600 }]}>
                    {flagged[currentQuestion._id] ? 'Flagged' : 'Flag for review'}
                  </AppText>
                </PressableScale>
              </View>

              <QuizQuestionCard question={currentQuestion} index={current} answer={answerById[currentQuestion._id]} {...handlers} />
            </Animated.View>
          </ScrollView>

          <View style={[tw`flex-row px-4 pt-3 bg-white border-t border-slate-200`, { paddingBottom: insets.bottom + 12 }]}>
            <AppButton
              label="Previous"
              tone="secondary"
              disabled={current === 0}
              onPress={() => goTo(current - 1)}
              style={tw`flex-1 mr-3`}
            />
            {current < questions.length - 1 ? (
              <AppButton label="Next" onPress={() => goTo(current + 1)} style={tw`flex-1`} />
            ) : (
              <AppButton label="Review & Submit" onPress={() => setReviewOpen(true)} disabled={submitting} style={tw`flex-1`} />
            )}
          </View>
        </>
      ) : (
        <AppText style={{ textAlign: 'center', marginTop: 50, fontSize: 16, color: COLORS.gray500 }}>No questions available</AppText>
      )}

      <ReviewSheet
        visible={reviewOpen}
        items={reviewItems}
        currentIndex={current}
        submitting={submitting}
        onClose={() => setReviewOpen(false)}
        onJump={(index) => {
          setReviewOpen(false);
          goTo(index);
        }}
        onSubmit={() => {
          setReviewOpen(false);
          submit(answersRef.current);
        }}
      />
    </View>
  );
}
