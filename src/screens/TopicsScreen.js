import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchLearningPath as loadLearningPath } from '../utils/learningPathApi';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import Header from '../components/Header';

const cardShadow = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

function StatusPill({ status }) {
  const toneMap = {
    Done: { bg: '#DCFCE7', text: '#16A34A' },
    Open: { bg: '#EFF6FF', text: '#2563EB' },
    Locked: { bg: '#F3F4F6', text: '#9CA3AF' },
    Close: { bg: '#EFF6FF', text: '#2563EB' },
  };
  const tone = toneMap[status] || toneMap.Open;

  return (
    <View style={{ backgroundColor: tone.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 }}>
      <Text style={{ color: tone.text, fontFamily: 'ManropeBold', fontSize: 11 }}>{status}</Text>
    </View>
  );
}

export default function TopicsScreen({ route, navigation }) {
  const { unitId, unitName } = route.params;

  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUnitName = unit?.name || unitName || 'Unit';
  const topics = useMemo(() => (Array.isArray(unit?.topics) ? unit.topics : []), [unit]);

  const fetchTopicsFallback = useCallback(async () => {
    const topicsRes = await axios.get(`${API_BASE_URL}/api/content/topics/${unitId}`);
    const plainTopics = Array.isArray(topicsRes.data) ? topicsRes.data : [];

    const topicsWithSubtopics = await Promise.all(
      plainTopics.map(async (topic, index) => {
        const subtopicsRes = await axios.get(`${API_BASE_URL}/api/content/subtopics/${topic._id}`);
        const plainSubtopics = Array.isArray(subtopicsRes.data) ? subtopicsRes.data : [];

        return {
          ...topic,
          isUnlocked: index === 0,
          isCleared: false,
          isDirectLesson: plainSubtopics.length === 0,
          subtopics: plainSubtopics.map((subtopic, subtopicIndex) => ({
            ...subtopic,
            isUnlocked: index === 0 && subtopicIndex === 0,
            isCleared: false,
          })),
        };
      })
    );

    setUnit({
      _id: unitId,
      name: unitName || 'Unit',
      topics: topicsWithSubtopics,
    });
  }, [unitId, unitName]);

  const fetchLearningPath = useCallback(async () => {
    const userId = global.userId || global.user?.userId;

    try {
      setLoading(true);
      const learningPath = await loadLearningPath(userId ? { userid: userId } : {});
      const units = Array.isArray(learningPath?.units) ? learningPath.units : [];
      const nextUnit =
        units.find((item) => item?._id?.toString() === unitId?.toString()) || null;

      if (nextUnit) {
        setUnit(nextUnit);
      } else {
        await fetchTopicsFallback();
      }
      setSelectedTopicId((prev) => {
        if (!prev) {
          return prev;
        }

        const sourceTopics = Array.isArray(nextUnit?.topics) ? nextUnit.topics : [];
        const exists = sourceTopics.length > 0
          ? sourceTopics.some((topic) => topic?._id?.toString() === prev)
          : false;

        return exists ? prev : null;
      });
    } catch (err) {
      console.log('Learning path fetch error:', err);
      try {
        await fetchTopicsFallback();
      } catch (fallbackErr) {
        console.log('Topics fallback fetch error:', fallbackErr);
        setUnit(null);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchTopicsFallback, unitId]);

  useFocusEffect(
    useCallback(() => {
      fetchLearningPath();
    }, [fetchLearningPath])
  );

  const openTopicLesson = (topic) => {
    navigation.navigate('QuestionsScreen', {
      topicId: topic._id,
      topicName: topic.name,
      unitName: currentUnitName,
    });
  };

  const handleTopicPress = (topic) => {
    if (!topic?.isUnlocked) {
      Alert.alert('Topic locked', 'Complete the previous lesson to unlock this topic.');
      return;
    }

    if (topic?.isDirectLesson) {
      openTopicLesson(topic);
      return;
    }

    const topicKey = topic?._id?.toString();
    setSelectedTopicId((prev) => (prev === topicKey ? null : topicKey));
  };

  const handleSubtopicPress = (topic, subtopic) => {
    if (!subtopic?.isUnlocked) {
      Alert.alert('Lesson locked', 'Complete the previous lesson to unlock this lesson.');
      return;
    }

    navigation.navigate('QuestionsScreen', {
      topicId: topic._id,
      subtopicId: subtopic._id,
      subtopicName: subtopic.name,
      topicName: topic.name,
      unitName: currentUnitName,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <Header title={currentUnitName} showBack onBackPress={() => navigation.goBack()} />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={topics}
          keyExtractor={(item) => item._id.toString()}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            paddingVertical: 20,
            paddingHorizontal: 16,
            paddingBottom: 40,
          }}
          ListHeaderComponent={
            <Text
              style={{
                fontSize: 16,
                marginBottom: 12,
                fontFamily: 'ManropeSemiBold',
                color: '#0F172A',
              }}
            >
              Topics
            </Text>
          }
          ListEmptyComponent={
            <Text style={{ color: '#6B7280', fontFamily: 'ManropeRegular' }}>
              No topics available for this unit yet.
            </Text>
          }
          renderItem={({ item }) => {
            const topicKey = item?._id?.toString();
            const isSelected = selectedTopicId === topicKey;
            const statusLabel = item?.isCleared ? 'Done' : item?.isUnlocked ? 'Open' : 'Locked';

            return (
              <View style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() => handleTopicPress(item)}
                  activeOpacity={0.8}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: isSelected ? '#93C5FD' : '#E5E7EB',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: item?.isUnlocked ? 1 : 0.55,
                    ...cardShadow,
                  }}
                >
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text
                      style={{
                        color: '#0F172A',
                        fontSize: 15,
                        fontFamily: 'ManropeBold',
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        marginTop: 4,
                        color: '#6B7280',
                        fontSize: 12,
                        fontFamily: 'ManropeMedium',
                      }}
                    >
                      {item?.isDirectLesson ? 'Direct quiz' : `${item?.subtopics?.length || 0} lessons`}
                    </Text>
                  </View>

                  <StatusPill
                    status={
                      item?.isDirectLesson && item?.isUnlocked
                        ? statusLabel
                        : isSelected
                        ? 'Close'
                        : statusLabel
                    }
                  />
                </TouchableOpacity>

                {isSelected &&
                  Array.isArray(item?.subtopics) &&
                  item.subtopics.map((subtopic) => (
                    <TouchableOpacity
                      key={subtopic._id}
                      onPress={() => handleSubtopicPress(item, subtopic)}
                      activeOpacity={0.8}
                      style={{
                        marginTop: 8,
                        marginLeft: 14,
                        padding: 14,
                        borderRadius: 12,
                        backgroundColor: '#FFFFFF',
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: subtopic?.isUnlocked ? 1 : 0.55,
                      }}
                    >
                      <Text style={{ fontFamily: 'ManropeMedium', color: '#0F172A', fontSize: 13, flex: 1, marginRight: 10 }}>
                        {subtopic.name}
                      </Text>

                      <StatusPill status={subtopic?.isCleared ? 'Done' : subtopic?.isUnlocked ? 'Open' : 'Locked'} />
                    </TouchableOpacity>
                  ))}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
