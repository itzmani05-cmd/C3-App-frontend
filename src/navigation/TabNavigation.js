import React from 'react'
import {View, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import LearningScreen from '../screens/LearningScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab=createBottomTabNavigator();

export default function TabNavigation(){
  return (
    <Tab.Navigator
        screenOptions={({route})=>({
            headerShown:false,
            tabBarIcon:({focused,color})=>{
                let iconName;

                switch(route.name){
                    case 'Home':
                        iconName=focused?'home':'home-outline';
                        break;
                    case 'Explore':
                        iconName=focused?'search':'search-outline';
                        break;
                    case 'Learning':
                        iconName=focused?'book':'book-outline';
                        break;
                    case 'Wishlist':
                        iconName=focused?'heart':'heart-outline';
                        break;
                    case 'Profile':
                        iconName=focused?'person':'person-outline';
                        break;
                }
                return <Ionicons name={iconName} size={22} color={color} />
            },
            
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#B3B3B3',

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
        },

        tabBarLabelStyle: {
          fontSize: 11,
        }
            
        })}
    >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Learning" component={LearningScreen} />
        <Tab.Screen name="Wishlist" component={WishlistScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}
