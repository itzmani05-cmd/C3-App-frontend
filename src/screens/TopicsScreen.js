import React, { useState } from 'react';
import { Alert, FlatList } from 'react-native';
import AppText from '../components/ui/AppText';
import Screen from '../components/ui/Screen';
import { ListSkeleton } from '../components/ui/Skeletons';
import ErrorState from '../components/ui/ErrorState';
import OfflineBanner from '../components/ui/OfflineBanner';
import TopicItem from '../components/learning/TopicItem';
import useFetch from '../hooks/useFetch';
import { getUnitWithTopics } from '../api/content';
import { COLORS, contentColumn } from '../theme';
import FadeIn, { staggerDelay } from '../components/ui/FadeIn';

export default function TopicsScreen({ route, navigation }) {
  const { unitId, unitName } = route.params;
  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const { data: unit, loading, error, stale, reload } = useFetch(() => getUnitWithTopics(unitId, unitName), [unitId, unitName], {
    refetchOnFocus: true,
    cacheKey: `unit:${unitId}`,
  });

  const currentUnitName = unit?.name || unitName || 'Unit';
  const topics = Array.isArray(unit?.topics) ? unit.topics : [];

  const openQuiz = (params) => navigation.navigate('QuestionsScreen', { ...params, unitName: currentUnitName });

  const handleTopicPress = (topic) => {
    if (!topic?.isUnlocked) {
      Alert.alert('Topic locked', 'Complete the previous lesson to unlock this topic.');
      return;
    }
    if (topic?.isDirectLesson) {
      // A lesson that only has practice questions has no quiz to open, so go straight to practice.
      if (topic.quizQuestionCount === 0 && topic.questionCount > 0) {
        handlePractice(topic);
        return;
      }
      openQuiz({ topicId: topic._id, topicName: topic.name });
      return;
    }
    const topicKey = String(topic._id);
    setExpandedTopicId((prev) => (prev === topicKey ? null : topicKey));
  };

  const handleSubtopicPress = (topic, subtopic) => {
    if (!subtopic?.isUnlocked) {
      Alert.alert('Lesson locked', 'Complete the previous lesson to unlock this lesson.');
      return;
    }
    openQuiz({ topicId: topic._id, topicName: topic.name, subtopicId: subtopic._id, subtopicName: subtopic.name });
  };

  const handlePractice = (topic, subtopic) =>
    navigation.navigate('PracticeScreen', {
      topicId: topic._id,
      topicName: topic.name,
      subtopicId: subtopic?._id,
      subtopicName: subtopic?.name,
    });

  return (
    <Screen title={currentUnitName} onBack={navigation.goBack} background={COLORS.appBackground} scroll={false}>
      {loading ? (
        <ListSkeleton count={5} style={{ paddingHorizontal: 16, paddingTop: 20 }} />
      ) : error && !unit ? (
        <ErrorState onRetry={() => reload()} />
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => String(item._id)}
          initialNumToRender={8}
          windowSize={7}
          contentContainerStyle={[{ paddingTop: 20, paddingHorizontal: 16, paddingBottom: 40 }, contentColumn]}
          ListHeaderComponent={
            <>
              {stale ? <OfflineBanner visible style={{ marginHorizontal: 0 }} /> : null}
              <AppText variant="semiBold" style={{ fontSize: 16, marginBottom: 12, color: COLORS.slate900 }}>
                Topics
              </AppText>
            </>
          }
          ListEmptyComponent={<AppText style={{ color: COLORS.gray500 }}>No topics available for this unit yet.</AppText>}
          renderItem={({ item, index }) => (
            <FadeIn delay={staggerDelay(index)}>
              <TopicItem
                topic={item}
                expanded={expandedTopicId === String(item._id)}
                onPress={() => handleTopicPress(item)}
                onSubtopicPress={handleSubtopicPress}
                onPractice={handlePractice}
              />
            </FadeIn>
          )}
        />
      )}
    </Screen>
  );
}
