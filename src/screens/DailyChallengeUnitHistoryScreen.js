import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import AppText from '../components/AppText';
import DailyChallengeQuestionCard from '../components/DailyChallengeQuestionCard';
import { API_BASE_URL } from '../config/api';
import { COLORS } from '../theme/dailyChallengeColors';

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function userHeaders() {
  const userId = global.userId || global.user?.userId;
  return { userid: userId };
}

export default function DailyChallengeUnitHistoryScreen({ route, navigation }) {
  const { unitId, unitName, topicId, topicName } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/daily-challenge/units/${unitId}/history`, {
          headers: userHeaders(),
          params: topicId ? { topicId } : undefined,
        });
        setQuestions(Array.isArray(res.data?.questions) ? res.data.questions : []);
      } catch (err) {
        console.log('Fetch daily challenge unit history error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [unitId, topicId]);

  const title = topicName || unitName || 'Daily Challenge';

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
        <Header title={title} showBack={navigation.canGoBack()} onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand600} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title={title} showBack={navigation.canGoBack()} onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {questions.length === 0 ? (
          <AppText style={{ marginTop: 40, color: COLORS.slate500, textAlign: 'center' }}>
            No completed daily challenges here yet — finish Today's Challenge to start building this up.
          </AppText>
        ) : (
          questions.map((q, index) => (
            <DailyChallengeQuestionCard
              key={`${q.challengeId}_${q.questionId}`}
              question={q}
              index={index}
              dateLabel={formatDate(q.publishedAt)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}
