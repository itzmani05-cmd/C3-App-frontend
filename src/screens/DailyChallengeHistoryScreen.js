import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import AppText from '../components/AppText';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';

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

export default function DailyChallengeHistoryScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/daily-challenge/history`, {
          headers: userHeaders(),
        });
        setChallenges(Array.isArray(res.data?.challenges) ? res.data.challenges : []);
      } catch (err) {
        console.log('Fetch daily challenge history error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const openReview = (item) => {
    if (!item.revealed || !item.latestAttemptId) return;
    navigation.navigate('DailyChallengeReviewScreen', {
      challengeId: item.challengeId,
      attemptId: item.latestAttemptId,
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
        <Header title="Challenge History" showBack onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand600} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title="Challenge History" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {challenges.length === 0 ? (
          <AppText style={{ marginTop: 40, color: COLORS.slate500, textAlign: 'center' }}>
            No past challenges yet.
          </AppText>
        ) : (
          challenges.map((item) => {
            const canOpen = item.revealed && item.latestAttemptId;
            const attempted = item.attemptsSubmitted > 0;

            return (
              <TouchableOpacity
                key={item.challengeId}
                activeOpacity={canOpen ? 0.8 : 1}
                onPress={() => openReview(item)}
                style={cardStyle}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <AppText variant="bold" style={{ flex: 1, marginRight: 12, fontSize: 15, color: COLORS.slate900 }}>
                    {item.title || `Challenge — ${formatDate(item.publishedAt)}`}
                  </AppText>
                  <View
                    style={{
                      borderRadius: RADII.pill,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      backgroundColor: attempted ? COLORS.successSoft : COLORS.slate100,
                    }}
                  >
                    <AppText variant="bold" style={{ fontSize: 11, color: attempted ? COLORS.success600 : COLORS.slate500 }}>
                      {attempted ? 'Attempted' : 'Missed'}
                    </AppText>
                  </View>
                </View>

                <AppText style={{ marginTop: 6, fontSize: 12, color: COLORS.slate500 }}>
                  {formatDate(item.publishedAt)} • {item.questionCount} Questions
                </AppText>

                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <AppText style={{ color: COLORS.slate600, fontSize: 13 }}>
                    Score: {typeof item.bestScore === 'number' ? `${item.bestScore}/${item.questionCount}` : '—'}
                  </AppText>
                  <AppText style={{ marginLeft: 16, color: COLORS.slate600, fontSize: 13 }}>
                    Attempts: {item.attemptsSubmitted}/3
                  </AppText>
                </View>

                {canOpen ? (
                  <AppText variant="bold" style={{ marginTop: 10, fontSize: 12, color: COLORS.brand600 }}>
                    Review Answers →
                  </AppText>
                ) : null}
              </TouchableOpacity>
            );
          })
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
