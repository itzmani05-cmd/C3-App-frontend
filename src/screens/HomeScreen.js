import React from 'react';
import { View } from 'react-native';
import { ChartColumn, History, Library, Trophy } from '../icons';
import Screen from '../components/ui/Screen';
import FadeIn from '../components/ui/FadeIn';
import { HomeSkeleton } from '../components/ui/Skeletons';
import ErrorState from '../components/ui/ErrorState';
import SectionTitle, { SectionLink } from '../components/ui/SectionTitle';
import GreetingCard from '../components/home/GreetingCard';
import ContinueCard from '../components/home/ContinueCard';
import WeekStrip from '../components/home/WeekStrip';
import StreakInfoCard from '../components/home/StreakInfoCard';
import FeedbackCard from '../components/home/FeedbackCard';
import { FocusAreaCard, LeaderboardPreview, RecentActivityCard, StatsGrid, UnitsProgressCard } from '../components/home/HomeCards';
import DailyChallengeCard from '../components/dailyChallenge/DailyChallengeCard';
import QuickLinkCard from '../components/dailyChallenge/QuickLinkCard';
import NotificationItem from '../components/notifications/NotificationItem';
import useFeaturesMenu from '../hooks/useFeaturesMenu';
import useLearningOverview from '../hooks/useLearningOverview';
import useFetch from '../hooks/useFetch';
import { getDashboard } from '../api/user';
import { getNotifications, getUnreadCount } from '../api/notifications';
import { getLeaderboard, getProgressOverview, getTodayChallenge } from '../api/dailyChallenge';
import { COLORS, tw } from '../theme';

const QUICK_ACTIONS = [
  { icon: Library, tone: 'brand', label: 'Learn', helper: 'Units and lessons', tab: 'Practice' },
  { icon: ChartColumn, tone: 'accent', label: 'Progress', helper: 'Your daily stats', screen: 'DailyChallengeProgressScreen' },
  { icon: Trophy, tone: 'warning', label: 'Leaderboard', helper: 'See the rankings', screen: 'DailyChallengeLeaderboardScreen' },
  { icon: History, tone: 'neutral', label: 'History', helper: 'Past challenges', screen: 'DailyChallengeHistoryScreen' },
];

// A titled block that fades in after the ones above it.
function Section({ title, right, delay, children, style }) {
  return (
    <FadeIn delay={delay} style={[tw`px-4 mt-6`, style]}>
      {title ? <SectionTitle right={right}>{title}</SectionTitle> : null}
      {children}
    </FadeIn>
  );
}

