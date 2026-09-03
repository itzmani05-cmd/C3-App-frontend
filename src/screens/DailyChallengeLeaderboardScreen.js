import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import AppText from '../components/AppText';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';

function userHeaders() {
  const userId = global.userId || global.user?.userId;
  return { userid: userId };
}

const RANK_MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

function LeaderboardRow({ entry }) {
  return (
    <View style={[rowStyle, entry.isMe ? meRowStyle : null]}>
      <View style={rankBadgeStyle}>
        <AppText variant="extraBold" style={{ fontSize: 14, color: entry.isMe ? COLORS.brand600 : COLORS.slate600 }}>
          {RANK_MEDAL[entry.rank] || entry.rank}
        </AppText>
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <AppText variant="bold" style={{ fontSize: 14, color: COLORS.slate900 }} numberOfLines={1}>
          {entry.name}{entry.isMe ? ' (You)' : ''}
        </AppText>
        <AppText style={{ marginTop: 2, fontSize: 12, color: COLORS.slate500 }}>
          {entry.challengesCompleted} challenge{entry.challengesCompleted === 1 ? '' : 's'} completed
          {entry.currentStreak > 0 ? ` • 🔥 ${entry.currentStreak} day streak` : ''}
        </AppText>
      </View>

      <AppText variant="extraBold" style={{ fontSize: 16, color: COLORS.brand600 }}>
        {entry.totalScore}
      </AppText>
    </View>
  );
}

export default function DailyChallengeLeaderboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [me, setMe] = useState(null);

  const fetchLeaderboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/daily-challenge/leaderboard`, {
        headers: userHeaders(),
      });
      setLeaderboard(Array.isArray(res.data?.leaderboard) ? res.data.leaderboard : []);
      setMe(res.data?.me || null);
    } catch (err) {
      console.log('Fetch leaderboard error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const meInTop = me && leaderboard.some((e) => e.isMe);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
        <Header title="Leaderboard" showBack onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand600} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title="Leaderboard" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchLeaderboard(true)} />}
      >
        {leaderboard.length === 0 ? (
          <View style={[cardStyle, { alignItems: 'center' }]}>
            <AppText variant="bold" style={{ fontSize: 16, color: COLORS.slate900 }}>
              No rankings yet
            </AppText>
            <AppText style={{ marginTop: 8, color: COLORS.slate500, textAlign: 'center' }}>
              Complete a Daily Challenge to appear on the leaderboard.
            </AppText>
          </View>
        ) : (
          <>
            <View style={cardStyle}>
              {leaderboard.map((entry) => (
                <LeaderboardRow key={String(entry.userId)} entry={entry} />
              ))}
            </View>

            {me && !meInTop ? (
              <View style={{ marginTop: 16 }}>
                <AppText variant="medium" style={{ fontSize: 12, color: COLORS.slate500, marginBottom: 8 }}>
                  Your rank
                </AppText>
                <View style={cardStyle}>
                  <LeaderboardRow entry={me} />
                </View>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const cardStyle = {
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 8,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.md,
};

const rowStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  paddingHorizontal: 10,
  borderRadius: RADII.xl,
};

const meRowStyle = {
  backgroundColor: COLORS.brand50,
};

const rankBadgeStyle = {
  width: 32,
  alignItems: 'center',
};
