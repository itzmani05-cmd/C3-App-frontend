import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import AppText from '../components/AppText';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';

export default function DailyChallengeTopicsScreen({ route, navigation }) {
  const { unitId, unitName } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/content/topics/${unitId}`);
        setTopics(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log('Fetch topics error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [unitId]);

  const openTopic = (topic) => {
    navigation.navigate('DailyChallengeUnitHistoryScreen', {
      unitId,
      unitName,
      topicId: topic._id,
      topicName: topic.name,
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
        <Header title={unitName || 'Topics'} showBack={navigation.canGoBack()} onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand600} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title={unitName || 'Topics'} showBack={navigation.canGoBack()} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {topics.length === 0 ? (
          <AppText style={{ marginTop: 40, color: COLORS.slate500, textAlign: 'center' }}>
            No topics available for this unit yet.
          </AppText>
        ) : (
          topics.map((topic) => (
            <TouchableOpacity
              key={topic._id}
              activeOpacity={0.8}
              onPress={() => openTopic(topic)}
              style={cardStyle}
            >
              <AppText variant="bold" style={{ fontSize: 15, color: COLORS.slate900 }}>
                {topic.name}
              </AppText>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const cardStyle = {
  marginTop: 12,
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 16,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.sm,
};