export default function HomeScreen({ navigation }) {
  const menu = useFeaturesMenu(navigation);
  const { data: dashboard, loading, refreshing, refresh, error, reload } = useFetch(getDashboard, [], { cacheKey: 'dashboard' });
  const { data: unreadCount } = useFetch(getUnreadCount, [], { refetchOnFocus: true, initialData: 0 });
  const { data: challenge, loading: loadingChallenge } = useFetch(getTodayChallenge, [], { refetchOnFocus: true, cacheKey: 'today' });
  const { data: overview } = useFetch(getProgressOverview, [], { refetchOnFocus: true, cacheKey: 'progress-overview' });
  const { data: leaderboard } = useFetch(getLeaderboard, [], { refetchOnFocus: true, cacheKey: 'leaderboard' });
  const { data: notifications } = useFetch(getNotifications, [], { refetchOnFocus: true, cacheKey: 'notifications-home', initialData: [] });
  const { data: learning } = useLearningOverview();

  const open = (action) => navigation.navigate(action.tab || action.screen);
  const openLesson = ({ lesson }) =>
    navigation.navigate('QuestionsScreen', {
      topicId: lesson.topicId,
      subtopicId: lesson.subtopicId || undefined,
      topicName: lesson.topicName,
      subtopicName: lesson.subtopicName || undefined,
      unitName: lesson.unitName,
    });
  const openUnit = (unit) => navigation.navigate('TopicsScreen', { unitId: unit._id, unitName: unit.name });
  const practiseWeakArea = () =>
    navigation.navigate('PracticeScreen', { topicId: overview.weakArea.topicId, topicName: overview.weakArea.topicName });

  const weakArea = overview?.weakArea;
  const showFocus = weakArea && weakArea.accuracy < 80;
  const updates = (notifications || []).slice(0, 3);

  return (
    <Screen
      title="Home"
      headerProps={{
        onMenuPress: menu.open,
        onBellPress: () => navigation.navigate('NotificationsScreen'),
        unreadCount,
      }}
      background={COLORS.appBackground}
      loaderColor={COLORS.blue600}
      loading={loading}
      skeleton={<HomeSkeleton />}
      refreshing={refreshing}
      onRefresh={refresh}
      contentStyle={{ padding: 0, paddingBottom: 28 }}
    >
      {error && !dashboard ? (
        <ErrorState onRetry={() => reload()} style={{ paddingVertical: 80 }} />
      ) : (
        <>
          <FadeIn>
            <GreetingCard name={dashboard?.user?.name} challenge={challenge} />
          </FadeIn>

          {overview?.streakHistory?.length ? (
            <FadeIn delay={50} style={tw`px-4 mt-3`}>
              <WeekStrip history={overview.streakHistory} />
            </FadeIn>
          ) : null}

          {learning?.pick ? (
            <Section title="Continue" delay={100}>
              <ContinueCard pick={learning.pick} onPress={() => openLesson(learning.pick)} />
            </Section>
          ) : null}

          <Section title="Today" delay={150}>
            <DailyChallengeCard challenge={challenge} loading={loadingChallenge} onOpen={() => navigation.navigate('DailyChallengeScreen')} />
          </Section>

          <Section title="Your stats" delay={200}>
            <StatsGrid stats={dashboard?.stats} />
          </Section>

          {learning?.units?.some((unit) => unit.total > 0) ? (
            <Section title="Your units" right={<SectionLink label="See all" onPress={() => navigation.navigate('Practice')} />} delay={250}>
              <UnitsProgressCard units={learning.units} onOpenUnit={openUnit} />
            </Section>
          ) : null}

          {showFocus ? (
            <Section delay={300}>
              <FocusAreaCard weakArea={weakArea} onPractice={practiseWeakArea} />
            </Section>
          ) : null}

          {dashboard?.recentActivity?.length ? (
            <Section title="Recent activity" delay={350}>
              <RecentActivityCard items={dashboard.recentActivity} />
            </Section>
          ) : null}

          {leaderboard?.leaderboard?.length ? (
            <Section
              title="Leaderboard"
              right={<SectionLink label="View all" onPress={() => navigation.navigate('DailyChallengeLeaderboardScreen')} />}
              delay={400}
            >
              <LeaderboardPreview data={leaderboard} />
            </Section>
          ) : null}

          {updates.length > 0 ? (
            <Section
              title="Latest updates"
              right={<SectionLink label="See all" onPress={() => navigation.navigate('NotificationsScreen')} />}
              delay={450}
            >
              {updates.map((notification) => (
                <NotificationItem key={notification._id} notification={notification} onPress={() => navigation.navigate('NotificationsScreen')} />
              ))}
            </Section>
          ) : null}

          <Section title="Quick actions" delay={500}>
            <View style={tw`flex-row flex-wrap -mx-1`}>
              {QUICK_ACTIONS.map((action) => (
                <View key={action.label} style={tw`w-1/2 p-1`}>
                  <QuickLinkCard {...action} onPress={() => open(action)} />
                </View>
              ))}
            </View>
          </Section>

          <StreakInfoCard />

          <FeedbackCard onPress={menu.openFeedback} />
        </>
      )}

      {menu.sheet}
    </Screen>
  );
}
