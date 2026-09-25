import React from 'react';
import AppText from '../components/ui/AppText';
import Card from '../components/ui/Card';
import Screen from '../components/ui/Screen';
import EmptyState from '../components/ui/EmptyState';
import useFetch from '../hooks/useFetch';
import { getTopics } from '../api/content';
import { COLORS } from '../theme';

export default function DailyChallengeTopicsScreen({ route, navigation }) {
  const { unitId, unitName } = route.params || {};
  const { data: topics, loading } = useFetch(() => getTopics(unitId), [unitId], { initialData: [] });

  const openTopic = (topic) =>
    navigation.navigate('DailyChallengeUnitHistoryScreen', { unitId, unitName, topicId: topic._id, topicName: topic.name });

  return (
    <Screen title={unitName || 'Topics'} onBack={navigation.canGoBack() ? navigation.goBack : undefined} loading={loading}>
      {topics.length === 0 ? (
        <EmptyState message="No topics available for this unit yet." />
      ) : (
        topics.map((topic) => (
          <Card key={topic._id} onPress={() => openTopic(topic)} style={{ marginTop: 12 }}>
            <AppText variant="bold" style={{ fontSize: 15, color: COLORS.slate900 }}>
              {topic.name}
            </AppText>
          </Card>
        ))
      )}
    </Screen>
  );
}
