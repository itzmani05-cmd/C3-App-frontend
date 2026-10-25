import React, { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import AppText from '../components/ui/AppText';
import Screen from '../components/ui/Screen';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import SearchBar from '../components/ui/SearchBar';
import ScientificCalculator from '../components/question/ScientificCalculator';
import { QuestionSkeleton } from '../components/ui/Skeletons';
import PracticeQuestionCard, { EMPTY_PRACTICE_STATE } from '../components/quiz/PracticeQuestionCard';
import useFetch from '../hooks/useFetch';
import { getBookmarks, removeBookmark } from '../api/bookmarks';
import { normalizeQuestionData } from '../utils/questionFormat';
import { SEARCH_MIN_QUESTIONS, filterSaved, isNearSavedLimit, savedCountLabel } from '../utils/savedQuestions';
import { COLORS, tw } from '../theme';

const EMPTY = { questions: [], limit: 0 };

const loadSaved = async () => {
  const { questions, limit } = await getBookmarks();
  return { questions: questions.map((question) => ({ ...normalizeQuestionData(question), lessonName: question.lessonName })), limit };
};

// The questions the student saved from practice because they had a doubt or could not solve them at the time. Answers and
// explanations can be revealed here exactly as in practice, and a question leaves the list once it is no longer saved.
export default function BookmarksScreen({ navigation }) {
  const { data, setData, loading, refreshing, refresh, error, reload } = useFetch(loadSaved, [], {
    initialData: EMPTY,
    refetchOnFocus: true,
  });
  const { questions, limit } = data;
  const [states, setStates] = useState({});
  const [query, setQuery] = useState('');
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  // Search appears once the list is long enough to need it, and stays while there is something typed in it.
  const showSearch = questions.length >= SEARCH_MIN_QUESTIONS || query.trim() !== '';
  const visible = useMemo(() => (showSearch ? filterSaved(questions, query) : questions), [questions, query, showSearch]);

  const unsave = async (question) => {
    setData((prev) => ({ ...prev, questions: prev.questions.filter((item) => item._id !== question._id) }));
    try {
      await removeBookmark(question._id);
    } catch (err) {
      reload('silent');
      Alert.alert('Could not remove this question', err.response?.data?.message || 'Please try again.');
    }
  };

  const nearLimit = isNearSavedLimit(questions.length, limit);

  return (
    <Screen
      title="Saved questions"
      onBack={navigation.goBack}
      loading={loading}
      skeleton={<QuestionSkeleton />}
      refreshing={refreshing}
      onRefresh={refresh}
      top={showSearch ? <SearchBar value={query} onChangeText={setQuery} placeholder="Search saved questions..." /> : null}
    >
      {error && questions.length === 0 ? (
        <ErrorState onRetry={() => reload()} style={{ paddingVertical: 80 }} />
      ) : questions.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          message="While you practise, tap Save on a question you have a doubt about or could not solve. It will wait for you here."
        />
      ) : (
        <>
          <AppText variant={nearLimit ? 'semiBold' : undefined} type="small" style={[tw`mb-3`, { color: nearLimit ? COLORS.amber600 : COLORS.slate500 }]}>
            {savedCountLabel(questions.length, limit)}
          </AppText>

          {visible.length === 0 ? (
            <EmptyState title="No matches" message={`None of your saved questions match "${query.trim()}".`} illustration="search" />
          ) : (
            visible.map((question, index) => (
              <View key={question._id}>
                {question.lessonName ? (
                  <AppText variant="semiBold" style={tw`mb-1.5 ml-1 text-xs text-slate-500`} numberOfLines={1}>
                    {question.lessonName}
                  </AppText>
                ) : null}
                <PracticeQuestionCard
                  question={question}
                  index={index}
                  state={states[question._id]}
                  onChange={(change) =>
                    setStates((prev) => ({ ...prev, [question._id]: { ...EMPTY_PRACTICE_STATE, ...prev[question._id], ...change } }))
                  }
                  reportContext={question.lessonName ? `Saved · ${question.lessonName}` : 'Saved questions'}
                  onOpenCalculator={() => setCalculatorOpen(true)}
                  bookmarked
                  onToggleBookmark={() => unsave(question)}
                />
              </View>
            ))
          )}
        </>
      )}
      <ScientificCalculator visible={calculatorOpen} onClose={() => setCalculatorOpen(false)} />
    </Screen>
  );
}
