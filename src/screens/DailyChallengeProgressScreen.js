import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import AppText from '../components/AppText';
import { API_BASE_URL } from '../config/api';
import { COLORS, RADII, SHADOWS } from '../theme/dailyChallengeColors';

function userHeaders() {
  const userId = global.userId || global.user?.userId;
  return { userid: userId };
}

function StatCard({ label, value, accent = COLORS.brand600 }) {
  return (
    <View style={statCardStyle}>
      <AppText variant="medium" style={{ fontSize: 12, color: COLORS.slate500 }}>
        {label}
      </AppText>
      <AppText variant="extraBold" style={{ marginTop: 8, fontSize: 22, color: accent }}>
        {value}
      </AppText>
    </View>
  );
}

function formatDayLabel(dateKey) {
  if (!dateKey) return '';
  const date = new Date(`${dateKey}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function StreakGraph({ history }) {
  if (!history.length) {
    return (
      <AppText style={{ marginTop: 10, color: COLORS.slate500 }}>
        Complete a Daily Challenge to start building your streak graph.
      </AppText>
    );
  }

  return (
    <View style={{ width: '100%', marginTop: 14, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      {history.map((day, index) => (
        <View key={day.dateKey || index} style={{ alignItems: 'center', flex: 1 }}>
          <View
            style={{
              width: '70%',
              height: 36,
              borderRadius: RADII.pill,
              backgroundColor: day.completed ? COLORS.success500 : COLORS.slate100,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {day.completed ? <AppText style={{ fontSize: 12 }}>🔥</AppText> : null}
          </View>
          <AppText style={{ marginTop: 6, fontSize: 9, color: COLORS.slate500 }}>
            {formatDayLabel(day.dateKey)}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function TopicBar({ topic }) {
  const accuracy = Math.round(topic.accuracy || 0);
  const barColor = accuracy >= 80 ? COLORS.success500 : accuracy >= 50 ? COLORS.warning500 : COLORS.danger500;

  return (
    <View style={{ marginTop: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={{ fontSize: 13, color: COLORS.slate700 }}>{topic.topicName}</AppText>
        <AppText variant="bold" style={{ fontSize: 13, color: COLORS.slate900 }}>{accuracy}%</AppText>
      </View>
      <View style={trackStyle}>
        <View style={[fillStyle, { width: `${Math.min(100, accuracy)}%`, backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

export default function DailyChallengeProgressScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [topics, setTopics] = useState([]);
  const [weakArea, setWeakArea] = useState(null);
  const [streakHistory, setStreakHistory] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, topicRes, streakRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/daily-challenge/progress-summary`, { headers: userHeaders() }),
          axios.get(`${API_BASE_URL}/api/daily-challenge/topic-performance`, { headers: userHeaders() }),
          axios.get(`${API_BASE_URL}/api/daily-challenge/streak-history`, { headers: userHeaders() }),
        ]);
        setSummary(summaryRes.data);
        setTopics(topicRes.data?.topics || []);
        setWeakArea(topicRes.data?.weakArea || null);
        setStreakHistory(Array.isArray(streakRes.data?.history) ? streakRes.data.history : []);
      } catch (err) {
        console.log('Fetch daily challenge progress error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
        <Header title="Daily Challenge Progress" showBack onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.brand600} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.pageBackground }}>
      <Header title="Daily Challenge Progress" showBack onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <View style={streakCardStyle}>
          <AppText style={{ fontSize: 28 }}>🔥</AppText>
          <AppText variant="extraBold" style={{ marginTop: 6, fontSize: 30, color: COLORS.warningText }}>
            {summary?.currentStreak || 0} Day{summary?.currentStreak === 1 ? '' : 's'}
          </AppText>
          <AppText style={{ marginTop: 2, color: COLORS.slate600 }}>Current Streak</AppText>
          <AppText style={{ marginTop: 8, fontSize: 12, color: COLORS.slate500 }}>
            Best Streak: {summary?.longestStreak || 0} days
          </AppText>
          <StreakGraph history={streakHistory} />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, marginHorizontal: -6 }}>
          <StatCard label="Challenges Completed" value={summary?.challengesCompleted || 0} />
          <StatCard label="Questions Answered" value={summary?.questionsAnswered || 0} accent={COLORS.accent600} />
          <StatCard label="Accuracy" value={`${Math.round(summary?.accuracy || 0)}%`} accent={COLORS.success600} />
          <StatCard
            label="Average Score"
            value={`${(summary?.averageScore || 0).toFixed(1)}/${summary?.questionsPerChallenge || 5}`}
            accent={COLORS.info600}
          />
        </View>

        <View style={sectionCardStyle}>
          <AppText variant="bold" style={{ fontSize: 15, color: COLORS.slate900 }}>
            Your Performance
          </AppText>

          {topics.length === 0 ? (
            <AppText style={{ marginTop: 10, color: COLORS.slate500 }}>
              Complete a few Daily Challenges to see your topic-wise performance.
            </AppText>
          ) : (
            topics.map((t) => <TopicBar key={t.topicId} topic={t} />)
          )}

          {weakArea ? (
            <View style={weakAreaBoxStyle}>
              <AppText variant="bold" style={{ fontSize: 13, color: COLORS.danger600 }}>
                ⚠ Weak Area: {weakArea.topicName}
              </AppText>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const statCardStyle = {
  width: '48%',
  marginHorizontal: '1%',
  marginTop: 8,
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 14,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.sm,
};

const streakCardStyle = {
  alignItems: 'center',
  backgroundColor: COLORS.warningSoft,
  borderRadius: RADII.xxxl,
  padding: 22,
  borderWidth: 1,
  borderColor: COLORS.warningSoft,
  ...SHADOWS.md,
};

const sectionCardStyle = {
  marginTop: 20,
  backgroundColor: COLORS.white,
  borderRadius: RADII.xxl,
  padding: 16,
  borderWidth: 1,
  borderColor: COLORS.slate200,
  ...SHADOWS.sm,
};

const trackStyle = {
  marginTop: 6,
  height: 8,
  borderRadius: RADII.pill,
  backgroundColor: COLORS.slate100,
  overflow: 'hidden',
};

const fillStyle = {
  height: 8,
  borderRadius: RADII.pill,
};

const weakAreaBoxStyle = {
  marginTop: 16,
  padding: 12,
  borderRadius: RADII.xl,
  backgroundColor: COLORS.dangerSoft,
};
