import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import StudentsScreen from './StudentsScreen';
import ProgressScreen from './ProgressScreen';
import AddStudentScreen from './AddStudentScreen';
import QuestionScreen from './QuestionScreen';
import { TAB_BAR_LABEL_STYLE } from '../theme/typography';

const Tab = createBottomTabNavigator();

export default function AdminScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case 'Students':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Progress':
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
              break;
            case 'Questions':
              iconName = focused ? 'help-circle' : 'help-circle-outline';
              break;
            case 'AddStudent':
              iconName = focused ? 'person-add' : 'person-add-outline';
              break;
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          height: 65,
          paddingBottom: 12,
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
        },
        tabBarLabelStyle: TAB_BAR_LABEL_STYLE,
      })}
    >
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Questions" component={QuestionScreen} />
      <Tab.Screen name="AddStudent" component={AddStudentScreen} />
    </Tab.Navigator>
  );
}

