import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function DailyChallengeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState(null);

  const fetchToday = useCallback(async (isRefreshing = false) => {
    const userId = global.userId || global.user?.userId;
    if (!userId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/api/daily-challenge/today`, {
        headers: { userid: userId },
      });
      setChallenge(res.data?.challenge || null);
      setError(null);
    } catch (err) {
      console.log('Daily challenge fetch error:', err);
      setError('Could not load today’s challenge.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
    const unsubscribe = navigation.addListener('focus', () => fetchToday());
    return unsubscribe;
  }, [fetchToday, navigation]);

  const startOrContinue = () => {
    navigation.navigate('DailyChallengeAttemptScreen', { challengeId: challenge.challengeId });
  };

  const reviewAnswers = () => {
    navigation.navigate('DailyChallengeReviewScreen', {
      challengeId: challenge.challengeId,
      data: challenge,
    });
  };

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

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title="C3 Daily Challenge" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchToday(true)} />}
      >
        {error ? (
          <AppText style={{ color: COLORS.danger600, textAlign: 'center', marginTop: 40 }}>{error}</AppText>
        ) : !challenge ? (
          <View style={[cardStyle, { alignItems: 'center' }]}>
            <AppText variant="bold" style={{ fontSize: 16, color: COLORS.slate900 }}>
              No Daily Challenge yet
            </AppText>
            <AppText style={{ marginTop: 8, color: COLORS.slate500, textAlign: 'center' }}>
              Check back soon — a new challenge is published regularly.
            </AppText>
          </View>
        ) : (
          <View style={cardStyle}>
            <AppText variant="extraBold" style={{ fontSize: 20, color: COLORS.slate900 }}>
              {challenge.title || "Today's Challenge"}
            </AppText>
            <AppText style={{ marginTop: 4, color: COLORS.slate500 }}>
              {challenge.questionCount} Questions
            </AppText>

            <View style={rowStyle}>
              <InfoBlock label="Available until" value={formatDateTime(challenge.expiresAt)} />
              <InfoBlock
                label="Attempts"
                value={`${challenge.attemptsSubmitted} / ${challenge.maxAttempts}`}
              />
            </View>

            <View style={rowStyle}>
              <InfoBlock
                label="Best Score"
                value={typeof challenge.bestScore === 'number' ? `${challenge.bestScore} / ${challenge.questionCount}` : '—'}
              />
              <InfoBlock
                label="Status"
                value={challenge.revealed ? 'Completed' : challenge.attemptsSubmitted > 0 ? 'In Progress' : 'Not Started'}
              />
            </View>

            {challenge.revealed ? (
              <AppButton
                label="Review Answers"
                onPress={reviewAnswers}
                style={{ marginTop: 20, backgroundColor: COLORS.brand600, borderRadius: RADII.xl }}
              />
            ) : challenge.attemptsRemaining > 0 ? (
              <AppButton
                label={challenge.attemptsSubmitted > 0 ? 'Try Again' : 'Start Challenge'}
                onPress={startOrContinue}
                style={{ marginTop: 20, backgroundColor: COLORS.brand600, borderRadius: RADII.xl }}
              />
            ) : (
              <AppText style={{ marginTop: 20, color: COLORS.slate500, textAlign: 'center' }}>
                No attempts remaining. Answers will be revealed when this challenge expires.
              </AppText>
            )}
          </View>
        )}

        <View style={linksRowStyle}>
          <TouchableOpacity
            style={linkCardStyle}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DailyChallengeProgressScreen')}
          >
            <AppText variant="bold" style={{ fontSize: 13, color: COLORS.brand600 }}>
              📊 My Progress
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={linkCardStyle}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DailyChallengeHistoryScreen')}
          >
            <AppText variant="bold" style={{ fontSize: 13, color: COLORS.brand600 }}>
              🗓 History
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={linkCardStyle}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DailyChallengeLeaderboardScreen')}
          >
            <AppText variant="bold" style={{ fontSize: 13, color: COLORS.brand600 }}>
              🏆 Leaderboard
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoBlock({ label, value }) {
  return (
    <View style={{ flex: 1 }}>
      <AppText variant="medium" style={{ fontSize: 12, color: COLORS.slate500 }}>
        {label}
      </AppText>
      <AppText variant="bold" style={{ marginTop: 4, fontSize: 15, color: COLORS.slate900 }}>
        {value}
      </AppText>
    </View>
  );
}

const cardStyle = {
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 18,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.md,
};

const rowStyle = {
  flexDirection: 'row',
  marginTop: 18,
};

const linksRowStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 14,
  gap: 12,
};

const linkCardStyle = {
  flexGrow: 1,
  flexBasis: '30%',
  backgroundColor: COLORS.brand50,
  borderRadius: RADII.xxl,
  paddingVertical: 14,
  paddingHorizontal: 6,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: COLORS.brand100,
};
