import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import DailyChallengeScreen from '../screens/DailyChallengeScreen';
import DailyChallengeUnitsScreen from '../screens/DailyChallengeUnitsScreen';
import ProfileStack from './ProfileStack';
import { COLORS, TAB_BAR_LABEL_STYLE } from '../theme';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home', component: HomeScreen, icon: 'home' },
  { name: 'Practice', component: ExploreScreen, icon: 'search' },
  { name: 'Today', component: DailyChallengeScreen, icon: 'flash' },
  { name: 'Daily', component: DailyChallengeUnitsScreen, icon: 'calendar', label: 'Archive' },
  { name: 'Profile', component: ProfileStack, icon: 'person' },
];

const ICON_BY_TAB = Object.fromEntries(TABS.map((tab) => [tab.name, tab.icon]));

const tabBarStyle = {
  height: 65,
  paddingBottom: 8,
  paddingTop: 8,
  backgroundColor: COLORS.white,
  borderTopWidth: 1,
  borderTopColor: COLORS.slate100,
  shadowColor: COLORS.slate900,
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 8,
};

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icon = ICON_BY_TAB[route.name];
          return <Ionicons name={focused ? icon : `${icon}-outline`} size={22} color={color} />;
        },
        tabBarActiveTintColor: COLORS.blue600,
        tabBarInactiveTintColor: COLORS.gray400,
        tabBarStyle,
        tabBarLabelStyle: TAB_BAR_LABEL_STYLE,
      })}
    >
      {TABS.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={tab.label ? { tabBarLabel: tab.label } : undefined}
        />
      ))}
    </Tab.Navigator>
  );
}
