import React,{useEffect,useState} from 'react';
import axios from 'axios';
import * as Updates from 'expo-updates';
import {ActivityIndicator, View} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {useFonts} from 'expo-font';

import LoginScreen from './src/screens/LoginScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import TabNavigation from './src/navigation/TabNavigation';
import LessonScreen from './src/screens/LessonScreen';
import SplashScreen from './src/screens/SplashScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import TimeUpScreen from './src/screens/TimeUpScreen';
import QuestionsScreen from './src/screens/QuestionsScreen';
import ResultScreen from './src/screens/ResultScreen';
import DailyChallengeScreen from './src/screens/DailyChallengeScreen';
import DailyChallengeAttemptScreen from './src/screens/DailyChallengeAttemptScreen';
import DailyChallengeResultScreen from './src/screens/DailyChallengeResultScreen';
import DailyChallengeReviewScreen from './src/screens/DailyChallengeReviewScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import DailyChallengeHistoryScreen from './src/screens/DailyChallengeHistoryScreen';
import DailyChallengeProgressScreen from './src/screens/DailyChallengeProgressScreen';
import DailyChallengeLeaderboardScreen from './src/screens/DailyChallengeLeaderboardScreen';
import { API_BASE_URL } from './src/config/api';
import { applyGlobalTypographyDefaults } from './src/theme/typography';
import { getSession } from './src/utils/authStorage';
import { registerForDailyChallengePushNotifications } from './src/utils/pushNotifications';

const Stack=createNativeStackNavigator();

applyGlobalTypographyDefaults();

export default function App() {

  const [sessionChecked,setSessionChecked]=useState(false);
  const [initialRoute,setInitialRoute]=useState('Login');

  useEffect(() => {
    async function checkForUpdate() {
      try {
        const update = await Updates.checkForUpdateAsync();
        console.log("Update available:", update.isAvailable);

        if (update.isAvailable) {
          console.log("Fetching update...");
          await Updates.fetchUpdateAsync();

          console.log("Reloading app...");
          await Updates.reloadAsync();
        }
      } catch (err) {
        console.log("Update check error:", err);
      }
    }

    async function pingApi() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/test`);
        console.log(res.data);
      } catch (err) {
        console.log("API ping error:", err);
      }
    }

    checkForUpdate();
    pingApi();
  }, []);

  useEffect(() => {
    async function restoreSession() {
      const session = await getSession();
      if (session?.userId) {
        global.user = session;
        global.userId = session.userId;
        setInitialRoute('MainApp');
        registerForDailyChallengePushNotifications(session.userId);
      }
      setSessionChecked(true);
    }

    restoreSession();
  }, []);

  const [loaded]=useFonts({
    ManropeRegular: require('./src/assests/fonts/Manrope-Regular.ttf'),
    ManropeMedium: require('./src/assests/fonts/Manrope-Medium.ttf'),
    ManropeSemiBold: require('./src/assests/fonts/Manrope-SemiBold.ttf'),
    ManropeBold: require('./src/assests/fonts/Manrope-Bold.ttf'),
    ManropeExtraBold: require('./src/assests/fonts/Manrope-ExtraBold.ttf'),
  });

  if(!loaded || !sessionChecked){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{headerShown:false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name='Login' component={LoginScreen}/>
        <Stack.Screen name='ResetPassword' component={ResetPasswordScreen}/>
        <Stack.Screen name='MainApp' component={TabNavigation}/>
        <Stack.Screen name="LessonScreen" component={LessonScreen}/>
        <Stack.Screen name="TopicsScreen" component={TopicsScreen}/>
        <Stack.Screen name="QuestionsScreen" component={QuestionsScreen} />
        <Stack.Screen name="TimeUpScreen" component={TimeUpScreen}/> 
        <Stack.Screen name="ResultScreen" component={ResultScreen}/>
        <Stack.Screen name="DailyChallengeScreen" component={DailyChallengeScreen}/>
        <Stack.Screen name="DailyChallengeAttemptScreen" component={DailyChallengeAttemptScreen}/>
        <Stack.Screen name="DailyChallengeResultScreen" component={DailyChallengeResultScreen}/>
        <Stack.Screen name="DailyChallengeReviewScreen" component={DailyChallengeReviewScreen}/>
        <Stack.Screen name="NotificationsScreen" component={NotificationsScreen}/>
        <Stack.Screen name="DailyChallengeHistoryScreen" component={DailyChallengeHistoryScreen}/>
        <Stack.Screen name="DailyChallengeProgressScreen" component={DailyChallengeProgressScreen}/>
        <Stack.Screen name="DailyChallengeLeaderboardScreen" component={DailyChallengeLeaderboardScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
    
  ) 
}

