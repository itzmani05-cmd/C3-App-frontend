import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import AppText from './AppText';
import AppButton from './AppButton';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';

function formatTimeRemaining(expiresAt) {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return 'Expired';

  const totalMinutes = Math.floor(diffMs / (60 * 1000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m left`;
}

export default function DailyChallengeCard({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState(null);

  const fetchToday = useCallback(async () => {
    const userId = global.userId || global.user?.userId;
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/daily-challenge/today`, {
        headers: { userid: userId },
      });
      setChallenge(res.data?.challenge || null);
    } catch (err) {
      console.log('Daily challenge card fetch error:', err);
      setChallenge(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
    const unsubscribe = navigation?.addListener?.('focus', fetchToday);
    return unsubscribe;
  }, [fetchToday, navigation]);

  if (loading) {
    return (
      <View style={[cardStyle, { alignItems: 'center', justifyContent: 'center', minHeight: 90 }]}>
        <ActivityIndicator size="small" color={COLORS.brand600} />
      </View>
    );
  }

  if (!challenge) {
    return null;
  }

  const { revealed, attemptsSubmitted, attemptsRemaining, bestScore, questionCount, expiresAt, maxAttempts, currentStreak } = challenge;

  let statusLabel;
  let buttonLabel;

  if (revealed) {
    statusLabel = 'Challenge completed';
    buttonLabel = 'Review Answers';
  } else if (attemptsSubmitted > 0) {
    statusLabel = `Attempts: ${attemptsSubmitted}/${maxAttempts}`;
    buttonLabel = 'Continue Challenge';
  } else {
    statusLabel = `${questionCount} Questions • ${maxAttempts} Attempts`;
    buttonLabel = 'Start Challenge';
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.navigate('DailyChallengeScreen')}
      style={cardStyle}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="bold" style={{ fontSize: 15, color: COLORS.slate900 }}>
          🔥 C3 Daily Challenge
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {currentStreak > 0 ? (
            <View style={streakPillStyle}>
              <AppText variant="semiBold" style={{ fontSize: 11, color: COLORS.warningText }}>
                🔥 {currentStreak}
              </AppText>
            </View>
          ) : null}
          {!revealed ? (
            <View style={pillStyle}>
              <AppText variant="semiBold" style={{ fontSize: 11, color: COLORS.danger700 }}>
                {formatTimeRemaining(expiresAt)}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>

      <AppText variant="medium" style={{ marginTop: 8, fontSize: 13, color: COLORS.slate500 }}>
        {statusLabel}
      </AppText>

      {typeof bestScore === 'number' ? (
        <AppText variant="semiBold" style={{ marginTop: 4, fontSize: 13, color: COLORS.brand600 }}>
          Best Score: {bestScore}/{questionCount}
        </AppText>
      ) : null}

      <AppButton
        label={buttonLabel}
        onPress={() => navigation.navigate('DailyChallengeScreen')}
        style={{ marginTop: 12, backgroundColor: COLORS.brand600, borderRadius: RADII.xl }}
      />
    </TouchableOpacity>
  );
}

const cardStyle = {
  marginTop: 14,
  marginHorizontal: 16,
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 16,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.md,
};

const pillStyle = {
  backgroundColor: COLORS.dangerSoft,
  borderWidth: 1,
  borderColor: COLORS.dangerSoft,
  borderRadius: RADII.pill,
  paddingHorizontal: 10,
  paddingVertical: 4,
};

const streakPillStyle = {
  backgroundColor: COLORS.warningSoft,
  borderWidth: 1,
  borderColor: COLORS.warningSoft,
  borderRadius: RADII.pill,
  paddingHorizontal: 10,
  paddingVertical: 4,
};
