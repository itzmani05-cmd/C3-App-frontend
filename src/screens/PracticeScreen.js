import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, AppState, Easing, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../components/ui/AppText';
import AppButton from '../components/ui/AppButton';
import Card from '../components/ui/Card';
import Screen from '../components/ui/Screen';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import ProgressBar from '../components/ui/ProgressBar';
import { QuestionSkeleton } from '../components/ui/Skeletons';
import PracticeQuestionCard, { EMPTY_PRACTICE_STATE } from '../components/quiz/PracticeQuestionCard';
import ScoreRing from '../components/result/ScoreRing';
import useReduceMotion from '../hooks/useReduceMotion';
import { getPracticeLesson, savePracticeProgress } from '../api/content';
import { evaluateAnswer, getCorrectOptionIndex, normalizeQuestionData } from '../utils/questionFormat';
import { PRACTICE_PAGE_SIZE, hasPracticed, mergePage, pageStartFor } from '../utils/practiceSession';
import { COLORS, contentColumn, tw } from '../theme';

const normalizePage = (page) => ({ ...page, questions: page.questions.map(normalizeQuestionData) });

function toAnswer(question, state) {
  if (question.answerType === 'multiple') return { selectedOptionIndexes: state.selected };
  if (question.answerType === 'numerical') return { selectedNumericalAnswer: state.numerical };
  return { selectedOptionIndex: state.selected[0] };
}

// What the student did in this session. Practice is not scored; this just shows how they got on with the questions they
// chose to answer. `total` and `practiced` cover the whole lesson, including earlier sessions.
function summarise(questions, states, viewed, total, practiced) {
  let answered = 0;
  let correct = 0;
  let revealed = 0;

  questions.forEach((question) => {
    const state = states[question._id];
    if (!state) return;
    if (state.showAnswer) revealed += 1;
    const result = evaluateAnswer(question, toAnswer(question, state), getCorrectOptionIndex(question));
    if (result.answered) {
      answered += 1;
      if (result.correct) correct += 1;
    }
  });

  return { total, viewed, answered, correct, revealed, practiced };
}

function SummaryStat({ label, value }) {
  return (
    <View style={tw`flex-1 items-center`}>
      <AppText variant="extraBold" style={[tw`text-xl`, { color: COLORS.slate900, letterSpacing: -0.4 }]}>
        {value}
      </AppText>
      <AppText type="caption" style={tw`mt-0.5 text-slate-500`}>
        {label}
      </AppText>
    </View>
  );
}

function PracticeSummary({ summary, onAgain, onBack }) {
  const accuracy = summary.answered ? Math.round((summary.correct / summary.answered) * 100) : 0;

  return (
    <ScrollView contentContainerStyle={[tw`p-4`, contentColumn]}>
      <Card elevation="md" style={tw`items-center p-6`}>
        <AppText type="title" style={tw`text-slate-900`}>
          Practice complete
        </AppText>
        <AppText type="small" style={tw`mt-1 mb-5 text-slate-500 text-center`}>
          {summary.answered > 0
            ? `You answered ${summary.answered} of ${summary.total} questions.`
            : `You looked through ${summary.viewed} of ${summary.total} questions without answering any.`}
        </AppText>

        {summary.answered > 0 ? (
          <>
            <ScoreRing value={accuracy} color={accuracy >= 80 ? COLORS.green600 : accuracy >= 50 ? COLORS.amber600 : COLORS.red600} size={132} />
            <AppText type="small" style={tw`mt-3 text-slate-500`}>
              {summary.correct} correct out of {summary.answered} answered
            </AppText>
          </>
        ) : (
          <AppText type="small" style={tw`text-center text-slate-500`}>
            Try choosing an answer before you reveal it. It is the best way to find what you need to revise.
          </AppText>
        )}

        <AppText type="small" style={tw`mt-4 text-center text-slate-500`}>
          {`${summary.practiced} of ${summary.total} questions in this lesson practised so far`}
        </AppText>

        <View style={tw`mt-6 flex-row self-stretch border-t border-slate-100 pt-5`}>
          <SummaryStat label="Viewed" value={`${summary.viewed}/${summary.total}`} />
          <SummaryStat label="Answered" value={summary.answered} />
          <SummaryStat label="Revealed" value={summary.revealed} />
        </View>
      </Card>

      <AppButton label="Practice again" onPress={onAgain} size="lg" style={tw`mt-5 rounded-lg`} />
      <AppButton label="Back to lessons" tone="secondary" onPress={onBack} size="lg" style={tw`mt-2.5 rounded-lg`} />
    </ScrollView>
  );
}

