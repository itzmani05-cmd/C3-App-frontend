import React from 'react';
import { View } from 'react-native';
import AppText from '../components/ui/AppText';
import Card from '../components/ui/Card';
import Screen from '../components/ui/Screen';
import { LeaderboardSkeleton } from '../components/ui/Skeletons';
import EmptyState from '../components/ui/EmptyState';
import LeaderboardRow from '../components/dailyChallenge/LeaderboardRow';
import useFetch from '../hooks/useFetch';
import { getLeaderboard } from '../api/dailyChallenge';
import { COLORS } from '../theme';

export default function DailyChallengeLeaderboardScreen({ navigation }) {
  const { data, loading, refreshing, refresh } = useFetch(getLeaderboard, [], {
    initialData: { leaderboard: [], me: null },
  });
  const { leaderboard, me } = data;
  const showMyRank = me && !leaderboard.some((entry) => entry.isMe);

  return (
    <Screen title="Leaderboard" onBack={navigation.goBack} loading={loading} skeleton={<LeaderboardSkeleton />} refreshing={refreshing} onRefresh={refresh}>
      {leaderboard.length === 0 ? (
        <EmptyState title="No rankings yet" message="Complete a Daily Challenge to appear on the leaderboard." />
      ) : (
        <>
          <Card elevation="md" style={{ padding: 8 }}>
            {leaderboard.map((entry) => (
              <LeaderboardRow key={String(entry.userId)} entry={entry} />
            ))}
          </Card>

          {showMyRank ? (
            <View style={{ marginTop: 16 }}>
              <AppText variant="medium" style={{ fontSize: 12, color: COLORS.slate500, marginBottom: 8 }}>
                Your rank
              </AppText>
              <Card elevation="md" style={{ padding: 8 }}>
                <LeaderboardRow entry={me} />
              </Card>
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}
