import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigation from './TabNavigation';
import TopicsScreen from '../screens/TopicsScreen';
import QuestionsScreen from '../screens/QuestionsScreen';
import PracticeScreen from '../screens/PracticeScreen';
import ResultScreen from '../screens/ResultScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import DailyChallengeScreen from '../screens/DailyChallengeScreen';
import DailyChallengeAttemptScreen from '../screens/DailyChallengeAttemptScreen';
import DailyChallengeResultScreen from '../screens/DailyChallengeResultScreen';
import DailyChallengeReviewScreen from '../screens/DailyChallengeReviewScreen';
import DailyChallengeHistoryScreen from '../screens/DailyChallengeHistoryScreen';
import DailyChallengeProgressScreen from '../screens/DailyChallengeProgressScreen';
import DailyChallengeLeaderboardScreen from '../screens/DailyChallengeLeaderboardScreen';

const Stack = createNativeStackNavigator();

const SCREENS = {
  Login: LoginScreen,
  MainApp: TabNavigation,
  TopicsScreen,
  QuestionsScreen,
  PracticeScreen,
  ResultScreen,
  NotificationsScreen,
  DailyChallengeScreen,
  DailyChallengeAttemptScreen,
  DailyChallengeResultScreen,
  DailyChallengeReviewScreen,
  DailyChallengeHistoryScreen,
  DailyChallengeProgressScreen,
  DailyChallengeLeaderboardScreen,
};

export default function RootNavigator({ initialRoute }) {
  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      {Object.entries(SCREENS).map(([name, component]) => (
        <Stack.Screen key={name} name={name} component={component} />
      ))}
    </Stack.Navigator>
  );
}
