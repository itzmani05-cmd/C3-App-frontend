import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import axios from 'axios';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import Header from '../components/Header';
import DailyChallengeQuestionCard from '../components/DailyChallengeQuestionCard';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';
import { getMotivationalMessage } from '../utils/motivationalMessage';

export default function DailyChallengeReviewScreen({ route, navigation }) {
  const { challengeId, attemptId, data: initialData } = route.params || {};
  const [loading, setLoading] = useState(!initialData);
  const [data, setData] = useState(initialData || null);
  const [currentStreak, setCurrentStreak] = useState(null);

  useEffect(() => {
    if (initialData) return;

    const fetchAttempt = async () => {
      const userId = global.userId || global.user?.userId;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/daily-challenge/${challengeId}/attempts/${attemptId}`,
          { headers: { userid: userId } }
        );
        setData(res.data);
      } catch (err) {
        console.log('Fetch daily challenge review error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [challengeId, attemptId, initialData]);

  useEffect(() => {
    const fetchStreak = async () => {
      const userId = global.userId || global.user?.userId;
      if (!userId) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/daily-challenge/progress-summary`, {
          headers: { userid: userId },
        });
        setCurrentStreak(res.data?.currentStreak ?? null);
      } catch (err) {
        console.log('Fetch streak error:', err);
      }
    };
    fetchStreak();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
        <Header title="C3 Daily Challenge" showBack onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand600} />
        </View>
      </View>
    );
  }

  const questions = Array.isArray(data?.questions) ? data.questions : [];
  const finalScore = data?.score ?? data?.bestScore ?? 0;
  const finalTotal = data?.totalQuestions ?? questions.length;
  const percentage = finalTotal ? (finalScore / finalTotal) * 100 : 0;
  const motivationalMessage = getMotivationalMessage(percentage);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title="C3 Daily Challenge" showBack onBackPress={() => navigation.navigate('MainApp')} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={[cardStyle, { alignItems: 'center' }]}>
          <AppText variant="bold" style={{ fontSize: 16, color: COLORS.slate900 }}>
            🎉 Final Score
          </AppText>
          <AppText variant="extraBold" style={{ marginTop: 6, fontSize: 34, color: COLORS.brand600 }}>
            {finalScore}/{finalTotal}
          </AppText>
          <AppText variant="semiBold" style={{ marginTop: 10, fontSize: 14, color: COLORS.slate700, textAlign: 'center' }}>
            {motivationalMessage}
          </AppText>
          {typeof currentStreak === 'number' && currentStreak > 0 ? (
            <View style={streakPillStyle}>
              <AppText variant="bold" style={{ fontSize: 13, color: COLORS.warningText }}>
                🔥 {currentStreak} Day Streak
              </AppText>
            </View>
          ) : null}
        </View>

        {questions.map((q, index) => (
          <DailyChallengeQuestionCard key={q.questionId || index} question={q} index={index} />
        ))}

        <AppButton
          label="Back to Home"
          onPress={() => navigation.navigate('MainApp')}
          style={{ marginTop: 8, backgroundColor: COLORS.brand600, borderRadius: RADII.xl }}
        />
      </ScrollView>
    </View>
  );
}

const cardStyle = {
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.md,
};

const streakPillStyle = {
  marginTop: 12,
  backgroundColor: COLORS.warningSoft,
  borderRadius: RADII.pill,
  paddingHorizontal: 14,
  paddingVertical: 6,
};
