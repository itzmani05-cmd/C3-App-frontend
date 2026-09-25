import React from 'react';
import Screen from '../components/ui/Screen';
import GreetingCard from '../components/home/GreetingCard';
import StreakInfoCard from '../components/home/StreakInfoCard';
import DailyChallengeCard from '../components/dailyChallenge/DailyChallengeCard';
import useFetch from '../hooks/useFetch';
import useLogout from '../hooks/useLogout';
import { getDashboard } from '../api/user';
import { getUnreadCount } from '../api/notifications';
import { COLORS } from '../theme';

export default function HomeScreen({ navigation }) {
  const logout = useLogout(navigation);
  const { data: dashboard, loading, refreshing, refresh } = useFetch(getDashboard);
  const { data: unreadCount } = useFetch(getUnreadCount, [], { refetchOnFocus: true, initialData: 0 });

  return (
    <Screen
      title="Home"
      headerProps={{
        rightLabel: 'Logout',
        onRightPress: logout,
        onBellPress: () => navigation.navigate('NotificationsScreen'),
        unreadCount,
      }}
      background={COLORS.appBackground}
      loaderColor={COLORS.blue600}
      loading={loading}
      refreshing={refreshing}
      onRefresh={refresh}
      contentStyle={{ padding: 0, paddingBottom: 24 }}
    >
      <GreetingCard name={dashboard?.user?.name} />
      <DailyChallengeCard navigation={navigation} />
      <StreakInfoCard />
    </Screen>
  );
}
