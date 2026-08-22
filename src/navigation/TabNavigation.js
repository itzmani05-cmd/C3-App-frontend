import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileStack from './ProfileStack';
import { TAB_BAR_LABEL_STYLE } from '../theme/typography';

const Tab = createBottomTabNavigator();

export default function TabNavigation({route}){
  const userId=route?.params?.userId;
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown:false,
        tabBarIcon:({focused,color}) => {
          let iconName;

          switch(route.name){
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Practice':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={22} color={color} />
        },
        tabBarActiveTintColor:'#2563EB',
        tabBarInactiveTintColor:'#9CA3AF',
        tabBarStyle:{
          height:65,
          paddingBottom:8,
          paddingTop:8,
          backgroundColor:'#FFFFFF',
          borderTopWidth:1,
          borderTopColor:'#F1F5F9',
          shadowColor:'#0F172A',
          shadowOffset:{width:0,height:-2},
          shadowOpacity:0.05,
          shadowRadius:8,
          elevation:8,
        },
        tabBarLabelStyle: TAB_BAR_LABEL_STYLE
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{userId}} />
      <Tab.Screen name="Practice" component={ExploreScreen} />
      {/* <Tab.Screen name="Analytics" component={LearningScreen} /> */}
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  )
}
