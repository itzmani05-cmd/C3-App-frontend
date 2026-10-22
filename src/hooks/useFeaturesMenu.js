import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { BookOpen, Bell, ChartColumn, History, House, KeyRound, LifeBuoy, Library, LogOut, MessageCircle, Trophy, UserRound, Zap } from '../icons';
import FeaturesSheet from '../components/ui/FeaturesSheet';
import FeedbackSheet from '../components/home/FeedbackSheet';
import useLogout from './useLogout';

// Where each feature lives. `tab` items switch bottom tabs, `screen` items open a stacked screen, `nested` items open a
// screen inside a tab's own stack.
const GROUPS = [
  {
    title: 'Study',
    layout: 'grid',
    items: [
      { id: 'learn', label: 'Learn', helper: 'Units, topics and lessons', icon: Library, tone: 'brand', tab: 'Practice' },
      { id: 'practice', label: 'Practice', helper: 'Open a lesson, then tap Practice', icon: BookOpen, tone: 'accent', tab: 'Practice' },
      { id: 'daily', label: 'Daily Challenge', helper: "Today's questions and streak", icon: Zap, tone: 'warning', tab: 'Today' },
      { id: 'home', label: 'Home', helper: 'Your dashboard', icon: House, tone: 'neutral', tab: 'Home' },
    ],
  },
  {
    title: 'Track progress',
    layout: 'grid',
    items: [
      { id: 'progress', label: 'My Progress', helper: 'Streaks and topic accuracy', icon: ChartColumn, tone: 'accent', screen: 'DailyChallengeProgressScreen' },
      { id: 'leaderboard', label: 'Leaderboard', helper: 'See the rankings', icon: Trophy, tone: 'warning', screen: 'DailyChallengeLeaderboardScreen' },
      { id: 'history', label: 'Challenge History', helper: 'Past daily challenges', icon: History, tone: 'neutral', screen: 'DailyChallengeHistoryScreen' },
      { id: 'notifications', label: 'Notifications', helper: 'Reminders and updates', icon: Bell, tone: 'brand', screen: 'NotificationsScreen' },
    ],
  },
  {
    title: 'Account',
    layout: 'list',
    items: [
      { id: 'profile', label: 'Profile', helper: 'Your details and stats', icon: UserRound, tone: 'brand', tab: 'Profile' },
      { id: 'password', label: 'Change password', helper: 'Update your account password', icon: KeyRound, tone: 'neutral', nested: ['Profile', 'ResetPassword'] },
      { id: 'feedback', label: 'Send feedback', helper: 'Tell us what to improve', icon: MessageCircle, tone: 'brand', action: 'feedback' },
      { id: 'support', label: 'Support', helper: 'Get help with your account', icon: LifeBuoy, tone: 'neutral', action: 'support' },
      { id: 'logout', label: 'Log out', helper: 'Sign out from this device', icon: LogOut, tone: 'danger', danger: true, action: 'logout' },
    ],
  },
];

/**
 * The top-bar "features" button and its sheet. Use it on a screen like:
 *   const menu = useFeaturesMenu(navigation);
 *   <Screen headerProps={{ onMenuPress: menu.open }}> ... {menu.sheet} </Screen>
 */
export default function useFeaturesMenu(navigation) {
  const [visible, setVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const logout = useLogout(navigation);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);
  const openFeedback = useCallback(() => setFeedbackVisible(true), []);
  const closeFeedback = useCallback(() => setFeedbackVisible(false), []);

  const select = useCallback(
    (item) => {
      setVisible(false);
      // Let the sheet finish closing before navigating or showing a dialog, or the two animations fight.
      setTimeout(() => {
        if (item.tab) navigation.navigate(item.tab);
        else if (item.screen) navigation.navigate(item.screen);
        else if (item.nested) navigation.navigate(item.nested[0], { screen: item.nested[1] });
        else if (item.action === 'feedback') setFeedbackVisible(true);
        else if (item.action === 'support') Alert.alert('Support', 'Please contact 6369925623 for help.');
        else if (item.action === 'logout') logout();
      }, 250);
    },
    [navigation, logout]
  );

  return {
    open,
    openFeedback,
    sheet: (
      <>
        <FeaturesSheet visible={visible} groups={GROUPS} onSelect={select} onClose={close} />
        <FeedbackSheet visible={feedbackVisible} onClose={closeFeedback} />
      </>
    ),
  };
}