export default function PracticeScreen({ route, navigation }) {
  const { topicId, subtopicId, topicName, subtopicName } = route.params || {};
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  // Questions arrive a page at a time and keep their place in the lesson, so "question 12 of 30" is always the same
  // question and the student can pick up where they stopped.
  const [status, setStatus] = useState('loading');
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState({});
  const [index, setIndex] = useState(0);
  const [resumedFrom, setResumedFrom] = useState(null);
  const [practicedCount, setPracticedCount] = useState(0);
  const [pageError, setPageError] = useState(false);
  const [states, setStates] = useState({});
  const [finished, setFinished] = useState(false);
  const visited = useRef(new Set());
  const practiced = useRef(new Set());
  const unsaved = useRef(new Set());
  const requested = useRef(new Set());
  const indexRef = useRef(0);
  const dirty = useRef(false);
  const saveTimer = useRef(null);
  const slide = useRef(new Animated.Value(1)).current;
  const slideDirection = useRef(1);

  const flush = useCallback(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = null;
    if (!dirty.current) return;
    dirty.current = false;
    const questionIds = [...unsaved.current];
    unsaved.current = new Set();
    // Progress is saved quietly: if the request fails the answers are sent again with the next save.
    savePracticeProgress({ topicId, subtopicId, questionIds, position: indexRef.current }).catch(() => {
      questionIds.forEach((id) => unsaved.current.add(id));
      dirty.current = true;
    });
  }, [topicId, subtopicId]);

  const scheduleSave = useCallback(() => {
    dirty.current = true;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, 800);
  }, [flush]);

  const loadPage = useCallback(
    async (at) => {
      const start = pageStartFor(at);
      if (requested.current.has(start)) return;
      requested.current.add(start);
      try {
        const page = await getPracticeLesson({ topicId, subtopicId, offset: start, limit: PRACTICE_PAGE_SIZE });
        setItems((prev) => mergePage(prev, normalizePage(page)));
        setPageError(false);
      } catch (err) {
        console.log('Practice page failed:', err?.message || err);
        requested.current.delete(start);
        setPageError(true);
      }
    },
    [topicId, subtopicId]
  );

  const begin = useCallback(async () => {
    setStatus('loading');
    requested.current = new Set();
    try {
      const page = normalizePage(await getPracticeLesson({ topicId, subtopicId, limit: PRACTICE_PAGE_SIZE }));
      practiced.current = new Set(page.practicedIds);
      unsaved.current = new Set();
      indexRef.current = page.offset;
      visited.current = new Set([page.offset]);
      setItems(mergePage({}, page));
      setTotal(page.total);
      setIndex(page.offset);
      setResumedFrom(page.offset > 0 ? page.offset : null);
      setPracticedCount(practiced.current.size);
      setStatus(page.questions.length > 0 ? 'ready' : 'empty');
    } catch (err) {
      console.log('Practice load failed:', err?.message || err);
      setStatus(err?.response?.status === 404 ? 'empty' : 'error');
    }
  }, [topicId, subtopicId]);

  useEffect(() => {
    begin();
  }, [begin]);

  // Keep the question being read, and the ones around it, loaded.
  useEffect(() => {
    if (status !== 'ready') return;
    [index, index + 1, index + 2, index - 1].forEach((at) => {
      if (at >= 0 && at < total && !items[at]) loadPage(at);
    });
  }, [status, index, total, items, loadPage]);

  // Save the place when the student leaves the lesson or the app.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => state !== 'active' && flush());
    return () => {
      subscription.remove();
      flush();
    };
  }, [flush]);

  useEffect(() => {
    if (reduceMotion) {
      slide.setValue(1);
      return undefined;
    }
    slide.setValue(0);
    const animation = Animated.timing(slide, { toValue: 1, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [index, reduceMotion]);

  const question = items[index];
  const isLast = index === total - 1;

  const patch = (id, change) => {
    const next = { ...EMPTY_PRACTICE_STATE, ...states[id], ...change };
    setStates((prev) => ({ ...prev, [id]: next }));
    if (hasPracticed(next) && !practiced.current.has(id)) {
      practiced.current.add(id);
      unsaved.current.add(id);
      setPracticedCount(practiced.current.size);
      scheduleSave();
    }
  };

  const goTo = (next) => {
    slideDirection.current = next >= index ? 1 : -1;
    visited.current.add(next);
    indexRef.current = next;
    setIndex(next);
    setResumedFrom(null);
    scheduleSave();
  };

  const finish = () => {
    // A finished lesson starts from the top next time.
    indexRef.current = 0;
    dirty.current = true;
    flush();
    setFinished(true);
  };

  const startOver = () => {
    setFinished(false);
    setStates({});
    visited.current = new Set();
    goTo(0);
  };

  const renderBody = () => {
    if (status === 'loading') return <QuestionSkeleton style={tw`m-4`} />;
    if (status === 'error') return <ErrorState onRetry={begin} />;
    if (status === 'empty') return <EmptyState message="No practice questions available yet." style={tw`mt-16 mx-4`} />;

    if (finished) {
      return (
        <PracticeSummary
          summary={summarise(Object.values(items), states, visited.current.size, total, practicedCount)}
          onAgain={startOver}
          onBack={navigation.goBack}
        />
      );
    }

    return (
      <>
        <View style={[tw`px-4 pt-3 pb-2`, contentColumn]}>
          <View style={tw`flex-row justify-between mb-1.5`}>
            <AppText variant="semiBold" style={tw`text-xs text-slate-500`}>
              Question {index + 1} of {total}
            </AppText>
            <AppText variant="semiBold" style={tw`text-xs text-slate-500`}>
              {practicedCount} of {total} practised
            </AppText>
          </View>
          <ProgressBar value={((index + 1) / total) * 100} height={6} />
          {resumedFrom !== null ? (
            <View style={tw`mt-2.5 flex-row items-center justify-between rounded-lg bg-brand-50 px-3 py-2`}>
              <AppText type="small" style={tw`flex-1 mr-3 text-brand-700`}>
                {`Continuing from question ${resumedFrom + 1}`}
              </AppText>
              <TouchableOpacity onPress={startOver} accessibilityRole="button" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <AppText variant="bold" type="small" style={tw`text-brand-700`}>
                  Start over
                </AppText>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {question ? (
          <ScrollView contentContainerStyle={[tw`p-4`, contentColumn]} key={question._id}>
            <Animated.View
              style={{
                opacity: slide,
                transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [slideDirection.current * 28, 0] }) }],
              }}
            >
              <PracticeQuestionCard question={question} index={index} state={states[question._id]} onChange={(change) => patch(question._id, change)} />
            </Animated.View>
          </ScrollView>
        ) : pageError ? (
          <ErrorState onRetry={() => loadPage(index)} />
        ) : (
          <QuestionSkeleton style={tw`m-4`} />
        )}

        <View style={[tw`flex-row px-4 pt-3 bg-white border-t border-slate-200`, { paddingBottom: insets.bottom + 12 }]}>
          <AppButton label="Previous" tone="secondary" disabled={index === 0} onPress={() => goTo(index - 1)} style={tw`flex-1 mr-3`} />
          <AppButton label={isLast ? 'Finish' : 'Next'} disabled={!question} onPress={() => (isLast ? finish() : goTo(index + 1))} style={tw`flex-1`} />
        </View>
      </>
    );
  };

  return (
    <Screen
      title={`Practice: ${subtopicName || topicName || 'Questions'}`}
      onBack={navigation.goBack}
      background={COLORS.appBackground}
      scroll={false}
    >
      {renderBody()}
    </Screen>
  );
}
